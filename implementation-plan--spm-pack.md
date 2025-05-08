# Implementation Plan: SPM Pack Feature

This document outlines the step-by-step implementation plan for the `spm pack` feature in the Specky Package Manager CLI tool. The feature will enable users to package a Specky component specification into a distributable zip file.

## Overview

The `spm pack` command will:
1. Validate the component specification structure
2. Collect all required files as specified in the `files` field of spec.json
3. Create a zip archive containing these files
4. Name the archive using the component name and version from spec.json

## Implementation Steps

### 1. Setup Command Structure

- [x] Create a new file `src/commands/pack.ts` based on the command template
- [x] Implement the basic command structure with Commander.js
- [x] Register the command in `src/commands/index.ts`

### 2. Implement Spec.json Validation

- [x] Add function to check if spec.json exists in the current directory
- [x] Add function to validate the spec.json file structure
- [x] Implement validation for required fields (name, version)
- [x] Implement validation for the `files` field (must be an array of strings)
- [x] Add appropriate error messages for validation failures

### 3. Implement File Collection Logic

- [x] Create a function to read the `files` field from spec.json
- [x] Implement logic to resolve file paths relative to the component root
- [x] Add support for glob pattern resolution (e.g., `tests/**/*.feature`)
- [x] Ensure spec.json is always included in the package, even if not explicitly listed
- [x] Validate that all specified files exist
- [x] Handle errors for missing files or invalid glob patterns

### 4. Implement Zip Archive Creation

- [x] Add a function to generate the output filename based on component name and version
- [x] Implement logic to create a zip archive
- [x] Add all collected files to the zip archive, maintaining directory structure
- [x] Save the zip file in the current directory
- [x] Handle errors during zip file creation (permissions, disk space, etc.)

### 5. Implement User Interface

- [x] Add progress indicators for the packaging process
- [x] Implement success message with the path to the created zip file
- [x] Add appropriate error messages for various failure scenarios
- [x] Implement the `--yes` flag to skip confirmation prompts

### 6. Add Tests

- [x] Create unit tests for validation functions
- [x] Create integration tests for the pack command
- [x] Add tests for error handling scenarios
- [x] Add tests for glob pattern resolution

### 7. Update Documentation

- [ ] Update the README.md with information about the new command
- [ ] Add examples of how to use the command
- [ ] Document the expected structure of the spec.json file

## Detailed Implementation Tasks

### 1. Setup Command Structure

#### Create Pack Command File

- [x] Create `src/commands/pack.ts` with the basic command structure
- [x] Import necessary dependencies (Commander, chalk, fs-extra, path, etc.)
- [x] Define the `packCommand` function that registers the command with Commander
- [x] Implement the command action function with try/catch error handling

#### Register the Command

- [x] Add the `packCommand` to the list of commands in `src/commands/index.ts`
- [x] Export the `packCommand` from `src/commands/index.ts`

### 2. Implement Spec.json Validation

#### Check for Spec.json Existence

- [x] Use the existing `checkFileExists` utility to verify spec.json exists
- [x] Display appropriate error message if spec.json is not found

#### Validate Spec.json Structure

- [x] Use the existing `readJsonFile` utility to read and parse spec.json
- [x] Check for required fields (name, version)
- [x] Validate that the `files` field exists and is an array of strings
- [x] Use existing validation utilities for name and version validation

### 3. Implement File Collection Logic

#### Read Files Field

- [x] Extract the `files` array from the spec.json file
- [x] Create a function to process each file entry

#### Resolve File Paths and Glob Patterns

- [x] Add a utility function to determine if a path is a glob pattern
- [x] Use a glob library (like `glob` or `fast-glob`) to resolve glob patterns
- [x] Collect all matching files into a list
- [x] Ensure spec.json is included in the list

#### Validate File Existence

- [x] Check that all specified files exist
- [x] Collect any missing files into a list
- [x] Display appropriate error messages for missing files

### 4. Implement Zip Archive Creation

#### Generate Output Filename

- [x] Create a function to generate the output filename (`{component-name}-{version}.zip`)
- [x] Sanitize the component name and version for use in a filename

#### Create Zip Archive

- [x] Use a library like `archiver` or `adm-zip` to create the zip file
- [x] Add each collected file to the archive, maintaining directory structure
- [x] Handle errors during zip creation
- [x] Save the zip file to the current directory

### 5. Implement User Interface

#### Add Progress Indicators

- [x] Display a message when starting the packaging process
- [x] Show progress as files are being collected and added to the archive
- [x] Display a success message with the path to the created zip file

#### Implement Error Handling

- [x] Add specific error messages for different failure scenarios
- [x] Display helpful information for resolving errors
- [x] Ensure non-zero exit codes for failures

### 6. Add Tests

#### Unit Tests

- [x] Create tests for validation functions
- [x] Create tests for file collection logic
- [x] Create tests for zip archive creation

#### Integration Tests

- [x] Create tests for the entire pack command
- [x] Test with various spec.json configurations
- [x] Test error handling scenarios

### 7. Update Documentation

#### Update README

- [ ] Add information about the `spm pack` command to the README
- [ ] Include examples of how to use the command
- [ ] Document the expected structure of the spec.json file

## Dependencies

The implementation will require the following dependencies:

1. **fs-extra**: For file system operations
2. **path**: For path manipulation
3. **glob** or **fast-glob**: For resolving glob patterns
4. **archiver** or **adm-zip**: For creating zip archives
5. **chalk**: For colorized console output
6. **inquirer**: For interactive prompts
7. **commander**: For command-line interface

## Conclusion

This implementation plan provides a comprehensive guide for developing the `spm pack` feature for the Specky Package Manager CLI tool. By following these steps, the development team can efficiently implement the feature according to the specified requirements.