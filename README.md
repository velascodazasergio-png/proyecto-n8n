# SmartCity-Fix 🏙️

**Sistema Inteligente de Diagnóstico y Enrutamiento de Reportes de Infraestructura Urbana**

> Plataforma frontend SaaS que permite a los ciudadanos reportar daños en infraestructura urbana. Los reportes son procesados por IA multimodal, enrutados automáticamente vía n8n y notificados por Telegram.

---

## 📸 Capturas de Pantalla

### 🌐 Página Web

**Hero & Landing**

![Hero - SmartCity-Fix](https://i.ibb.co/m55NzhgH/Captura-de-pantalla-2026-06-09-181523.png)

*Vista principal con estadísticas en tiempo real y tarjetas animadas.*

---

**Formulario de Reporte**

![Formulario de reporte ciudadano](https://i.ibb.co/nM5zQSWk/Captura-de-pantalla-2026-06-09-181640.png)

*Formulario avanzado con geolocalización, drag & drop de foto y validaciones en tiempo real.*

---

**Dashboard de Métricas**

![Dashboard de métricas](https://i.ibb.co/XrGcQdxj/Captura-de-pantalla-2026-06-09-181744.png)

*Panel con bar chart, donut chart y line chart en SVG puro mostrando reportes por categoría y estado.*

---

**Consulta de Estado de Ticket**

![Panel de consulta de ticket](https://i.ibb.co/LzHQ0HMF/Captura-de-pantalla-2026-06-09-181827.png)

*Módulo de seguimiento de reportes con ID de ticket y estado actual.*

---

### ⚙️ Flujo n8n

**Flujo completo de procesamiento**

![Flujo n8n - SmartCity-Fix](https://i.ibb.co/1JmNSQ60/Captura-de-pantalla-2026-06-09-181950.png)

*Pipeline completo: Webhook → Validación → Gemini Vision → Google Sheets → Telegram Bot.*

---

**Nodo de clasificación IA**

![Nodo clasificación IA en n8n](https://i.ibb.co/Wpx5nwTb/Captura-de-pantalla-2026-06-09-182153.png)

*Configuración del nodo de análisis de imagen con clasificación y priorización automática vía OpenRouter/Gemini.*

---

### 📱 Notificaciones Telegram

**Notificación de nuevo reporte**

![Telegram - Reporte recibido](https://i.ibb.co/7t2KTFmL/Captura-de-pantalla-2026-06-09-182230.png)

*Mensaje enviado al operador con tipo, prioridad, confianza IA y datos del ciudadano.*

---

## Estructura del Proyecto

```
smartcity-fix/
├── index.html          # Landing page completa (SPA)
├── css/
│   └── styles.css      # Estilos completos con CSS Custom Properties
├── js/
│   └── app.js          # Lógica JavaScript ES6+ (runtime)
├── ts/
│   └── app.ts          # Fuente TypeScript (compilar antes de deploy)
└── README.md
```

---

## Stack Tecnológico

| Capa        | Tecnología                                             |
|-------------|--------------------------------------------------------|
| Markup      | HTML5 semántico + ARIA                                 |
| Estilos     | CSS3 + Custom Properties + Grid/Flexbox                |
| Lógica      | JavaScript ES6+ / TypeScript                           |
| Íconos      | Remix Icons 4.2 (CDN)                                  |
| Tipografía  | Syne (display) + DM Sans (body) — Google Fonts         |

---

## Características

### UI/UX
- ✅ Diseño responsive: 320px · 480px · 768px · 1024px · 1440px
- ✅ Paleta Smart City / Gobierno Digital
- ✅ Animaciones fade-up, counters, progress bars, line/bar charts
- ✅ Navbar fija con scroll blur + active link tracking
- ✅ Loader inicial animado
- ✅ Toast notifications
- ✅ Accesibilidad: ARIA labels, roles, focus-visible, contraste

### Secciones
- ✅ Hero con tarjetas animadas y estadísticas en tiempo real
- ✅ Flujo de 6 pasos (Cómo Funciona)
- ✅ Formulario avanzado con validaciones TypeScript
- ✅ Geolocalización nativa del navegador
- ✅ Upload de foto con drag & drop y vista previa
- ✅ Panel de consulta de estado de ticket (mock data)
- ✅ Dashboard de métricas (bar chart, donut chart, line chart — SVG puro)
- ✅ Sección motor de IA con progress bars animadas
- ✅ Contacto y Footer completo

---

## Compilar TypeScript

```bash
# Instalar TypeScript globalmente (si no lo tienes)
npm install -g typescript

# Compilar
tsc ts/app.ts --target ES2020 --strict --outDir js/

# O con configuración
tsc --init   # genera tsconfig.json
tsc          # compila según tsconfig
```

**tsconfig.json recomendado:**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "strict": true,
    "outDir": "./js",
    "rootDir": "./ts",
    "lib": ["ES2020", "DOM"],
    "noUnusedLocals": true,
    "noUnusedParameters": true
  },
  "include": ["ts/**/*.ts"]
}
```

---

## Instalación y Uso

```bash
# Clona o descarga el proyecto
git clone https://github.com/tu-usuario/smartcity-fix.git
cd smartcity-fix

# Sirve localmente (cualquiera de estas opciones)
npx serve .
# o
python3 -m http.server 8080
# o
npx live-server
```

Abre `http://localhost:8080` en tu navegador.

---

## Integración Backend

El formulario está conectado a un backend n8n mediante `fetch`:

```javascript
// En app.js — función simulateSubmit()
const formData = new FormData(form);
const response = await fetch('https://tu-n8n.com/webhook/smartcity-fix', {
  method: 'POST',
  body: formData,
});
const data = await response.json();
```

### Flujo backend implementado:

1. **Webhook n8n** recibe `FormData` (campos + imagen en base64)
2. **Validación semántica** detecta palabras críticas y verifica campos
3. **Gemini 2.5 Flash** (vía OpenRouter) analiza la imagen → clasifica categoría, prioridad y spam
4. **Detección de duplicados** por radio de 20 metros contra Google Sheets
5. **Google Sheets** registra el reporte con ID de ticket y estado
6. **Telegram Bot** notifica al operador según nivel de confianza IA (alta / media / baja)
7. **Telegram Bot** confirma al ciudadano con su ticket ID
8. Retorna `{ ticketId, categoria, prioridad, confianza, duplicado }` al frontend

---

## ⚙️ Workflow n8n — Importar

> Copia el JSON de abajo y en n8n ve a **Workflows → Import from clipboard** para cargar el flujo completo.

<details>
<summary><strong>📋 Ver JSON del workflow (clic para expandir)</strong></summary>

```json
{
  "nodes": [
    {
      "parameters": {
        "url": "=https://sheets.googleapis.com/v4/spreadsheets/1dmzvnPmnqyxJwLrMBTvem3u0yuW8JiNiWJU-vqIfHhk/values/Hoja%201",
        "authentication": "predefinedCredentialType",
        "nodeCredentialType": "googleSheetsOAuth2Api",
        "options": { "timeout": 10000 }
      },
      "id": "579417d9-ab1f-4b84-a704-30d4af547f32",
      "name": "HTTP — Sheets Buscar Duplicados",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.4,
      "position": [5776, 1648],
      "credentials": { "googleSheetsOAuth2Api": { "id": "mijTwKDUbR6cFILO", "name": "Google Sheets account" } },
      "continueOnFail": true
    },
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "smartcity-fix",
        "responseMode": "responseNode",
        "options": { "allowedOrigins": "*" }
      },
      "id": "6b13e297-699b-4073-8073-0e52a648a326",
      "name": "Webhook — Recibir Reporte1",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 2,
      "position": [4080, 1536],
      "webhookId": "smartcity-fix-main"
    },
    {
      "parameters": {
        "jsCode": "const src = $input.item.json.body || $input.item.json;\nreturn [{\n  json: {\n    ticketId:     src.ticketId      || null,\n    nombre:       src.fullName      || null,\n    documento:    src.docId         || null,\n    telefono:     src.phone         || null,\n    correo:       src.email         || null,\n    tipo:         src.incidentType  || null,\n    descripcion:  src.description   || null,\n    latitud:      src.lat           || null,\n    longitud:     src.lng           || null,\n    direccion:    src.direccion     || null,\n    fechaEnvio:   src.fechaEnvio    || new Date().toISOString(),\n    imagenBase64: src.photoBase64   || null\n  }\n}];"
      },
      "id": "d03346cf-c41c-4039-acb2-744b12b7ad06",
      "name": "Code in JavaScript2",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [4320, 1536]
    },
    {
      "parameters": {
        "jsCode": "const desc   = $input.item.json.descripcion || '';\nconst tipo   = $input.item.json.tipo        || '';\nconst nombre = $input.item.json.nombre      || '';\nconst correo = $input.item.json.correo      || '';\n\nif (!nombre.trim() || !correo.trim() || !tipo || desc.trim().length < 20) {\n  return [{ json: {\n    ...$input.item.json,\n    errorValidacion:   'Campos obligatorios incompletos',\n    prioridadSemantica: 'Media',\n    escalaCritica:     false,\n    palabraCritica:    null,\n    timestampProceso:  new Date().toISOString()\n  }}];\n}\n\nconst emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$/;\nif (!emailRegex.test(correo.trim())) {\n  return [{ json: {\n    ...$input.item.json,\n    errorValidacion:   'Correo inválido',\n    prioridadSemantica: 'Media',\n    escalaCritica:     false,\n    palabraCritica:    null,\n    timestampProceso:  new Date().toISOString()\n  }}];\n}\n\nconst palabrasCriticas = ['gas','explosion','explosión','colegio','hospital','alto voltaje','emergencia','accidente','derrumbe','colapso','fuego','incendio','fuga de gas'];\nconst descLower         = desc.toLowerCase();\nconst palabraEncontrada = palabrasCriticas.find(p => descLower.includes(p));\nconst prioridadSemantica = palabraEncontrada ? 'Crítica' : 'Media';\nconst escalaCritica      = !!palabraEncontrada;\n\nreturn [{ json: { ...$input.item.json, prioridadSemantica, escalaCritica, palabraCritica: palabraEncontrada || null, timestampProceso: new Date().toISOString() } }];"
      },
      "id": "da822536-326b-45b8-94f7-06d999f214e1",
      "name": "Code — Validar y Análisis Semántico1",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [4624, 1552]
    },
    {
      "parameters": {
        "jsCode": "const data = $input.item.json;\nconst textPrompt = `Analiza esta imagen de infraestructura urbana colombiana. Responde SOLO con un objeto JSON válido, sin markdown, sin texto extra.\n\nFormato exacto:\n{\"categoria\": \"bache\", \"prioridad\": \"Alta\", \"confianza\": 85, \"esSpam\": false, \"explicacion\": \"Descripción breve\"}\n\nValores permitidos:\n- categoria: bache | fuga_agua | luminaria | semaforo | cableado | otro\n- prioridad: Crítica | Alta | Media | Baja\n- confianza: número entre 0 y 100\n- esSpam: true si la imagen NO muestra infraestructura urbana dañada\n\nTipo declarado: ${data.tipo}\nDescripción: ${data.descripcion}`;\n\nconst content = data.imagenBase64\n  ? [{ type: 'text', text: textPrompt }, { type: 'image_url', image_url: { url: data.imagenBase64 } }]\n  : `Analiza esta descripción de incidente urbano sin imagen disponible.\\n\\nTipo: ${data.tipo}\\nDescripción: ${data.descripcion}\\n\\nResponde SOLO con JSON: {\"categoria\":\"${data.tipo}\",\"prioridad\":\"Media\",\"confianza\":60,\"esSpam\":false,\"explicacion\":\"Sin imagen adjunta\"}`;\n\nconst body = { model: 'google/gemini-2.5-flash', max_tokens: 400, messages: [{ role: 'user', content }] };\nreturn [{ json: { ...data, openrouterBody: body } }];"
      },
      "id": "43e19247-5672-4bfa-8971-37b09037ab1d",
      "name": "Code in JavaScript3",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [4864, 1552]
    },
    {
      "parameters": {
        "method": "POST",
        "url": "https://openrouter.ai/api/v1/chat/completions",
        "sendHeaders": true,
        "headerParameters": { "parameters": [{ "name": "Authorization", "value": "Bearer TU_OPENROUTER_API_KEY" }] },
        "sendBody": true,
        "specifyBody": "json",
        "jsonBody": "={{ $json.openrouterBody }}",
        "options": { "timeout": 30000 }
      },
      "id": "22ee8c5c-7262-4d83-be9d-50b5e872621c",
      "name": "HTTP Request",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.4,
      "position": [5168, 1536],
      "continueOnFail": true
    },
    {
      "parameters": {
        "jsCode": "const rawResponse = $input.item.json;\nlet iaResult = { categoria: null, prioridad: 'Media', confianza: 0, esSpam: false, explicacion: 'IA no disponible' };\n\ntry {\n  const content = rawResponse.choices?.[0]?.message?.content || '';\n  const cleaned = content.replace(/```json|```/g, '').trim();\n  const jsonMatch = cleaned.match(/\\{[\\s\\S]*?\\}/);\n  if (jsonMatch) { iaResult = { ...iaResult, ...JSON.parse(jsonMatch[0]) }; }\n} catch (e) { console.log('Error parseando IA:', e.message); }\n\nconst nodoValidar = $('Code — Validar y Análisis Semántico1').item.json;\nconst prioridadSemantica = nodoValidar.prioridadSemantica || 'Media';\nconst prioridadMap = { 'Crítica': 4, 'Alta': 3, 'Media': 2, 'Baja': 1 };\nconst prioridadIA = iaResult.prioridad || 'Media';\nconst prioridadFinal = prioridadMap[prioridadSemantica] > prioridadMap[prioridadIA] ? prioridadSemantica : prioridadIA;\nconst confianza = iaResult.confianza || 0;\nconst nivelConfianza = confianza >= 75 ? 'alta' : confianza >= 45 ? 'media' : 'baja';\n\nreturn [{ json: { ...nodoValidar, iaCategoria: iaResult.categoria || nodoValidar.tipo, iaConfianza: confianza, iaEsSpam: iaResult.esSpam || false, iaExplicacion: iaResult.explicacion, prioridadFinal, nivelConfianza, categoriaFinal: iaResult.categoria || nodoValidar.tipo } }];"
      },
      "id": "a37fe59d-731b-4433-a324-985b738ff6f0",
      "name": "Code — Parsear Resultado IA",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [5376, 1552]
    },
    {
      "parameters": {
        "conditions": {
          "options": { "caseSensitive": true, "leftValue": "", "typeValidation": "strict", "version": 1 },
          "conditions": [{ "id": "spam-check", "leftValue": "={{ $json.iaEsSpam }}", "rightValue": true, "operator": { "type": "boolean", "operation": "equals" } }],
          "combinator": "and"
        },
        "options": {}
      },
      "id": "6d0be63d-59ca-4211-8c80-611fc710e3ac",
      "name": "IF — ¿Es Spam?1",
      "type": "n8n-nodes-base.if",
      "typeVersion": 2,
      "position": [5568, 1536]
    },
    {
      "parameters": {
        "respondWith": "json",
        "responseBody": "={{ JSON.stringify({ success: false, error: 'SPAM_DETECTED', message: 'La imagen no corresponde a un daño de infraestructura. Por favor sube una fotografía del incidente real.' }) }}",
        "options": { "responseCode": 400 }
      },
      "id": "af7d031a-1d62-4e30-ba25-20e83fa47e3d",
      "name": "Respond — Spam Rechazado1",
      "type": "n8n-nodes-base.respondToWebhook",
      "typeVersion": 1.1,
      "position": [5776, 1408]
    },
    {
      "parameters": {
        "jsCode": "const data = $('Code — Parsear Resultado IA').item.json;\nconst lat  = parseFloat(data.latitud  || 0);\nconst lng  = parseFloat(data.longitud || 0);\n\nlet existentes = [];\ntry { const sheetsData = $input.item.json; existentes = sheetsData.values || []; } catch(e) {}\n\nfunction distanciaMetros(lat1, lng1, lat2, lng2) {\n  const R    = 6371000;\n  const dLat = (lat2 - lat1) * Math.PI / 180;\n  const dLng = (lng2 - lng1) * Math.PI / 180;\n  const a    = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) * Math.sin(dLng/2)**2;\n  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));\n}\n\nlet esDuplicado = false;\nlet ticketDuplicado = null;\n\nif (lat && lng && existentes.length > 1) {\n  for (let i = 1; i < existentes.length; i++) {\n    const fila = existentes[i];\n    const filaLat = parseFloat(fila[8] || 0);\n    const filaLng = parseFloat(fila[9] || 0);\n    if (!filaLat || !filaLng) continue;\n    const dist = distanciaMetros(lat, lng, filaLat, filaLng);\n    if (dist <= 20) { esDuplicado = true; ticketDuplicado = fila[0]; break; }\n  }\n}\n\nreturn [{ json: { ...data, esDuplicado, ticketDuplicado } }];"
      },
      "id": "b35e2f6b-4f0e-455c-b9c3-192ea00b86c1",
      "name": "Code — Detectar Duplicados",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [6000, 1648]
    },
    {
      "parameters": {
        "operation": "append",
        "documentId": { "__rl": true, "value": "TU_SPREADSHEET_ID", "mode": "list", "cachedResultName": "Reportes" },
        "sheetName": { "__rl": true, "value": "gid=0", "mode": "list", "cachedResultName": "Hoja 1" },
        "columns": {
          "mappingMode": "defineBelow",
          "value": {
            "Ticket ID": "={{ $json.ticketId }}",
            "Fecha": "={{ new Date($json.fechaEnvio).toLocaleString('es-CO') }}",
            "Nombre": "={{ $json.nombre }}",
            "Documento": "={{ $json.documento }}",
            "Telefono": "={{ $json.telefono }}",
            "Correo": "={{ $json.correo }}",
            "Categoria": "={{ $json.categoriaFinal }}",
            "Descripcion": "={{ $json.descripcion }}",
            "Latitud": "={{ $json.latitud }}",
            "Longitud": "={{ $json.longitud }}",
            "Direccion": "={{ $json.direccion }}",
            "Severidad": "={{ $json.prioridadFinal }}",
            "Confianza IA": "={{ $json.iaConfianza }}",
            "Estado": "={{ $json.esDuplicado ? 'Duplicado' : 'Pendiente' }}",
            "Observaciones": "={{ $json.iaExplicacion }}"
          },
          "matchingColumns": [],
          "schema": []
        },
        "options": {}
      },
      "id": "3ad80c14-1e92-46a2-ba42-514c618b1f22",
      "name": "Google Sheets — Insertar Reporte",
      "type": "n8n-nodes-base.googleSheets",
      "typeVersion": 4.5,
      "position": [6224, 1648],
      "credentials": { "googleSheetsOAuth2Api": { "id": "mijTwKDUbR6cFILO", "name": "Google Sheets account" } }
    },
    {
      "parameters": {
        "rules": {
          "values": [
            { "conditions": { "options": { "caseSensitive": true, "leftValue": "", "typeValidation": "strict", "version": 1 }, "conditions": [{ "id": "alta-confianza", "leftValue": "=={{ $('Code — Parsear Resultado IA').item.json.nivelConfianza }}", "rightValue": "alta", "operator": { "type": "string", "operation": "equals" } }], "combinator": "and" }, "renameOutput": true, "outputKey": "0" },
            { "conditions": { "options": { "caseSensitive": true, "leftValue": "", "typeValidation": "strict", "version": 1 }, "conditions": [{ "id": "media-confianza", "leftValue": "=={{ $('Code — Parsear Resultado IA').item.json.nivelConfianza }}", "rightValue": "media", "operator": { "type": "string", "operation": "equals" } }], "combinator": "and" }, "renameOutput": true, "outputKey": "1" }
          ]
        },
        "options": { "fallbackOutput": "extra" }
      },
      "id": "5cc5f56e-dc9b-45b2-b297-29afcf7f45e0",
      "name": "Switch — Nivel de Confianza",
      "type": "n8n-nodes-base.switch",
      "typeVersion": 3,
      "position": [6448, 1648]
    },
    {
      "parameters": {
        "jsCode": "const data = $('Code — Detectar Duplicados').item.json;\nconst prioridadEmoji = { 'Crítica': '🚨', 'Alta': '⚠️', 'Media': '🔵', 'Baja': '🟢' };\nconst emoji = prioridadEmoji[data.prioridadFinal] || '📋';\nconst mapOrganismo = { bache: 'Secretaría de Infraestructura', fuga_agua: 'Empresa de Acueducto', semaforo: 'Secretaría de Movilidad', luminaria: 'Empresa de Energía', cableado: 'Empresa de Energía / SSPD', otro: 'Alcaldía Municipal' };\nconst organismo = mapOrganismo[data.categoriaFinal] || 'Alcaldía Municipal';\nconst mensaje = `${emoji} *NUEVO REPORTE — ALTA CONFIANZA*\\n\\n🎫 *Ticket:* \\`${data.ticketId}\\`\\n📍 *Tipo:* ${data.categoriaFinal?.toUpperCase()}\\n⚡ *Prioridad:* ${data.prioridadFinal}\\n🎯 *Confianza IA:* ${data.iaConfianza}%\\n📝 *Descripción:* ${data.descripcion?.substring(0, 200) || 'Sin descripción'}\\n🗺 *Ubicación:* ${data.direccion || `${data.latitud}, ${data.longitud}`}\\n👤 *Ciudadano:* ${data.nombre}\\n📞 *Teléfono:* ${data.telefono}\\n📧 *Correo:* ${data.correo}\\n🏢 *Organismo:* ${organismo}\\n\\n✅ Clasificado automáticamente por IA SmartCity-Fix`;\nreturn [{ json: { ...data, mensajeTelegram: mensaje, organismo } }];"
      },
      "id": "5c8c7d12-e9a0-4824-80bd-12f81e9da0dd",
      "name": "Code — Mensaje Alta Confianza",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [6672, 1472]
    },
    {
      "parameters": {
        "jsCode": "const data = $('Code — Detectar Duplicados').item.json;\nconst mensaje = `⚠️ *REPORTE — REVISIÓN REQUERIDA*\\n\\n🎫 *Ticket:* \\`${data.ticketId}\\`\\n📍 *Tipo declarado:* ${data.tipo}\\n📍 *Categoría IA:* ${data.iaCategoria}\\n🎯 *Confianza IA:* ${data.iaConfianza}% *(media — requiere revisión)*\\n📝 *Descripción:* ${data.descripcion?.substring(0, 150) || 'Sin descripción'}\\n🗺 *Ubicación:* ${data.direccion || `${data.latitud}, ${data.longitud}`}\\n👤 *Ciudadano:* ${data.nombre}\\n📞 *Teléfono:* ${data.telefono}\\n\\nPor favor valida este reporte antes de enrutar.`;\nreturn [{ json: { ...data, mensajeTelegram: mensaje, organismo: 'Supervisor de Turno' } }];"
      },
      "id": "43794e53-c86b-4d5f-b2cb-53839617320c",
      "name": "Code — Mensaje Confianza Media",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [6672, 1648]
    },
    {
      "parameters": {
        "jsCode": "const data = $('Code — Detectar Duplicados').item.json;\nconst mensaje = `🔴 *REPORTE — VALIDACIÓN MANUAL NECESARIA*\\n\\n🎫 *Ticket:* \\`${data.ticketId}\\`\\n🎯 *Confianza IA:* ${data.iaConfianza}% *(baja)*\\n📍 *Tipo declarado:* ${data.tipo}\\n📝 *Descripción:* ${data.descripcion?.substring(0, 100) || 'Sin descripción'}\\n🗺 *Ubicación:* ${data.direccion || `${data.latitud}, ${data.longitud}`}\\n👤 *Ciudadano:* ${data.nombre}\\n\\nLa IA no pudo clasificar con certeza. Revisión manual requerida.`;\nreturn [{ json: { ...data, mensajeTelegram: mensaje, organismo: 'Validación Manual' } }];"
      },
      "id": "15d7cdb3-c06b-4463-882e-d9c0292638ef",
      "name": "Code — Mensaje Baja Confianza",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [6672, 1824]
    },
    {
      "parameters": {
        "chatId": "=TU_TELEGRAM_CHAT_ID",
        "text": "={{ $json.mensajeTelegram }}",
        "additionalFields": { "disable_notification": false, "parse_mode": "Markdown" }
      },
      "id": "06f3b5a3-413e-4948-8e75-7199c4e6d3ba",
      "name": "Telegram — Notificar Operadores",
      "type": "n8n-nodes-base.telegram",
      "typeVersion": 1.2,
      "position": [6912, 1648],
      "credentials": { "telegramApi": { "id": "wtizxQmeBNZ42WaQ", "name": "Telegram account" } },
      "continueOnFail": true
    },
    {
      "parameters": {
        "jsCode": "const data = $('Code — Detectar Duplicados').item.json;\nconst emoji = { 'Crítica': '🚨', 'Alta': '⚠️', 'Media': '🔵', 'Baja': '🟢' }[data.prioridadFinal] || '📋';\nconst primerNombre = data.nombre ? data.nombre.split(' ')[0] : 'Ciudadano';\nconst msgCiudadano = `✅ *SmartCity-Fix — Reporte Recibido*\\n\\nHola ${primerNombre}, tu reporte fue registrado exitosamente.\\n\\n🎫 *Tu ticket:* \\`${data.ticketId}\\`\\n📍 *Tipo:* ${data.categoriaFinal}\\n${emoji} *Prioridad:* ${data.prioridadFinal}\\n📅 *Fecha:* ${new Date(data.fechaEnvio).toLocaleString('es-CO')}\\n\\n${data.esDuplicado ? '⚠️ *Nota:* Este incidente puede ser similar a uno ya reportado (' + data.ticketDuplicado + ')\\n\\n' : ''}📲 Guarda tu ticket para hacer seguimiento con:\\n\\`/ticket ${data.ticketId}\\`\\n\\nGracias por contribuir a una ciudad mejor 🏙️`;\nreturn [{ json: { ...data, msgCiudadano } }];"
      },
      "id": "c5bde79d-ff12-4af5-83f0-d24be2ed86cf",
      "name": "Code — Mensaje Ciudadano1",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [7184, 1648]
    },
    {
      "parameters": {
        "chatId": "=TU_TELEGRAM_CHAT_ID",
        "text": "={{ $json.msgCiudadano }}",
        "additionalFields": { "parse_mode": "Markdown" }
      },
      "id": "8e820db0-86e4-49be-9d5e-6b255f14bab9",
      "name": "Telegram — Confirmar al Ciudadano1",
      "type": "n8n-nodes-base.telegram",
      "typeVersion": 1.2,
      "position": [7408, 1648],
      "credentials": { "telegramApi": { "id": "wtizxQmeBNZ42WaQ", "name": "Telegram account" } },
      "continueOnFail": true
    },
    {
      "parameters": {
        "respondWith": "json",
        "responseBody": "={{ JSON.stringify({ success: true, ticketId: $json.ticketId, categoria: $json.categoriaFinal, prioridad: $json.prioridadFinal, confianza: $json.iaConfianza, duplicado: $json.esDuplicado, ticketDuplicado: $json.ticketDuplicado || null, message: 'Reporte recibido y procesado correctamente' }) }}",
        "options": { "responseCode": 200, "responseHeaders": { "entries": [{ "name": "Access-Control-Allow-Origin", "value": "*" }] } }
      },
      "id": "8c28d26f-8b01-4680-a581-6c9b9f7c6ea9",
      "name": "Respond — Éxito al Frontend1",
      "type": "n8n-nodes-base.respondToWebhook",
      "typeVersion": 1.1,
      "position": [7632, 1648]
    },
    {
      "parameters": { "path": "get-ticket", "responseMode": "responseNode", "options": { "allowedOrigins": "*" } },
      "id": "ff0b1ff9-e99b-45e2-91e0-f6adbe4eae00",
      "name": "Webhook — Consultar Ticket1",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 2,
      "position": [4208, 1984],
      "webhookId": "smartcity-fix-ticket"
    },
    {
      "parameters": {
        "conditions": {
          "options": { "caseSensitive": false, "leftValue": "", "typeValidation": "strict", "version": 1 },
          "conditions": [{ "leftValue": "={{ $json.headers['x-original-method'] ?? $json.method ?? '' }}", "rightValue": "OPTIONS", "operator": { "type": "string", "operation": "equals" } }],
          "combinator": "and"
        },
        "options": {}
      },
      "id": "17104939-ca01-48b2-af4e-f67795befb24",
      "name": "IF — Preflight OPTIONS1",
      "type": "n8n-nodes-base.if",
      "typeVersion": 2,
      "position": [4432, 1984]
    },
    {
      "parameters": {
        "respondWith": "json",
        "responseBody": "={}",
        "options": { "responseCode": 204, "responseHeaders": { "entries": [{ "name": "Access-Control-Allow-Origin", "value": "*" }, { "name": "Access-Control-Allow-Methods", "value": "GET, POST, OPTIONS" }, { "name": "Access-Control-Allow-Headers", "value": "Content-Type, Authorization, ngrok-skip-browser-warning" }] } }
      },
      "id": "343079de-0c4a-4011-affe-9b847ca1bec3",
      "name": "Respond — Preflight OK1",
      "type": "n8n-nodes-base.respondToWebhook",
      "typeVersion": 1.1,
      "position": [4656, 1840]
    },
    {
      "parameters": {
        "documentId": { "__rl": true, "value": "TU_SPREADSHEET_ID", "mode": "list", "cachedResultName": "Reportes" },
        "sheetName": { "__rl": true, "value": "gid=0", "mode": "list", "cachedResultName": "Hoja 1" },
        "filtersUI": { "values": [{ "lookupColumn": "Ticket ID", "lookupValue": "={{ $json.query.id }}" }] },
        "options": {}
      },
      "id": "1fa3930d-7c35-4213-b123-c31364370915",
      "name": "Google Sheets — Leer Ticket1",
      "type": "n8n-nodes-base.googleSheets",
      "typeVersion": 4.5,
      "position": [4656, 2128],
      "credentials": { "googleSheetsOAuth2Api": { "id": "mijTwKDUbR6cFILO", "name": "Google Sheets account" } }
    },
    {
      "parameters": {
        "respondWith": "json",
        "responseBody": "={{ JSON.stringify({ ticketId: $json['Ticket ID'], estado: $json['Estado'], categoria: $json['Categoria'], prioridad: $json['Severidad'], fecha: $json['Fecha'], confianza: $json['Confianza IA'], observaciones: $json['Observaciones'], descripcion: $json['Descripcion'] }) }}",
        "options": { "responseCode": 200, "responseHeaders": { "entries": [{ "name": "Access-Control-Allow-Origin", "value": "*" }] } }
      },
      "id": "dd68348e-6e78-4650-a080-e059b330da00",
      "name": "Respond — Datos del Ticket1",
      "type": "n8n-nodes-base.respondToWebhook",
      "typeVersion": 1.1,
      "position": [4880, 2128]
    },
    {
      "parameters": {
        "respondWith": "json",
        "responseBody": "={{ JSON.stringify($json) }}",
        "options": { "responseCode": 200, "responseHeaders": { "entries": [{ "name": "Access-Control-Allow-Origin", "value": "*" }] } }
      },
      "id": "bfcd1732-d091-49fc-83c7-a802edce3cbb",
      "name": "Respond — Métricas JSON",
      "type": "n8n-nodes-base.respondToWebhook",
      "typeVersion": 1.1,
      "position": [4864, 2336]
    },
    {
      "parameters": {
        "jsCode": "const items = $input.all();\nconst reportes = items.map(i => i.json);\nconst total = reportes.length;\nconst criticos  = reportes.filter(r => r['Severidad'] === 'Crítica').length;\nconst moderados = reportes.filter(r => r['Severidad'] === 'Alta').length;\nconst bajos     = reportes.filter(r => ['Media','Baja'].includes(r['Severidad'])).length;\nconst resueltos = reportes.filter(r => r['Estado'] === 'Resuelto').length;\nconst catMap = {};\nreportes.forEach(r => { const cat = r['Categoria'] || 'otro'; catMap[cat] = (catMap[cat] || 0) + 1; });\nconst categorias = Object.entries(catMap).map(([nombre, count]) => ({ nombre, count })).sort((a,b) => b.count - a.count).slice(0, 6);\nconst distribucion = [{ label: 'Crítico', value: criticos, color: '#EF4444' }, { label: 'Moderado', value: moderados, color: '#F59E0B' }, { label: 'Bajo', value: bajos, color: '#3B82F6' }, { label: 'Resuelto', value: resueltos, color: '#10B981' }].filter(d => d.value > 0);\nreturn [{ json: { total, criticos, moderados, bajos, resueltos, tiempoPromedio: '38 min', categorias, distribucion } }];"
      },
      "id": "b39f9f30-067f-460b-a4bf-b24d96be728d",
      "name": "Code — Calcular Métricas",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [4640, 2336]
    },
    {
      "parameters": {
        "documentId": { "value": "TU_SPREADSHEET_ID" },
        "sheetName": { "value": "Hoja 1" },
        "options": {}
      },
      "id": "3866a62a-0598-43bc-8756-b8effdf4f1ca",
      "name": "Google Sheets — Leer Todos para Métricas",
      "type": "n8n-nodes-base.googleSheets",
      "typeVersion": 4.5,
      "position": [4416, 2336],
      "credentials": { "googleSheetsOAuth2Api": { "id": "mijTwKDUbR6cFILO", "name": "Google Sheets account" } }
    },
    {
      "parameters": { "path": "get-metrics", "responseMode": "responseNode", "options": {} },
      "id": "567cc6ed-8ac9-46e6-879a-a2c6c1c29dc3",
      "name": "Webhook — Métricas Dashboard",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 2,
      "position": [4192, 2336],
      "webhookId": "smartcity-fix-metrics"
    }
  ],
  "connections": {
    "HTTP — Sheets Buscar Duplicados": { "main": [[{ "node": "Code — Detectar Duplicados", "type": "main", "index": 0 }]] },
    "Webhook — Recibir Reporte1": { "main": [[{ "node": "Code in JavaScript2", "type": "main", "index": 0 }]] },
    "Code in JavaScript2": { "main": [[{ "node": "Code — Validar y Análisis Semántico1", "type": "main", "index": 0 }]] },
    "Code — Validar y Análisis Semántico1": { "main": [[{ "node": "Code in JavaScript3", "type": "main", "index": 0 }]] },
    "Code in JavaScript3": { "main": [[{ "node": "HTTP Request", "type": "main", "index": 0 }]] },
    "HTTP Request": { "main": [[{ "node": "Code — Parsear Resultado IA", "type": "main", "index": 0 }]] },
    "Code — Parsear Resultado IA": { "main": [[{ "node": "IF — ¿Es Spam?1", "type": "main", "index": 0 }]] },
    "IF — ¿Es Spam?1": { "main": [[{ "node": "Respond — Spam Rechazado1", "type": "main", "index": 0 }], [{ "node": "HTTP — Sheets Buscar Duplicados", "type": "main", "index": 0 }]] },
    "Code — Detectar Duplicados": { "main": [[{ "node": "Google Sheets — Insertar Reporte", "type": "main", "index": 0 }]] },
    "Google Sheets — Insertar Reporte": { "main": [[{ "node": "Switch — Nivel de Confianza", "type": "main", "index": 0 }]] },
    "Switch — Nivel de Confianza": { "main": [[{ "node": "Code — Mensaje Alta Confianza", "type": "main", "index": 0 }], [{ "node": "Code — Mensaje Confianza Media", "type": "main", "index": 0 }], [{ "node": "Code — Mensaje Baja Confianza", "type": "main", "index": 0 }]] },
    "Code — Mensaje Alta Confianza": { "main": [[{ "node": "Telegram — Notificar Operadores", "type": "main", "index": 0 }]] },
    "Code — Mensaje Confianza Media": { "main": [[{ "node": "Telegram — Notificar Operadores", "type": "main", "index": 0 }]] },
    "Code — Mensaje Baja Confianza": { "main": [[{ "node": "Telegram — Notificar Operadores", "type": "main", "index": 0 }]] },
    "Telegram — Notificar Operadores": { "main": [[{ "node": "Code — Mensaje Ciudadano1", "type": "main", "index": 0 }]] },
    "Code — Mensaje Ciudadano1": { "main": [[{ "node": "Telegram — Confirmar al Ciudadano1", "type": "main", "index": 0 }]] },
    "Telegram — Confirmar al Ciudadano1": { "main": [[{ "node": "Respond — Éxito al Frontend1", "type": "main", "index": 0 }]] },
    "Webhook — Consultar Ticket1": { "main": [[{ "node": "IF — Preflight OPTIONS1", "type": "main", "index": 0 }]] },
    "IF — Preflight OPTIONS1": { "main": [[{ "node": "Respond — Preflight OK1", "type": "main", "index": 0 }], [{ "node": "Google Sheets — Leer Ticket1", "type": "main", "index": 0 }]] },
    "Google Sheets — Leer Ticket1": { "main": [[{ "node": "Respond — Datos del Ticket1", "type": "main", "index": 0 }]] },
    "Code — Calcular Métricas": { "main": [[{ "node": "Respond — Métricas JSON", "type": "main", "index": 0 }]] },
    "Google Sheets — Leer Todos para Métricas": { "main": [[{ "node": "Code — Calcular Métricas", "type": "main", "index": 0 }]] },
    "Webhook — Métricas Dashboard": { "main": [[{ "node": "Google Sheets — Leer Todos para Métricas", "type": "main", "index": 0 }]] }
  },
  "pinData": {},
  "meta": { "templateCredsSetupCompleted": true }
}
```

</details>

> ⚠️ **Antes de importar**, reemplaza los placeholders:
> - `TU_OPENROUTER_API_KEY` → tu clave de OpenRouter
> - `TU_SPREADSHEET_ID` → ID de tu Google Sheets
> - `TU_TELEGRAM_CHAT_ID` → chat ID del bot
> - Reconecta las credenciales de Google Sheets y Telegram en n8n

---

## Paleta de Colores

```css
--color-primary:   #0F172A   /* Fondo oscuro, navbar */
--color-secondary: #1E293B   /* Texto secundario */
--color-accent:    #3B82F6   /* Azul acción principal */
--color-success:   #10B981   /* Verde éxito */
--color-warning:   #F59E0B   /* Amarillo advertencia */
--color-danger:    #EF4444   /* Rojo error/crítico */
--color-bg:        #F8FAFC   /* Fondo general */
```

---

## Validaciones Implementadas

| Campo              | Validación                                |
|--------------------|-------------------------------------------|
| Nombre             | Requerido                                 |
| Documento          | Requerido                                 |
| Teléfono           | Requerido + formato `[+\d\s\-()]{7,20}`   |
| Correo             | Requerido + regex RFC 5322 simplificado   |
| Tipo de incidente  | Requerido (radio button)                  |
| Coordenadas        | Lat ∈ [-90,90] · Lng ∈ [-180,180]         |
| Fotografía         | Requerida · solo imágenes · máx. 10 MB    |
| Descripción        | Requerida · mínimo 20 caracteres          |

---

## Licencia

MIT — Proyecto académico / Open Source.

---

*Desarrollado con ❤️ para ciudades más inteligentes.*