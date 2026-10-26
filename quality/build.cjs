const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const root = path.join(__dirname, '..');
const result = spawnSync(process.execPath, [path.join(root, 'node_modules/vite/bin/vite.js'), 'build'], { cwd: root, stdio: 'inherit' });
if (result.status !== 0) process.exit(result.status || 1);
for (const item of ['src', 'public', 'package.json', 'package-lock.json', 'README.md']) fs.cpSync(path.join(root, item), path.join(root, 'dist', item), { recursive: true });
console.log('Paquete full stack listo en dist');
