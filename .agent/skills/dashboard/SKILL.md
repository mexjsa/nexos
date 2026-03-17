---
name: Advanced Analytics & Geographic Dashboards
description: Skill para el diseño y desarrollo de dashboards inteligentes de analítica geográfica y operativa. Incluye patrones de filtrado avanzado, gestión de operadores y visualización de diversidad.
---

# Dashboards Inteligentes y Analítica Avanzada

Esta skill define los estándares para crear paneles de administración premium que permitan la toma de decisiones basada en datos geográficos, demográficos y operativos.

## 🗺️ Filtrado Geográfico Inteligente (Smart Geo-Filters)
Los dashboards deben permitir una navegación fluida por el territorio nacional mediante filtros en cascada y zoom dinámico.

### 1. Filtros en Cascada (State-Muni Cascade)
El selector de municipios debe actualizarse dinámicamente según el estado seleccionado para evitar ruido y errores de usuario.
- **Estado:** Se llena con los valores únicos del dataset.
- **Municipio:** Se filtra reactivamente al cambiar el estado.

### 2. Zoom Dinámico y Adaptativo
El mapa debe reaccionar a los filtros seleccionados para centrar la atención del usuario.
- **Nivel Estado:** Zoom intermedio (ej. nivel 7) centrado en el promedio de coordenadas del estado.
- **Nivel Municipio:** Zoom detallado (ej. nivel 10) centrado en la zona específica.
- **Reset:** Al limpiar filtros, el mapa debe regresar suavemente a la vista nacional (ej. México: `[23.6345, -102.5528]`, zoom 5).

### 3. Buscador por Código Postal (CP)
Implementar un campo de texto especializado para búsqueda por CP exacto o parcial, conectando la tabla de registros con los marcadores del mapa.

## 📊 Métricas Interactivas (Card-Based Filtering)
Las tarjetas de resumen (KPIs) no deben ser estáticas; deben actuar como selectores de estado para el dashboard completo.

### 1. Filtrado por Riesgo/Estatus
Al hacer clic en una tarjeta de métrica (ej. "Alertas Rojas"), el dashboard debe entrar en "Modo Filtrado":
- **UI:** Añadir una clase `.active` con borde de color y una etiqueta de "FILTRANDO".
- **Sincronización:** Filtrar tanto la tabla como el mapa en un solo ciclo (función `applyFilters`).
- **Toggle:** Un segundo clic en la misma tarjeta debe limpiar el filtro.

### 2. Visualización de Diversidad e Inclusión
Las métricas de género deben ser exhaustivas y visualmente sensibles:
- **Categorías:** Mujeres (👩), Hombres (👨), No-Binario (🏳️‍🌈), Otros/No especificado (🐼).
- **Interactividad:** Los iconos de género dentro de las tarjetas deben ser clickeables para permitir micro-filtros demográficos.

## 👨‍💼 Gestión Operativa de Administradores
Para sistemas que requieren trazabilidad de atención, se debe implementar una gestión de operadores con IDs permanentes.

### 1. IDs Secuenciales por Rol
Los IDs de operador deben ser persistentes y descriptivos según la especialidad:
- **Psicólogos (PS):** PS0001, PS0002...
- **Trabajadores Sociales (TS):** TS0001...
- **Lógica:** Calcular el siguiente número basado en el conteo actual de operadores de ese tipo específico en la base de datos (evitar duplicados tras eliminaciones).

### 2. Asignación de Operador por Defecto
En datasets de prueba o fases iniciales, asignar un operador "Master" o un ID secuencial automático a cada registro para asegurar que la columna nunca esté vacía.

## 🎨 Estándares de Interfaz (Premium UI)
- **Glassmorphism:** Usar fondos con `backdrop-filter: blur()` y bordes sutiles.
- **Micro-interacciones:** Transiciones de 0.3s en hovers, cambios de filtro y acercamientos de mapa.
- **Feedback Visual:** Uso de semáforos de color consistentes (Rojo para urgencia, Naranja para prevención, Verde para bienestar).

## 👤 Navegación de Usuario y Perfil Premium (User Hub)
La navegación superior no debe ser solo un encabezado, sino un centro de control de identidad y herramientas.

### 1. Centro de Identidad y Tiempo (Clock & Identity)
- **Reloj en Tiempo Real:** Mostrar la hora local de forma prominente pero sutil (ej. `03:45 AM`) con una tipografía limpia como Inter.
- **Jerarquía de Contexto:** Ubicar la ciudad y fecha debajo del reloj con un tamaño de fuente reducido y color atenuado para no sobrecargar la vista.
- **Perfil de Usuario:** Incluir avatar circular con indicador de estado (punto verde), nombre y rol, encapsulados en un contenedor tipo "pastilla" (pill-shaped) con efecto glassmorphism.

### 2. Controles de Acción (Grey-Scale Aesthetic)
Para evitar la fatiga visual y competencia con el mapa:
- **Botones de Opción:** Usar una paleta de grises y blancos (`#f8fafc`).
- **Estados de Animación:** Los iconos deben estar en escala de grises al 70% de opacidad, activándose a color y escala completa únicamente en el *hover*.
- **Funcionalidad Integrada:** El botón de herramientas debe estar conectado a utilidades de exportación (ej. `window.print()` para reportes).

### 3. Optimización de Espacio Vertical (Spatial Efficiency)
En dashboards de alta densidad de datos, cada pixel vertical cuenta:
- **Proporción del Mapa:** El mapa debe ocupar la mayor proporción posible de la vista principal (ej. ~68vh) para permitir una exploración cómoda.
- **Compactación de Cabeceras:** Minimizar márgenes entre el título institucional y los contenedores de visualización.
- **Consistencia de Datos en Tablas:** Asegurar que los nombres de las pruebas diagnósticas sean precisos (ej. PHQ9 en lugar de PHQ3) y que los estados (Badges) tengan un ancho fijo para evitar saltos de línea.
