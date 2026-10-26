const fs = require('node:fs');
const path = require('node:path');
const { createServer } = require('./server.cjs');
const dir = path.join(__dirname, '../data');
fs.mkdirSync(dir, { recursive: true });
const server = createServer({ databaseFile: path.join(dir, 'catalogo.sqlite') });
const host = process.env.HOST || '127.0.0.1';
server.listen(Number(process.env.PORT || 3000), host, () => console.log('Demo SQA en http://' + host + ':' + server.address().port));
function stop() { server.close(() => process.exit(0)); }
process.once('SIGTERM', stop);
process.once('SIGINT', stop);
