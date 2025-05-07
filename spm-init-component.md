# SPM Init Command Specification

# Overview

The `spm init` command is a core utility in the Specky Package Manager (SPM) that enables developers to initialize new component specifications. 
Similar to `npm init`, this command provides an interactive experience that guides users through the process of creating a new component specification by prompting for essential metadata and configuration options.

The primary purpose of the `spm init` command is to simplify the creation of new component specifications by:

1. Providing an interactive interface to collect component metadata
2. Validating user inputs according to Specky's requirements
3. Generating a properly formatted `spec.json` file
4. Setting up the foundation for a well-structured component specification

This command serves as the entry point for developers creating new component specifications, whether they're building standalone components or components that will be part of a larger application.

# Core Functionality

The `spm init` command implements an interactive prompt-based workflow that collects information from the user to generate a valid `spec.json` file. The command:

3. Prompts the user for required and optional metadata fields
4. Provides sensible defaults where appropriate
5. Validates all user inputs according to Specky's requirements
6. Generates a properly formatted `spec.json` file in the working directory based on the collected information
7. Handles edge cases such as existing files and invalid inputs

The command follows a conversational flow, asking one question at a time and providing clear feedback on validation errors. 
It aims to make the initialization process as smooth and intuitive as possible, especially for developers who are already familiar with similar tools like npm.

# Features & Use Cases

## Feature: Initialize Component Specification
- Use Case: User creates a new component specification
  - Rule: a user should be prompted for the component name if not provided as an argument
  - Rule: the component name must be validated to be lowercase and contain only alphanumeric characters, hyphens, and underscores
  - Rule: a user should be prompted for the component version with default value "1.0.0"
  - Rule: the version must be validated to follow semantic versioning format (X.Y.Z)
  - Rule: a user should be prompted for a component description
  - Rule: the description must be a non-empty string
  - Rule: a user should be prompted for author information with default from git config if available
  - Rule: author information can be a string or an object with name, email, and URL
  - Rule: if author is an object, email should be validated as a proper email format
  - Rule: if author is an object, URL should be validated as a proper URL format
  - Rule: a user should be prompted for license with default value "MIT"
  - Rule: license must be a valid SPDX license identifier
  - Rule: a user should be prompted for keywords as comma-separated values
  - Rule: keywords should be converted to an array of strings
  - Rule: a user should be prompted for repository information
  - Rule: repository can be a string URL or an object with type and URL
  - Rule: if repository is an object, URL should be validated as a proper URL format
  - Rule: a user should be prompted for homepage URL
  - Rule: homepage URL must be validated as a proper URL format
  - Rule: a user should be prompted for bug reporting URL and email
  - Rule: bug reporting URL must be validated as a proper URL format
  - Rule: bug reporting email must be validated as a proper email format
  - Rule: the system should generate a valid spec.json file based on user inputs in the working directory
  - Rule: the spec.json file should be formatted with proper indentation for readability

## Feature: Validate User Inputs
- Use Case: User provides invalid input
  - Rule: if validation fails for any field, the user should be shown a specific error message explaining the validation requirements
  - Rule: after showing an error message, the user should be prompted again for the same field
  - Rule: the user should be able to press Enter to use the default value (if available) for any field
  - Rule: the user should be able to enter an empty string for optional fields to skip them
  - Rule: for required fields (name, version, description), empty inputs should not be accepted

## Feature: Handle Existing Files
- Use Case: User runs init in a directory with existing spec.json
  - Rule: if spec.json already exists, the user should be warned and asked for confirmation to overwrite
  - Rule: the warning should include the full path to the existing spec.json file
  - Rule: if the user confirms, the existing file should be overwritten with the new spec.json
  - Rule: if the user declines, the initialization process should be aborted with a message
  - Rule: if the initialization process is aborted, no files should be modified

## Feature: Support Cancellation
- Use Case: User wants to cancel the initialization process
  - Rule: the user should be able to cancel the initialization process at any prompt by pressing Ctrl+C
  - Rule: if the initialization process is cancelled, a cancellation message should be displayed
  - Rule: if the initialization process is cancelled, no files should be created or modified
  - Rule: if a new directory was created before cancellation, it should remain (not be deleted)

# Edge Cases and Error Handling

## Invalid Inputs
- If the user provides invalid input for any field, a specific error message should be displayed explaining the validation requirements
- The user should be prompted again for the same field until valid input is provided or the process is cancelled
- Validation errors should be clear and helpful, guiding the user toward correct input

