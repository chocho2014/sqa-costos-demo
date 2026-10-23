const test = require('node:test');
const assert = require('node:assert/strict');
const { createServer } = require('../src/server.cjs');
const input = () => ({ lineas: [{ id_producto: 1, codigo_interno: 'DEMO-1', nombre: 'Ficticio', cantidad_recibida: 1, precio_unitario: '100', moneda: 'GTQ' }], datos: { tipo_cambio: '1', gastos: [] } });

async function fixture(t) {
  const server = createServer();
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  t.after(() => new Promise(resolve => { server.close(resolve); server.closeAllConnections(); }));
  return 'http://127.0.0.1:' + server.address().port;
}

test('HTTP calcula con la aplicación real sin base de datos', async t => {
  const url = await fixture(t);
  const result = await fetch(url + '/api/calcular', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(input()) });
  assert.equal(result.status, 200);
  assert.equal((await result.json()).total_gtq, '100.00');
});

test('HTTP publica la interfaz y sus archivos con tipo y política de contenido', async t => {
  const url = await fixture(t);
  for (const route of ['/', '/app.js', '/style.css']) {
    const result = await fetch(url + route);
    assert.equal(result.status, 200);
    assert.match(result.headers.get('content-security-policy'), /frame-ancestors 'none'/);
    assert.ok((await result.text()).length > 100);
  }
});

test('HTTP rechaza JSON inválido y datos incompletos', async t => {
  const url = await fixture(t);
  for (const value of ['{invalido', '{}']) {
    const result = await fetch(url + '/api/calcular', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: value });
    assert.equal(result.status, 400);
    assert.ok((await result.json()).error);
  }
});

test('HTTP valida método, tipo de contenido y rutas', async t => {
  const url = await fixture(t);
  assert.equal((await fetch(url + '/api/calcular')).status, 405);
  assert.equal((await fetch(url + '/api/calcular', { method: 'POST', body: '{}' })).status, 415);
  assert.equal((await fetch(url + '/no-existe')).status, 404);
  assert.equal((await fetch(url + '/../package.json')).status, 404);
});

test('HTTP propaga un rechazo del cálculo sin datos internos', async t => {
  const url = await fixture(t), value = input();
  value.lineas[0].moneda = 'EUR';
  const result = await fetch(url + '/api/calcular', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(value) });
  assert.equal(result.status, 400);
  assert.equal((await result.text()).includes('stack'), false);
});
