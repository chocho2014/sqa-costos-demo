const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const express = require('express');
const { calculate } = require('./calculator.cjs');
const { createStore } = require('./product-store.cjs');
const error = (message, statusCode = 400) => Object.assign(new Error(message), { statusCode });
function validate(input) {
  if (!input || !Array.isArray(input.lineas) || input.lineas.length < 1 || input.lineas.length > 50 ||
      !input.datos || !Array.isArray(input.datos.gastos) || input.datos.gastos.length > 20 ||
      input.lineas.some(r => !r || !Number.isSafeInteger(r.id_producto) || r.id_producto < 1) ||
      input.datos.gastos.some(g => !g || typeof g !== 'object')) throw error('Datos de cálculo inválidos');
}
function createServer(options = {}) {
  const store = createStore(options.databaseFile), app = express();
  app.disable('x-powered-by');
  app.use((_req, res, next) => {
    res.set('X-Content-Type-Options', 'nosniff');
    res.set('Cache-Control', 'no-store');
    res.set('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self'; connect-src 'self'; frame-ancestors 'none'");
    next();
  });
  app.use('/api', (req, _res, next) => {
    if (['POST', 'PUT'].includes(req.method) && !req.is('application/json')) return next(error('Use application/json', 415));
    next();
  });
  app.use(express.json({ limit: '32kb' }));
  app.get('/api/productos', (_req, res) => res.json(store.list()));
  app.get('/api/productos/:id', (req, res) => res.json(store.get(req.params.id)));
  app.post('/api/productos', (req, res) => res.status(201).json(store.create(req.body)));
  app.put('/api/productos/:id', (req, res) => res.json(store.update(req.params.id, req.body)));
  app.delete('/api/productos/:id', (req, res) => { store.remove(req.params.id); res.json({ eliminado: true }); });
  app.post('/api/calcular', (req, res) => { validate(req.body); res.json(calculate(req.body.lineas, req.body.datos)); });
  app.all('/api/calcular', (_req, res) => res.set('Allow', 'POST').status(405).json({ error: 'Use POST' }));
  const web = path.join(__dirname, '../dist/web');
  app.use(express.static(web));
  // Conserva las rutas de la interfaz inicial para compatibilidad y regresión.
  app.use(express.static(path.join(__dirname, '../public'), { index: fs.existsSync(path.join(web, 'index.html')) ? false : 'index.html' }));
  app.use((_req, res) => res.status(404).json({ error: 'Ruta no encontrada' }));
  app.use((failure, _req, res, _next) => {
    const status = failure.statusCode || failure.status || 500;
    res.status(status).json({ error: status < 500 ? failure.message : 'Error interno' });
  });
  const server = http.createServer(app);
  server.on('close', () => store.close());
  return server;
}
module.exports = { createServer, validate };
