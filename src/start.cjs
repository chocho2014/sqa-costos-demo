const { createServer } = require('./server.cjs');
const port = Number(process.env.PORT || 3000);
createServer().listen(port, '127.0.0.1', () => console.log('Demo disponible en http://127.0.0.1:' + port));

