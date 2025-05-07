import { Command } from 'commander';
import chalk from 'chalk';
import { initCommand } from './commands/init';

// Package information
const packageJson = require('../package.json');

/**
 * Configure and run the CLI application
 */
export async function run(): Promise<void> {
  const program = new Command();

  // Set up basic program information
  program
    .name('spm')
    .description('Specky Package Manager - A CLI tool for creating, installing, and managing component specifications')
    .version(packageJson.version);

  // Register commands
  initCommand(program);

  // Parse command line arguments
  await program.parseAsync(process.argv);

  // If no command is provided, show help
  if (process.argv.length <= 2) {
    program.help();
  }
}