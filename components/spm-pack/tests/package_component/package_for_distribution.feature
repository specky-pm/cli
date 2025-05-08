Feature: Package Component Specification for Distribution

  # Use Case: A user packages a component specification for distribution

  Rule: The system should create a zip file named "{component-name}-{version}.zip"

    Example: User packages a component specification
      Given a valid component specification with component name "my-component" and version "1.2.3"
      When the user runs "spm pack"
      Then the system should create a zip file named "my-component-1.2.3.zip"

  Rule: The system should add all collected files to the zip archive, maintaining the directory structure

    Example: User packages a component with nested directory structure
      Given the user is in a directory with a valid component specification
      And the spec.json file contains a "files" field with files in nested directories
      When the user runs "spm pack"
      Then the system should collect all required files maintaining the directory structure
      And the system should create a zip file with the same directory structure

  Rule: The system should save the zip file in the current directory

    Example: User packages a component specification
      Given the user is in a directory with a valid component specification
      When the user runs "spm pack"
      Then the system should save the zip file in the current directory

  Rule: The system should display a success message with the path to the created zip file

    Example: User successfully packages a component specification
      Given the user is in a directory with a valid component specification
      When the user runs "spm pack"
      Then the system should display a success message with the path to the created zip file