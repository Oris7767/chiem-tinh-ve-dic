import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the logo file
const logoPath = path.join(__dirname, 'public/images/logo.png');
const logoBuffer = fs.readFileSync(logoPath);

// Convert to base64
const base64 = logoBuffer.toString('base64');

// Create data URL
const dataUrl = `data:image/png;base64,${base64}`;

// Write to a TypeScript file
const outputPath = path.join(__dirname, 'src/utils/logoDataUrl.ts');
const output = `// Auto-generated - do not edit manually
// This file contains the logo as a base64 data URL to ensure it renders in exported PDFs/PNGs
export const LOGO_DATA_URL = '${dataUrl}';

// For inline SVG embedding
export const LOGO_INLINE_SVG = \`
  <image href="${dataUrl}" x="0" y="0" width="500" height="500" />
\`;
`;

fs.writeFileSync(outputPath, output);
console.log('Logo data URL generated successfully at:', outputPath);
console.log('Data URL length:', dataUrl.length, 'characters');
