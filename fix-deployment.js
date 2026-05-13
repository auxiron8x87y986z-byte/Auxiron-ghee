
const fs = require('fs');
const path = require('path');

async function fixDeployment() {
  console.log('Starting deployment fix...');

  const projectRoot = process.cwd();
  const publicImagesUploads = path.join(projectRoot, 'public', 'images', 'uploads');
  const publicUploads = path.join(projectRoot, 'public', 'uploads');
  const rootUploads = path.join(projectRoot, 'uploads');

  // 1. Ensure public/images/uploads exists with correct permissions
  if (!fs.existsSync(publicImagesUploads)) {
    console.log('Creating public/images/uploads directory...');
    fs.mkdirSync(publicImagesUploads, { recursive: true, mode: 0o755 });
  } else {
    console.log('public/images/uploads already exists. Ensuring permissions...');
    try {
      fs.chmodSync(publicImagesUploads, 0o755);
    } catch (e) {
      console.warn('Could not set permissions on public/images/uploads:', e.message);
    }
  }

  // 2. Ensure public/uploads exists (legacy compatibility)
  if (!fs.existsSync(publicUploads)) {
    fs.mkdirSync(publicUploads, { recursive: true, mode: 0o755 });
  }

  // 3. Create symlink for Nginx compatibility
  if (process.platform !== 'win32') {
    try {
      if (fs.existsSync(rootUploads)) {
        const stats = fs.lstatSync(rootUploads);
        if (stats.isSymbolicLink()) {
          console.log('Removing old symlink...');
          fs.unlinkSync(rootUploads);
        } else if (stats.isDirectory()) {
          console.log('Moving old uploads to public/images/uploads...');
          const files = fs.readdirSync(rootUploads);
          for (const file of files) {
             try { fs.renameSync(path.join(rootUploads, file), path.join(publicImagesUploads, file)); } catch(e) {}
          }
          fs.rmdirSync(rootUploads);
        }
      }
      
      console.log('Creating symlink: uploads -> public/images/uploads');
      fs.symlinkSync('public/images/uploads', rootUploads, 'dir');
    } catch (err) {
      console.error('Failed to manage symlink:', err.message);
    }
  }

  console.log('Fix completed successfully!');
}

fixDeployment().catch(console.error);
