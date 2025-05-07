# Converting Component Specifications to Specky Format

This guide explains how to convert the component specifications in this directory to the Specky component format.

## Specky Component Structure

As described in the documentation, a Specky component consists of:

1. **spec.json**: Contains metadata about the component
2. **component.md**: Describes the component in detail
3. **datamodel.json** (optional): Models entities that the component relies on
4. **tests/*.feature** (optional): Gherkin feature specifications for testing

## Conversion Process

### Step 1: Create Component Directory Structure

For each component specification (e.g., `user-management.md`), create a directory structure:

```
components/
├── user-management/
│   ├── spec.json
│   ├── component.md
│   ├── datamodel.json (if needed)
│   └── tests/
│       └── *.feature
├── component-storage/
│   ├── ...
...
```

### Step 2: Create spec.json

Extract metadata from each component specification to create a `spec.json` file:

```json
{
  "name": "@specky/user-management",
  "version": "0.1.0",
  "description": "User management component for the Specky repository",
  "author": {
    "name": "Your Name",
    "email": "your.email@example.com"
  },
  "license": "MIT",
  "keywords": ["user", "authentication", "profile"],
  "dependencies": {
    "@specky/authentication-authorization": "^0.1.0"
  }
}
```

Key points:
- Use the component name as the package name
- Use @specky as the component namespace e.g. `@specky/component-name`
- Start with version 0.1.0 because we're still in development
- Include relevant keywords
- Define dependencies on other components

#### Validating spec.json

There is a linter available on the command line that you can use to verify the `spec.json`. For example:
```bash
specky-lint --no-datamodel path/to/component/dir
```

The linter will tell you if there are any problems with the `spec.json` file you've created
Note: we use the `--no-datamodel` option to exclude the `datamodel.json` file from the validation, since it doesn't exist yet

### Step 3: Convert to component.md

The existing markdown files are already structured similarly to what's expected in a `component.md` file. However, you should:

1. Remove any implementation-specific details
2. Focus on functional requirements only
3. Ensure the content is language-agnostic
4. Organize content according to the recommended structure:
   - Overview
   - Core Functionality
   - Features & Use Cases

Example transformation:

From:
```markdown
## Data Management

### User Data

The component stores the following user information:
- Unique identifier (UUID)
- Username (unique)
- Email address
```

To:
```markdown
## Data Management

### User Data

The component should manage the following user information:
- A unique identifier for each user
- A unique username
- An email address
```

### Step 4: Create datamodel.json

Extract entity definitions from the "Data Management" section of each component specification to create a `datamodel.json` file:

```json
{
  "entities": [
    {
      "name": "User",
      "attributes": [
        {
          "name": "id",
          "type": "string",
          "description": "Unique identifier for the user",
          "required": true,
          "unique": true
        },
        {
          "name": "username",
          "type": "string",
          "description": "User's unique username",
          "required": true,
          "unique": true
        },
        {
          "name": "email",
          "type": "string",
          "description": "User's email address",
          "required": true,
          "unique": true,
          "validation": {
            "format": "email"
          }
        }
      ],
      "relationships": []
    }
  ]
}
```

#### Validating spec.json

There is a linter available on the command line that you can use to verify the `datamodel.json`. For example:
```bash
specky-lint --no-spec path/to/component/dir
```

The linter will tell you if there are any problems with the `datamodel.json` file you've created.
Note: we use the `--no-spec` option to exclude the `spec.json` file from the validation so we can focus on the datamodel.


### Step 5: Create Gherkin Feature Files

Convert the "Features & Use Cases" sections into Gherkin feature files in the `tests/` directory:

```gherkin
Feature: User Registration and Authentication

  Rule: Users can register using OAuth providers
  
    Example: User registers with GitHub
      Given a user wants to register
      When they select GitHub as their OAuth provider
      And they complete the GitHub authentication flow
      Then a new user account should be created
      And their GitHub profile information should be imported
      And they should receive an authentication token

  Rule: Users can log in to the system
  
    Example: User logs in with valid credentials
      Given a registered user
      When they authenticate with their OAuth provider
      Then they should be logged in
      And they should receive a valid JWT token
      And their login activity should be recorded
```

Organize feature files by user journey or activity:

```
tests/
├── user_registration/
│   ├── oauth_registration.feature
│   └── login.feature
├── user_profile/
│   ├── view_profile.feature
│   └── update_profile.feature
...
```

## Validation

After converting each component, validate it using the specky-lint validation tool to find any issues:

```bash
specky-lint components/user-management
```

Ensure that:
1. The `spec.json` file is valid
2. The `component.md` file contains all required sections
3. The `datamodel.json` file (if present) follows the correct schema
4. All Gherkin feature files use valid syntax

## Dependencies Between Components

When defining dependencies in `spec.json`, follow these guidelines:

1. Use semantic versioning ranges (e.g., `^1.0.0`)
2. Only include direct dependencies
3. Categorize dependencies appropriately:
   - `dependencies`: Required components

## Example

A complete example of the User Management component converted to Specky format would include:

1. `spec.json` with metadata
2. `component.md` with functional requirements
3. `datamodel.json` with User entity definition
4. Feature files for registration, login, profile management, etc.

This structure ensures that the component specification can be shared, versioned, and used by other developers through the Specky repository.