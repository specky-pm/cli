/**
 * Pack Command
 *
 * This command packages a component specification into a distributable zip file.
 */

import { Command } from "commander";
import chalk from "chalk";
import path from "path";
import fg from "fast-glob";
import fs from "fs-extra";
import Ajv from "ajv";
import addFormats from "ajv-formats";
import archiver from "archiver";
import inquirer from "inquirer";
import { specJsonSchema } from "@specky-pm/spec";
import { checkFileExists, readJsonFile } from "../utils/filesystem";
import { SpecJson } from "../types";

/**
 * Check if spec.json exists in the current directory
 * @returns A promise that resolves to true if spec.json exists, false otherwise
 */
export async function checkSpecJsonExists(): Promise<boolean> {
  return checkFileExists("spec.json");
}

/**
 * Validate the spec.json file structure
 * @returns A promise that resolves to the validated spec.json content
 * @throws Error if validation fails
 */
export async function validateSpecJson(): Promise<SpecJson> {
  // Check if spec.json exists
  const specJsonExists = await checkSpecJsonExists();
  if (!specJsonExists) {
    throw new Error("spec.json not found in the current directory");
  }

  // Read and parse spec.json
  const specJson = await readJsonFile<SpecJson>("spec.json");

  try {
    // Validate against JSON schema
    const ajv = new Ajv({
      allErrors: true,
      strict: false,
    });

    // Add formats support (including email and uri)
    addFormats(ajv);

    // Create a modified version of the schema without the $schema property
    const modifiedSchema = { ...specJsonSchema } as Record<string, any>;
    delete modifiedSchema.$schema;

    // Use the modified schema for validation
    const validate = ajv.compile(modifiedSchema);
    const valid = validate(specJson);

    if (!valid && validate.errors) {
      console.log(chalk.red("Validation errors from schema:"));
      validate.errors.forEach((error) => {
        console.log(
          chalk.red(`- ${error.instancePath || "/"}: ${error.message}`),
        );
      });
      throw new Error("spec.json validation failed");
    }

    // Additional validation specific to pack command
    // Validate files field which is required for packaging
    if (!specJson.files) {
      throw new Error("Missing 'files' field in spec.json");
    }

    if (!Array.isArray(specJson.files)) {
      throw new Error("'files' field must be an array");
    }

    if (specJson.files.length === 0) {
      throw new Error("'files' field cannot be empty");
    }

    for (const file of specJson.files) {
      if (typeof file !== "string") {
        throw new Error("All entries in 'files' must be strings");
      }
    }

    return specJson;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Error validating spec.json");
  }
}

/**
 * Collect all files to be included in the package based on spec.json
 * @param specJson The validated spec.json content
 * @returns A promise that resolves to an array of file paths
 * @throws Error if any specified file doesn't exist or if glob patterns don't match any files
 */
