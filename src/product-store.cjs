const { DatabaseSync } = require('node:sqlite');
const { decimal } = require('./calculator.cjs');
function invalid(message, statusCode = 400) { return Object.assign(new Error(message), { statusCode }); }
function product(input) {
  if (!input || typeof input.nombre !== 'string' || !input.nombre.trim() || input.nombre.trim().length > 120) throw invalid('Nombre requerido de hasta 120 caracteres');
  const cents = decimal(input.precio);
  if (cents === 0n) throw invalid('Precio mayor que cero');
  return { nombre: input.nombre.trim(), precio: `${cents / 100n}.${String(cents % 100n).padStart(2, '0')}` };
}
function identifier(id) {
  if (!/^\d+$/.test(String(id)) || !Number.isSafeInteger(Number(id)) || Number(id) < 1) throw invalid('Identificador inválido');
  return Number(id);
}
function createStore(filename = ':memory:') {
  const db = new DatabaseSync(filename);
  db.exec('CREATE TABLE IF NOT EXISTS productos (id INTEGER PRIMARY KEY AUTOINCREMENT, nombre TEXT NOT NULL, precio TEXT NOT NULL)');
  const list = () => db.prepare('SELECT id, nombre, precio FROM productos ORDER BY id').all();
  const find = id => db.prepare('SELECT id, nombre, precio FROM productos WHERE id = ?').get(identifier(id));
  function get(id) { const row = find(id); if (!row) throw invalid('Producto no encontrado', 404); return row; }
  return {
    list, get,
    create(input) { const p = product(input); const r = db.prepare('INSERT INTO productos (nombre, precio) VALUES (?, ?)').run(p.nombre, p.precio); return get(Number(r.lastInsertRowid)); },
    update(id, input) { get(id); const p = product(input); db.prepare('UPDATE productos SET nombre = ?, precio = ? WHERE id = ?').run(p.nombre, p.precio, identifier(id)); return get(id); },
    remove(id) { get(id); db.prepare('DELETE FROM productos WHERE id = ?').run(identifier(id)); },
    close() { db.close(); }
  };
}
module.exports = { createStore, product, identifier };
