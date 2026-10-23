const http = require('node:http');
const fs = require('node:fs/promises');
const path = require('node:path');
const { calculate } = require('./calculator.cjs');
const error = (message, statusCode = 400) => Object.assign(new Error(message), { statusCode });

async function body(req) {
  if (!String(req.headers['content-type'] || '').startsWith('application/json')) throw error('Use application/json', 415);
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > 32768) throw error('Solicitud demasiado grande', 413);
    chunks.push(chunk);
  }
  try { return JSON.parse(Buffer.concat(chunks).toString('utf8')); }
  catch { throw error('JSON inválido'); }
}

function validate(input) {
  if (!input || !Array.isArray(input.lineas) || input.lineas.length < 1 || input.lineas.length > 50 ||
      !input.datos || !Array.isArray(input.datos.gastos) || input.datos.gastos.length > 20 ||
      input.lineas.some(r => !r || !Number.isSafeInteger(r.id_producto) || r.id_producto < 1) ||
      input.datos.gastos.some(g => !g || typeof g !== 'object')) throw error('Datos de cálculo inválidos');
}

function createServer() {
  return http.createServer(async (req, res) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self'; connect-src 'self'; frame-ancestors 'none'");
    function json(status, value) {
      res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify(value));
    }
    try {
      const assets = { '/': ['index.html', 'text/html'], '/app.js': ['app.js', 'text/javascript'], '/style.css': ['style.css', 'text/css'] };
      if (req.method === 'GET' && Object.hasOwn(assets, req.url)) {
        const [name, type] = assets[req.url];
        const content = await fs.readFile(path.join(__dirname, '../public', name));
        res.writeHead(200, { 'Content-Type': type + '; charset=utf-8' }); res.end(content); return;
      }
      if (req.url !== '/api/calcular') { json(404, { error: 'Ruta no encontrada' }); return; }
      if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); json(405, { error: 'Use POST' }); return; }
      const input = await body(req);
      validate(input);
      json(200, calculate(input.lineas, input.datos));
    } catch (failure) { json(failure.statusCode || 500, { error: failure.statusCode ? failure.message : 'Error interno' }); }
  });
}
module.exports = { createServer };

