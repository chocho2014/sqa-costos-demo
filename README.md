# Catálogo y costos con aseguramiento de calidad

[![Calidad demo](https://github.com/chocho2014/sqa-costos-demo/actions/workflows/quality.yml/badge.svg?branch=atlas%2Fentrega-sqa-completa)](https://github.com/chocho2014/sqa-costos-demo/actions/workflows/quality.yml)

Adaptación académica de un cálculo existente de Atlas ERP. Incluye catálogo CRUD en React, API Express y persistencia SQLite con datos ficticios. Se conserva la privacidad del ERP original. Node.js 24, npm, React 19, Express 5 y Vite 7. SQLite es una variante justificada para reproducir la entrega sin servidor externo.

```powershell
npm ci
npm run build
npm start
```

Abrir http://127.0.0.1:3000. Guardar, editar y eliminar productos; con Q10 + Q20 y Q3 de flete, calcular Q33. No utilizar datos empresariales reales ni exponer esta demo sin autenticación a Internet.

## Calidad

```powershell
npm test
npm run analyze
npm run lint
npm run report
```

Build → Test y Analyze → Report → Entrega verificada → Aceptacion de calidad. Test y Analyze son paralelos a Build. La entrega requiere los cuatro stages exitosos. Cobertura global mínima 60 % en las cuatro métricas; cero pruebas fallidas u omitidas y cero hallazgos configurados; duplicación máxima 10 %. El pipeline genera JUnit, LCOV, análisis JSON, dashboard HTML y compilación.

La cobertura incluye src y frontend, salvo arranque y montaje. No representa todo Atlas ni prueba ausencia de defectos. Oxlint, ESLint y jscpd forman la alternativa documentada a SonarCloud. Se requiere además revisión humana independiente para integrar a main.

## Documentación

- [Plan SQA](docs/SQA-Plan.md)
- [Matriz de pruebas](docs/Matriz-Pruebas.md)
- [Línea base](docs/Linea-Base-Calidad.md)
- [Reporte de mejora y deuda](docs/Reporte-Mejora.md)
- [Manual técnico](docs/Manual-Tecnico.md)
- [Manual de usuario](docs/Manual-Usuario.md)
- [Revisión y evidencia](docs/Revision-y-Evidencia.md)

Los reportes remotos caducan en 30 días; descargar los artefactos de Actions. La entrega continua publica un paquete verificado; no se afirma despliegue automático de producción.

## Docker

La entrega incluye Dockerfile, .dockerignore y compose.yaml. Consultar [Docker](docs/Docker.md) desde la raíz o Docker.md dentro de docs. El job adicional Contenedor Docker prueba CRUD y persistencia tras reinicio y es obligatorio para Entrega y Aceptacion. Se contiene la adaptación pública, sin migrar el ERP ni XAMPP.
