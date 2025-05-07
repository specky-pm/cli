import { Command } from 'commander';
import chalk from 'chalk';
import { registerCommands } from './commands';
import path from 'path';
import fs from 'fs-extra';

/**
 * Package information - using dynamic import to avoid require
 *
 * This reads the package.json file to get version information and other metadata
 * needed for the CLI application.
 */
const packageJson = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8')
);

/**
 * Configure and run the CLI application
 *
 * This function sets up the Commander.js program, registers commands,
 * and parses command line arguments.
 */
export async function run(): Promise<void> {
  const program = new Command();

  // Set up basic program information
  program
    .name('spm')
    .description('Specky Package Manager - A CLI tool for creating, installing, and managing component specifications')
    .version(packageJson.version, '-v, --version', 'Display the current version')
    .helpOption('-h, --help', 'Display help information');

  // Register all commands
  registerCommands(program);

  // Add global options
  program
    .option('--debug', 'Enable debug mode with verbose logging')
    .on('option:debug', () => {
      process.env.DEBUG = 'true';
      console.log(chalk.yellow('Debug mode enabled'));
    });

  // Parse command line arguments
  await program.parseAsync(process.argv);

  // If no command is provided, show help
  if (process.argv.length <= 2) {
    program.help();
  }
}

/**
 * Handle unhandled promise rejections
 *
 * This sets up a global handler for unhandled promise rejections to prevent
 * the application from crashing silently. It logs the error and exits with
 * a non-zero status code.
 *
 * @example
 * // This is automatically set up when the CLI is loaded
 * // Any unhandled rejections will be caught and logged
 */
process.on('unhandledRejection', (reason, promise) => {
  console.error(chalk.red('Unhandled Rejection at:'), promise);
  console.error(chalk.red('Reason:'), reason);
  process.exit(1);
});