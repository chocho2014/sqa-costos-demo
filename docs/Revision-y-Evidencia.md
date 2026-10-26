# Revisión y evidencia

Repositorio público: https://github.com/chocho2014/sqa-costos-demo

La revisión debe hacerse sobre la rama atlas/entrega-sqa-completa. El revisor comprueba entradas inválidas, SQL parametrizado, exactitud de centavos, alcance real de cobertura, configuración de stages, dependencias de entrega y límites de la demo. Debe registrar sus comentarios y aprobación en el PR con su propia cuenta autorizada.

La protección existente exige Aceptacion de calidad y una aprobación independiente. No se debe desactivar la regla ni aprobar con una identidad ficticia para producir evidencia. El video debe mostrarse con el estado real: si la revisión continúa pendiente, decirlo.

El PR 1 conserva una demostración previa de rechazo intencional y corrección: https://github.com/chocho2014/sqa-costos-demo/pull/1. El fallo previo fue una expectativa incorrecta Q32.00 para un total real Q33.00; luego se corrigió. Esa evidencia histórica no sustituye los reportes nuevos del CRUD.

La carpeta de entrega añade capturas y resultados fechados. La grabación MP4 de 4 a 5 minutos la realiza el estudiante con su voz; el guion se entrega por separado.

## Verificación del 26 de octubre

PR de la entrega: https://github.com/chocho2014/sqa-costos-demo/pull/2. Ejecución inicial aprobada: https://github.com/chocho2014/sqa-costos-demo/actions/runs/40338838654, con 22 pruebas aprobadas y seis jobs exitosos.

Se publicó el commit deliberadamente incorrecto 25a8321 esperando Q32.00. La ejecución https://github.com/chocho2014/sqa-costos-demo/actions/runs/40339214351 rechazó Test y Aceptacion, y omitió Entrega verificada. Se restaura Q33.00 en la corrección posterior, sin desactivar los controles.

Prueba manual de navegador realizada: crear Pieza A Q10 y Pieza B Q20, calcular flete Q3 y obtener Q33; editar nombre, refrescar y comprobar persistencia, eliminar Pieza B y comprobar su ausencia. Capturas conservadas en la entrega. Este recorrido manual no se presenta como E2E automatizado.
