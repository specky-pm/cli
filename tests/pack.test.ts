import { jest } from '@jest/globals';
import { SpecJson } from '../src/types';
// Import mocked modules
import fs from 'fs-extra';
import fg from 'fast-glob';
import archiver from 'archiver';
import * as filesystem from '../src/utils/filesystem';

// Import the module after mocking
import {
  checkSpecJsonExists,
  collectFiles,
  createZipArchive,
  generateOutputFilename,
  validateSpecJson
} from '../src/commands/pack';

// Mock modules
jest.mock('fs-extra');
jest.mock('fast-glob');
jest.mock('archiver');
jest.mock('@specky-pm/spec', () => ({
  specJsonSchema: {}
}));
jest.mock('../src/utils/filesystem');

describe('Pack Command', () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.resetAllMocks();
    jest.spyOn(process, 'cwd').mockReturnValue('/test/path');
    
    // Setup fs-extra mocks
    (fs.pathExists as any).mockResolvedValue(true);
    (fs.stat as any).mockResolvedValue({ isDirectory: () => false });
    (fs.createWriteStream as any).mockReturnValue({
      on: jest.fn().mockImplementation(function(this: any, event: any, handler: any) {
        if (event === 'close') setTimeout(handler, 0);
        return this;
      })
    });
    (fs.existsSync as any).mockReturnValue(true);
    (fs.statSync as any).mockReturnValue({ size: 1024 });
    
    // Setup fast-glob mock
    (fg as any).mockResolvedValue([]);
    
    // Setup archiver mock
    (archiver as any).mockReturnValue({
      pipe: jest.fn().mockReturnThis(),
      file: jest.fn().mockReturnThis(),
      finalize: jest.fn().mockReturnThis(),
      on: jest.fn().mockImplementation(function(this: any, event: any, handler: any) {
        if (event === 'entry') setTimeout(handler, 0);
        return this;
      })
    });
    
    // Setup filesystem utils mocks
    (filesystem.checkFileExists as any).mockResolvedValue(true);
    (filesystem.readJsonFile as any).mockResolvedValue({
      name: 'test-component',
      version: '1.0.0',
      description: 'Test component',
      files: ['README.md', 'src/**/*.ts']
    });
  });

  describe('collectFiles', () => {
    it('should always include spec.json', async () => {
      const specJson = {
        name: 'test-component',
        version: '1.0.0',
        description: 'Test component for unit tests',
        files: ['file1.txt']
      };

      const files = await collectFiles(specJson);
      
      expect(files).toContain('spec.json');
    });

    it('should resolve regular file paths', async () => {
      const specJson = {
        name: 'test-component',
        version: '1.0.0',
        description: 'Test component for unit tests',
        files: ['file1.txt', 'file2.md', 'file3.json']
      };

      const files = await collectFiles(specJson);
      
      expect(files).toContain('spec.json');
      expect(files).toContain('file1.txt');
      expect(files).toContain('file2.md');
      expect(files).toContain('file3.json');
      expect(files.length).toBe(4); // spec.json + 3 files
    });

    it('should resolve glob patterns', async () => {
      // Override fast-glob mock for this test
      (fg as any).mockImplementation((pattern: string) => {
        if (pattern === '**/*.md') {
          return Promise.resolve(['README.md', 'docs/guide.md']);
        }
        return Promise.resolve([]);
      });

      const specJson = {
        name: 'test-component',
        version: '1.0.0',
        description: 'Test component for unit tests',
        files: ['**/*.md']
      };

      const files = await collectFiles(specJson);
      
      expect(files).toContain('spec.json');
      expect(files).toContain('README.md');
      expect(files).toContain('docs/guide.md');
      expect(files.length).toBe(3); // spec.json + 2 markdown files
    });

    it('should handle directories', async () => {
      // Override fs.stat mock for this test
      (fs.stat as any).mockImplementation((filePath: string) => {
        if (filePath === '/test/path/docs') {
          return Promise.resolve({ isDirectory: () => true });
        }
        return Promise.resolve({ isDirectory: () => false });
      });
      
      // Override fast-glob mock for this test
      (fg as any).mockImplementation((pattern: string, options: any) => {
        if (pattern === '**/*' && options.cwd === '/test/path/docs') {
          return Promise.resolve(['guide.md', 'api.md']);
        }
        return Promise.resolve([]);
      });

      const specJson = {
        name: 'test-component',
        version: '1.0.0',
        description: 'Test component for unit tests',
        files: ['docs']
      };

      const files = await collectFiles(specJson);
      
      expect(files).toContain('spec.json');
      expect(files).toContain('docs/guide.md');
      expect(files).toContain('docs/api.md');
      expect(files.length).toBe(3); // spec.json + 2 files in docs
    });

    it('should throw an error for non-existent files', async () => {
      // Override fs.existsSync mock for this test
      (fs.existsSync as any).mockImplementation((filePath: string) => {
        if (filePath === '/test/path/missing.txt') {
          return false;
        }
        return true;
      });

      const specJson = {
        name: 'test-component',
        version: '1.0.0',
        description: 'Test component for unit tests',
        files: ['missing.txt']
      };

      await expect(collectFiles(specJson)).rejects.toThrow(
        "File 'missing.txt' specified in spec.json does not exist"
      );
    });

    it('should throw an error for glob patterns with no matches', async () => {
      // Override fast-glob mock for this test
      (fg as any).mockResolvedValue([]);

      const specJson = {
        name: 'test-component',
        version: '1.0.0',
        description: 'Test component for unit tests',
        files: ['**/*.nonexistent']
      };

      await expect(collectFiles(specJson)).rejects.toThrow(
        "Glob pattern '**/*.nonexistent' did not match any files"
      );
    });
  });

  describe('generateOutputFilename', () => {
    it('should generate a filename in the format {component-name}-{version}.zip', () => {
      const specJson = {
        name: 'test-component',
        version: '1.0.0',
        description: 'Test component for unit tests'
      };

      const filename = generateOutputFilename(specJson);
      expect(filename).toBe('test-component-1.0.0.zip');
    });

    it('should sanitize component name and version for use in a filename', () => {
      const specJson = {
        name: 'test/component@with:invalid*chars',
        version: '1.0.0+build.123',
        description: 'Test component for unit tests'
      };

      const filename = generateOutputFilename(specJson);
      expect(filename).toBe('test-component-with-invalid-chars-1.0.0-build.123.zip');
    });
  });

  describe('checkSpecJsonExists', () => {
    it('should return true when spec.json exists', async () => {
      (filesystem.checkFileExists as any).mockResolvedValue(true);
      
      const result = await checkSpecJsonExists();
      
      expect(result).toBe(true);
      expect(filesystem.checkFileExists).toHaveBeenCalledWith('spec.json');
    });

    it('should return false when spec.json does not exist', async () => {
      (filesystem.checkFileExists as any).mockResolvedValue(false);
      
      const result = await checkSpecJsonExists();
      
      expect(result).toBe(false);
      expect(filesystem.checkFileExists).toHaveBeenCalledWith('spec.json');
    });
  });

  describe('validateSpecJson', () => {
    beforeEach(() => {
      // Reset mocks
      jest.clearAllMocks();
    });

    it('should throw an error when spec.json does not exist', async () => {
      (filesystem.checkFileExists as any).mockResolvedValue(false);
      
      await expect(validateSpecJson()).rejects.toThrow('spec.json not found');
      expect(filesystem.checkFileExists).toHaveBeenCalledWith('spec.json');
    });

    it('should throw an error when spec.json is missing required fields', async () => {
      (filesystem.checkFileExists as any).mockResolvedValue(true);
      (filesystem.readJsonFile as any).mockResolvedValue({
        name: 'test-component',
        // Missing version and description
      });
      
      await expect(validateSpecJson()).rejects.toThrow();
    });

    it('should throw an error when files field is missing', async () => {
      (filesystem.checkFileExists as any).mockResolvedValue(true);
      (filesystem.readJsonFile as any).mockResolvedValue({
        name: 'test-component',
        version: '1.0.0',
        description: 'Test component'
        // Missing files field
      });
      
      await expect(validateSpecJson()).rejects.toThrow("Missing 'files' field");
    });

    it('should throw an error when files field is not an array', async () => {
      (filesystem.checkFileExists as any).mockResolvedValue(true);
      (filesystem.readJsonFile as any).mockResolvedValue({
        name: 'test-component',
        version: '1.0.0',
        description: 'Test component',
        files: 'not-an-array'
      });
      
      await expect(validateSpecJson()).rejects.toThrow("'files' field must be an array");
    });

    it('should throw an error when files field is an empty array', async () => {
      (filesystem.checkFileExists as any).mockResolvedValue(true);
      (filesystem.readJsonFile as any).mockResolvedValue({
        name: 'test-component',
        version: '1.0.0',
        description: 'Test component',
        files: []
      });
      
      await expect(validateSpecJson()).rejects.toThrow("'files' field cannot be empty");
    });

    it('should throw an error when files field contains non-string entries', async () => {
      (filesystem.checkFileExists as any).mockResolvedValue(true);
      (filesystem.readJsonFile as any).mockResolvedValue({
        name: 'test-component',
        version: '1.0.0',
        description: 'Test component',
        files: ['valid.txt', 123, {}]
      });
      
      await expect(validateSpecJson()).rejects.toThrow("All entries in 'files' must be strings");
    });

    it('should return the validated spec.json when valid', async () => {
      const validSpecJson: SpecJson = {
        name: 'test-component',
        version: '1.0.0',
        description: 'Test component',
        files: ['README.md', 'src/**/*.ts']
      };
      
      (filesystem.checkFileExists as any).mockResolvedValue(true);
      (filesystem.readJsonFile as any).mockResolvedValue(validSpecJson);
      
      const result = await validateSpecJson();
      
      expect(result).toEqual(validSpecJson);
    });
  });

  describe('createZipArchive', () => {
    beforeEach(() => {
      jest.spyOn(process, 'cwd').mockReturnValue('/test/path');
      process.stdout.write = jest.fn() as any;
    });

    it('should create a zip archive with the specified files', async () => {
      const files = ['spec.json', 'README.md', 'src/index.ts'];
      const specJson: SpecJson = {
        name: 'test-component',
        version: '1.0.0',
        description: 'Test component',
        files: ['README.md', 'src/**/*.ts']
      };
      
      const result = await createZipArchive(files, specJson);
      
      expect(result).toBe('/test/path/test-component-1.0.0.zip');
    });

    it('should handle errors during zip creation', async () => {
      // Create a custom archiver mock that simulates an error
      const errorMock = {
        pipe: jest.fn().mockReturnThis(),
        file: jest.fn().mockReturnThis(),
        finalize: jest.fn(),
        on: jest.fn().mockImplementation(function(this: any, event: any, handler: any) {
          if (event === 'error') {
            // Immediately call the error handler
            handler(new Error('Archiver error'));
          }
          return this;
        })
      };
      
      (archiver as any).mockReturnValue(errorMock);
      
      const files = ['spec.json', 'README.md'];
      const specJson: SpecJson = {
        name: 'test-component',
        version: '1.0.0',
        description: 'Test component',
        files: ['README.md']
      };
      
      await expect(createZipArchive(files, specJson)).rejects.toThrow('Error creating zip archive');
    });

    it('should handle warnings during zip creation', async () => {
      // Create a custom archiver mock that simulates a warning
      (archiver as any).mockReturnValue({
        pipe: jest.fn().mockReturnThis(),
        file: jest.fn().mockReturnThis(),
        finalize: jest.fn().mockReturnThis(),
        on: jest.fn().mockImplementation(function(this: any, event: any, handler: any) {
          if (event === 'warning') {
            setTimeout(() => handler({ code: 'ENOENT', message: 'File not found' }), 0);
          } else if (event === 'close') {
            setTimeout(() => handler(), 10);
          }
          return this;
        })
      });
      
      const files = ['spec.json', 'README.md'];
      const specJson: SpecJson = {
        name: 'test-component',
        version: '1.0.0',
        description: 'Test component',
        files: ['README.md']
      };
      
      const result = await createZipArchive(files, specJson);
      expect(result).toBe('/test/path/test-component-1.0.0.zip');
    });
  });
});