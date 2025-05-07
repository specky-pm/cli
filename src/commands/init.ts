import { Command } from 'commander';
import chalk from 'chalk';
import inquirer from 'inquirer';
import fs from 'fs-extra';
import path from 'path';
import semver from 'semver';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { specJsonSchema } from '@specky-pm/spec';
import {
  validateComponentName,
  validateVersion,
  validateDescription,
  validateUrl,
  validateEmail,
  validateLicense
} from '../utils/validation';
import { getDefaultAuthor, getDefaultRepository } from '../utils/git';
import { checkFileExists, writeJsonFile } from '../utils/filesystem';
import { getDefaultVersion, getDefaultLicense, getDefaultKeywords } from '../utils/defaults';
import { SpecJson, Author, Repository, Bugs, CommandOptions } from '../types';

/**
 * Register the init command with the CLI
 *
 * This function registers the 'init' command with the Commander program.
 * The init command initializes a new Specky component specification by creating
 * a spec.json file in the current directory.
 *
 * @param program - The Commander program instance
 *
 * @example
 * // In src/commands/index.ts
 * import { Command } from 'commander';
 * import { initCommand } from './init';
 *
 * const program = new Command();
 * initCommand(program);
 */
export function initCommand(program: Command): void {
  program
    .command('init')
    .description('Initialize a new Specky component specification')
    .option('-y, --yes', 'Skip prompts and use default values')
    .action(async (options: CommandOptions) => {
      console.log(chalk.blue('Initializing a new Specky component specification...'));
      
      try {
        // Check if spec.json already exists
        const specJsonPath = path.join(process.cwd(), 'spec.json');
        const fileExists = await checkFileExists(specJsonPath);
        
        if (fileExists && !options.yes) {
          const { overwrite } = await inquirer.prompt([
            {
              type: 'confirm',
              name: 'overwrite',
              message: 'A spec.json file already exists. Do you want to overwrite it?',
              default: false
            }
          ]);
          
          if (!overwrite) {
            console.log(chalk.yellow('Initialization cancelled.'));
            return;
          }
        }
        
        // Get default values
        const defaultAuthor = getDefaultAuthor();
        const defaultRepository = getDefaultRepository();
        
        // Prompt for component information
        const answers = await promptForSpecInfo(defaultAuthor, defaultRepository);
        
        // Generate spec.json content
        const specJson = generateSpecJson(answers);
        
        // Validate against JSON schema
        const isValid = validateSpecJson(specJson);
        
        if (!isValid) {
          console.log(chalk.red('Generated spec.json is not valid according to the schema.'));
          return;
        }
        
        // Preview spec.json
        console.log(chalk.green('\nPreview of spec.json:'));
        console.log(JSON.stringify(specJson, null, 2));
        
        // Confirm file creation
        if (!options.yes) {
          const { confirm } = await inquirer.prompt([
            {
              type: 'confirm',
              name: 'confirm',
              message: 'Do you want to create this spec.json file?',
              default: true
            }
          ]);
          
          if (!confirm) {
            console.log(chalk.yellow('File creation cancelled.'));
            return;
          }
        }
        
        // Write spec.json file
        await writeJsonFile(specJsonPath, specJson);
        
        console.log(chalk.green(`\nspec.json file created successfully at ${specJsonPath}`));
      } catch (error) {
        if (error instanceof Error && error.name === 'SIGINT') {
          console.log(chalk.yellow('\nInitialization cancelled.'));
        } else {
          console.error(chalk.red('Error initializing spec.json:'), error);
        }
      }
    });
}

/**
 * Prompt the user for spec.json information
 */
/**
 * Prompt the user for spec.json information
 *
 * @param defaultAuthor - Default author information from git config
 * @param defaultRepo - Default repository URL from git config
 * @returns A promise that resolves to an object containing all user inputs
 * @throws Error with name 'SIGINT' if the user cancels the prompts
 *
 * @example
 * // Get default values
 * const defaultAuthor = getDefaultAuthor();
 * const defaultRepository = getDefaultRepository();
 *
 * // Prompt for component information
 * const answers = await promptForSpecInfo(defaultAuthor, defaultRepository);
 */
