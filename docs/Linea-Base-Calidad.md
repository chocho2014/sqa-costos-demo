# Línea base de calidad

Se capturó una ejecución real de la adaptación CRUD antes de las mejoras SQA del 26 de octubre de 2026. El archivo quality/baseline-sqa.json conserva métricas y hashes de los archivos incluidos; el commit e48b906 conserva el código de ese punto. No es una reconstrucción ficticia de fechas anteriores.

| Métrica | Línea base |
|---|---:|
| Casos | 16 |
| Aprobados | 14 |
| Fallidos | 2 |
| Omitidos | 0 |
| Líneas y sentencias | 67.41 % |
| Funciones | 52.38 % |
| Ramas | 97.02 % |
| Errores estáticos | 0 |
| Advertencias de mantenibilidad | 1 |
| Duplicación | 0 % |

La configuración de recursos estáticos de Express empleaba un valor booleano incompatible para index. Se corrigió y se amplió la integración CRUD. ESLint identificó complejidad 21 en calculate; se extrajo receivedProducts para separar agrupación y conversión sin cambiar el reparto monetario.

Reproducción histórica: en una copia independiente del repositorio ejecutar git checkout e48b906, npm ci y npm run baseline. Este comando recoge el estado sin aplicar los umbrales de cobertura, pero mantiene los fallos de las pruebas. No ejecutar checkout sobre trabajo sin guardar. La reproducción puede variar ligeramente por la versión de Node/V8; usar la versión registrada en el JSON.
