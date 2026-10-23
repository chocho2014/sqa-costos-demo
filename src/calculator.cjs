// Importes en centavos y tipo de cambio en millonésimas: sin reparto flotante.
const crypto = require('node:crypto');
function fail(message){throw Object.assign(new Error(message),{statusCode:400});}
function decimal(value, scale=2, positive=false){
  const s=String(value);
  if(!['string','number'].includes(typeof value)||!new RegExp(`^\\d{1,12}(\\.\\d{1,${scale}})?$`).test(s))fail('Importe o tipo de cambio no válido');
  const [whole,fraction='']=s.split('.');const n=BigInt(whole)*10n**BigInt(scale)+BigInt(fraction.padEnd(scale,'0'));
  if(n>99999999999999n || (positive && n===0n))fail('Importe fuera de rango');return n;
}
const round=(a,b)=>(a+b/2n)/b;
function money(n){if(n<0n||n>99999999999999n)fail('El costo excede el rango permitido');return `${n/100n}.${String(n%100n).padStart(2,'0')}`;}
function calculate(lines, data){
  const fx=decimal(data.tipo_cambio,6,true);
  const convert=(amount,currency)=>{
    if(!['USD','GTQ'].includes(currency))fail('Solo se admite compra en USD o GTQ');
    return currency==='USD'?round(amount*fx,1000000n):amount;
  };
  const expenses=data.gastos.map(g=>({...g,total_gtq:money(convert(decimal(g.monto),g.moneda))}));
  const expense=expenses.reduce((sum,g)=>sum+decimal(g.total_gtq),0n);
  const groups=new Map();
  for(const line of lines){
    const qty=Number(line.cantidad_recibida);if(!Number.isSafeInteger(qty)||qty<0)fail('Cantidad recibida no válida');
    if(!qty)continue;
    if(line.precio_unitario===null)fail('La orden no tiene precio de compra');
    const base=convert(decimal(line.precio_unitario)*BigInt(qty),line.moneda);
    const old=groups.get(line.id_producto)||{id_producto:line.id_producto,codigo_interno:line.codigo_interno,nombre:line.nombre,cantidad:0,base:0n};
    old.cantidad+=qty;old.base+=base;groups.set(line.id_producto,old);
  }
  const products=[...groups.values()].sort((a,b)=>a.id_producto-b.id_producto);
  const base=products.reduce((sum,p)=>sum+p.base,0n);
  if(!products.length || base===0n)fail('Se requiere mercancía recibida con valor de compra mayor que cero');
  const discountInput=data.descuento_proveedor;
  if(discountInput&&!['USD','GTQ'].includes(discountInput.moneda))fail('Moneda del descuento no válida');
  const discount=discountInput?round(decimal(discountInput.monto,6)*(discountInput.moneda==='USD'?fx:1000000n),10000000000n):0n;
  if(discount>=base)fail('El descuento debe ser menor al valor de la mercancía recibida');
  const net=base-discount;
  for(const p of products){p.net=net*p.base/base;p.netRemainder=net*p.base%base;}
  let netRemaining=net-products.reduce((sum,p)=>sum+p.net,0n);
  for(const p of [...products].sort((a,b)=>a.netRemainder===b.netRemainder?a.id_producto-b.id_producto:a.netRemainder>b.netRemainder?-1:1)){
    if(netRemaining>0n){p.net++;netRemaining--;}
  }
  for(const p of products){p.allocated=expense*p.base/base;p.remainder=expense*p.base%base;}
  let remaining=expense-products.reduce((s,p)=>s+p.allocated,0n);
  for(const p of [...products].sort((a,b)=>a.remainder===b.remainder?a.id_producto-b.id_producto:a.remainder>b.remainder?-1:1)){
    if(remaining>0n){p.allocated++;remaining--;}
  }
  const result={tipo_cambio:data.tipo_cambio,gastos:expenses,descuento_proveedor:data.descuento_proveedor??{moneda:'GTQ',monto:'0.00'},compra_bruta_gtq:money(base),descuento_gtq:money(discount),compra_gtq:money(net),gastos_gtq:money(expense),total_gtq:money(net+expense),
    productos:products.map(p=>{const unit=round(p.net+p.allocated,BigInt(p.cantidad));return {
      id_producto:p.id_producto,codigo_interno:p.codigo_interno,nombre:p.nombre,cantidad:p.cantidad,
      porcentaje:Number(p.base*1000000n/base)/10000,compra_gtq:money(p.net),gastos_gtq:money(p.allocated),
      total_gtq:money(p.net+p.allocated),costo_unitario:money(unit),
    };})};
  result.firma=crypto.createHash('sha256').update(JSON.stringify({lines,result})).digest('hex');return result;
}
module.exports={calculate,decimal,money};
