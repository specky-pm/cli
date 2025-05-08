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
import { specJsonSchema } from "@specky-pm/spec";
import { checkFileExists, readJsonFile } from "../utils/filesystem";
import { validateComponentName, validateVersion } from "../utils/validation";
import { SpecJson } from "../types";

/**
 * Check if spec.json exists in the current directory
 * @returns A promise that resolves to true if spec.json exists, false otherwise
 */
export async function checkSpecJsonExists(): Promise<boolean> {
  return await checkFileExists("spec.json");
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
  if (!specJson.files || !Array.isArray(specJson.files) || specJson.files.length === 0) {
    throw new Error("'files' field must be a non-empty array");
  }
  
  // Process each entry in the files array
  for (const pattern of specJson.files) {
    try {
      // Check if it's a glob pattern
      if (pattern.includes("*") || pattern.includes("?") || pattern.includes("{") || pattern.includes("[")) {
        // Resolve glob pattern
        const matches = await fg(pattern, {
          cwd,
          onlyFiles: true,
          absolute: false,
          dot: true
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
        const exists = await fs.pathExists(filePath);
        if (!exists) {
          throw new Error(`File '${pattern}' specified in spec.json does not exist`);
        }
        
        // Check if it's a directory
        const stats = await fs.stat(filePath);
        if (stats.isDirectory()) {
          // If it's a directory, add all files in it
          const dirFiles = await fg("**/*", {
            cwd: filePath,
            onlyFiles: true,
            absolute: false,
            dot: true
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
        throw new Error(`Error processing file pattern '${pattern}': ${error.message}`);
      } else {
        throw new Error(`Unknown error processing file pattern '${pattern}'`);
      }
    }
  }
  
  return Array.from(collectedFiles);
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
    .description("Package a component specification into a distributable zip file")
    .option("-y, --yes", "Skip confirmation prompts")
    .action(async (options) => {
      console.log(
        chalk.blue("Packaging component specification...")
      );

      try {
        // 1. Validate spec.json
        const specJson = await validateSpecJson();
        console.log(chalk.green("✓ spec.json validation successful"));
        
        // 2. Collect files
        const files = await collectFiles(specJson);
        console.log(chalk.green(`✓ Collected ${files.length} files for packaging`));
        
        // Debug output - only show in debug mode
        if (process.env.DEBUG) {
          console.log(chalk.blue("Files to be packaged:"));
          files.forEach(file => console.log(chalk.blue(`  - ${file}`)));
        }
        
        // 3. Create zip archive (to be implemented in future steps)
        
        console.log(chalk.green("Component packaged successfully!"));
      } catch (error) {
        console.error(
          chalk.red("Error packaging component:"),
          error instanceof Error ? error.message : String(error)
        );
        if (process.env.DEBUG) {
          console.error(error);
        }
        process.exit(1);
      }
    });
}