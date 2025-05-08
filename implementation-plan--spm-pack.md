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

- [ ] Create a new file `src/commands/pack.ts` based on the command template
- [ ] Implement the basic command structure with Commander.js
- [ ] Register the command in `src/commands/index.ts`

### 2. Implement Spec.json Validation

- [ ] Add function to check if spec.json exists in the current directory
- [ ] Add function to validate the spec.json file structure
- [ ] Implement validation for required fields (name, version)
- [ ] Implement validation for the `files` field (must be an array of strings)
- [ ] Add appropriate error messages for validation failures

### 3. Implement File Collection Logic

- [ ] Create a function to read the `files` field from spec.json
- [ ] Implement logic to resolve file paths relative to the component root
- [ ] Add support for glob pattern resolution (e.g., `tests/**/*.feature`)
- [ ] Ensure spec.json is always included in the package, even if not explicitly listed
- [ ] Validate that all specified files exist
- [ ] Handle errors for missing files or invalid glob patterns

### 4. Implement Zip Archive Creation

- [ ] Add a function to generate the output filename based on component name and version
- [ ] Implement logic to create a zip archive
- [ ] Add all collected files to the zip archive, maintaining directory structure
- [ ] Save the zip file in the current directory
- [ ] Handle errors during zip file creation (permissions, disk space, etc.)

### 5. Implement User Interface

- [ ] Add progress indicators for the packaging process
- [ ] Implement success message with the path to the created zip file
- [ ] Add appropriate error messages for various failure scenarios
- [ ] Implement the `--yes` flag to skip confirmation prompts

### 6. Add Tests

- [ ] Create unit tests for validation functions
- [ ] Create integration tests for the pack command
- [ ] Add tests for error handling scenarios
- [ ] Add tests for glob pattern resolution

### 7. Update Documentation

- [ ] Update the README.md with information about the new command
- [ ] Add examples of how to use the command
- [ ] Document the expected structure of the spec.json file

## Detailed Implementation Tasks

### 1. Setup Command Structure

#### Create Pack Command File

- [ ] Create `src/commands/pack.ts` with the basic command structure
- [ ] Import necessary dependencies (Commander, chalk, fs-extra, path, etc.)
- [ ] Define the `packCommand` function that registers the command with Commander
- [ ] Implement the command action function with try/catch error handling

#### Register the Command

- [ ] Add the `packCommand` to the list of commands in `src/commands/index.ts`
- [ ] Export the `packCommand` from `src/commands/index.ts`

### 2. Implement Spec.json Validation

#### Check for Spec.json Existence

- [ ] Use the existing `checkFileExists` utility to verify spec.json exists
- [ ] Display appropriate error message if spec.json is not found

#### Validate Spec.json Structure

- [ ] Use the existing `readJsonFile` utility to read and parse spec.json
- [ ] Check for required fields (name, version)
- [ ] Validate that the `files` field exists and is an array of strings
- [ ] Use existing validation utilities for name and version validation

### 3. Implement File Collection Logic

#### Read Files Field

- [ ] Extract the `files` array from the spec.json file
- [ ] Create a function to process each file entry

#### Resolve File Paths and Glob Patterns

- [ ] Add a utility function to determine if a path is a glob pattern
- [ ] Use a glob library (like `glob` or `fast-glob`) to resolve glob patterns
- [ ] Collect all matching files into a list
- [ ] Ensure spec.json is included in the list

#### Validate File Existence

- [ ] Check that all specified files exist
- [ ] Collect any missing files into a list
- [ ] Display appropriate error messages for missing files

### 4. Implement Zip Archive Creation

#### Generate Output Filename

- [ ] Create a function to generate the output filename (`{component-name}-{version}.zip`)
- [ ] Sanitize the component name and version for use in a filename

#### Create Zip Archive

- [ ] Use a library like `archiver` or `adm-zip` to create the zip file
- [ ] Add each collected file to the archive, maintaining directory structure
- [ ] Handle errors during zip creation
- [ ] Save the zip file to the current directory

### 5. Implement User Interface

#### Add Progress Indicators

- [ ] Display a message when starting the packaging process
- [ ] Show progress as files are being collected and added to the archive
- [ ] Display a success message with the path to the created zip file

#### Implement Error Handling

- [ ] Add specific error messages for different failure scenarios
- [ ] Display helpful information for resolving errors
- [ ] Ensure non-zero exit codes for failures

### 6. Add Tests

#### Unit Tests

- [ ] Create tests for validation functions
- [ ] Create tests for file collection logic
- [ ] Create tests for zip archive creation

#### Integration Tests

- [ ] Create tests for the entire pack command
- [ ] Test with various spec.json configurations
- [ ] Test error handling scenarios

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