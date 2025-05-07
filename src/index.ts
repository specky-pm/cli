#!/usr/bin/env node

import { run } from './cli';

// Entry point for the CLI application
run().catch(error => {
  console.error('Error:', error.message);
  process.exit(1);
});