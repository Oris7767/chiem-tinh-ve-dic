/**
 * Browser Polyfills for PDF Generation
 * Must be imported before @react-pdf/renderer
 */

interface Buffer {
  from(data: string | ArrayBuffer | Buffer, encoding?: string): Uint8Array;
  alloc(size: number): Uint8Array;
  isBuffer(obj: unknown): boolean;
  prototype: unknown;
}

/**
 * Create a robust Buffer polyfill for browser environments
 */
function createBufferPolyfill(): typeof globalThis.Buffer & { from: (data: string | ArrayBuffer, encoding?: string) => Uint8Array } {
  const fromString = (data: string, encoding?: string): Uint8Array => {
    if (encoding === 'base64') {
      const binary = atob(data.replace(/\s/g, ''));
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      return bytes;
    }
    return new TextEncoder().encode(data);
  };

  const fromArrayBuffer = (data: ArrayBuffer): Uint8Array => {
    return new Uint8Array(data);
  };

  return {
    from: (data: string | ArrayBuffer | Buffer, encoding?: string): Uint8Array => {
      if (typeof data === 'string') {
        return fromString(data, encoding);
      }
      if (data instanceof ArrayBuffer) {
        return fromArrayBuffer(data);
      }
      if (data instanceof Uint8Array) {
        return data;
      }
      return new Uint8Array(0);
    },
    alloc: (size: number): Uint8Array => {
      return new Uint8Array(size);
    },
    isBuffer: (_obj: unknown): boolean => {
      return false;
    },
    // Buffer prototype compatibility
    prototype: {
      write: function(str: string, encoding?: string): number {
        const bytes = this.from(str, encoding);
        for (let i = 0; i < bytes.length && i < this.length; i++) {
          this[i] = bytes[i];
        }
        return bytes.length;
      },
      toString: function(encoding?: string, start?: number, end?: number): string {
        const slice = this.slice(start, end);
        const arr = slice instanceof Uint8Array ? slice : new Uint8Array(slice);
        if (encoding === 'base64') {
          let binary = '';
          arr.forEach(b => binary += String.fromCharCode(b));
          return btoa(binary);
        }
        return new TextDecoder().decode(arr);
      },
      length: 0,
    },
  } as unknown as typeof globalThis.Buffer & { from: (data: string | ArrayBuffer, encoding?: string) => Uint8Array };
}

// Install Buffer polyfill if not present
if (typeof globalThis.Buffer === 'undefined') {
  globalThis.Buffer = createBufferPolyfill();
}

// Also polyfill process if needed by react-pdf
if (typeof globalThis.process === 'undefined') {
  globalThis.process = {
    env: { NODE_ENV: 'production' },
    browser: true,
    versions: { node: '0.0.0' },
  } as unknown as typeof process;
}

/**
 * Initialize PDF polyfills
 * Call this at app startup or before first PDF generation
 */
export function initializePDFPolyfills(): void {
  // Ensure Buffer is available
  if (typeof globalThis.Buffer === 'undefined') {
    globalThis.Buffer = createBufferPolyfill();
  }
  console.log('PDF polyfills initialized');
}
