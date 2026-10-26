const test = require('node:test');
const assert = require('node:assert/strict');
const { mkdtempSync, rmSync } = require('node:fs');
const { tmpdir } = require('node:os');
const path = require('node:path');
const { createStore, product, identifier } = require('../src/product-store.cjs');
const { createServer, validate } = require('../src/server.cjs');
test('U12 valida nombres, importes y claves sin aceptar SQL como identificador', () => {
  for (const value of [null, {}, { nombre: '' }, { nombre: 'a'.repeat(121) }, { nombre: 'ok', precio: '0' }]) assert.throws(() => product(value));
  for (const value of ['0', '-1', '1 OR 1=1', '9007199254740992']) assert.throws(() => identifier(value));
  assert.deepEqual(product({ nombre: ' Pieza ', precio: '1.2' }), { nombre: 'Pieza', precio: '1.20' });
});
test('I06 SQLite conserva crear, editar y eliminar entre reaperturas', t => {
  const dir = mkdtempSync(path.join(tmpdir(), 'sqa-crud-'));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  const file = path.join(dir, 'test.sqlite');
  let db = createStore(file);
  const p = db.create({ nombre: "Pieza '); DROP TABLE productos;--", precio: '12.30' });
  db.close(); db = createStore(file);
  assert.equal(db.list().length, 1); assert.equal(db.get(p.id).precio, '12.30');
  assert.equal(db.update(p.id, { nombre: 'Cambio', precio: '10' }).nombre, 'Cambio');
  db.remove(p.id); assert.deepEqual(db.list(), []);
  assert.throws(() => db.get(p.id), /no encontrado/); db.close();
});
test('I07 API completa CRUD sobre Express y SQLite reales', async t => {
  const server = createServer(); await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  t.after(() => new Promise(resolve => { server.close(resolve); server.closeAllConnections(); }));
  const base = 'http://127.0.0.1:' + server.address().port;
  const send = (url, method, body) => {
    const options = { method, headers: { 'Content-Type': 'application/json' } };
    if (body) options.body = JSON.stringify(body);
    return fetch(base + url, options);
  };
  const created = await send('/api/productos', 'POST', { nombre: 'Ficticio', precio: '20.5' }); assert.equal(created.status, 201);
  const p = await created.json(); assert.equal((await (await fetch(base + '/api/productos')).json()).length, 1);
  assert.equal((await (await fetch(base + '/api/productos/' + p.id)).json()).precio, '20.50');
  assert.equal((await (await send('/api/productos/' + p.id, 'PUT', { nombre: 'Editado', precio: '25' })).json()).nombre, 'Editado');
  assert.equal((await send('/api/productos/' + p.id, 'DELETE')).status, 200);
  assert.equal((await fetch(base + '/api/productos/' + p.id)).status, 404);
  assert.equal((await send('/api/productos', 'POST', { nombre: '' })).status, 400);
  assert.equal((await send('/api/productos', 'POST', { nombre: 'x'.repeat(40000) })).status, 413);
});
test('U13 rechaza estructuras de cálculo inválidas antes de procesarlas', () => {
  const row = { id_producto: 1 };
  for (const value of [null, {}, { lineas: [], datos: {} }, { lineas: [null], datos: { gastos: [] } }, { lineas: [row], datos: { gastos: [null] } }, { lineas: [row], datos: { gastos: Array(21).fill({}) } }, { lineas: Array(51).fill(row), datos: { gastos: [] } }]) assert.throws(() => validate(value));
});
