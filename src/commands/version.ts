import { Command } from "commander";
import chalk from "chalk";
import path from "path";
import fs from "fs-extra";

// Package information
const packageJson = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../../package.json"), "utf8"),
);

/**
 * Register the version command with the CLI
 *
 * This command displays the current version of the CLI and other relevant information.
 */
export function versionCommand(program: Command): void {
  program
    .command("version")
    .description("Display the current version of spm")
    .action(() => {
      console.log(chalk.blue("Specky Package Manager (spm)"));
      console.log(chalk.green(`Version: ${packageJson.version}`));
      console.log(`Node.js: ${process.version}`);
      console.log(`Platform: ${process.platform} (${process.arch})`);

      // Display additional package information
      if (packageJson.homepage) {
        console.log(`Homepage: ${packageJson.homepage}`);
      }

      if (packageJson.bugs && packageJson.bugs.url) {
        console.log(`Issues: ${packageJson.bugs.url}`);
      }
    });
}
