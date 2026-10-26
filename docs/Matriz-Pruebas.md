# Matriz de pruebas

Los 22 casos automatizados se ejecutan con npm test. Resultado verificado local y en Actions: 22 aprobados, 0 fallidos, 0 omitidos.

| ID | Tipo | Entrada | Esperado | Obtenido | Referencia |
|---|---|---|---|---|---|
| CP01 | Unitaria y regresión | Q10 + Q20; flete Q3 | Total Q33.00 | Coincide, aprobado | test/calculator.boundaries.test.cjs: demostración del control: total de dos productos con flete |
| CP02 | Unitaria y regresión | Compras Q0.07, Q1.13, Q2.19; gastos de 0 a 99 centavos | Gastos y totales se conservan exactamente en 100 iteraciones | Coincide, aprobado | test/calculator.boundaries.test.cjs: el reparto conserva todos los centavos con cien combinaciones de gastos |
| CP03 | Unitaria y regresión | Dos productos Q1; gasto Q0.01; invertir orden | Mismos productos e importes ordenados | Coincide, aprobado | test/calculator.boundaries.test.cjs: el orden de entrada no cambia los importes asignados |
| CP04 | Unitaria y regresión | Cantidad -1, 1.5, abc, entero fuera de rango; precio null | Rechazo con error de cantidad o precio | Coincide, aprobado | test/calculator.boundaries.test.cjs: cantidades negativas, fraccionarias y precios ausentes se rechazan |
| CP05 | Unitaria y regresión | null, -1, Infinity, 0.001, 1e3, abc y money fuera de rango | Todos los valores se rechazan | Coincide, aprobado | test/calculator.boundaries.test.cjs: los importes rechazan valores no finitos, negativos y precisión excesiva |
| CP06 | Unitaria y regresión | Q1; descuento Q0.01; moneda alternativa EUR | Q0.99 en GTQ y rechazo de EUR | Coincide, aprobado | test/calculator.boundaries.test.cjs: descuento en GTQ y moneda inválida conservan reglas de validación |
| CP07 | Unitaria y regresión | 10 unidades USD10 y 20 unidades USD15; cambio7.8; fleteQ780 | CompraQ3120; gastosQ195/Q585; costoQ97.50 | Coincide, aprobado | test/calculator.test.cjs: convierte USD y distribuye gastos por valor recibido |
| CP08 | Unitaria y regresión | Tres productos USD1; cambio1; gastoQ0.02 | RepartoQ0.01/Q0.01/Q0.00; totalQ3.02 | Coincide, aprobado | test/calculator.test.cjs: centavos sobrantes se distribuyen exactamente y no se pierden |
| CP09 | Unitaria y regresión | Producto repetido 2xUSD10 y 1xQ20; cantidad0; gastoUSD1; cambio8 | Un producto, cantidad3, totalQ188, unitarioQ62.67 | Coincide, aprobado | test/calculator.test.cjs: agrupa producto repetido, usa recibido, omite faltantes y convierte gastos USD |
| CP10 | Unitaria y regresión | Cantidad0; EUR; entero2147483647 y precio999999999999.99 | Rechazos por base, moneda y rango | Coincide, aprobado | test/calculator.test.cjs: rechaza sin base, moneda no soportada y desbordamiento |
| CP11 | Unitaria y regresión | CompraUSD20; descuentoUSD2; gastoQ16; cambio8; producto gratis | CompraQ144, totalQ160, producto gratisQ0; precisión decimal comprobada | Coincide, aprobado | test/calculator.test.cjs: descuento reduce la compra, conserva centavos y las piezas sin cargo no absorben gastos proporcionales |
| CP12 | Unitaria y regresión | Nombre vacío o121 caracteres; precio0; ID SQL o fuera de rango | Rechazos; Pieza y1.2 normalizados a Pieza y1.20 | Coincide, aprobado | test/crud.test.cjs: U12 valida nombres, importes y claves sin aceptar SQL como identificador |
| CP13 | SQLite | Crear nombre con textoSQL; cerrar y reabrir archivo; editar y eliminar | Una fila conservada; precio12.30; cambio y eliminación correctos | Coincide, aprobado | test/crud.test.cjs: I06 SQLite conserva crear, editar y eliminar entre reaperturas |
| CP14 | HTTP | POST/GET/PUT/DELETE reales; vacío y cuerpo>32KB | 201/200/200/200, lectura final404, inválido400, grande413 | Coincide, aprobado | test/crud.test.cjs: I07 API completa CRUD sobre Express y SQLite reales |
| CP15 | Unitaria y regresión | null, sin líneas, null por línea, >20 gastos y >50 líneas | Rechazo previo al cálculo | Coincide, aprobado | test/crud.test.cjs: U13 rechaza estructuras de cálculo inválidas antes de procesarlas |
| CP16 | React | Render inicial de App sin productos | Formulario y títulos presentes; calcular deshabilitado | Coincide, aprobado | test/frontend.test.cjs: F01 React presenta formulario CRUD y calculo deshabilitado sin productos |
| CP17 | React | Fetch simulado exitoso y error JSON Nombre requerido | Devuelve lista y propaga error; headers JSON correctos | Coincide, aprobado | test/frontend.test.cjs: F02 cliente React interpreta JSON valido y comunica errores de API |
| CP18 | HTTP | POST calcular con una unidad Q100 | HTTP200 y total100.00 | Coincide, aprobado | test/http.test.cjs: HTTP calcula con la aplicación real sin base de datos |
| CP19 | HTTP | GET /, /app.js y /style.css | HTTP200; CSP frame-ancestors none y contenido>100 caracteres | Coincide, aprobado | test/http.test.cjs: HTTP publica la interfaz y sus archivos con tipo y política de contenido |
| CP20 | HTTP | JSON {invalido y objeto vacío | HTTP400 y error JSON | Coincide, aprobado | test/http.test.cjs: HTTP rechaza JSON inválido y datos incompletos |
| CP21 | HTTP | GET cálculo; POST sinJSON; ruta inexistente y ../package.json | HTTP405,415,404,404 | Coincide, aprobado | test/http.test.cjs: HTTP valida método, tipo de contenido y rutas |
| CP22 | HTTP | POST cálculo con EUR | HTTP400 y respuesta sin stack | Coincide, aprobado | test/http.test.cjs: HTTP propaga un rechazo del cálculo sin datos internos |

## Verificación adicional Docker

DC01, fuera del conteo de 22 pruebas: quality/docker-smoke.cjs crea y edita un producto, reinicia el servicio sqa, verifica persistencia, elimina y comprueba 404 y HTML React. Esperado: todos los pasos aprobados. Obtenido local: passed, registrado en artifacts/docker-smoke.json. Resultado remoto conservado en el artefacto evidencia-docker.

Los casos React comprueban render inicial y transporte HTTP, no eventos completos de navegador. La prueba manual CRUD y el cálculo Q33 se documentan por separado en Revision-y-Evidencia.md.
