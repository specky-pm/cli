Feature: Support cancellation during initialization

  Rule: The system should allow users to cancel the initialization process at any point

    Example: User cancels during name prompt
      Given the user is initializing a new component
      When the user is prompted for the component name
      And the user presses Ctrl+C
      Then the system should display a cancellation message
      And the initialization process should be aborted
      And no spec.json file should be created

    Example: User cancels during version prompt
      Given the user is initializing a new component
      When the user enters "my-component" for the name
      And the user is prompted for the version
      And the user presses Ctrl+C
      Then the system should display a cancellation message
      And the initialization process should be aborted
      And no spec.json file should be created

    Example: User cancels during confirmation
      Given the user has completed all prompts for initialization
      When the system displays the preview of the spec.json file
      And the system asks for confirmation before writing the file
      And the user presses Ctrl+C
      Then the system should display a cancellation message
      And the initialization process should be aborted
      And no spec.json file should be created

  Rule: The system should preserve any directories created before cancellation

    Example: User cancels after creating a new directory
      Given the user has created a new directory for the component
      When the user runs "spm init" in the new directory
      And the user presses Ctrl+C during initialization
      Then the system should display a cancellation message
      And the initialization process should be aborted
      And no spec.json file should be created
      But the new directory should remain intact

  Rule: The system should handle file system errors gracefully

    Example: System encounters permission error when writing file
      Given the user is initializing a new component
      When the user completes all prompts and confirms
      But the system cannot write to the file due to permission issues
      Then the system should display a specific error message about permissions
      And the error message should include the path that could not be accessed
      And the system should suggest running with administrator privileges