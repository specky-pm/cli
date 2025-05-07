import { execSync } from 'child_process';
import { Author } from '../types';

/**
 * Get the default author information from git config
 * @returns A promise that resolves to an Author object or undefined if git config is not available
 */
export function getDefaultAuthor(): Author | undefined {
  try {
    const name = execSync('git config --get user.name').toString().trim();
    const email = execSync('git config --get user.email').toString().trim();
    
    if (name || email) {
      return {
        name: name || 'Unknown',
        ...(email && { email })
      };
    }
    
    return undefined;
  } catch (error) {
    // Git command failed or git is not installed
    return undefined;
  }
}

/**
 * Get the default repository information from git remote
 * @returns A repository URL string or undefined if not available
 */
export function getDefaultRepository(): string | undefined {
  try {
    const remoteUrl = execSync('git config --get remote.origin.url').toString().trim();
    
    if (remoteUrl) {
      // Convert SSH URL to HTTPS URL if needed
      if (remoteUrl.startsWith('git@')) {
        const sshMatch = remoteUrl.match(/git@([^:]+):([^/]+)\/(.+)\.git/);
        if (sshMatch) {
          const [, host, owner, repo] = sshMatch;
          return `https://${host}/${owner}/${repo}`;
        }
      }
      
      // Remove .git suffix if present
      return remoteUrl.replace(/\.git$/, '');
    }
    
    return undefined;
  } catch (error) {
    // Git command failed or git is not installed
    return undefined;
  }
}