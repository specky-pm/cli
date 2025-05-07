In the ./docs directory, you'll find the specification of the Specky CLI tool.

I want you to help me build the **specifications** for implementing Specky in the style outlined by the Specky 
Specification, so that I can bootstrap the development. That is, I want to specify Specky in its own specification
language.

# Your Tasks

- review all the specifications in the ./docs directory to understand the requirements
- write a specification in markdown format for the `spm init` command
    - review `docs/specky-man-page.md` to get an overview of the spm commands
    - the init function should work the same as `npm init` that is, it asks the user for meta-data about the component specification they want to build
    - the init function should build a `spec.json` file as outlined in `docs/02-specky-spec-json.md`
    - write your specification to `spm-init-component.md`

# Constraints

I'm building a simple MVP so I **only** want to create the **specification** for the `spm init` command and nothing else.

 
 