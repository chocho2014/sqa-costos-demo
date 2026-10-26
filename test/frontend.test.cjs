const test = require('node:test');
const assert = require('node:assert/strict');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
test('F01 React presenta formulario CRUD y calculo deshabilitado sin productos', async () => {
  const { App } = await import('../frontend/App.mjs');
  const html = renderToStaticMarkup(React.createElement(App));
  for (const text of ['Catálogo y reparto de costos', 'Nuevo producto', 'Nombre', 'Precio GTQ', 'Guardar producto', 'Productos registrados', 'Flete GTQ', 'Calcular total']) assert.ok(html.includes(text));
  assert.match(html, /disabled/);
});
test('F02 cliente React interpreta JSON valido y comunica errores de API', async t => {
  const original = global.fetch;
  t.after(() => { global.fetch = original; });
  const { request } = await import('../frontend/App.mjs');
  global.fetch = async (url, options) => { assert.equal(url, '/api/productos'); assert.equal(options.headers['Content-Type'], 'application/json'); return { ok: true, json: async () => [{ id: 1 }] }; };
  assert.deepEqual(await request('/api/productos'), [{ id: 1 }]);
  global.fetch = async () => ({ ok: false, json: async () => ({ error: 'Nombre requerido' }) });
  await assert.rejects(request('/api/productos', { method: 'POST' }), /Nombre requerido/);
});
