/**
 * Get the default version for a new component
 * @returns The default version string
 */
export function getDefaultVersion(): string {
  return '1.0.0';
}

/**
 * Get the default license for a new component
 * @returns The default license string
 */
export function getDefaultLicense(): string {
  return 'MIT';
}

/**
 * Get default keywords for a new component
 * @param name The component name
 * @returns An array of default keywords
 */
export function getDefaultKeywords(name: string): string[] {
  const keywords = ['specky', 'component'];
  
  // Add the component name as a keyword (without scope)
  const nameWithoutScope = name.includes('/') ? name.split('/')[1] : name;
  keywords.push(nameWithoutScope);
  
  return keywords;
}