#!/usr/bin/env node

/**
 * Specky Package Manager (spm) CLI
 *
 * This is the entry point for the CLI application.
 * It imports the CLI setup from cli.ts and runs it.
 */

import { run } from "./cli";
import chalk from "chalk";

// Entry point for the CLI application
run().catch((error: Error) => {
  console.error(chalk.red("Error:"), error.message);
  if (process.env.DEBUG) {
    console.error(error.stack);
  }
  process.exit(1);
});
