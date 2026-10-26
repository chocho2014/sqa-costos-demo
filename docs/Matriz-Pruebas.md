# Matriz de pruebas

Ejecución local: 22 aprobadas, 0 fallos y 0 omisiones. Los resultados detallados y las aserciones reproducibles se conservan en test/ y artifacts/tests.xml. La prueba inicial React no es una prueba E2E.

| ID | Tipo | Entrada y escenario | Esperado y obtenido | Archivo |
|---|---|---|---|---|
| CP01 | Unitaria y regresión | demostración del control: total de dos productos con flete | Aserciones de ese caso satisfechas; aprobado | test/calculator.boundaries.test.cjs |
| CP02 | Unitaria y regresión | el reparto conserva todos los centavos con cien combinaciones de gastos | Aserciones de ese caso satisfechas; aprobado | test/calculator.boundaries.test.cjs |
| CP03 | Unitaria y regresión | el orden de entrada no cambia los importes asignados | Aserciones de ese caso satisfechas; aprobado | test/calculator.boundaries.test.cjs |
| CP04 | Unitaria y regresión | cantidades negativas, fraccionarias y precios ausentes se rechazan | Aserciones de ese caso satisfechas; aprobado | test/calculator.boundaries.test.cjs |
| CP05 | Unitaria y regresión | los importes rechazan valores no finitos, negativos y precisión excesiva | Aserciones de ese caso satisfechas; aprobado | test/calculator.boundaries.test.cjs |
| CP06 | Unitaria y regresión | descuento en GTQ y moneda inválida conservan reglas de validación | Aserciones de ese caso satisfechas; aprobado | test/calculator.boundaries.test.cjs |
| CP07 | Unitaria y regresión | convierte USD y distribuye gastos por valor recibido | Aserciones de ese caso satisfechas; aprobado | test/calculator.test.cjs |
| CP08 | Unitaria y regresión | centavos sobrantes se distribuyen exactamente y no se pierden | Aserciones de ese caso satisfechas; aprobado | test/calculator.test.cjs |
| CP09 | Unitaria y regresión | agrupa producto repetido, usa recibido, omite faltantes y convierte gastos USD | Aserciones de ese caso satisfechas; aprobado | test/calculator.test.cjs |
| CP10 | Unitaria y regresión | rechaza sin base, moneda no soportada y desbordamiento | Aserciones de ese caso satisfechas; aprobado | test/calculator.test.cjs |
| CP11 | Unitaria y regresión | descuento reduce la compra, conserva centavos y las piezas sin cargo no absorben gastos proporcionales | Aserciones de ese caso satisfechas; aprobado | test/calculator.test.cjs |
| CP12 | Unitaria y regresión | U12 valida nombres, importes y claves sin aceptar SQL como identificador | Aserciones de ese caso satisfechas; aprobado | test/crud.test.cjs |
| CP13 | Integración SQLite | I06 SQLite conserva crear, editar y eliminar entre reaperturas | Aserciones de ese caso satisfechas; aprobado | test/crud.test.cjs |
| CP14 | Integración HTTP | I07 API completa CRUD sobre Express y SQLite reales | Aserciones de ese caso satisfechas; aprobado | test/crud.test.cjs |
| CP15 | Unitaria y regresión | U13 rechaza estructuras de cálculo inválidas antes de procesarlas | Aserciones de ese caso satisfechas; aprobado | test/crud.test.cjs |
| CP16 | Componente o cliente React | F01 React presenta formulario CRUD y calculo deshabilitado sin productos | Aserciones de ese caso satisfechas; aprobado | test/frontend.test.cjs |
| CP17 | Componente o cliente React | F02 cliente React interpreta JSON valido y comunica errores de API | Aserciones de ese caso satisfechas; aprobado | test/frontend.test.cjs |
| CP18 | Integración HTTP | HTTP calcula con la aplicación real sin base de datos | Aserciones de ese caso satisfechas; aprobado | test/http.test.cjs |
| CP19 | Integración HTTP | HTTP publica la interfaz y sus archivos con tipo y política de contenido | Aserciones de ese caso satisfechas; aprobado | test/http.test.cjs |
| CP20 | Integración HTTP | HTTP rechaza JSON inválido y datos incompletos | Aserciones de ese caso satisfechas; aprobado | test/http.test.cjs |
| CP21 | Integración HTTP | HTTP valida método, tipo de contenido y rutas | Aserciones de ese caso satisfechas; aprobado | test/http.test.cjs |
| CP22 | Integración HTTP | HTTP propaga un rechazo del cálculo sin datos internos | Aserciones de ese caso satisfechas; aprobado | test/http.test.cjs |

Los nombres describen el escenario; para los valores exactos de entrada, salida y códigos HTTP, consultar las aserciones del archivo enlazado. Las pruebas HTTP usan servidor real en puerto efímero y las de persistencia reabren un archivo SQLite real.
