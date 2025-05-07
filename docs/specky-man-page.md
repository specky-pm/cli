# SPECKY(1) - Specky Package Manager

## NAME

spm - Specky Package Manager for component specifications

## SYNOPSIS

`spm [command] [options]`

## DESCRIPTION

Specky Package Manager (spm) is a command-line tool for creating, sharing, and downloading component specifications. 
It helps developers define, manage, and reuse component specifications across projects.

## COMMANDS

### Project Initialization

#### `spm init <project-name>`

Initialize a new Specky application or component. An empty `spec.json` will be created.

**Options:**
- None documented

**Example:**
```bash
spm init my-first-project
```

### Dependency Management

#### `spm install [component] [options]`

Install components from the Specky registry.

**Options:**
- `@<version>`: Install a specific version (e.g., `spm install product-component@1.2.0`)

**Examples:**
```bash
spm install product-component
spm install product-component@1.2.0
spm install product-component shopping-cart-component user-component
spm install # Install all dependencies from spec.json
```

#### `spm uninstall <specification>`

Remove a specification from your project.

**Options:**
- None documented

**Example:**
```bash
spm uninstall product-component
```

#### `spm update [specification]`

Update specifications to newer versions.

**Options:**
- None documented

**Examples:**
```bash
spm update
spm update user-component
spm update user-component product-component
```

#### `spm outdated`

Check for outdated specifications.

**Options:**
- `--json`: Output in JSON format

**Examples:**
```bash
spm outdated
spm outdated --json > outdated.json
```

#### `spm list`

List installed specifications.

**Options:**
- `--depth=<number>`: Limit the depth of dependencies to display
- `--search=<term>`: Search among locally installed specifications

**Examples:**
```bash
spm list
spm list --depth=0
spm list --search=auth
```

#### `spm validate [component-name]`

Validate component specifications against the Specky schema.

**Options:**
- `--focus=<file>`: Validate a specific file (e.g., datamodel.json)

**Examples:**
```bash
spm validate
spm validate user-component
spm validate --focus=datamodel.json
```

### Registry Interaction

#### `spm search <term> [options]`

Search for specifications in the Specky registry.

**Options:**
- `--tag=<tag>`: Filter by tag
- `--author=<author>`: Filter by author
- `--sort=<criteria>`: Sort results by relevance (default), downloads, recent, or rating
- `--limit=<number>`: Limit the number of results

**Examples:**
```bash
spm search user authentication
spm search authentication --tag=security
spm search --author=auth-experts
spm search authentication --sort=downloads
spm search authentication --limit=5
spm search "user AND authentication NOT oauth"
spm search name:auth description:secure
```

#### `spm info <specification>`

Get detailed information about a specification.

**Options:**
- None documented

**Example:**
```bash
spm info user-auth-component
```

#### `spm related <specification>`

Find specifications related to the specified one.

**Options:**
- None documented

**Example:**
```bash
spm related user-auth-component
```

### Publishing

#### `spm login`

Authenticate with the Specky registry.

**Options:**
- None documented

**Example:**
```bash
spm login
```

#### `spm publish [options]`

Publish specifications to the Specky registry.

**Options:**
- `--dry-run`: Show what would be published without actually publishing

**Examples:**
```bash
spm publish
spm publish --dry-run
```

#### `spm deprecate <specification> <message>`

Mark a specification as deprecated.

**Options:**
- None documented

**Example:**
```bash
spm deprecate user-component "Use auth-component instead"
```

#### `spm unpublish <specification>`

Remove a specification from the registry.

**Options:**
- None documented

**Example:**
```bash
spm unpublish user-component
```

## ENVIRONMENT VARIABLES

- `SPECKY_REGISTRY`: Registry URL
- `SPECKY_AUTH_TOKEN`: Authentication token
- `SPECKY_PROXY`: HTTP proxy
- `SPECKY_HTTPS_PROXY`: HTTPS proxy
- `SPECKY_CACHE`: Cache directory
- `SPECKY_COLOR`: Enable/disable color output (true/false)

## FILES

- `spec.json`: Component metadata and dependencies
- `component.md`: Component description
- `datamodel.json`: Data model definition
- `tests/`: Directory for Gherkin feature specifications
- `.speckyrc`: Project-specific configuration
- `~/.speckyrc` or `~/.config/specky/config`: User configuration

## AUTHOR

The Specky Team
