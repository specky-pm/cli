Feature: Validate user inputs during initialization

  Rule: The system should validate all user inputs according to Specky's requirements

    Example: User provides invalid component name
      Given the user is initializing a new component
      When the user enters "MY-COMPONENT" as the component name
      Then the system should display an error about lowercase requirement
      And the system should prompt for the component name again
      When the user enters "my-component"
      Then the system should accept the input and continue

    Example: User provides invalid version
      Given the user is initializing a new component
      When the user enters "1.x" as the version
      Then the system should display an error about semantic versioning format
      And the system should prompt for the version again
      When the user enters "1.0.0"
      Then the system should accept the input and continue

    Example: User provides invalid author email
      Given the user is initializing a new component
      When the user enters author information with an invalid email format
      Then the system should display an error about email format
      And the system should prompt for author information again
      When the user enters author information with a valid email
      Then the system should accept the input and continue

    Example: User provides invalid repository URL
      Given the user is initializing a new component
      When the user enters "invalid-url" as the repository URL
      Then the system should display an error about URL format
      And the system should prompt for repository URL again
      When the user enters "https://github.com/username/my-component"
      Then the system should accept the input and continue

    Example: User provides invalid license
      Given the user is initializing a new component
      When the user enters "InvalidLicense" as the license
      Then the system should display an error about valid SPDX license identifiers
      And the system should prompt for license again
      When the user enters "MIT"
      Then the system should accept the input and continue

  Rule: The system should handle empty inputs appropriately

    Example: User provides empty input for required fields
      Given the user is initializing a new component
      When the user enters an empty string for the component name
      Then the system should display an error about required field
      And the system should prompt for the component name again
      When the user enters "my-component"
      Then the system should accept the input and continue

    Example: User provides empty input for optional fields
      Given the user is initializing a new component
      When the user enters an empty string for the license
      Then the system should use the default value "MIT"
      And the system should continue to the next prompt