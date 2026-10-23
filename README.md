# Demostración pública de CI/CD y aseguramiento de calidad

Aplicación académica de reparto de costos con Node.js. Usa exclusivamente productos e importes ficticios. Se deriva de un cálculo genérico ya existente y se acompaña de una interfaz mínima independiente para demostrar calidad y entrega continua.

No es el ERP completo. No contiene datos, cuentas, claves, base de datos, documentos, logotipos ni historial Git de ninguna empresa. Se omitieron los campos OEM y la política de precio sugerido del módulo de origen. Publicar esta demostración no protege el repositorio privado original ni certifica su calidad global.

## Uso

Node.js 24 o superior:

```sh
npm ci
npm start
```

Abrir http://127.0.0.1:3000. La aplicación no persiste datos ni requiere una base de datos.

## Comprobaciones

```sh
npm run lint
npm test
npm run build
npm run report
```

Oxlint exige cero advertencias. Las pruebas unitarias verifican importes, distribución de centavos, redondeos y límites. Las integraciones realizan solicitudes HTTP contra el servidor real con datos ficticios. No son pruebas de integración de base de datos ni pruebas E2E de navegador.

La cobertura nativa de Node exige 85 % de líneas, 75 % de ramas y 90 % de funciones en calculator.cjs y server.cjs cargados por la suite. No se mide el JavaScript de interfaz ni start.cjs. La línea base de diez pruebas se midió antes de ampliar los escenarios sobre la misma aplicación. Las métricas pertenecen a esta demostración.

## Pipeline y entrega

Push y pull request ejecutan análisis, pruebas, cobertura y preparación del paquete. El job de entrega publica dist solo si calidad pasa. Aceptacion de calidad usa always() y falla si falta un resultado correcto. Los informes JUnit, LCOV, JSON y HTML se conservan catorce días. Se entrega un paquete listo para instalar, sin despliegue automático.

## Plan de calidad y deuda

- Cada cambio requiere PR con descripción y evidencia, comprobaciones aprobadas y revisión de otra persona.
- Revisar conservación de centavos, validaciones, errores HTTP y ausencia de datos privados.
- No reducir umbrales ni omitir pruebas para aprobar una entrega.
- Deuda abierta: cobertura de interfaz y E2E de navegador; actualización y fijación de acciones por SHA; pruebas del paquete en un entorno de despliegue.
- Las actualizaciones se prueban por PR. No existe autofusión.

## Protección de main y demostración negativa

Tras publicar y obtener una ejecución verde, configurar protección de main con PR obligatorio, una aprobación, descarte de aprobaciones antiguas, conversación resuelta y check Aceptacion de calidad. No permitir force push, eliminación ni excepciones de administrador.

En una rama de prueba separada, introducir un test fallido deliberado, abrir su PR y mostrar el rechazo del pipeline y el bloqueo de fusión. Corregir mediante otro commit y conservar ambos resultados como evidencia. La revisión manual requiere otra persona con acceso autorizado. El autor no puede autoaprobarse.

Estado inicial de esta copia: validación local. La publicación, ejecución remota, reglas y revisión humana se acreditarán con sus enlaces al realizarse.
