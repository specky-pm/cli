# spm pack Command Specification

## Overview

The `spm pack` command packages a Specky component specification into a distributable zip file. This command is similar to `npm pack` and is used to create a package that can be shared or published to the Specky Repository.

## Core Functionality

The `spm pack` command performs the following operations:

1. Validates the component specification structure
2. Collects all required files as specified in the `files` field of spec.json
3. Creates a zip archive containing these files
4. Names the archive using the component name and version from spec.json

## Command Syntax

```bash
spm pack [options]
```

## Options

| Option | Description |
|--------|-------------|
| `--help`, `-h` | Display help information for the command |

## Behavior

### Execution Flow

1. **Validation Phase**
   - Verify that the current directory contains a valid Specky component specification
   - Check for the presence of a spec.json file
   - Validate that the spec.json file contains required fields (name, version)
   - Verify that the spec.json file contains a `files` field
   - Validate that the `files` field is an array of strings

2. **Collection Phase**
   - Read the `files` field from spec.json
   - Resolve all file paths and glob patterns
   - Verify that all specified files exist
   - Create a list of files to be included in the package

3. **Packaging Phase**
   - Extract component name and version from spec.json
   - Create a zip file named `{component-name}-{version}.zip`
   - Add all collected files to the zip archive, maintaining the directory structure
   - Save the zip file in the current directory

4. **Completion Phase**
   - Display a success message with the path to the created zip file
   - Return a success exit code

### File Selection

- The command will only include files specified in the `files` field of spec.json
- The `files` field must be an array of strings, where each string is either:
  - A direct file path relative to the component root
  - A glob pattern (e.g., `tests/**/*.feature`)
- The spec.json file is always included in the package, even if not explicitly listed in the `files` field

### Output File Naming

- The output zip file will be named using the pattern: `{component-name}-{version}.zip`
- The component name and version are extracted from the spec.json file
- Special characters in the component name will be handled according to the same rules as npm pack

## Error Handling

The command will fail with an appropriate error message in the following cases:

### Validation Errors

- **Missing spec.json**: If the spec.json file is not found in the current directory
  ```
  Error: spec.json not found in the current directory.
  ```

- **Invalid spec.json**: If the spec.json file is not valid JSON
  ```
  Error: spec.json contains invalid JSON.
  ```

- **Missing Required Fields**: If spec.json is missing required fields
  ```
  Error: spec.json is missing required fields: {field1}, {field2}, ...
  ```

- **Missing Files Field**: If spec.json does not contain a `files` field
  ```
  Error: spec.json must contain a 'files' field specifying which files to include in the package.
  ```

- **Invalid Files Field**: If the `files` field is not an array of strings
  ```
  Error: The 'files' field in spec.json must be an array of strings.
  ```

### Collection Errors

- **Missing Files**: If any file specified in the `files` field does not exist
  ```
  Error: The following files specified in spec.json could not be found: {file1}, {file2}, ...
  ```

- **Invalid Glob Pattern**: If a glob pattern in the `files` field is invalid
  ```
  Error: Invalid glob pattern in 'files' field: {pattern}
  ```

### Packaging Errors

- **File System Errors**: If there are issues creating or writing to the zip file
  ```
  Error: Failed to create package: {detailed error message}
  ```

- **Permission Errors**: If the command doesn't have permission to write to the output directory
  ```
  Error: Permission denied when creating package file.
  ```

## Examples

### Basic Usage

```bash
$ cd my-component
$ spm pack
```

Output:
```
Successfully created package: my-component-1.0.0.zip
```

### Error Example: Missing Files Field

```bash
$ cd my-component-without-files-field
$ spm pack
```

Output:
```
Error: spec.json must contain a 'files' field specifying which files to include in the package.
```

### Error Example: Missing Files

```bash
$ cd my-component-with-missing-files
$ spm pack
```

Output:
```
Error: The following files specified in spec.json could not be found: src/missing-file.md, tests/nonexistent.feature
```

## Integration with Other Commands

The `spm pack` command is often used as a precursor to the `spm publish` command, which publishes the package to the Specky Repository. The typical workflow is:

1. Create and validate the component specification
2. Run `spm pack` to create a distributable package
3. Run `spm publish` to publish the package to the repository

## Implementation Considerations

- The command should handle large file sets efficiently
- File paths should be normalized to ensure consistent behavior across different operating systems
- The command should maintain file permissions when adding files to the zip archive
- The command should handle symbolic links appropriately (either follow them or preserve them)
- The command should use a temporary directory for assembling the package to avoid partial results in case of errors