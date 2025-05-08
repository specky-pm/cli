/**
 * Command Template
 *
 * This file serves as a template for creating new commands.
 * Copy this file and modify it to create a new command.
 */

import { Command } from "commander";
import chalk from "chalk";

/**
 * Register the command with the CLI
 *
 * @param program The Commander program instance
 */
export function commandTemplate(program: Command): void {
  program
    .command("command-name")
    .description("Description of the command")
    .option("-o, --option", "Description of an option")
    .argument("[argument]", "Description of an argument")
    .action((_argument, _options) => {
      console.log(chalk.blue("Executing command..."));

      try {
        // Command implementation goes here
        console.log(chalk.green("Command executed successfully!"));
      } catch (error) {
        console.error(
          chalk.red("Error:"),
          error instanceof Error ? error.message : String(error),
        );
        if (process.env.DEBUG) {
          console.error(error);
        }
        process.exit(1);
      }
    });
}
