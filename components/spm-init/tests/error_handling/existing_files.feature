Feature: Handle existing files during initialization

  Rule: The system should warn users when spec.json already exists

    Example: User declines to overwrite existing spec.json
      Given the user is in a directory with an existing spec.json file
      When the user runs "spm init"
      Then the system should warn that spec.json already exists
      And the system should display the full path to the existing file
      And the system should ask for confirmation to overwrite
      When the user declines to overwrite
      Then the system should abort the initialization process
      And the system should display a message that no changes were made
      And the existing spec.json file should remain unchanged

    Example: User confirms to overwrite existing spec.json
      Given the user is in a directory with an existing spec.json file
      When the user runs "spm init"
      Then the system should warn that spec.json already exists
      And the system should display the full path to the existing file
      And the system should ask for confirmation to overwrite
      When the user confirms to overwrite
      Then the system should continue with the initialization process
      And the system should prompt for component information
      When the user completes all prompts and confirms
      Then the existing spec.json file should be replaced with the new content

  Rule: The system should handle other Specky-related files appropriately

    Example: User initializes in a directory with other Specky files
      Given the user is in a directory with component.md and datamodel.json files
      When the user runs "spm init"
      Then the system should inform the user about existing Specky files
      But the system should not ask for confirmation to proceed
      And the system should continue with the initialization process
      When the user completes all prompts and confirms
      Then a new spec.json file should be created
      And the existing component.md and datamodel.json files should remain unchanged