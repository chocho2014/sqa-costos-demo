const test = require('node:test');
const assert = require('node:assert/strict');
const { calculate, decimal, money } = require('../src/calculator.cjs');
const line = (id, amount) => ({ id_producto: id, nombre: 'Ficticio', cantidad_recibida: 1, precio_unitario: amount, moneda: 'GTQ' });
const cents = value => BigInt(value.replace('.', ''));

test('el reparto conserva todos los centavos con cien combinaciones de gastos', () => {
  for (let n = 0; n < 100; n++) {
    const result = calculate([line(1, '0.07'), line(2, '1.13'), line(3, '2.19')], { tipo_cambio: '1', gastos: [{ moneda: 'GTQ', monto: money(BigInt(n)) }] });
    assert.equal(result.productos.reduce((sum, p) => sum + cents(p.gastos_gtq), 0n), BigInt(n));
    assert.equal(result.productos.reduce((sum, p) => sum + cents(p.total_gtq), 0n), cents(result.total_gtq));
  }
});

test('el orden de entrada no cambia los importes asignados', () => {
  const data = { tipo_cambio: '1', gastos: [{ moneda: 'GTQ', monto: '0.01' }] };
  const lines = [line(2, '1.00'), line(1, '1.00')];
  assert.deepEqual(calculate(lines, data).productos, calculate([...lines].reverse(), data).productos);
});

test('cantidades negativas, fraccionarias y precios ausentes se rechazan', () => {
  for (const quantity of [-1, 1.5, 'abc', Number.MAX_SAFE_INTEGER + 1]) {
    assert.throws(() => calculate([{ ...line(1, '1'), cantidad_recibida: quantity }], { tipo_cambio: '1', gastos: [] }), /Cantidad/);
  }
  assert.throws(() => calculate([line(1, null)], { tipo_cambio: '1', gastos: [] }), /precio/);
});

test('los importes rechazan valores no finitos, negativos y precisión excesiva', () => {
  for (const value of [undefined, null, {}, -1, Infinity, '0.001', '1e3', 'abc']) assert.throws(() => decimal(value));
  assert.throws(() => decimal('0', 6, true), /rango/);
  assert.throws(() => money(-1n), /rango/);
  assert.throws(() => money(100000000000000n), /rango/);
});

test('descuento en GTQ y moneda inválida conservan reglas de validación', () => {
  const data = { tipo_cambio: '1', gastos: [], descuento_proveedor: { moneda: 'GTQ', monto: '0.01' } };
  assert.equal(calculate([line(1, '1')], data).total_gtq, '0.99');
  assert.throws(() => calculate([line(1, '1')], { ...data, descuento_proveedor: { moneda: 'EUR', monto: '0.01' } }), /Moneda/);
});
