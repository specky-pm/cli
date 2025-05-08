import path from 'path';
import { jest } from '@jest/globals';

// Create mock functions
const mockPathExists = jest.fn();
const mockStat = jest.fn();
const mockFastGlob = jest.fn();

// Mock modules
jest.mock('fs-extra', () => ({
  pathExists: mockPathExists,
  stat: mockStat
}));

jest.mock('fast-glob', () => mockFastGlob);

// Import the module after mocking
import { collectFiles, generateOutputFilename } from '../src/commands/pack';

describe('Pack Command', () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.resetAllMocks();
    jest.spyOn(process, 'cwd').mockReturnValue('/test/path');
  });

  describe('collectFiles', () => {
    it('should always include spec.json', async () => {
      // Mock pathExists to return true for all files
      // @ts-ignore
      mockPathExists.mockResolvedValue(true);
      // Mock stat to return a file stat
      // @ts-ignore
      mockStat.mockResolvedValue({ isDirectory: () => false });
      // Mock fast-glob to return empty arrays (no glob matches)
      // @ts-ignore
      mockFastGlob.mockResolvedValue([]);

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
      // Mock pathExists to return true for all files
      // @ts-ignore
      mockPathExists.mockResolvedValue(true);
      // Mock stat to return a file stat
      // @ts-ignore
      mockStat.mockResolvedValue({ isDirectory: () => false });

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
      // Mock pathExists to return true for all files
      // @ts-ignore
      mockPathExists.mockResolvedValue(true);
      // Mock stat to return a file stat
      // @ts-ignore
      mockStat.mockResolvedValue({ isDirectory: () => false });
      // Mock fast-glob to return glob matches
      // @ts-ignore
      mockFastGlob.mockImplementation((pattern) => {
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
      // Mock pathExists to return true for all files
      // @ts-ignore
      mockPathExists.mockResolvedValue(true);
      // Mock stat to return a directory stat for 'docs'
      // @ts-ignore
      mockStat.mockImplementation((filePath) => {
        if (filePath === '/test/path/docs') {
          return Promise.resolve({ isDirectory: () => true });
        }
        return Promise.resolve({ isDirectory: () => false });
      });
      // Mock fast-glob to return files in the directory
      // @ts-ignore
      mockFastGlob.mockImplementation((pattern, options) => {
        // @ts-ignore
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
      // Mock pathExists to return false for 'missing.txt'
      // @ts-ignore
      mockPathExists.mockImplementation((filePath) => {
        if (filePath === '/test/path/missing.txt') {
          return Promise.resolve(false);
        }
        return Promise.resolve(true);
      });
      // Mock stat to return a file stat
      // @ts-ignore
      mockStat.mockResolvedValue({ isDirectory: () => false });

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
      // Mock pathExists to return true for all files
      // @ts-ignore
      mockPathExists.mockResolvedValue(true);
      // Mock stat to return a file stat
      // @ts-ignore
      mockStat.mockResolvedValue({ isDirectory: () => false });
      // Mock fast-glob to return empty arrays (no glob matches)
      // @ts-ignore
      mockFastGlob.mockResolvedValue([]);

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
});