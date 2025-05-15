
const fs = require('fs');
const path = require('path');
const https = require('https');

const EPHE_DIR = path.join(__dirname, 'ephe');
const BASE_URL = 'https://www.astro.com/ftp/swisseph/ephe/';

const FILES_TO_DOWNLOAD = [
  'seas_18.se1',
  'semo_18.se1',
  'sepl_18.se1'
];

// Create ephe directory if it doesn't exist
if (!fs.existsSync(EPHE_DIR)) {
  fs.mkdirSync(EPHE_DIR, { recursive: true });
}

// Download each file
FILES_TO_DOWNLOAD.forEach(file => {
  const fileUrl = BASE_URL + file;
  const filePath = path.join(EPHE_DIR, file);
  
  console.log(`Downloading ${fileUrl}...`);
  
  const fileStream = fs.createWriteStream(filePath);
  https.get(fileUrl, response => {
    response.pipe(fileStream);
    
    fileStream.on('finish', () => {
      fileStream.close();
      console.log(`Downloaded ${file}`);
    });
  }).on('error', err => {
    fs.unlink(filePath, () => {}); // Delete the file if there's an error
    console.error(`Error downloading ${file}: ${err.message}`);
  });
});
