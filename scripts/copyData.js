import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create public/data directory if it doesn't exist
const publicDataDir = path.join(__dirname, '../public/data');
if (!fs.existsSync(publicDataDir)) {
  fs.mkdirSync(publicDataDir, { recursive: true });
}

// Copy CSV file from src to public
const srcFile = path.join(__dirname, '../src/data/testhcpdata.csv');
const destFile = path.join(publicDataDir, 'testhcpdata.csv');

try {
  fs.copyFileSync(srcFile, destFile);
  console.log('Successfully copied GP data file to public directory');
} catch (error) {
  console.error('Error copying GP data file:', error);
  process.exit(1);
} 