export async function collectFiles(specJson: SpecJson): Promise<string[]> {
  const collectedFiles = new Set<string>();
  const cwd = process.cwd();

  // Always include spec.json
  collectedFiles.add("spec.json");

  // Ensure files array exists
  if (
    !specJson.files ||
    !Array.isArray(specJson.files) ||
    specJson.files.length === 0
  ) {
    throw new Error("'files' field must be a non-empty array");
  }

  // Process each entry in the files array
  for (const pattern of specJson.files) {
    try {
      // Check if it's a glob pattern
      if (
        pattern.includes("*") ||
        pattern.includes("?") ||
        pattern.includes("{") ||
        pattern.includes("[")
      ) {
        // Resolve glob pattern
        const matches = await fg(pattern, {
          cwd,
          onlyFiles: true,
          absolute: false,
          dot: true,
        });

        if (matches.length === 0) {
          throw new Error(`Glob pattern '${pattern}' did not match any files`);
        }

        // Add all matched files to the set
        for (const match of matches) {
          collectedFiles.add(match);
        }
      } else {
        // It's a regular file path
        const filePath = path.resolve(cwd, pattern);
        const relativePath = path.relative(cwd, filePath);

        // Check if file exists
        const exists = fs.existsSync(filePath);
        if (!exists) {
          throw new Error(
            `File '${pattern}' specified in spec.json does not exist`,
          );
        }

        // Check if it's a directory
        const stats = await fs.stat(filePath);
        if (stats.isDirectory()) {
          // If it's a directory, add all files in it
          const dirFiles = await fg("**/*", {
            cwd: filePath,
            onlyFiles: true,
            absolute: false,
            dot: true,
          });

          for (const file of dirFiles) {
            collectedFiles.add(path.join(relativePath, file));
          }
        } else {
          // It's a regular file
          collectedFiles.add(relativePath);
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(
          `Error processing file pattern '${pattern}': ${error.message}`,
        );
      } else {
        throw new Error(`Unknown error processing file pattern '${pattern}'`);
      }
    }
  }

  return Array.from(collectedFiles);
}

/**
 * Generate a sanitized output filename for the zip archive
 * @param specJson The validated spec.json content
 * @returns A string representing the output filename in the format {component-name}-{version}.zip
 */
export function generateOutputFilename(specJson: SpecJson): string {
  // Sanitize component name and version for use in a filename
  // Replace any characters that are not alphanumeric, dash, or underscore with a dash
  const sanitizedName = specJson.name.replace(/[^a-zA-Z0-9\-_]/g, "-");
  const sanitizedVersion = specJson.version.replace(/[^a-zA-Z0-9\-_.]/g, "-");

  // Return the filename in the format {component-name}-{version}.zip
  return `${sanitizedName}-${sanitizedVersion}.zip`;
}

/**
 * Create a zip archive containing the specified files
 * @param files Array of file paths to include in the archive
 * @param specJson The validated spec.json content
 * @returns A promise that resolves to the path of the created zip file
 * @throws Error if zip creation fails
 */
export async function createZipArchive(
  files: string[],
  specJson: SpecJson,
): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const outputFilename = generateOutputFilename(specJson);
      const outputPath = path.join(process.cwd(), outputFilename);

      // Create a file to write the zip data to
      const output = fs.createWriteStream(outputPath);
      const archive = archiver("zip", {
        zlib: { level: 9 }, // Set the compression level (0-9)
      });

      // Track progress
      let filesProcessed = 0;
      const totalFiles = files.length;

      // Listen for all archive data to be written
      output.on("close", () => {
        resolve(outputPath);
      });

      // Listen for warnings during archiving
      archive.on("warning", (err) => {
        if (err.code === "ENOENT") {
          console.warn(
            chalk.yellow(`Warning during zip creation: ${err.message}`),
          );
        } else {
          reject(new Error(`Error during zip creation: ${err.message}`));
        }
      });

      // Listen for errors during archiving
      archive.on("error", (err) => {
        reject(new Error(`Error creating zip archive: ${err.message}`));
      });

      // Listen for progress
      archive.on("entry", () => {
        filesProcessed++;
        const percentage = Math.round((filesProcessed / totalFiles) * 100);
        process.stdout.write(
          `\r${chalk.blue(`Adding files to archive... ${percentage}% (${filesProcessed}/${totalFiles})`)}`,
        );
      });

      // Pipe archive data to the output file
      archive.pipe(output);

      // Add each file to the archive
      for (const file of files) {
        const filePath = path.join(process.cwd(), file);
        archive.file(filePath, { name: file });
      }

      // Finalize the archive (write the zip footer)
      void archive.finalize();
    } catch (error) {
      if (error instanceof Error) {
        reject(new Error(`Failed to create zip archive: ${error.message}`));
      } else {
        reject(new Error("Failed to create zip archive: Unknown error"));
      }
    }
  });
}

/**
 * Register the pack command with the CLI
 *
 * This function registers the 'pack' command with the Commander program.
 * The pack command packages a component specification into a distributable zip file.
 *
 * @param program - The Commander program instance
 *
 * @example
 * // In src/commands/index.ts
 * import { Command } from 'commander';
 * import { packCommand } from './pack';
 *
 * const program = new Command();
 * packCommand(program);
 */
