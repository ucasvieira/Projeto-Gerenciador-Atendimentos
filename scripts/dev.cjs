const { spawn } = require('child_process');

function startProcess(label, command, args) {
  const child = spawn(command, args, {
    stdio: 'inherit',
  });

  child.on('exit', (code, signal) => {
    if (signal) {
      process.exitCode = 1;
      return;
    }

    if (code && code !== 0) {
      process.exitCode = code;
    }
  });

  child.on('error', (error) => {
    console.error(`[${label}]`, error);
    process.exitCode = 1;
  });

  return child;
}

const api = startProcess('api', 'node', ['server.cjs']);
const web = startProcess('web', 'node', ['node_modules/vite/bin/vite.js', '--host']);

function shutdown() {
  api.kill();
  web.kill();
  process.exit();
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
