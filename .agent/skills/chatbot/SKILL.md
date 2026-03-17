---
name: Conversational Chatbot & Lead Management
description: Skill para generar chatbots inteligentes con captura de leads, integraciones seguras de base de datos y paneles de visualización.
---

# Generación de Chatbots y Gestión de Leads

Esta skill permite al agente diseñar e implementar chatbots conversacionales premium con almacenamiento persistente y seguro de leads.

## 🛡️ Protocolo de Seguridad Mandatorio (Anti-Leaks)
Todo chatbot generado que utilice servicios en la nube (Firebase/Supabase) **DEBE** seguir estas reglas de seguridad para evitar la exposición pública de datos:

### 1. Reglas de Base de Datos (Firebase Firestore)
Nunca dejar las reglas en modo "test" (lectura/escritura abierta). Se deben implementar reglas granulares:
- **Escritura:** Permitida para cualquiera (para recibir leads).
- **Lectura/Update/Delete:** **ESTRICTAMENTE PROHIBIDA** para el público. Solo permitida para el Admin o mediante funciones seguras.
- **Ejemplo de Regla Segura:**
  ```javascript
  service cloud.firestore {
    match /databases/{database}/documents {
      match /real_estate_leads/{document} {
        allow create: if true; // Cualquiera puede enviar su info
        allow read, update, delete: if false; // Nadie puede listar o ver otros leads
      }
    }
  }
  ```

### 2. Seguridad en Supabase (PostgreSQL)
- **RLS (Row Level Security):** Debe estar siempre `ENABLED` en todas las tablas.
- **Políticas Públicas:** Solo crear políticas de `INSERT` si el chatbot escribe directo. Las políticas de `SELECT` deben estar restringidas a usuarios autenticados o roles específicos.
- **Tablas de Sistema:** Ocultar o proteger tablas internas (ej. `_keepalive`) activando RLS.

## 🎨 Diseño y Experiencia de Usuario (Aesthetics & UX)
- **Interfaz:** Seguir el estándar "Dark Mode" o "Glassmorphism" según el branding del cliente.
- **Micro-animaciones:** Usar indicadores de "escribiendo...", transiciones suaves de burbujas y botones interactivos.

### 🎭 Tonos Narrativos y Propósitos
El chatbot debe adaptar su personalidad según el objetivo del proyecto. Se definen 3 modos estándar:
1. **Modo Clínico / Empático:** (Ej. Salud Mental) Lenguaje cálido, validación emocional constante, uso de "nosotros" y frases de apoyo. Evita tecnicismos áridos.
2. **Modo Informativo / Corporativo:** (Ej. Trámites Gov) Lenguaje directo, estructurado y formal. Prioriza la velocidad de respuesta y la claridad en los pasos.
3. **Modo Conversacional / Gen-Z:** (Ej. Marketing/Leads) Lenguaje fresco, uso medido de emojis, tono cercano ("tú" en lugar de "usted") y micro-interacciones lúdicas.

### 🧠 Lenguaje Adaptativo
La respuesta del bot debe cambiar dinámicamente según el perfil capturado:
- **Personalización por Nombre:** Integrar el nombre del usuario en al menos el 30% de las frases posteriores a la captura.
- **Adaptación por Edad:** Ajustar referencias y nivel de formalidad según el rango detectado (ver abajo).

### 👥 Segmentación Demográfica (Age Ranges)
Para proyectos de impacto social o marketing, se deben usar rangos estandarizados para análisis posterior:
- **Adolescentes:** 12-14, 15-17 (Requieren tono más visual y validación).
- **Jóvenes Adultos:** 18-21, 22-25 (Tono directo y orientado a soluciones).
- **Adultos:** 26-29, 30+ (Tono más formal y profesional).

