
# WebAssembly Integration for Swiss Ephemeris

This implementation uses WebAssembly to run Swiss Ephemeris calculations directly in the browser, providing several advantages:

1. **No Server Dependency**: All calculations are performed client-side
2. **Better Performance**: WebAssembly runs at near-native speed
3. **Privacy**: User birth data never leaves their device
4. **Reduced Server Load**: No need for dedicated calculation servers

## Implementation Details

### Architecture

1. **WebAssembly Module**: We use the `swisseph` NPM package which provides WebAssembly bindings for Swiss Ephemeris
2. **Ephemeris Data Files**: Required data files are served from the `/public/ephe` directory
3. **Fallback Mechanism**: If WebAssembly fails, we fall back to either:
   - Server API (if configured)
   - Simple client-side calculation (less accurate)

### Files & Components

- `swissephWasm.ts`: Core service that interfaces with the WebAssembly module
- `vedicAstroService.ts`: High-level service that orchestrates calculations
- `config.ts`: Configuration for paths and fallback options

## Setup & Deployment

1. **Install Dependencies**:
   ```bash
   npm install swisseph
   ```

2. **Copy Ephemeris Files**:
   Ephemeris files need to be available in the `/public/ephe` directory.
   Run the script to copy them:
   ```bash
   node src/scripts/copyEphemerisFiles.js
   ```

3. **Testing**:
   The implementation will automatically try to use WebAssembly first, then fall back to other methods if needed.
   Check the console logs for any issues with loading the WebAssembly module or ephemeris files.

## Troubleshooting

- **Missing Ephemeris Files**: Make sure the ephemeris files are correctly copied to the `/public/ephe` directory
- **WebAssembly Support**: Ensure the user's browser supports WebAssembly (all modern browsers do)
- **Console Errors**: Check browser console for specific error messages related to the WebAssembly module

## References

- [Swiss Ephemeris Documentation](https://www.astro.com/swisseph/swephprg.htm)
- [Swiss Ephemeris NPM Package](https://www.npmjs.com/package/swisseph)
- [WebAssembly MDN Documentation](https://developer.mozilla.org/en-US/docs/WebAssembly)
