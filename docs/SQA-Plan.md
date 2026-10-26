# Plan de aseguramiento de calidad

## Propósito y alcance
Aplicar controles repetibles a una adaptación de una función existente de costos de Atlas ERP. La aplicación pública agrega un catálogo CRUD en React, API Express y persistencia SQLite. Se utilizan únicamente datos ficticios. Atlas ERP completo permanece privado y no recibe los porcentajes de cobertura de esta adaptación.

La variante SQLite se justifica porque permite reproducir el CRUD sin un servidor ni credenciales externas; la consigna admite variantes justificadas. No se afirma que esta demo sustituya la base MariaDB del ERP. La aplicación se ejecuta en localhost, sin autenticación de producción.

## Actividades y responsables
El desarrollador mantiene requisitos, casos, correcciones y evidencia. GitHub Actions ejecuta Build, Test, Analyze y Report con cada push y PR. Una persona distinta del autor realiza revisión manual del PR y registra su aprobación. La aprobación humana no se simula mediante el pipeline.

## Estándares internos
Node.js 24, dependencias fijadas mediante package-lock.json y npm ci; SQL parametrizado; importes en centavos enteros con BigInt; entradas validadas; errores internos sin detalles al cliente; cambios mediante PR. Este plan define reglas propias de calidad y no constituye certificación ISO ni auditoría de seguridad.

## Política de aceptación
| Control | Umbral obligatorio |
|---|---|
| Compilación Vite | Salida 0 |
| Pruebas | Cero fallos y cero omisiones |
| Cobertura global del alcance | Líneas, sentencias, funciones y ramas >= 60 % |
| Oxlint y ESLint | Cero errores y advertencias configuradas |
| Duplicación jscpd | <= 10 %, mínimo 8 líneas y 60 tokens |
| Entrega | Build, Test, Analyze y Report exitosos |
| Rama main | PR, control Aceptacion de calidad y aprobación independiente |

C8 usa --all sobre src y frontend. Se excluyen src/start.cjs y frontend/main.mjs por ser entradas de arranque y montaje. Se incluyen los archivos de negocio aunque no se importen. Las exclusiones y los porcentajes por archivo se muestran en el reporte. El umbral es global; no significa 60 % para cada archivo o función individual.

## Herramientas y equivalencia de análisis
Oxlint analiza reglas de corrección; ESLint incorpora complejidad ciclomática máxima 20 y profundidad máxima 5; jscpd mide duplicación. Los JSON originales y el dashboard HTML constituyen la alternativa a SonarCloud. No se utilizó SonarCloud. Los errores estáticos son hallazgos de reglas y no un conteo de defectos confirmados. Los code smells son advertencias configuradas; no son comparables directamente con métricas de otro producto.

## Riesgos y límites
La cobertura de funciones React es menor que la del servidor; las pruebas de render inicial y del cliente HTTP no ejecutan todos los eventos de edición y borrado. E2E de navegador permanece como deuda priorizada, opcional en la consigna. Se requiere verificación manual del CRUD y revisión independiente. SQLite de Node 24 puede emitir advertencia experimental. No hay despliegue automático de producción, escaneo de penetración ni prueba de carga.

## Evidencia y conservación
Cada ejecución publica JUnit, LCOV, JSON de análisis, HTML de cobertura, comparación antes/después y compilación; retención remota 30 días. La carpeta entregada conserva copias para evitar depender de esa caducidad. La línea base es posterior a adaptar el CRUD y anterior a corregir/ampliar las pruebas; no es una medición del origen completo de Atlas.

## Docker

La entrega incluye Dockerfile, .dockerignore y compose.yaml. Consultar [Docker](docs/Docker.md) desde la raíz o Docker.md dentro de docs. El job adicional Contenedor Docker prueba CRUD y persistencia tras reinicio y es obligatorio para Entrega y Aceptacion. Se contiene la adaptación pública, sin migrar el ERP ni XAMPP.