## File System Errors
- If the system cannot write to a file due to permissions or other file system issues, an appropriate error message should be displayed
- The error message should include the specific path that could not be accessed or modified
- If possible, suggestions for resolving the issue should be provided (e.g., "Try running with administrator privileges")

## Existing Files
- If spec.json already exists in the target directory, the user should be warned and asked for confirmation to overwrite
- If the user declines to overwrite, the initialization process should be aborted with a message
- If other Specky-related files exist (component.md, datamodel.json, etc.), the user should be informed but not asked for confirmation to overwrite, as the init command only creates spec.json

## Cancellation
- The initialization process can be cancelled at any prompt by pressing Ctrl+C
- If cancelled, a message should be displayed indicating that the process was cancelled
- No files should be created or modified if the process is cancelled after the confirmation to overwrite existing files

# Example Interactions

## Example 1: Basic Initialization

```
$ spm init

Creating a new Specky component specification

name: (my-component) 
version: (1.0.0) 
description: A sample component for demonstration
author: (John Doe <john@example.com>) 
license: (MIT) 
keywords: sample, demo, component
repository: (https://github.com/username/my-component) 
homepage: https://example.com/my-component
bugs: https://github.com/username/my-component/issues

About to write to spec.json:

{
  "name": "my-component",
  "version": "1.0.0",
  "description": "A sample component for demonstration",
  "author": "John Doe <john@example.com>",
  "license": "MIT",
  "keywords": [
    "sample",
    "demo",
    "component"
  ],
  "repository": "https://github.com/username/my-component",
  "homepage": "https://example.com/my-component",
  "bugs": "https://github.com/username/my-component/issues"
}

Is this OK? (yes) yes
```

## Example 2: Validation Error Handling

```
$ spm init

Creating a new Specky component specification

name: MY-COMPONENT
Error: Component name must be lowercase and can only contain alphanumeric characters, hyphens, and underscores.
name: my-component
version: (1.0.0) 1.x
Error: Version must follow semantic versioning format (X.Y.Z).
version: (1.0.0) 1.0.0
description: A sample component
author: (John Doe <john@example.com>) John Doe <invalid-email>
Error: Author email must be a valid email address.
author: (John Doe <john@example.com>) John Doe <john@example.com>
license: (MIT) 
keywords: sample, demo
repository: invalid-url
Error: Repository URL must be a valid URL.
repository: https://github.com/username/my-component
homepage: 
bugs: 

About to write to /path/to/current-dir/spec.json:

{
  "name": "my-component",
  "version": "1.0.0",
  "description": "A sample component",
  "author": "John Doe <john@example.com>",
  "license": "MIT",
  "keywords": [
    "sample",
    "demo"
  ],
  "repository": "https://github.com/username/my-component"
}

Is this OK? (yes) yes
```

## Example 3: Handling Existing Files

```
$ spm init

Creating a new Specky component specification

spec.json already exists in the current directory.
Do you want to overwrite it? (no) no
Initialization aborted. No changes were made.
```

## Example 4: Detailed Author and Repository Information

```
$ spm init

Creating a new Specky component specification

name: auth-component
version: (1.0.0) 
description: Authentication component for web applications
author: (John Doe <john@example.com>) {"name": "Jane Developer", "email": "jane@example.com", "url": "https://janedeveloper.com"}
license: (MIT) Apache-2.0
keywords: authentication, security, login
repository: {"type": "git", "url": "https://github.com/username/auth-component.git"}
homepage: https://auth-component.example.com
bugs: {"url": "https://github.com/username/auth-component/issues", "email": "bugs@example.com"}

About to write to /path/to/current-dir/spec.json:

{
  "name": "auth-component",
  "version": "1.0.0",
  "description": "Authentication component for web applications",
  "author": {
    "name": "Jane Developer",
    "email": "jane@example.com",
    "url": "https://janedeveloper.com"
  },
  "license": "Apache-2.0",
  "keywords": [
    "authentication",
    "security",
    "login"
  ],
  "repository": {
    "type": "git",
    "url": "https://github.com/username/auth-component.git"
  },
  "homepage": "https://auth-component.example.com",
  "bugs": {
    "url": "https://github.com/username/auth-component/issues",
    "email": "bugs@example.com"
  }
}

Is this OK? (yes) yes