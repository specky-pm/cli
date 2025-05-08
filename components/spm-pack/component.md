# SPM Pack Component

# Overview

The SPM Pack component provides functionality for packaging a Specky component specification into a distributable zip file. Similar to `npm pack`, this component enables users to create a package that can be shared or published to the Specky Repository.

The primary purpose of this component is to facilitate the distribution of component specifications by:

1. Validating the component specification structure
2. Collecting all required files as specified in the `files` field of spec.json
3. Creating a zip archive containing these files
4. Naming the archive using the component name and version from spec.json

This component serves as an essential tool in the component development workflow, enabling developers to package their components for distribution and sharing.

# Core Functionality

The SPM Pack component implements a workflow that packages a component specification into a distributable zip file. The component:

1. Validates the component specification structure to ensure it meets Specky's requirements
2. Reads the `files` field from spec.json to determine which files to include
3. Resolves file paths and glob patterns to create a list of files to be included
4. Creates a zip archive named according to the component name and version
5. Handles edge cases such as missing files, invalid specifications, and file system errors

The component follows a straightforward process, first validating the specification, then collecting the files, and finally creating the package. It aims to make the packaging process as simple and reliable as possible.

# Features & Use Cases

## Feature: Package Component Specification

- Use Case: A user packages a component specification for distribution
  - Rule: The system should create a zip file named `{component-name}-{version}.zip`
  - Rule: The system should add all collected files to the zip archive, maintaining the directory structure
  - Rule: The system should save the zip file in the current directory
  - Rule: The system should display a success message with the path to the created zip file

- Use Case: The system determines which files to include in the package
  - Rule: The system should only include files specified in the `files` field of spec.json
  - Rule: The system should support direct file paths relative to the component root
  - Rule: The system should support glob patterns (e.g., `tests/**/*.feature`)
  - Rule: The system should always include the spec.json file, even if not explicitly listed

- Use Case: The system validates files to be included in the package
  - Rule: If the spec.json file is not found, the system should display an appropriate error message
  - Rule: If the spec.json file contains invalid JSON, the system should display an appropriate error message
  - Rule: If the spec.json file is missing required fields, the system should display an appropriate error message
  - Rule: If the spec.json file does not contain a `files` field, the system should display an appropriate error message
  - Rule: If the `files` field is not an array of strings, the system should display an appropriate error message

- Use Case: The system handles errors when collecting files
  - Rule: If any file specified in the `files` field does not exist, the system should display an appropriate error message
  - Rule: If a glob pattern in the `files` field is invalid, the system should display an appropriate error message

- Use Case: The system handles errors during packaging
  - Rule: If there are issues creating or writing to the zip file, the system should display an appropriate error message
  - Rule: If the system doesn't have permission to write to the output directory, the system should display an appropriate error message
