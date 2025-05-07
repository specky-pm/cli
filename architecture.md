# Specky Package Manager (spm) Architecture

The Specky Package Manager (spm) is a CLI (command line interface) for creating, installing and managing component 
specifications following the Specky format. 

## System Context

The CLI tool will be installed globally via NPM and can then be used to perform various actions.
It can access the Specky repository via an REST API.

## Constraints

We are implementing an MVP so the only constraint is that the tool should be small and simple.

## Quality (non-functional) Requirements

The system should be small and simple. It will be thrown away in the future.

## Solution Strategy

To keep the CLI small and simple, the following design decisions have been made:
- Programming Language: Typescript
- Packaging: NPM
- Runtime: Node.js