## 📊 Gestión de Leads y Calificación (Scoring)
- **Captura:** Nombre, Edad (Rango), Género, Ubicación y Medio de contacto.
- **Lead Scoring:** Asignar puntos automáticos basados en la interacción:
  - Pregunta por precio/servicios: +10 pts.
  - Detecta crisis/urgencia: +100 pts (Flag de Alerta).
  - Agenda cita/contacto: +50 pts.
- **Validación:** Implementar Regex para teléfonos y correos electrónicos.

## 📍 Geolocalización Inteligente (CP-Based)
Para chatbots que requieren ubicación precisa sin pedir coordenadas manuales (GPS), se utiliza la resolución por Código Postal (CP) con una API local fragmentada.

### 1. Arquitectura de Datos Fragmentada
Para evitar cargar bases de datos masivas (25MB+ de CP de México), se fragmenta la data en archivos JSON por prefijo (ej. `010.json`, `800.json`).
- **Ruta sugerida:** `/public/api/cp/[prefix].json`
- **Estructura JSON:**
  ```json
  {
    "01000": {
      "estado": "Ciudad de México",
      "municipio": "Álvaro Obregón",
      "colonias": ["San Ángel", "Los Alpes"],
      "coords": { "lat": 19.349, "lon": -99.193 }
    }
  }
  ```

### 2. Lógica de Resolución del Bot
El chatbot debe validar los 5 dígitos y resolver en tiempo real:
```javascript
async function resolveCP(cp) {
    if (!/^\d{5}$/.test(cp)) return null;
    const prefix = cp.substring(0, 3);
    const response = await fetch(`./api/cp/${prefix}.json`);
    const data = await response.json();
    return data[cp] || null; // Retorna data + coords
}
```

## 🗺️ Dashboards y Visualización Geográfica (Leaflet)
Al proyectar leads en un mapa, la estética y la precisión son críticas para la percepción del cliente.

### 1. Estética de Marcadores (Premium Look)
Evitar marcadores (pins) predeterminados. Usar `circleMarkers` minimalistas:
- **Radio:** 3.5 a 5 píxeles.
- **Borde:** Blanco (#fff), weight 0.5 a 1.
- **Opacidad:** Alta (0.9 - 1) para que los puntos pequeños no se pierdan.

### 2. Gestión de Capas y Rendimiento
- Utilizar `L.layerGroup()` para manejar los marcadores.
- **Mandatorio:** Llamar a `layerGroup.clearLayers()` antes de cada actualización para evitar duplicidad de puntos y fugas de memoria.

### 3. Dispersión Automática (Anti-Overlapping)
Si muchos leads vienen de una misma ciudad (misma coordenada central), se debe aplicar "Jittering" (dispersión aleatoria leve) para que el usuario pueda percibir la densidad de casos:
```javascript
if (isMockData) {
    lat += (Math.random() - 0.5) * 0.4; // Dispersión de ~40km aprox
    lon += (Math.random() - 0.5) * 0.4;
}
```

## 🧪 Seeding con Datos Reales para Demos
Para presentaciones con clientes, nunca usar puntos al azar en el océano. 
- **Estrategia:** Seleccionar aleatoriamente un prefijo de CP real (ej. `010`, `450`, `800`), cargar su JSON y elegir una coordenada real de la base de datos para el caso de prueba.

## 🛠️ Entregables y Mantenimiento
1. **Script de Verificación de Leads:** Un script Python/Node para que el cliente pueda consultar sus prospectos de forma privada.
2. **Dashboard de Visualización:** Página protegida con Leaflet.js para monitoreo geográfico nacional. Ver patrones avanzados en [Advanced Dashboard Skill](file:///c:/Users/Juan/.gemini/antigravity/scratch/agency_web/.agent/skills/dashboard/SKILL.md).
3. **Procesador de CP:** Script `process_cp.js` que convierta archivos de texto SEPOMEX a la estructura JSON fragmentada.
4. **Guía de Configuración:** Documentar las credenciales y cómo rotar las API Keys si es necesario.
