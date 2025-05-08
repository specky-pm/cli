Feature: Validate Files to be Included in Package

  # Use Case: The system validates files to be included in the package

  Rule: If the spec.json file is not found, the system should display an appropriate error message

    Example: User attempts to package without a spec.json file
      Given a directory without a spec.json file
      When the user runs "spm pack"
      Then the system should display an error message "Error: spec.json not found in the current directory."
      And the system should exit with a non-zero status code

  Rule: If the spec.json file contains invalid JSON, the system should display an appropriate error message

    Example: User attempts to package with an invalid spec.json file
      Given a directory with a spec.json file containing invalid JSON
      When the user runs "spm pack"
      Then the system should display an error message "Error: spec.json contains invalid JSON."
      And the system should exit with a non-zero status code

  Rule: If the spec.json file is missing required fields, the system should display an appropriate error message

    Example: User attempts to package with a spec.json missing required fields
      Given a directory with a spec.json file missing required fields
      When the user runs "spm pack"
      Then the system should display an error message indicating the missing required fields
      And the system should exit with a non-zero status code

  Rule: If the spec.json file does not contain a `files` field, the system should display an appropriate error message

    Example: User attempts to package with a spec.json without a files field
      Given a directory with a spec.json file without a "files" field
      When the user runs "spm pack"
      Then the system should display an error message "Error: spec.json must contain a 'files' field specifying which files to include in the package."
      And the system should exit with a non-zero status code

  Rule: If the `files` field is not an array of strings, the system should display an appropriate error message

    Example: User attempts to package with an invalid files field
      Given a directory with a spec.json file with a "files" field that is not an array of strings
      When the user runs "spm pack"
      Then the system should display an error message "Error: The 'files' field in spec.json must be an array of strings."
      And the system should exit with a non-zero status code