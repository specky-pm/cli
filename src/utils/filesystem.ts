import fs from 'fs-extra';
import path from 'path';

/**
 * Check if a file exists at the specified path
 * @param filePath The path to check
 * @returns A promise that resolves to true if the file exists, false otherwise
 */
export async function checkFileExists(filePath: string): Promise<boolean> {
  try {
    const stats = await fs.stat(filePath);
    return stats.isFile();
  } catch (error) {
    return false;
  }
}

/**
 * Write JSON data to a file with pretty formatting
 * @param filePath The path to write to
 * @param data The data to write
 * @returns A promise that resolves when the file is written
 */
export async function writeJsonFile(filePath: string, data: any): Promise<void> {
  const jsonString = JSON.stringify(data, null, 2);
  await fs.ensureDir(path.dirname(filePath));
  await fs.writeFile(filePath, jsonString, 'utf8');
}

/**
 * Read and parse a JSON file
 * @param filePath The path to read from
 * @returns A promise that resolves to the parsed JSON data
 */
export async function readJsonFile<T>(filePath: string): Promise<T> {
  const content = await fs.readFile(filePath, 'utf8');
  return JSON.parse(content) as T;
}

/**
 * Create a directory if it doesn't exist
 * @param dirPath The directory path to create
 * @returns A promise that resolves when the directory is created
 */
export async function ensureDirectory(dirPath: string): Promise<void> {
  await fs.ensureDir(dirPath);
}