
/**
 * Simple script to copy ephemeris files to the public directory
 * This can be run as part of the build process
 */

const fs = require('fs');
const path = require('path');

// Source directory for ephemeris files
const sourceDir = path.join(__dirname, '../components/VedicAstrology/ephe');
// Target directory in public folder
const targetDir = path.join(__dirname, '../../public/ephe');

// Create the target directory if it doesn't exist
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
  console.log(`Created directory: ${targetDir}`);
}

// Read all files from the source directory
fs.readdir(sourceDir, (err, files) => {
  if (err) {
    console.error('Error reading source directory:', err);
    return;
  }
  
  // Copy each file to the target directory
  files.forEach(file => {
    const sourcePath = path.join(sourceDir, file);
    const targetPath = path.join(targetDir, file);
    
    fs.copyFile(sourcePath, targetPath, err => {
      if (err) {
        console.error(`Error copying ${file}:`, err);
      } else {
        console.log(`Copied ${file} to ${targetDir}`);
      }
    });
  });
});

console.log('Ephemeris files copy process initiated.');
