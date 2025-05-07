import semver from 'semver';

/**
 * Validates a component name according to the Specky naming rules
 * @param name The component name to validate
 * @returns An object with isValid and message properties
 */
export function validateComponentName(name: string): { isValid: boolean; message?: string } {
  if (!name) {
    return { isValid: false, message: 'Component name is required' };
  }

  // Pattern: ^(@[a-z0-9-_]+\\/)?[a-z0-9-_]+$
  const namePattern = /^(@[a-z0-9-_]+\/)?[a-z0-9-_]+$/;
  if (!namePattern.test(name)) {
    return {
      isValid: false,
      message: 'Name must be lowercase and can only contain alphanumeric characters, hyphens, and underscores'
    };
  }

  return { isValid: true };
}

/**
 * Validates a version string according to semantic versioning rules
 * @param version The version string to validate
 * @returns An object with isValid and message properties
 */
export function validateVersion(version: string): { isValid: boolean; message?: string } {
  if (!version) {
    return { isValid: false, message: 'Version is required' };
  }

  // Reject versions that start with 'v'
  if (version.startsWith('v')) {
    return {
      isValid: false,
      message: 'Version should not start with "v"'
    };
  }

  if (!semver.valid(version)) {
    return {
      isValid: false,
      message: 'Version must follow semantic versioning format (X.Y.Z)'
    };
  }

  return { isValid: true };
}

/**
 * Validates a description string
 * @param description The description to validate
 * @returns An object with isValid and message properties
 */
export function validateDescription(description: string): { isValid: boolean; message?: string } {
  if (!description || description.trim() === '') {
    return { isValid: false, message: 'Description is required and cannot be empty' };
  }

  return { isValid: true };
}

/**
 * Validates a URL string
 * @param url The URL to validate
 * @returns An object with isValid and message properties
 */
export function validateUrl(url: string): { isValid: boolean; message?: string } {
  if (!url) {
    return { isValid: true }; // URLs are optional
  }

  try {
    new URL(url);
    return { isValid: true };
  } catch (error) {
    return { isValid: false, message: 'URL must be a valid URL' };
  }
}

/**
 * Validates an email string
 * @param email The email to validate
 * @returns An object with isValid and message properties
 */
export function validateEmail(email: string): { isValid: boolean; message?: string } {
  if (!email) {
    return { isValid: true }; // Email is optional
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return { isValid: false, message: 'Email must be a valid email address' };
  }

  return { isValid: true };
}