In the ./docs directory, you'll find the specification of the Specky CLI tool.

I want you to help me build the **specifications** for implementing Specky in the style outlined by the Specky 
Specification, so that I can bootstrap the development. That is, I want to specify Specky in its own specification
language.

# Your Tasks

- review all the specifications in the ./docs directory to understand the requirements
- write a specification in markdown format for the `spm pack` command
    - review `docs/specky-man-page.md` to get an overview of the spm commands
    - the `pack` command should work the same as `npm pack` that is, package a specification to send to the Specky Repository
    - the `pack` command should package a component specification including all relevant files i.e.
      - `spec.json` file as outlined in `docs/02-specky-spec-json.md`
      - `component.md` files as outlined in `docs/03-compontent-md.md`
      - `datamodel.json` file as outlined in `docs/04-specky-datamodel-json.md`
      - `tests/**/*.feature` files as outlined in `docs/05-specky-tests-directory.md`
    - the generated zip file should include the name of the component and the version e.g. `my-component-1.2.3.zip`
- write your specification to `spm-pack-component.md`

# Constraints

I'm building a simple MVP so I **only** want to create the **specification** for the `spm pack` command and nothing else.
