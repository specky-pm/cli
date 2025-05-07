Feature: Initialize a new component specification

  Rule: The system should guide users through creating a new spec.json file

    Example: User creates a basic component specification with defaults
      Given the user is in a directory without an existing spec.json file
      When the user runs "spm init"
      Then the system should prompt for component name
      And the system should prompt for version with default "1.0.0"
      And the system should prompt for description
      And the system should prompt for author with git config defaults if available
      And the system should prompt for license with default "MIT"
      And the system should prompt for keywords
      And the system should prompt for repository information
      And the system should prompt for homepage URL
      And the system should prompt for bug reporting URL
      And the system should display a preview of the spec.json file
      And the system should ask for confirmation before writing the file
      When the user confirms
      Then a valid spec.json file should be created in the current directory

    Example: User creates a component specification with custom values
      Given the user is in a directory without an existing spec.json file
      When the user runs "spm init"
      And the user enters "auth-component" for the name
      And the user enters "1.0.0" for the version
      And the user enters "Authentication component for web applications" for the description
      And the user enters detailed author information as a JSON object
      And the user enters "Apache-2.0" for the license
      And the user enters "authentication, security, login" for keywords
      And the user enters repository information as a JSON object
      And the user enters "https://auth-component.example.com" for the homepage
      And the user enters bug reporting information as a JSON object
      Then the system should display a preview of the spec.json file with all entered values
      When the user confirms
      Then a valid spec.json file should be created with all the provided information