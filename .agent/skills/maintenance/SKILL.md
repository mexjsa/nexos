---
name: System & Project Maintenance
description: Skill para limpieza periódica de proyectos y carpetas personales (Descargas/Downloads). Filtra por antigüedad (3 meses), tamaño y tipo de archivo (setups y comprimidos grandes).
---

# Mantenimiento de Temas e Infraestructura Personal

Esta skill está diseñada para mantener el equipo de Juan en condiciones óptimas, eliminando "basura digital" en proyectos y carpetas de sistema.

## 🛠️ Procedimiento de Limpieza

### 1. Limpieza de Proyectos (Temas y Assets)
Antes de proceder con archivos personales, esta skill audita los proyectos activos en el workspace (`agency_web`, `ligamx_model`):
- **Identificar Backups Obsoletos:** Buscar archivos del tipo `index_backup_*.html` y `style_backup_*.css` que no se hayan usado recientemente.
- **Auditar Assets Pesados:** Localizar imágenes (`.jpg`, `.png`, `.mp4`) en carpetas de `assets` que no tengan referencias en el código fuente.
- **Eliminar Logs:** Borrar archivos `.log`, `chrome_args.txt` y otros residuos de depuración.

### 2. Limpieza de Carpeta de Descargas (`Downloads`)
La skill escanea la carpeta `%USERPROFILE%\Downloads` con los siguientes criterios:
- **Antigüedad:** Archivos no accedidos o modificados en los últimos **90 días (3 meses)**.
- **Setups Grandes:** Filtro por extensión `.exe`, `.msi`, `.dmg`, `.pkg`, `.zip`, `.rar`, `.7z` que superen los **5MB**.
- **Telegram Desktop:** Se aplica la misma lógica a los archivos dentro de la subcarpeta `Telegram Desktop`.

### 3. Auditoría de Aplicaciones y Recursos (RAM/Disco)
La skill realiza un análisis del sistema para identificar consumidores ocultos:
- **Detección de Juegos y Apps Ocultas:** Cruce de datos entre el registro de Windows y el uso real en disco (especialmente juegos de Steam/Xbox que no reportan tamaño real).
- **Consumo de Memoria (RAM):** Identificación de procesos "vampiro" (Steam Web Helpers, Microsoft Edge, SQL Server) que no se estén usando activamente para el desarrollo.
- **Cachés de AppData:** Revisión de carpetas de datos de aplicaciones (WhatsApp, Spotify, etc.) que crecen de forma desproporcionada.

### 4. Reporte previo al borrado
**CRÍTICO:** Antes de ejecutar cualquier borrado masivo o desinstalación, la skill DEBE generar un resumen detallado que incluya:
- Cantidad de archivos a eliminar.
- Espacio total estimado a liberar.
- Lista de los procesos pesados/juegos identificados.

---

## 💻 Scripts y Herramientas
La skill utiliza un script de PowerShell centralizado en `scripts/cleanup.ps1` para realizar el filtrado seguro.

### Ejemplo de uso del script:
```powershell
./scripts/cleanup.ps1 -DryRun $true
```

### Reglas de Seguridad:
1. **Nunca borrar archivos en `.git` o `.agent`.**
2. **Ignorar archivos de configuración crítica (`.env`, `package.json`).**
3. **Respetar la carpeta "Telegram Desktop" como entidad.**
