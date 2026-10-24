// Unified development runner for SkyPulse MERN application
import { spawn, execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isWindows = process.platform === 'win32';

// 1. Pre-flight check: automatically free port 5000 if a previous orphan process is lingering
if (isWindows) {
  try {
    const netstatOut = execSync('netstat -ano | findstr :5000', { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] });
    const match = netstatOut.match(/LISTENING\s+(\d+)/);
    if (match && match[1]) {
      const pid = match[1];
      console.log(`🧹 Freeing lingering process on port 5000 (PID: ${pid})...`);
      execSync(`taskkill /F /PID ${pid}`, { stdio: 'ignore' });
    }
  } catch (e) {
    // Port 5000 is clean
  }
}

console.log('🚀 Starting Isobar Meteorological System (Express API + Vite React)...');

// 2. Start Express Server (port 5000)
const server = spawn('node', ['server.js'], {
  cwd: path.join(__dirname, 'server'),
  stdio: 'inherit'
});

// 3. Start Vite Client (port 5173, proxied to port 5000)
const client = spawn('node', ['./node_modules/vite/bin/vite.js'], {
  cwd: path.join(__dirname, 'client'),
  stdio: 'inherit'
});

let isCleaningUp = false;
const cleanup = () => {
  if (isCleaningUp) return;
  isCleaningUp = true;
  console.log('\n🛑 Stopping SkyPulse development servers...');

  const killProcess = (proc) => {
    if (!proc || !proc.pid) return;
    try {
      if (isWindows) {
        execSync(`taskkill /F /T /PID ${proc.pid}`, { stdio: 'ignore' });
      } else {
        proc.kill('SIGKILL');
      }
    } catch (e) {
      try { proc.kill(); } catch (err) {}
    }
  };

  killProcess(server);
  killProcess(client);
  process.exit(0);
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
process.on('exit', cleanup);
