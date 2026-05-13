
const fs = require('fs');
const path = require('path');

async function fixDeployment() {
  console.log('Starting deployment fix...');

  const projectRoot = process.cwd();
  const publicUploads = path.join(projectRoot, 'public', 'uploads');
  const rootUploads = path.join(projectRoot, 'uploads');

  // 1. Ensure public/uploads exists with correct permissions
  if (!fs.existsSync(publicUploads)) {
    console.log('Creating public/uploads directory...');
    fs.mkdirSync(publicUploads, { recursive: true, mode: 0o755 });
  } else {
    console.log('public/uploads already exists. Ensuring permissions...');
    try {
      fs.chmodSync(publicUploads, 0o755);
    } catch (e) {
      console.warn('Could not set permissions on public/uploads:', e.message);
    }
  }

  // 2. Create symlink for Nginx compatibility
  if (process.platform !== 'win32') {
    try {
      let shouldCreateSymlink = true;
      if (fs.existsSync(rootUploads)) {
        const stats = fs.lstatSync(rootUploads);
        if (stats.isSymbolicLink()) {
          console.log('Removing old symlink...');
          fs.unlinkSync(rootUploads);
        } else if (stats.isDirectory()) {
          console.log('WARNING: uploads is a real directory. Moving content to public/uploads...');
          const files = fs.readdirSync(rootUploads);
          for (const file of files) {
            fs.renameSync(path.join(rootUploads, file), path.join(publicUploads, file));
          }
          fs.rmdirSync(rootUploads);
        } else {
          console.log('uploads exists but is not a directory or symlink. Deleting...');
          fs.unlinkSync(rootUploads);
        }
      }
      
      if (shouldCreateSymlink) {
        console.log('Creating symlink: uploads -> public/uploads');
        fs.symlinkSync('public/uploads', rootUploads, 'dir');
      }
    } catch (err) {
      console.error('Failed to manage symlink:', err.message);
    }
  } else {
    console.log('Skipping symlink on Windows.');
  }

  console.log('Fix completed successfully!');
}

fixDeployment().catch(console.error);
