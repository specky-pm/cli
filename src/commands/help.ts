import { Command } from "commander";
import chalk from "chalk";

/**
 * Register the help command with the CLI
 *
 * This command provides detailed help information for the CLI and its commands.
 */
export function helpCommand(program: Command): void {
  program
    .command("help [command]")
    .description("Display help information for a specific command")
    .action((commandName: string) => {
      if (commandName) {
        const command = program.commands.find(
          (cmd) =>
            cmd.name() === commandName || cmd.aliases().includes(commandName),
        );

        if (command) {
          console.log(
            chalk.blue(`Help for command: ${chalk.bold(commandName)}`),
          );
          command.help();
        } else {
          console.log(chalk.red(`Unknown command: ${commandName}`));
          console.log(chalk.yellow("Available commands:"));
          program.commands.forEach((cmd) => {
            console.log(`  ${chalk.green(cmd.name())}: ${cmd.description()}`);
          });
        }
      } else {
        console.log(chalk.blue("Specky Package Manager (spm) Help"));
        program.help();
      }
    });
}
