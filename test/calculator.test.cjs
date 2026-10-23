const test=require('node:test');
const assert=require('node:assert/strict');
const {calculate}=require('../src/calculator.cjs');
const line=(id,qty,price,currency='USD')=>({id_producto:id,codigo_interno:`P${id}`,nombre:'Prueba',cantidad_recibida:qty,precio_unitario:price,moneda:currency});
test('convierte USD y distribuye gastos por valor recibido',()=>{
 const r=calculate([line(1,10,'10'),line(2,20,'15')],{tipo_cambio:'7.800000',gastos:[{concepto:'Flete',monto:'780',moneda:'GTQ'}]});
 assert.equal(r.compra_gtq,'3120.00');assert.equal(r.gastos_gtq,'780.00');
 assert.equal(r.productos[0].gastos_gtq,'195.00');assert.equal(r.productos[1].gastos_gtq,'585.00');
 assert.equal(r.productos[0].costo_unitario,'97.50');
});
test('centavos sobrantes se distribuyen exactamente y no se pierden',()=>{
 const r=calculate([line(1,1,'1'),line(2,1,'1'),line(3,1,'1')],{tipo_cambio:'1',gastos:[{concepto:'Otros',monto:'0.02',moneda:'GTQ'}]});
 assert.deepEqual(r.productos.map(p=>p.gastos_gtq),['0.01','0.01','0.00']);assert.equal(r.total_gtq,'3.02');
});
test('agrupa producto repetido, usa recibido, omite faltantes y convierte gastos USD',()=>{
 const r=calculate([line(1,2,'10'),line(1,1,'20','GTQ'),line(2,0,'100')],{tipo_cambio:'8',gastos:[{concepto:'Flete',monto:'1',moneda:'USD'}]});
 assert.equal(r.productos.length,1);assert.equal(r.productos[0].cantidad,3);assert.equal(r.total_gtq,'188.00');
 assert.equal(r.productos[0].costo_unitario,'62.67');
});
test('rechaza sin base, moneda no soportada y desbordamiento',()=>{
 assert.throws(()=>calculate([line(1,0,'1')],{tipo_cambio:'8',gastos:[]}),/valor/);
 assert.throws(()=>calculate([line(1,1,'1','EUR')],{tipo_cambio:'8',gastos:[]}),/USD/);
 assert.throws(()=>calculate([line(1,2147483647,'999999999999.99')],{tipo_cambio:'8',gastos:[]}),/rango/);
});
test('descuento reduce la compra, conserva centavos y las piezas sin cargo no absorben gastos proporcionales',()=>{
 const r=calculate([line(1,2,'10'),line(2,3,'0')],{tipo_cambio:'8',descuento_proveedor:{moneda:'USD',monto:'2'},gastos:[{concepto:'Flete',monto:'16',moneda:'GTQ'}]});
 assert.equal(r.compra_bruta_gtq,'160.00');assert.equal(r.descuento_gtq,'16.00');assert.equal(r.compra_gtq,'144.00');assert.equal(r.total_gtq,'160.00');
 assert.deepEqual(r.productos.map(p=>p.total_gtq),['160.00','0.00']);
 assert.throws(()=>calculate([line(1,1,'1')],{tipo_cambio:'1',descuento_proveedor:{moneda:'USD',monto:'2'},gastos:[]}),/descuento/);
 const precise=calculate([line(1,1,'201387')],{tipo_cambio:'7.8',descuento_proveedor:{moneda:'USD',monto:'3020.805'},gastos:[]});
 assert.equal(precise.descuento_gtq,'23562.28');assert.equal(precise.compra_gtq,'1547256.32');
});
