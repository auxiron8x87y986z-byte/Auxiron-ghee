const { execSync } = require('child_process');
try {
  const output = execSync('wmic process where "name=\'node.exe\'" get processid,commandline').toString();
  const lines = output.split('\n');
  for (const line of lines) {
    if (line.includes('next') && !line.includes('wmic')) {
      const parts = line.trim().split(/\s+/);
      const pid = parts[parts.length - 1];
      if (!isNaN(parseInt(pid))) {
        console.log('Killing PID:', pid);
        try {
          execSync(`taskkill /F /PID ${pid}`);
        } catch (err) {
          console.log('Failed to kill PID:', pid);
        }
      }
    }
  }
} catch (e) {
  console.error(e);
}
