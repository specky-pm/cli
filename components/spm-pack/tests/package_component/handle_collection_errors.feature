Feature: Handle Errors When Collecting Files

  # Use Case: The system handles errors when collecting files

  Rule: If any file specified in the `files` field does not exist, the system should display an appropriate error message

    Example: User attempts to package with missing files
      Given a valid component specification
      And the spec.json file contains a "files" field with files that do not exist
      When the user runs "spm pack"
      Then the system should display an error message listing the missing files
      And the system should exit with a non-zero status code

    Example: User attempts to package with some missing files
      Given a valid component specification
      And the spec.json file contains a "files" field with ["existing-file.js", "non-existent-file.js"]
      When the user runs "spm pack"
      Then the system should display an error message "Error: The following files specified in spec.json could not be found: non-existent-file.js"
      And the system should exit with a non-zero status code

  Rule: If a glob pattern in the `files` field is invalid, the system should display an appropriate error message

    Example: User attempts to package with invalid glob patterns
      Given a valid component specification
      And the spec.json file contains a "files" field with an invalid glob pattern
      When the user runs "spm pack"
      Then the system should display an error message indicating the invalid glob pattern
      And the system should exit with a non-zero status code

    Example: User attempts to package with a specific invalid glob pattern
      Given a valid component specification
      And the spec.json file contains a "files" field with ["src/**/*.js", "[invalid-glob"]
      When the user runs "spm pack"
      Then the system should display an error message "Error: Invalid glob pattern in 'files' field: [invalid-glob"
      And the system should exit with a non-zero status code