/**
 * Browser Polyfills for PDF Generation
 * Polyfills for @react-pdf/renderer in browser environments
 */

// Import Buffer from buffer polyfill package
import { Buffer } from 'buffer';

/**
 * Install Buffer polyfill globally
 * This must be called before any @react-pdf/renderer code runs
 */
export function installPolyfills(): void {
  // Only install if not already present
  if (typeof globalThis.Buffer === 'undefined') {
    globalThis.Buffer = Buffer;
  }

  // Polyfill process if needed
  if (typeof globalThis.process === 'undefined') {
    globalThis.process = {
      env: { NODE_ENV: 'production' },
      browser: true,
      versions: { node: '0.0.0' },
    } as unknown as typeof process;
  }

  console.log('PDF polyfills installed');
}

/**
 * Legacy export for backwards compatibility
 */
export const initializePDFPolyfills = installPolyfills;

// Auto-install polyfills when this module is imported
installPolyfills();