export function packCommand(program: Command): void {
  program
    .command("pack")
    .description(
      "Package a component specification into a distributable zip file",
    )
    .option("-y, --yes", "Skip confirmation prompts")
    .action(async (options) => {
      // Debug statement to verify the command is running
      console.log("DEBUG: Pack command started");
      console.log("📦 Packaging component specification...");

      try {
        // 1. Validate spec.json
        console.log(chalk.blue("🔍 Validating spec.json..."));
        const specJson = await validateSpecJson();
        console.log(chalk.green("✓ spec.json validation successful"));

        // 2. Collect files
        console.log(chalk.blue("📂 Collecting files..."));
        const files = await collectFiles(specJson);
        console.log(
          chalk.green(`✓ Collected ${files.length} files for packaging`),
        );

        // Debug output - only show in debug mode
        if (process.env.DEBUG) {
          console.log(chalk.blue("Files to be packaged:"));
          files.forEach((file) => console.log(chalk.blue(`  - ${file}`)));
        }

        // 3. Confirm before creating zip archive (unless --yes flag is used)
        const outputFilename = generateOutputFilename(specJson);
        const outputPath = path.join(process.cwd(), outputFilename);

        // Check if file already exists
        const fileExists = fs.existsSync(outputPath);

        if (!options.yes) {
          const confirmMessage = fileExists
            ? `Archive file ${outputFilename} already exists. Overwrite?`
            : `Create archive ${outputFilename} with ${files.length} files?`;

          const { proceed } = await inquirer.prompt([
            {
              type: "confirm",
              name: "proceed",
              message: confirmMessage,
              default: true,
            },
          ]);

          if (!proceed) {
            console.log(chalk.yellow("Packaging cancelled by user"));
            process.exit(0);
          }
        } else if (fileExists) {
          console.log(
            chalk.yellow(
              `Note: Archive file ${outputFilename} already exists and will be overwritten`,
            ),
          );
        }

        // 4. Create zip archive
        console.log(chalk.blue("🔒 Creating zip archive..."));
        const zipPath = await createZipArchive(files, specJson);
        console.log("\n"); // Add a newline after the progress indicator

        // Check if the zip file was created
        const zipExists = fs.existsSync(zipPath);
        if (!zipExists) {
          throw new Error(`Failed to create zip archive at ${zipPath}`);
        }

        // Get the size of the zip file
        const stats = fs.statSync(zipPath);
        const fileSizeInBytes = stats.size;
        const fileSizeInKB = (fileSizeInBytes / 1024).toFixed(2);

        // Success message with clear formatting
        console.log(chalk.green("✅ Component packaged successfully!"));
        console.log(chalk.green("📁 Archive details:"));
        console.log(chalk.green(`   - Location: ${zipPath}`));
        console.log(chalk.green(`   - Size: ${fileSizeInKB} KB`));
        console.log(chalk.green(`   - Contains: ${files.length} files`));
        console.log(
          chalk.green(`   - Component: ${specJson.name}@${specJson.version}`),
        );

        // Provide next steps hint
        console.log(
          chalk.blue(
            "\nYou can now distribute this archive to share your component.",
          ),
        );
      } catch (error) {
        // Enhanced error handling with more specific messages
        if (error instanceof Error) {
          if (error.message.includes("spec.json not found")) {
            console.error(
              chalk.red(
                "❌ Error: spec.json not found in the current directory",
              ),
            );
            console.error(
              chalk.yellow(
                "Make sure you're in the root directory of your component specification.",
              ),
            );
          } else if (error.message.includes("validation failed")) {
            console.error(chalk.red("❌ Error: spec.json validation failed"));
            console.error(
              chalk.yellow(
                "Please fix the validation errors listed above and try again.",
              ),
            );
          } else if (error.message.includes("did not match any files")) {
            console.error(
              chalk.red("❌ Error: Some file patterns did not match any files"),
            );
            console.error(
              chalk.yellow(
                "Check the 'files' field in your spec.json and ensure all patterns are correct.",
              ),
            );
          } else if (error.message.includes("does not exist")) {
            console.error(
              chalk.red("❌ Error: Some specified files do not exist"),
            );
            console.error(
              chalk.yellow(
                "Check the 'files' field in your spec.json and ensure all files exist.",
              ),
            );
          } else if (error.message.includes("zip")) {
            console.error(
              chalk.red("❌ Error creating zip archive:"),
              error.message,
            );
            console.error(
              chalk.yellow(
                "Check if you have write permissions in the current directory.",
              ),
            );
          } else {
            console.error(
              chalk.red("❌ Error packaging component:"),
              error.message,
            );
          }
        } else {
          console.error(
            chalk.red("❌ Unknown error occurred during packaging"),
          );
        }

        if (process.env.DEBUG) {
          console.error(error);
        }

        process.exit(1);
      }
    });
}
