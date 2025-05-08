# Notes on building with Agents

These are just some notes about how to improve the whole implementation process with Agent coders.

## 1. What I've been doing so far

Here's how I'm building this thing one feature at a time.

1. create instructions for building a draft specification for a component -> see `01-create-draft-spec-instructions`
2. prompt the agent to build a draft specification -> see `02-draft-specs`
3. prompt the agent to build a specky component from the draft spec -> see "Convert Draft Spec to Specky Spec" below
4. prompt the agent to build instructions for building the new component -> see `03-planning-instructions`
5. prompt the agent to implement the generated plan -> see `04-impl-plan`

### Side Notes

When creating an application for the first time, use `architecture.md` or similar to tell it what you want.

Generally, you want to include these sections:
- System Context
- Constraints
- Quality Requirements
- Solution Strategy

## 2. Convert Draft Spec to Specky Spec

Here's the prompt I'm using

```
convert the @/spm-pack-component.md to a specky component. use the @/conversion-guide.md
```

### Potential Improvements

Add instructions for writing good:
- Features, Use Cases and Rules
- Gherkin Specs


## 3. Planning Instructions

Things to include in the planning instructions:
- it should run ALL the test after each phase of the implementation
- it should make sure to implement the gherkin tests

### One Day

Figure out how to make it do TDD i.e. write the tests first

## 4. Impl Plans

Here's the prompt I'm using to get it to execute a plan:

```
implement the plan in @/implementation-plan--spm-pack.md . delegate to the relevant modes as appropriate. Update the plan after each step.
```