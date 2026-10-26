const fs = require('node:fs');
const path = require('node:path');
const { createServer } = require('./server.cjs');
const dir = path.join(__dirname, '../data');
fs.mkdirSync(dir, { recursive: true });
const server = createServer({ databaseFile: path.join(dir, 'catalogo.sqlite') });
server.listen(Number(process.env.PORT || 3000), '127.0.0.1', () => console.log('Demo SQA en http://127.0.0.1:' + server.address().port));
