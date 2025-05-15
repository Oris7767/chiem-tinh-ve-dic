
/**
 * Browser adapter for SwissEph
 * This file provides browser-compatible adapters for Node.js specific features
 */

// Create a browser-friendly version of Node.js path functions
export const pathUtils = {
  join: (...parts: string[]): string => {
    // Simple path joining for browser context
    return parts
      .map(part => part.replace(/^\/+/, '').replace(/\/+$/, ''))
      .filter(Boolean)
      .join('/');
  },
  
  resolve: (basePath: string, relativePath: string): string => {
    // Simple path resolving for browser context
    if (relativePath.startsWith('/')) {
      return relativePath;
    }
    return `${basePath.replace(/\/$/, '')}/${relativePath}`;
  }
};

// Create a browser-friendly version of Node.js fs functions
export const fsUtils = {
  existsSync: (path: string): boolean => {
    // In browser context, we can't easily check if a file exists synchronously
    // Return true and let fetch handle the error
    return true;
  },
  
  readFileSync: async (path: string): Promise<ArrayBuffer> => {
    // Use fetch to get the file content
    try {
      const response = await fetch(path);
      if (!response.ok) {
        throw new Error(`Failed to fetch file: ${path}`);
      }
      return response.arrayBuffer();
    } catch (error) {
      console.error(`Error fetching file: ${path}`, error);
      throw error;
    }
  }
};

// Define __dirname for browser context
export const __dirname = '/';
export const __filename = 'browser.js';

// Create a global process object with env for browser context
export const process = {
  env: {
    NODE_ENV: 'production'
  },
  cwd: () => '/'
};
