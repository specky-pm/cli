# Specky Package Manager (spm)

The Specky Package Manager (spm) is a command-line tool for creating, installing, and managing component specifications following the Specky format. It simplifies the process of creating and maintaining standardized component specifications across your projects.

## Installation

You can install the Specky Package Manager globally using npm:

```bash
npm install -g specky-pm
```

Or using yarn:

```bash
yarn global add specky-pm
```

## Usage

Once installed, you can use the `spm` command to manage your Specky components.

### Available Commands

- `spm init` - Initialize a new Specky component specification
- `spm help` - Display help information
- `spm version` - Display the current version

## Command: spm init

The `spm init` command helps you create a new `spec.json` file for your Specky component. It guides you through an interactive process to collect all the necessary information.

### Usage

```bash
spm init [options]
```

### Options

- `-y, --yes` - Skip prompts and use default values

### Examples

Basic usage with interactive prompts:

```bash
spm init
```

Quick initialization with default values:

```bash
spm init --yes
```

### Interactive Prompts

The `spm init` command will prompt you for the following information:

1. **Component name** - The name of your component (must be lowercase and can only contain alphanumeric characters, hyphens, and underscores)
2. **Version** - The version of your component (following semantic versioning)
3. **Description** - A brief description of your component
4. **Author information** - Your name, email, and URL
5. **License** - The license for your component (e.g., MIT, Apache-2.0)
6. **Keywords** - Comma-separated list of keywords
7. **Repository information** - The URL of your component's repository
8. **Homepage URL** - The URL of your component's homepage
9. **Bug reporting information** - URLs and email for reporting bugs

After collecting this information, the command will show you a preview of the `spec.json` file and ask for confirmation before creating it.

## Command: spm pack

The `spm pack` command creates a distributable package of your Specky component based on the `spec.json` file. It bundles the specified files and directories into a single archive, ready for distribution or installation.

### Usage

```bash
spm pack [options]
```

### Options

- `-y, --yes` - Skip prompts and proceed with packaging without confirmation

### Examples

Basic usage with confirmation prompt:

```bash
spm pack
```

Quick packaging without confirmation:

```bash
spm pack --yes
```

## The spec.json File

The `spec.json` file is the core of a Specky component. It contains metadata about the component and follows a structure similar to `package.json` but with specific fields for Specky components.

### Example spec.json

```json
{
  "name": "my-component",
  "version": "1.0.0",
  "description": "A sample Specky component",
  "author": {
    "name": "John Doe",
    "email": "john@example.com",
    "url": "https://example.com"
  },
  "license": "MIT",
  "keywords": [
    "specky",
    "component",
    "my-component"
  ],
  "repository": {
    "type": "git",
    "url": "https://github.com/username/my-component"
  },
  "homepage": "https://example.com/my-component",
  "bugs": {
    "url": "https://github.com/username/my-component/issues",
    "email": "bugs@example.com"
  }
}
```

### Required Fields

- `name` - The name of the component
- `version` - The version of the component (following semantic versioning)
- `description` - A brief description of the component

### Optional Fields

- `author` - The author of the component (string or object with name, email, and URL)
- `contributors` - Array of contributors (strings or objects)
- `license` - The license for the component (SPDX identifier)
- `keywords` - Array of keywords
- `dependencies` - Object mapping dependency names to version ranges
- `repository` - The repository where the component is stored (string or object)
- `homepage` - The URL of the component's homepage
- `bugs` - Information for reporting bugs (string or object)
- `files` - Array of files to include
- `publishConfig` - Configuration for publishing

### The `files` Field

The `files` field in `spec.json` is an array of strings that specifies which files and directories should be included when the component is packaged using `spm pack`.

Each string in the `files` array can be a file path, a directory path, or a glob pattern.

- **File Paths:** Include a specific file.
- **Directory Paths:** Include all files within the directory and its subdirectories.
- **Glob Patterns:** Use glob syntax to specify multiple files or patterns. Common glob patterns include:
    - `*`: Matches any sequence of non-separator characters.
    - `**`: Matches any sequence of characters, including separators (used for matching directories recursively).
    - `?`: Matches any single non-separator character.
    - `[abc]`: Matches any single character in the set.
    - `[!abc]`: Matches any single character not in the set.

Example `files` field:

```json
"files": [
  "README.md",
  "component.md",
  "docs/",
  "tests/**/*.feature",
  "!tests/**/*.md"
]
```

In this example:
- `README.md`, `component.md` includes the README and component files.
- `docs/` includes everything in the `docs` directory.
- `tests/**/*.features` includes all Gherkin feature spec files in the `tests` directory and its subdirectories.
- `tests/**/*.md` excludes markdown files from the `tests` directory (patterns starting with `!` exclude matches).

## Troubleshooting

### Common Issues

#### "spec.json already exists"

If you see this message, it means there's already a `spec.json` file in the current directory. You can:

1. Move to a different directory
2. Delete or rename the existing file
3. Confirm overwriting when prompted

#### Validation Errors

If you encounter validation errors, make sure:

- Component name is lowercase and contains only alphanumeric characters, hyphens, and underscores
- Version follows semantic versioning (X.Y.Z)
- Description is not empty
- URLs are valid
- Email addresses are valid
- License is a valid SPDX identifier

#### Git Configuration Not Found

If the tool can't find your git configuration:

1. Make sure git is installed
2. Configure your git user name and email:
   ```bash
   git config --global user.name "Your Name"
   git config --global user.email "your.email@example.com"
   ```

### Debug Mode

You can enable debug mode to see more detailed error information:

```bash
spm --debug init
```

## License

MIT