async function promptForSpecInfo(defaultAuthor?: Author, defaultRepo?: string): Promise<any> {
  try {
    const questions = [
      {
        type: 'input',
        name: 'name',
        message: 'Component name:',
        validate: (input: string) => {
          const result = validateComponentName(input);
          return result.isValid || result.message;
        }
      },
      {
        type: 'input',
        name: 'version',
        message: 'Version:',
        default: getDefaultVersion(),
        validate: (input: string) => {
          const result = validateVersion(input);
          return result.isValid || result.message;
        }
      },
      {
        type: 'input',
        name: 'description',
        message: 'Description:',
        validate: (input: string) => {
          const result = validateDescription(input);
          return result.isValid || result.message;
        }
      },
      {
        type: 'list',
        name: 'authorType',
        message: 'Author information:',
        choices: [
          { name: 'String (name only)', value: 'string' },
          { name: 'Object (name, email, url)', value: 'object' }
        ],
        default: defaultAuthor ? 'object' : 'string'
      },
      {
        type: 'input',
        name: 'authorString',
        message: 'Author name:',
        when: (answers: any) => answers.authorType === 'string',
        validate: (input: string) => input.trim() !== '' || 'Author name is required'
      },
      {
        type: 'input',
        name: 'authorName',
        message: 'Author name:',
        when: (answers: any) => answers.authorType === 'object',
        default: defaultAuthor?.name,
        validate: (input: string) => input.trim() !== '' || 'Author name is required'
      },
      {
        type: 'input',
        name: 'authorEmail',
        message: 'Author email (optional):',
        when: (answers: any) => answers.authorType === 'object',
        default: defaultAuthor?.email,
        validate: (input: string) => {
          if (!input) return true;
          const result = validateEmail(input);
          return result.isValid || result.message;
        }
      },
      {
        type: 'input',
        name: 'authorUrl',
        message: 'Author URL (optional):',
        when: (answers: any) => answers.authorType === 'object',
        default: defaultAuthor?.url,
        validate: (input: string) => {
          if (!input) return true;
          const result = validateUrl(input);
          return result.isValid || result.message;
        }
      },
      {
        type: 'input',
        name: 'license',
        message: 'License:',
        default: getDefaultLicense(),
        validate: (input: string) => {
          const result = validateLicense(input);
          return result.isValid || result.message;
        }
      },
      {
        type: 'input',
        name: 'keywords',
        message: 'Keywords (comma separated):',
        default: (answers: any) => getDefaultKeywords(answers.name).join(', '),
        filter: (input: string) => input.split(',').map(k => k.trim()).filter(Boolean)
      },
      {
        type: 'list',
        name: 'repositoryType',
        message: 'Repository information:',
        choices: [
          { name: 'None', value: 'none' },
          { name: 'URL string', value: 'string' },
          { name: 'Object (type, url)', value: 'object' }
        ],
        default: defaultRepo ? 'string' : 'none'
      },
      {
        type: 'input',
        name: 'repositoryString',
        message: 'Repository URL:',
        when: (answers: any) => answers.repositoryType === 'string',
        default: defaultRepo,
        validate: (input: string) => {
          const result = validateUrl(input);
          return result.isValid || result.message;
        }
      },
      {
        type: 'input',
        name: 'repositoryType',
        message: 'Repository type:',
        when: (answers: any) => answers.repositoryType === 'object',
        default: 'git'
      },
      {
        type: 'input',
        name: 'repositoryUrl',
        message: 'Repository URL:',
        when: (answers: any) => answers.repositoryType === 'object',
        default: defaultRepo,
        validate: (input: string) => {
          const result = validateUrl(input);
          return result.isValid || result.message;
        }
      },
      {
        type: 'input',
        name: 'homepage',
        message: 'Homepage URL (optional):',
        validate: (input: string) => {
          if (!input) return true;
          const result = validateUrl(input);
          return result.isValid || result.message;
        }
      },
      {
        type: 'list',
        name: 'bugsType',
        message: 'Bug reporting information:',
        choices: [
          { name: 'None', value: 'none' },
          { name: 'URL string', value: 'string' },
          { name: 'Object (url, email)', value: 'object' }
        ],
        default: 'none'
      },
      {
        type: 'input',
        name: 'bugsString',
        message: 'Bugs URL:',
        when: (answers: any) => answers.bugsType === 'string',
        validate: (input: string) => {
          const result = validateUrl(input);
          return result.isValid || result.message;
        }
      },
      {
        type: 'input',
        name: 'bugsUrl',
        message: 'Bugs URL:',
        when: (answers: any) => answers.bugsType === 'object',
        validate: (input: string) => {
          const result = validateUrl(input);
          return result.isValid || result.message;
        }
      },
      {
        type: 'input',
        name: 'bugsEmail',
        message: 'Bugs email (optional):',
        when: (answers: any) => answers.bugsType === 'object',
        validate: (input: string) => {
          if (!input) return true;
          const result = validateEmail(input);
          return result.isValid || result.message;
        }
      }
    ];

    // Handle SIGINT (Ctrl+C) during prompts
    process.on('SIGINT', () => {
      throw new Error('SIGINT');
    });

    return await inquirer.prompt(questions);
  } catch (error) {
    if (error instanceof Error && error.message === 'SIGINT') {
      error.name = 'SIGINT';
    }
    throw error;
  }
}

