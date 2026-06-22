// scripts/dev.js — Orchestrates local development.
// Starts all 4 packages in parallel with color-coded output.
//
// Dependency order:
//   1. mfe-contracts builds first (--watch keeps it live for type changes)
//   2. Angular apps start in parallel after a short delay for the initial build
//
// Port assignments (must match federation.manifest.dev.json):
//   shell    → http://localhost:4200
//   products → http://localhost:4201
//   checkout → http://localhost:4202

const { concurrently } = require('concurrently');
const path = require('path');

const packages = path.resolve(__dirname, '..', 'packages');

const { result } = concurrently(
  [
    {
      command: 'npm run build:watch',
      name: 'contracts',
      cwd: path.join(packages, 'mfe-contracts'),
      prefixColor: 'magenta',
    },
    {
      command: 'npm start',
      name: 'shell:4200',
      cwd: path.join(packages, 'mfe-shell'),
      prefixColor: 'blue',
    },
    {
      command: 'npm start',
      name: 'products:4201',
      cwd: path.join(packages, 'mfe-products'),
      prefixColor: 'green',
    },
    {
      command: 'npm start',
      name: 'checkout:4202',
      cwd: path.join(packages, 'mfe-checkout'),
      prefixColor: 'yellow',
    },
  ],
  {
    prefix: 'name',
    killOthers: ['failure'],
    restartTries: 0,
  }
);

result.then(
  () => console.log('All processes exited cleanly.'),
  (err) => {
    console.error('A process failed:', err.message || err);
    process.exit(1);
  }
);
