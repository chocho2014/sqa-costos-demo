import React, { useEffect, useState } from 'react';
const h = React.createElement;
export async function request(url, options = {}) {
  const response = await fetch(url, { ...options, headers: { 'Content-Type': 'application/json' } });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error);
  return result;
}
export function App() {
  const [rows, setRows] = useState([]), [name, setName] = useState(''), [price, setPrice] = useState(''), [editing, setEditing] = useState(null);
  const [message, setMessage] = useState(''), [freight, setFreight] = useState('0.00'), [total, setTotal] = useState(null);
  async function load() { try { setRows(await request('/api/productos')); } catch (e) { setMessage(e.message); } }
  useEffect(() => { load(); }, []);
  async function save(event) {
    event.preventDefault();
    try {
      await request(editing ? `/api/productos/${editing}` : '/api/productos', { method: editing ? 'PUT' : 'POST', body: JSON.stringify({ nombre: name, precio: price }) });
      setEditing(null); setName(''); setPrice(''); setTotal(null); setMessage('Producto guardado'); await load();
    } catch (e) { setMessage(e.message); }
  }
  async function remove(id) {
    try { await request(`/api/productos/${id}`, { method: 'DELETE' }); setTotal(null); setMessage('Producto eliminado'); await load(); }
    catch (e) { setMessage(e.message); }
  }
  async function calculate() {
    try {
      const value = await request('/api/calcular', { method: 'POST', body: JSON.stringify({ lineas: rows.map(p => ({ id_producto: p.id, nombre: p.nombre, cantidad_recibida: 1, precio_unitario: p.precio, moneda: 'GTQ' })), datos: { tipo_cambio: '1', gastos: [{ moneda: 'GTQ', monto: freight }] } }) });
      setTotal(value.total_gtq); setMessage('Cálculo completado');
    } catch (e) { setMessage(e.message); }
  }
  return h('main', null,
    h('h1', null, 'Catálogo y reparto de costos'),
    h('p', null, 'Adaptación académica de un cálculo existente de Atlas ERP. Solo datos ficticios.'),
    h('form', { onSubmit: save },
      h('h2', null, editing ? 'Editar producto' : 'Nuevo producto'),
      h('label', null, 'Nombre', h('input', { value: name, onChange: e => setName(e.target.value), required: true, maxLength: 120 })),
      h('label', null, 'Precio GTQ', h('input', { value: price, onChange: e => setPrice(e.target.value), required: true, type: 'number', min: '0.01', step: '0.01' })),
      h('button', { type: 'submit' }, 'Guardar producto')),
    h('p', { role: 'status' }, message),
    h('h2', null, 'Productos registrados'),
    h('table', null, h('thead', null, h('tr', null, ...['Nombre', 'Precio GTQ', 'Acciones'].map(t => h('th', { key: t }, t)))),
      h('tbody', null, ...rows.map(p => h('tr', { key: p.id }, h('td', null, p.nombre), h('td', null, p.precio), h('td', null,
        h('button', { onClick: () => { setEditing(p.id); setName(p.nombre); setPrice(p.precio); } }, `Editar ${p.nombre}`),
        h('button', { onClick: () => remove(p.id) }, `Eliminar ${p.nombre}`)))))),
    h('section', null, h('h2', null, 'Repartir flete'), h('label', null, 'Flete GTQ', h('input', { type: 'number', min: '0', step: '0.01', value: freight, onChange: e => setFreight(e.target.value) })),
      h('button', { onClick: calculate, disabled: !rows.length }, 'Calcular total'), total !== null && h('p', null, `Total GTQ ${total}`)));
}
