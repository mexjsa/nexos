---
name: Document Management System (DMS) Generation
description: Skill para generar sistemas de gestión documental ligeros con roles, paneles administrativos y cálculos de moneda automáticos, diseñados para entrega local al cliente.
---

# Generación de Sistemas de Gestión Documental (DMS)

Esta skill permite al agente generar rápidamente aplicaciones web para la gestión de archivos (PDF/XML) siguiendo el patrón de diseño "YRDoc".

## 🛠️ Stack Tecnológico Mandatorio
- **Backend:** Node.js + Express.
- **Base de Datos:** SQLite (via `better-sqlite3`).
- **Frontend:** Vanilla JS (app.js) + CSS (Premium Dark Mode) + HTML5.
- **Autenticación:** Sesiones de Express (`express-session`) + `bcryptjs`.

## 📋 Requisitos de la Skill

### 1. Gestión de Roles
Todo sistema DMS generado debe soportar al menos dos niveles de usuario:
- **Admin Maestro:** Control total (Lectura, Escritura, Borrado, Gestión de Usuarios/Catálogos).
- **Admin Consulta:** Permiso de lectura de documentos y dashboard, pero sin botones de edición/borrado.
- **Middleware:** Usar `requireAuth` para proteger rutas y verificar `req.session.rol`.

### 2. Dashboard y Acceso Controlado
- El inicio de sesión es obligatorio.
- El Dashboard es la vista principal exclusiva para perfiles administrativos.
- Debe mostrar estadísticas clave (Total documentos, vencimientos próximos, estados).

### 3. Lógica de Moneda Automática
Cuando el sistema maneje montos económicos:
- Admitir campos: `Moneda`, `Importe Original`, `Tipo de Cambio (TC)` e `Importe Total (MXN)`.
- **Cálculo:** `Total = Original * TC`.
- **Regla MXN:** Si la moneda es local (MXN), el TC se fija en 1.0000 y se bloquea la edición.
- El valor final en MXN es el que se usa para sumatorias y reportes del Dashboard.

### 4. Estructura de Almacenamiento
Organizar archivos en el disco de forma jerárquica:
`[RAIZ] / [CATEGORIA/PROVEEDOR] / [ENTIDAD/CONTRATO] / [SUB-ENTIDAD/PERIODO] / archivo.pdf`
- Usar `multer` con `diskStorage` dinámico para crear las carpetas al vuelo.

### 5. Transferencia al Cliente (Entregable Final)
Cada proyecto debe incluir:
- **iniciar_sistema.bat:** Script para que el cliente arranque el servidor con doble clic.
- **Guía de Instalación:** Manual con requisitos (Node.js) y configuración de rutas.
- **Configurable:** Ruta raíz de documentos en un archivo `config.js` externo.

## 🚀 Instrucciones de Ejecución
Al activar esta skill para un nuevo cliente:
1. Estudiar los tipos de documentos y entidades (ej. Proveedores/Contratos).
2. Generar el esquema de BD en `db.js`.
3. Implementar el Frontend con un diseño oscuro, profesional y con micro-animaciones.
4. Validar los cálculos de moneda antes de la entrega final.
5. Generar el entregable (`.bat` de inicio + guía de instalación).
6. Lanzar preview con ngrok para validación del cliente (ver sección 6).

### 6. Preview para el Cliente vía ngrok (ANTES de entregar el ZIP)

Antes de entregar el sistema, el cliente debe poder revisarlo y dar observaciones. Para esto se usa **ngrok** (gratuito), que expone el servidor local a una URL pública temporal.

**Requisitos:**
- ngrok instalado (`winget install ngrok.ngrok`)
- Cuenta gratuita en [ngrok.com](https://ngrok.com) y authtoken configurado:
  ```
  ngrok config add-authtoken <TOKEN_DEL_CLIENTE>
  ```

**Entregable: `iniciar_preview_ngrok.bat`**

Cada proyecto DMS debe incluir este script que:
1. Cierra instancias previas del servidor y ngrok (evita conflictos de puerto)
2. Arranca el servidor Node.js en segundo plano
3. Abre el túnel ngrok apuntando al puerto del sistema
4. **Muestra y copia al portapapeles** la URL pública para enviar al cliente
5. Al cerrarse, apaga todo limpiamente (servidor + ngrok)

**Plantilla del script** (ajustar `PORT` y `NGROK_PATH` según el proyecto):
```bat
@echo off
title [NOMBRE_SISTEMA] - Preview Cliente (ngrok)
REM Matar instancias previas
powershell -Command "Get-NetTCPConnection -LocalPort [PORT] -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }"
powershell -Command "Get-NetTCPConnection -LocalPort 4040 -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }"
timeout /t 1 >nul
REM Arrancar servidor y ngrok
start "Server" /min node server.js
timeout /t 2 >nul
start "ngrok" /min "%TEMP%\ngrok_latest\ngrok.exe" http [PORT]
timeout /t 4 >nul
REM Mostrar URL publica
powershell -Command "$url = (Invoke-RestMethod http://127.0.0.1:4040/api/tunnels -TimeoutSec 5).tunnels[0].public_url; Write-Host $url -ForegroundColor Green; Set-Clipboard $url"
echo (URL copiada al portapapeles. Cierra esta ventana para apagar todo.)
pause
powershell -Command "Get-NetTCPConnection -LocalPort [PORT] -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }"
powershell -Command "Get-NetTCPConnection -LocalPort 4040 -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }"
```

**Notas importantes:**
- La URL de ngrok **cambia cada vez** que se reinicia (plan gratuito). Hay que reenviarla al cliente.
- Los datos (SQLite + archivos) persisten en la máquina local entre sesiones.
- El cliente accede mientras la PC anfitriona esté encendida y el `.bat` activo.
