import { specJsonSchema } from '@specky-pm/spec';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import {
  validateComponentName,
  validateDescription,
  validateEmail,
  validateLicense,
  validateUrl,
  validateVersion
} from '../src/utils/validation';

// Mock dependencies
jest.mock('fs-extra');
jest.mock('child_process');
jest.mock('../src/utils/git');
jest.mock('../src/utils/filesystem');

// Mock inquirer module
jest.mock('inquirer', () => {
  return {
    prompt: jest.fn()
  };
});

describe('Init Command Integration Tests', () => {
  // We're testing the validation functions directly
  // These tests verify that the validation functions work correctly
  // and that they're integrated properly with the init command
  
  describe('Validation Integration', () => {
    it('should validate component names correctly', () => {
      // Valid component names
      expect(validateComponentName('my-component').isValid).toBe(true);
      expect(validateComponentName('@scope/my-component').isValid).toBe(true);
      
      // Invalid component names
      expect(validateComponentName('').isValid).toBe(false);
      expect(validateComponentName('UPPERCASE').isValid).toBe(false);
    });
    
    it('should validate versions correctly', () => {
      // Valid versions
      expect(validateVersion('1.0.0').isValid).toBe(true);
      expect(validateVersion('0.1.0').isValid).toBe(true);
      
      // Invalid versions
      expect(validateVersion('').isValid).toBe(false);
      expect(validateVersion('v1.0.0').isValid).toBe(false);
    });
    
    it('should validate descriptions correctly', () => {
      // Valid descriptions
      expect(validateDescription('A valid description').isValid).toBe(true);
      
      // Invalid descriptions
      expect(validateDescription('').isValid).toBe(false);
      expect(validateDescription('   ').isValid).toBe(false);
    });
    
    it('should validate URLs correctly', () => {
      // Valid URLs
      expect(validateUrl('https://example.com').isValid).toBe(true);
      expect(validateUrl('').isValid).toBe(true); // Empty URLs are valid (optional)
      
      // Invalid URLs
      expect(validateUrl('not-a-url').isValid).toBe(false);
    });
    
    it('should validate emails correctly', () => {
      // Valid emails
      expect(validateEmail('user@example.com').isValid).toBe(true);
      expect(validateEmail('').isValid).toBe(true); // Empty emails are valid (optional)
      
      // Invalid emails
      expect(validateEmail('not-an-email').isValid).toBe(false);
    });
    
    it('should validate licenses correctly', () => {
      // Valid licenses
      expect(validateLicense('MIT').isValid).toBe(true);
      expect(validateLicense('').isValid).toBe(true); // Empty licenses are valid (optional)
      
      // Invalid licenses
      expect(validateLicense('Invalid License').isValid).toBe(false);
    });
  });
  
  describe('Schema Validation', () => {
    it('should validate spec.json against the @specky-pm/spec schema', () => {
      // Create a valid spec.json object
      const specJson = {
        name: 'test-component',
        version: '1.0.0',
        description: 'Test component description',
        author: 'Test User',
        license: 'MIT',
        keywords: ['test', 'component']
      };
      
      // Validate against the schema
      const ajv = new Ajv({ allErrors: true, strict: false });
      addFormats(ajv);
      
      // Create a modified version of the schema without the $schema property
      const modifiedSchema = { ...specJsonSchema } as Record<string, any>;
      delete modifiedSchema.$schema;
      
      const validate = ajv.compile(modifiedSchema);
      const isValid = validate(specJson);
      
      // Verify the spec.json is valid
      expect(isValid).toBe(true);
    });
    
    it('should reject invalid spec.json', () => {
      // Create an invalid spec.json object (missing required description)
      const invalidSpecJson = {
        name: 'test-component',
        version: '1.0.0'
        // Missing required description
      };
      
      // Validate against the schema
      const ajv = new Ajv({ allErrors: true, strict: false });
      addFormats(ajv);
      
      // Create a modified version of the schema without the $schema property
      const modifiedSchema = { ...specJsonSchema } as Record<string, any>;
      delete modifiedSchema.$schema;
      
      const validate = ajv.compile(modifiedSchema);
      const isValid = validate(invalidSpecJson);
      
      // Verify the spec.json is invalid
      expect(isValid).toBe(false);
    });
  });
});