/**
 * Generate spec.json content from user answers
 */
/**
 * Generate spec.json content from user answers
 *
 * @param answers - The answers object from promptForSpecInfo
 * @returns A SpecJson object containing the formatted data
 *
 * @example
 * const answers = await promptForSpecInfo(defaultAuthor, defaultRepository);
 * const specJson = generateSpecJson(answers);
 */
function generateSpecJson(answers: any): SpecJson {
  const specJson: SpecJson = {
    name: answers.name,
    version: answers.version,
    description: answers.description
  };

  // Add author
  if (answers.authorType === 'string') {
    specJson.author = answers.authorString;
  } else if (answers.authorType === 'object') {
    const author: Author = {
      name: answers.authorName
    };
    
    if (answers.authorEmail) {
      author.email = answers.authorEmail;
    }
    
    if (answers.authorUrl) {
      author.url = answers.authorUrl;
    }
    
    specJson.author = author;
  }

  // Add license
  if (answers.license) {
    specJson.license = answers.license;
  }

  // Add keywords
  if (answers.keywords && answers.keywords.length > 0) {
    specJson.keywords = answers.keywords;
  }

  // Add repository
  if (answers.repositoryType === 'string') {
    specJson.repository = answers.repositoryString;
  } else if (answers.repositoryType === 'object') {
    specJson.repository = {
      type: answers.repositoryType,
      url: answers.repositoryUrl
    };
  }

  // Add homepage
  if (answers.homepage) {
    specJson.homepage = answers.homepage;
  }

  // Add bugs
  if (answers.bugsType === 'string') {
    specJson.bugs = answers.bugsString;
  } else if (answers.bugsType === 'object') {
    const bugs: Bugs = {
      url: answers.bugsUrl
    };
    
    if (answers.bugsEmail) {
      bugs.email = answers.bugsEmail;
    }
    
    specJson.bugs = bugs;
  }

  return specJson;
}

/**
 * Validate spec.json against JSON schema
 */
/**
 * Validate spec.json against JSON schema
 *
 * @param specJson - The spec.json object to validate
 * @returns True if the spec.json is valid, false otherwise
 *
 * @example
 * const specJson = generateSpecJson(answers);
 * const isValid = validateSpecJson(specJson);
 *
 * if (!isValid) {
 *   console.log('Generated spec.json is not valid according to the schema.');
 *   return;
 * }
 */
function validateSpecJson(specJson: SpecJson): boolean {
  try {
    // Create Ajv instance with additional options
    const ajv = new Ajv({
      allErrors: true,
      strict: false
    });
    
    // Add formats support (including email and uri)
    addFormats(ajv);
    
    // Create a modified version of the schema without the $schema property
    const modifiedSchema = { ...specJsonSchema } as Record<string, any>;
    delete modifiedSchema.$schema;
    
    // Use the modified schema for validation
    const validate = ajv.compile(modifiedSchema);
    const valid = validate(specJson);
    
    if (!valid && validate.errors) {
      console.log(chalk.red('Validation errors from schema:'));
      validate.errors.forEach((error) => {
        console.log(chalk.red(`- ${error.instancePath || '/'}: ${error.message}`));
      });
    }
    
    return !!valid;
  } catch (error) {
    console.error(chalk.red('Error validating spec.json:'), error);
    return false;
  }
}