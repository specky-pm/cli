Feature: Determine Files to Include in Package

  # Use Case: The system determines which files to include in the package

  Rule: The system should only include files specified in the `files` field of spec.json

    Example: User packages a component with specific files
      Given a valid component specification
      And the spec.json file contains a "files" field with ["src/index.js", "README.md"]
      When the user runs "spm pack"
      Then the system should include "src/index.js" and "README.md" in the package

  Rule: The system should support direct file paths relative to the component root

    Example: User packages a component with direct file paths
      Given a valid component specification
      And the spec.json file contains a "files" field with direct file paths ["src/index.js", "docs/README.md"]
      When the user runs "spm pack"
      Then the system should include the files at those exact paths in the package

  Rule: The system should support glob patterns

    Example: User packages a component with glob patterns
      Given a valid component specification
      And the spec.json file contains a "files" field with glob patterns ["src/**/*.js", "tests/**/*.feature"]
      When the user runs "spm pack"
      Then the system should resolve all glob patterns to matching files
      And the system should include all matching files in the package

  Rule: The system should always include the spec.json file, even if not explicitly listed

    Example: User packages a component without explicitly listing spec.json
      Given a valid component specification
      And the spec.json file contains a "files" field that does not include "spec.json"
      When the user runs "spm pack"
      Then the system should include the spec.json file in the package