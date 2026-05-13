
const fs = require('fs');
const path = require('path');

async function fixDeployment() {
  console.log('Starting deployment fix...');

  const projectRoot = process.cwd();
  const publicUploads = path.join(projectRoot, 'public', 'uploads');
  const rootUploads = path.join(projectRoot, 'uploads');

  // 1. Ensure public/uploads exists
  if (!fs.existsSync(publicUploads)) {
    console.log('Creating public/uploads directory...');
    fs.mkdirSync(publicUploads, { recursive: true });
  }

  // 2. Create symlink for Nginx compatibility
  if (process.platform !== 'win32') {
    try {
      if (fs.existsSync(rootUploads)) {
        console.log('Removing existing uploads path...');
        const stats = fs.lstatSync(rootUploads);
        if (stats.isSymbolicLink()) {
          fs.unlinkSync(rootUploads);
        } else {
          console.log('WARNING: uploads is a directory, not a symlink. Moving contents...');
          // Optional: move contents if needed, but let's be safe
        }
      }
      
      if (!fs.existsSync(rootUploads)) {
        console.log('Creating symlink: uploads -> public/uploads');
        fs.symlinkSync('public/uploads', rootUploads, 'dir');
      }
    } catch (err) {
      console.error('Failed to create symlink:', err.message);
    }
  } else {
    console.log('Skipping symlink on Windows.');
  }

  console.log('Fix completed successfully!');
}

fixDeployment().catch(console.error);
