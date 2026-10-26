# Manual técnico

## Arquitectura
React en frontend/App.mjs presenta el catálogo. Vite compila en dist/web. Express en src/server.cjs expone la API y sirve esa compilación. src/product-store.cjs utiliza node:sqlite y sentencias preparadas. src/calculator.cjs calcula moneda, descuento y reparto proporcional conservando centavos. src/start.cjs crea data/catalogo.sqlite al arrancar. Los archivos public son una interfaz anterior de compatibilidad cuando aún no existe la compilación React.

## Instalación reproducible
Requisitos: Git y Node.js 24 con npm. En una carpeta de trabajo ejecutar:

```powershell
git clone https://github.com/chocho2014/sqa-costos-demo.git
cd sqa-costos-demo
git fetch origin
git switch atlas/entrega-sqa-completa
npm ci
npm run build
npm start
```

Abrir http://127.0.0.1:3000. Para desarrollo ejecutar npm start y, en otra terminal, npm run dev; Vite redirige /api al puerto 3000. No se requieren Excel, XAMPP, contraseñas de empresa ni el código privado de Atlas.

## API
| Método | Ruta | Resultado |
|---|---|---|
| GET | /api/productos | Lista |
| GET | /api/productos/:id | Uno o 404 |
| POST | /api/productos | Alta, 201 |
| PUT | /api/productos/:id | Edición, 200 |
| DELETE | /api/productos/:id | Eliminación, 200 |
| POST | /api/calcular | Reparto de gastos y total |

Producto: {"nombre":"Pieza ficticia","precio":"10.00"}. Se rechazan nombre vacío, precio no positivo, identificador inválido, JSON incorrecto y cuerpo superior a 32 KB. SQL parametrizado evita interpretar nombres como instrucciones; una prueba verifica ese caso. Las operaciones no implementan usuarios porque el alcance es una demostración local.

## Ejecutar verificaciones
```powershell
npm run build
npm test
npm run analyze
npm run lint
npm run report
```
Cada comando debe finalizar con código 0. Si una etapa falla, corregir la causa antes de afirmar aceptación. Abrir artifacts/report.html, artifacts/coverage/lcov-report/index.html y artifacts/duplication/html/index.html. No editar manualmente los resultados para cambiar las métricas.

## Pipeline
.github/workflows/quality.yml usa seis jobs: Build, Test y Analyze paralelos; Report espera esos tres y conserva diagnósticos incluso con fallos; Entrega verificada espera los cuatro; Aceptacion de calidad exige éxito de todos. Los artefactos se identifican por SHA y se conservan 30 días. Las Actions oficiales se fijan por SHA. Un fallo impide la entrega y el control requerido bloquea la integración a main.

## Datos y mantenimiento
La base local está en data/catalogo.sqlite, ignorada por Git. Detener el proceso antes de copiarla como respaldo. Los registros son ficticios. Las pruebas usan una base temporal y cierran las conexiones. Ctrl+C detiene el servidor. No borrar la base para resolver un error sin respaldarla.

## Docker

La entrega incluye Dockerfile, .dockerignore y compose.yaml. Consultar [Docker](Docker.md). El job adicional Contenedor Docker prueba CRUD y persistencia tras reinicio y es obligatorio para Entrega y Aceptacion. Se contiene la adaptación pública, sin migrar el ERP ni XAMPP.
