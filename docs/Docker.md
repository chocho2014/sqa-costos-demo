# Ejecución y verificación con Docker

## Alcance
Se contiene únicamente la adaptación pública sqa-costos-demo. Atlas ERP y su base XAMPP no se migran ni se modifican. Docker Desktop o Docker Engine con Compose v2 debe estar iniciado. La imagen base oficial Node 24 Bookworm slim se fija mediante digest SHA256 para repetir la construcción.

## Arrancar
```powershell
docker compose -p sqa-entrega up -d --build
docker compose -p sqa-entrega ps
```
Abrir http://127.0.0.1:3100. El puerto se publica solo en la computadora local. No se publica en la red ni en un servidor remoto. No hay pago por alojar la demo localmente.

El Dockerfile tiene una etapa de compilación Vite y otra de ejecución con dependencias de producción. El proceso usa el usuario node sin privilegios de root, sin capacidades adicionales. El healthcheck consulta GET /api/productos. HOST=0.0.0.0 es necesario dentro del contenedor, mientras Compose limita el acceso externo a 127.0.0.1.

## Persistencia
El volumen sqa-entrega_sqa-datos se monta en /app/data y conserva catalogo.sqlite cuando se reinicia o se recrea el contenedor. Detener con docker compose -p sqa-entrega down conserva el volumen. No usar down -v para mantenimiento normal, porque elimina los datos del volumen. Para respaldar SQLite, detener el servicio antes de copiar el archivo.

## Verificación automática
```powershell
node quality/docker-smoke.cjs
```
La prueba crea un producto ficticio, lo edita, reinicia exclusivamente el servicio sqa del proyecto sqa-entrega, verifica que conserva los cambios, elimina su propio registro y comprueba que la interfaz React compilada se sirve. Escribe artifacts/docker-smoke.json. No es una prueba de clics E2E ni una prueba de carga.

GitHub Actions incorpora el job Contenedor Docker. Construye, arranca, ejecuta la prueba, publica evidencia y detiene su contenedor. La entrega y la aceptación dependen de su éxito. Si el motor local está apagado, iniciarlo antes de ejecutar los comandos; no modificar otros proyectos Docker.

## Consultar y detener
```powershell
docker compose -p sqa-entrega logs --tail 50
docker compose -p sqa-entrega stop
```
Para reanudar: docker compose -p sqa-entrega start. Esta configuración académica no representa un despliegue de producción con autenticación, HTTPS y respaldos operativos.
