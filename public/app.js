document.getElementById('form').addEventListener('submit', async event => {
  event.preventDefault();
  const fields = new FormData(event.currentTarget);
  const result = document.getElementById('result');
  result.textContent = 'Calculando…';
  try {
    const response = await fetch('/api/calcular', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lineas: [ ['a', 1], ['b', 2] ].map(([field, id]) => ({
        id_producto: id, codigo_interno: 'DEMO-' + id, nombre: 'Producto ficticio ' + id,
        cantidad_recibida: 1, precio_unitario: fields.get(field), moneda: 'GTQ'
      })), datos: { tipo_cambio: '1', gastos: [{ concepto: 'Transporte ficticio', monto: fields.get('gasto'), moneda: 'GTQ' }] } })
    });
    const data = await response.json();
    if (!response.ok) throw Error(data.error);
    result.textContent = data.productos.map(p => p.nombre + ': compra Q' + p.compra_gtq + ' + gastos Q' + p.gastos_gtq + ' = Q' + p.total_gtq).join('\n') + '\nTotal: Q' + data.total_gtq;
  } catch (error) { result.textContent = error.message || 'No se pudo conectar'; }
});

