Feature: Handle Errors During Packaging

  # Use Case: The system handles errors during packaging

  Rule: If there are issues creating or writing to the zip file, the system should display an appropriate error message

    Example: User attempts to package with file system errors
      Given a valid component specification
      And there are issues creating or writing to the zip file
      When the user runs "spm pack"
      Then the system should display an error message about the file creation failure
      And the system should exit with a non-zero status code

    Example: User attempts to package with a specific file system error
      Given a valid component specification
      And the system encounters a "disk full" error when creating the zip file
      When the user runs "spm pack"
      Then the system should display an error message "Error: Failed to create package: No space left on device"
      And the system should exit with a non-zero status code

  Rule: If the system doesn't have permission to write to the output directory, the system should display an appropriate error message

    Example: User attempts to package without write permissions
      Given a valid component specification
      And the user doesn't have permission to write to the output directory
      When the user runs "spm pack"
      Then the system should display an error message "Error: Permission denied when creating package file."
      And the system should exit with a non-zero status code

    Example: User attempts to package in a read-only directory
      Given a valid component specification in a read-only directory
      When the user runs "spm pack"
      Then the system should display an error message about permission issues
      And the system should exit with a non-zero status code