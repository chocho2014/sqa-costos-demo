# Reporte de mejora

| Métrica | Antes | Después local Node 24.19.0 |
|---|---:|---:|
| Aprobados | 14 | 22 |
| Fallidos | 2 | 0 |
| Omitidos | 0 | 0 |
| Líneas y sentencias | 67.41 % | 91.71 % |
| Funciones | 52.38 % | 76.66 % |
| Ramas | 97.02 % | 93.57 % |
| Errores estáticos | 0 | 0 |
| Code smells configurados | 1 | 0 |
| Duplicación | 0 % | 0 % |

Las líneas aumentaron 24.30 puntos y las funciones 24.28 puntos. Las ramas disminuyeron 3.45 puntos; la refactorización y la instrumentación de más funciones cambiaron el denominador. Se conserva el resultado real y se informa esa limitación: no todas las métricas mejoraron y los porcentajes no prueban ausencia de defectos.

Se corrigió la publicación estática, se separó agrupación del cálculo, se agregaron pruebas de persistencia SQLite entre reaperturas y recorridos HTTP CRUD, y se probaron el render inicial React y el manejo de errores del cliente. La UI conserva ramas y funciones sin ejecutar; consultar la cobertura por archivo.

## Deuda técnica
| ID | Pendiente | Prioridad | Criterio de cierre |
|---|---|---|---|
| DT01 | Eventos React completos con navegador | Alta | Crear, editar, eliminar y calcular automatizados en navegador |
| DT02 | Revisión humana independiente | Alta | Aprobación de otra persona registrada en PR |
| DT03 | Endurecimiento para despliegue público | Alta antes de publicar | Autenticación, autorización, HTTPS y política operativa |
| DT04 | Evolución de SQLite experimental | Media | Fijar y verificar versión de Node o usar motor estable equivalente |

El alcance académico se ejecuta localmente; DT03 no se omite para desplegarla como servicio abierto. La entrega continua produce un artefacto verificado, no un despliegue automático de producción.
