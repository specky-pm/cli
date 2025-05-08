/**
 * Author information
 */
export interface Author {
  name: string;
  email?: string;
  url?: string;
}

/**
 * Repository information
 */
export interface Repository {
  type: string;
  url: string;
}

/**
 * Bug reporting information
 */
export interface Bugs {
  url: string;
  email?: string;
}

/**
 * Publishing configuration
 */
export interface PublishConfig {
  registry?: string;
  access?: "public" | "restricted";
  tag?: string;
}

/**
 * Core spec.json structure
 */
export interface SpecJson {
  name: string;
  version: string;
  description: string;
  author?: string | Author;
  contributors?: Array<string | Author>;
  license?: string;
  keywords?: string[];
  dependencies?: Record<string, string>;
  repository?: string | Repository;
  homepage?: string;
  bugs?: string | Bugs;
  files?: string[];
  publishConfig?: PublishConfig;
}

/**
 * Command line options
 */
export interface CommandOptions {
  yes?: boolean;
}
