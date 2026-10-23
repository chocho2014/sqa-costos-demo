const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');
const out = path.join(root, 'dist');
fs.mkdirSync(out, { recursive: true });
for (const name of ['src', 'public', 'package.json', 'package-lock.json', 'README.md']) {
  fs.cpSync(path.join(root, name), path.join(out, name), { recursive: true });
}
console.log('Entrega preparada en dist sin credenciales ni datos privados.');

