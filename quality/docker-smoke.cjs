const assert = require('node:assert/strict');
const fs = require('node:fs');
const { spawnSync } = require('node:child_process');
const base = 'http://127.0.0.1:3100';
async function ready() {
  for (let attempt = 0; attempt < 60; attempt++) {
    try { if ((await fetch(base + '/api/productos')).ok) return; } catch { /* El arranque puede estar en curso. */ }
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  throw new Error('El contenedor no estuvo disponible en 60 segundos');
}
async function main() {
  await ready();
  const send = async (url, method, body) => {
    const options = { method, headers: { 'Content-Type': 'application/json' } };
    if (body) options.body = JSON.stringify(body);
    return fetch(base + url, options);
  };
  const created = await send('/api/productos', 'POST', { nombre: 'Docker ficticio', precio: '10' });
  assert.equal(created.status, 201);
  const p = await created.json();
  const changed = await send('/api/productos/' + p.id, 'PUT', { nombre: 'Docker editado', precio: '20' });
  assert.equal(changed.status, 200);
  const restarted = spawnSync('docker', ['compose', '-p', 'sqa-entrega', 'restart', 'sqa'], { encoding: 'utf8' });
  assert.equal(restarted.status, 0, restarted.stderr);
  await ready();
  assert.equal((await (await fetch(base + '/api/productos/' + p.id)).json()).nombre, 'Docker editado');
  assert.equal((await send('/api/productos/' + p.id, 'DELETE')).status, 200);
  assert.equal((await fetch(base + '/api/productos/' + p.id)).status, 404);
  assert.match(await (await fetch(base)).text(), /<div id="root">/);
  fs.mkdirSync('artifacts', { recursive: true });
  const result = { date: new Date().toISOString(), status: 'passed', checks: ['crear', 'editar', 'persistencia tras reinicio', 'eliminar', 'React compilado'], project: 'sqa-entrega', url: base };
  fs.writeFileSync('artifacts/docker-smoke.json', JSON.stringify(result, null, 2));
  console.log(result);
}
main().catch(error => { console.error(error); process.exitCode = 1; });
