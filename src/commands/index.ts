/**
 * Command Registry
 * 
 * This file exports all available commands and provides a function to register them with the CLI.
 */

import { Command } from 'commander';
import { initCommand } from './init';
import { helpCommand } from './help';
import { versionCommand } from './version';

// List of all available commands
const commands = [
  initCommand,
  helpCommand,
  versionCommand,
  // Add new commands here
];

/**
 * Register all commands with the CLI
 * 
 * @param program The Commander program instance
 */
export function registerCommands(program: Command): void {
  commands.forEach(command => command(program));
}

// Export individual commands for direct use
export {
  initCommand,
  helpCommand,
  versionCommand,
};