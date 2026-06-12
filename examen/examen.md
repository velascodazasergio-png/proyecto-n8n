# SmartCity-Fix 🏙️

**Sistema Inteligente de Diagnóstico y Enrutamiento de Reportes de Infraestructura Urbana**

> Plataforma frontend SaaS que permite a los ciudadanos reportar daños en infraestructura urbana. Los reportes son procesados por IA multimodal, enrutados automáticamente vía n8n y notificados por Telegram.

---

## 📸 Capturas de Pantalla

### ⚙️ Flujo n8n

**Flujo completo de procesamiento**

![Flujo n8n - SmartCity-Fix](https://i.ibb.co/ymLQ6bZR/Captura-de-pantalla-2026-06-12-133718.png)

*Pipeline completo: Webhook → Validación → Gemini Vision → Google Sheets → Telegram Bot.*

---

### 📱 Notificaciones Telegram

**Notificación de nuevo reporte**

![Telegram - Reporte recibido](https://i.ibb.co/5XwwFYcW/Captura-de-pantalla-2026-06-12-133559.png)

*Mensaje enviado al operador con tipo, prioridad, confianza IA y datos del ciudadano.*
---
## Marcado de Emergencia⚠️
![Telegram - Reporte recibido](https://i.ibb.co/Xhq3mTc/Captura-de-pantalla-2026-06-12-133929.png)
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
        "jsCode": "const d = $input.item.json;\nconst ubicacion = d.direccion || (d.latitud + ', ' + d.longitud) || 'No disponible';\nconst fecha = d.fechaEnvio ? new Date(d.fechaEnvio).toLocaleString('es-CO') : 'No disponible';\nconst msg = `⚠️ *SmartCity\\-Fix — Error en procesamiento automático de infraestructura*\n\n🎫 *Ticket:* \\`${d.ticketId}\\`\n👤 *Ciudadano:* ${d.nombre}\n📍 *Tipo declarado:* ${d.tipo}\n🗺 *Ubicación:* ${ubicacion}\n📅 *Fecha:* ${fecha}\n\n🔴 *Motivo:* Fallo en API de visión artificial \\(OpenRouter/Gemini\\) o en Google Sheets\\.\nEl reporte fue registrado con estado *PENDIENTE \\- FALLO TÉCNICO*\\.\n\n⚠️ Error en procesamiento automático de infraestructura\\. Caso enviado a revisión y asignación manual\\.\n\n👉 Accede a la hoja y asigna manualmente el caso\\.`;\nreturn [{ json: { ...d, mensajeFallo: msg } }];"
      },
      "id": "f0b59eb1-2465-4cb4-a1a2-d8abeedb37b1",
      "name": "Code — Mensaje Fallo Técnico",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [
        9440,
        4336
      ],
      "continueOnFail": true
    },
    {
      "parameters": {
        "path": "get-ticket",
        "responseMode": "responseNode",
        "options": {
          "allowedOrigins": "*"
        }
      },
      "id": "99404f1e-904b-4d69-8704-7a7f157a960e",
      "name": "Webhook — Consultar Ticket",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 2,
      "position": [
        7504,
        5232
      ],
      "webhookId": "smartcity-fix-ticket"
    },
    {
      "parameters": {
        "conditions": {
          "options": {
            "caseSensitive": false,
            "leftValue": "",
            "typeValidation": "strict",
            "version": 1
          },
          "conditions": [
            {
              "leftValue": "={{ $json.headers['x-original-method'] ?? $json.method ?? '' }}",
              "rightValue": "OPTIONS",
              "operator": {
                "type": "string",
                "operation": "equals"
              }
            }
          ],
          "combinator": "and"
        },
        "options": {}
      },
      "id": "8334807a-ddd7-417c-aa3e-63ea9ced1e4b",
      "name": "IF — Preflight OPTIONS",
      "type": "n8n-nodes-base.if",
      "typeVersion": 2,
      "position": [
        7728,
        5232
      ]
    },
    {
      "parameters": {
        "respondWith": "json",
        "responseBody": "={}",
        "options": {
          "responseCode": 204,
          "responseHeaders": {
            "entries": [
              {
                "name": "Access-Control-Allow-Origin",
                "value": "*"
              },
              {
                "name": "Access-Control-Allow-Methods",
                "value": "GET, POST, OPTIONS"
              },
              {
                "name": "Access-Control-Allow-Headers",
                "value": "Content-Type, Authorization, ngrok-skip-browser-warning"
              }
            ]
          }
        }
      },
      "id": "7cfdaf2c-296c-454d-9145-f5b4e6949d48",
      "name": "Respond — Preflight OK",
      "type": "n8n-nodes-base.respondToWebhook",
      "typeVersion": 1.1,
      "position": [
        8000,
        5104
      ]
    },
    {
      "parameters": {
        "documentId": {
          "__rl": true,
          "value": "1dmzvnPmnqyxJwLrMBTvem3u0yuW8JiNiWJU-vqIfHhk",
          "mode": "list",
          "cachedResultName": "Reportes",
          "cachedResultUrl": "https://docs.google.com/spreadsheets/d/1dmzvnPmnqyxJwLrMBTvem3u0yuW8JiNiWJU-vqIfHhk/edit?usp=drivesdk"
        },
        "sheetName": {
          "__rl": true,
          "value": "gid=0",
          "mode": "list",
          "cachedResultName": "Hoja 1",
          "cachedResultUrl": "https://docs.google.com/spreadsheets/d/1dmzvnPmnqyxJwLrMBTvem3u0yuW8JiNiWJU-vqIfHhk/edit#gid=0"
        },
        "filtersUI": {
          "values": [
            {
              "lookupColumn": "Ticket ID",
              "lookupValue": "={{ $json.query.id }}"
            }
          ]
        },
        "options": {}
      },
      "id": "bf69a463-3f59-433b-af1e-d2d21e9026d9",
      "name": "Google Sheets — Leer Ticket",
      "type": "n8n-nodes-base.googleSheets",
      "typeVersion": 4.5,
      "position": [
        7952,
        5376
      ],
      "retryOnFail": true,
      "credentials": {
        "googleSheetsOAuth2Api": {
          "id": "mijTwKDUbR6cFILO",
          "name": "Google Sheets account"
        }
      },
      "continueOnFail": true
    },
    {
      "parameters": {
        "respondWith": "json",
        "responseBody": "={{ JSON.stringify({ ticketId: $json['Ticket ID'], estado: $json['Estado'], categoria: $json['Categoria'], prioridad: $json['Severidad'], fecha: $json['Fecha'], confianza: $json['Confianza IA'], observaciones: $json['Observaciones'], descripcion: $json['Descripcion'] }) }}",
        "options": {
          "responseCode": 200,
          "responseHeaders": {
            "entries": [
              {
                "name": "Access-Control-Allow-Origin",
                "value": "*"
              }
            ]
          }
        }
      },
      "id": "e80be8fb-aa89-4092-8872-f0e65dad4bec",
      "name": "Respond — Datos del Ticket",
      "type": "n8n-nodes-base.respondToWebhook",
      "typeVersion": 1.1,
      "position": [
        8176,
        5376
      ]
    },
    {
      "parameters": {
        "respondWith": "json",
        "responseBody": "={{ JSON.stringify($json) }}",
        "options": {
          "responseCode": 200,
          "responseHeaders": {
            "entries": [
              {
                "name": "Access-Control-Allow-Origin",
                "value": "*"
              }
            ]
          }
        }
      },
      "id": "cc0a409b-b805-4f5c-bbed-c611871d5d0e",
      "name": "Respond — Métricas JSON1",
      "type": "n8n-nodes-base.respondToWebhook",
      "typeVersion": 1.1,
      "position": [
        8160,
        5584
      ]
    },
    {
      "parameters": {
        "jsCode": "const items = $input.all();\nconst reportes = items.map(i => i.json);\nconst total = reportes.length;\nconst criticos  = reportes.filter(r => r['Severidad'] === 'Crítica').length;\nconst moderados = reportes.filter(r => r['Severidad'] === 'Alta').length;\nconst bajos     = reportes.filter(r => ['Media','Baja'].includes(r['Severidad'])).length;\nconst resueltos = reportes.filter(r => r['Estado'] === 'Resuelto').length;\nconst catMap = {};\nreportes.forEach(r => { const cat = r['Categoria'] || 'otro'; catMap[cat] = (catMap[cat] || 0) + 1; });\nconst categorias = Object.entries(catMap).map(([nombre, count]) => ({ nombre, count })).sort((a,b) => b.count - a.count).slice(0, 6);\nconst distribucion = [\n  { label: 'Crítico',  value: criticos,  color: '#EF4444' },\n  { label: 'Moderado', value: moderados, color: '#F59E0B' },\n  { label: 'Bajo',     value: bajos,     color: '#3B82F6' },\n  { label: 'Resuelto', value: resueltos, color: '#10B981' }\n].filter(d => d.value > 0);\nreturn [{ json: { total, criticos, moderados, bajos, resueltos, tiempoPromedio: '38 min', categorias, distribucion } }];"
      },
      "id": "0cf20d4c-065f-4dca-b9da-58eec2970df3",
      "name": "Code — Calcular Métricas1",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [
        7936,
        5584
      ]
    },
    {
      "parameters": {
        "documentId": {
          "value": "1dmzvnPmnqyxJwLrMBTvem3u0yuW8JiNiWJU-vqIfHhk"
        },
        "sheetName": {
          "value": "Hoja 1"
        },
        "options": {}
      },
      "id": "76bd662b-9538-42dc-841d-5441041c8d75",
      "name": "Google Sheets — Leer Todos para Métricas1",
      "type": "n8n-nodes-base.googleSheets",
      "typeVersion": 4.5,
      "position": [
        7712,
        5584
      ],
      "retryOnFail": true,
      "credentials": {
        "googleSheetsOAuth2Api": {
          "id": "mijTwKDUbR6cFILO",
          "name": "Google Sheets account"
        }
      },
      "continueOnFail": true
    },
    {
      "parameters": {
        "path": "get-metrics",
        "responseMode": "responseNode",
        "options": {}
      },
      "id": "b3cadd87-2c15-4b57-91a7-c6ac42964bbe",
      "name": "Webhook — Métricas Dashboard1",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 2,
      "position": [
        7488,
        5584
      ],
      "webhookId": "smartcity-fix-metrics"
    },
    {
      "parameters": {
        "url": "=https://sheets.googleapis.com/v4/spreadsheets/1dmzvnPmnqyxJwLrMBTvem3u0yuW8JiNiWJU-vqIfHhk/values/Hoja%201",
        "authentication": "predefinedCredentialType",
        "nodeCredentialType": "googleSheetsOAuth2Api",
        "options": {
          "timeout": 10000
        }
      },
      "id": "fd740a33-4f8a-475b-b138-9130f31c56f9",
      "name": "HTTP — Sheets Buscar Duplicados1",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.4,
      "position": [
        9488,
        4784
      ],
      "retryOnFail": true,
      "credentials": {
        "googleSheetsOAuth2Api": {
          "id": "mijTwKDUbR6cFILO",
          "name": "Google Sheets account"
        }
      },
      "continueOnFail": true
    },
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "smartcity-fix",
        "responseMode": "responseNode",
        "options": {
          "allowedOrigins": "*"
        }
      },
      "id": "c47f3acc-6b58-4d94-9a23-39381d6635ad",
      "name": "Webhook — Recibir Reporte",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 2,
      "position": [
        7792,
        4672
      ],
      "webhookId": "smartcity-fix-main"
    },
    {
      "parameters": {
        "jsCode": "const src = $input.item.json.body || $input.item.json;\nreturn [{\n  json: {\n    ticketId:     src.ticketId      || null,\n    nombre:       src.fullName      || null,\n    documento:    src.docId         || null,\n    telefono:     src.phone         || null,\n    correo:       src.email         || null,\n    tipo:         src.incidentType  || null,\n    descripcion:  src.description   || null,\n    latitud:      src.lat           || null,\n    longitud:     src.lng           || null,\n    direccion:    src.direccion     || null,\n    fechaEnvio:   src.fechaEnvio    || new Date().toISOString(),\n    imagenBase64: src.photoBase64   || null\n  }\n}];"
      },
      "id": "7c4594fc-e105-4fc1-ae1b-d8f37fee8f97",
      "name": "Code in JavaScript",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [
        8032,
        4672
      ]
    },
    {
      "parameters": {
        "jsCode": "const desc   = $input.item.json.descripcion || '';\nconst tipo   = $input.item.json.tipo        || '';\nconst nombre = $input.item.json.nombre      || '';\nconst correo = $input.item.json.correo      || '';\n\nif (!nombre.trim() || !correo.trim() || !tipo || desc.trim().length < 20) {\n  return [{ json: {\n    ...$input.item.json,\n    errorValidacion:   'Campos obligatorios incompletos',\n    prioridadSemantica: 'Media',\n    escalaCritica:     false,\n    palabraCritica:    null,\n    timestampProceso:  new Date().toISOString()\n  }}];\n}\n\nconst emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$/;\nif (!emailRegex.test(correo.trim())) {\n  return [{ json: {\n    ...$input.item.json,\n    errorValidacion:   'Correo inválido',\n    prioridadSemantica: 'Media',\n    escalaCritica:     false,\n    palabraCritica:    null,\n    timestampProceso:  new Date().toISOString()\n  }}];\n}\n\nconst palabrasCriticas = [\n  'gas','explosion','explosión','colegio','hospital',\n  'alto voltaje','emergencia','accidente','derrumbe',\n  'colapso','fuego','incendio','fuga de gas'\n];\nconst descLower        = desc.toLowerCase();\nconst palabraEncontrada = palabrasCriticas.find(p => descLower.includes(p));\n\nconst prioridadSemantica = palabraEncontrada ? 'Crítica' : 'Media';\nconst escalaCritica      = !!palabraEncontrada;\n\nreturn [{ json: {\n  ...$input.item.json,\n  prioridadSemantica,\n  escalaCritica,\n  palabraCritica:   palabraEncontrada || null,\n  timestampProceso: new Date().toISOString()\n}}];"
      },
      "id": "491cb75e-e4a2-4563-82b4-19152eaf6906",
      "name": "Code — Validar y Análisis Semántico",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [
        8336,
        4688
      ]
    },
    {
      "parameters": {
        "jsCode": "const data = $input.item.json;\n\nconst textPrompt = `Analiza esta imagen de infraestructura urbana colombiana. Responde SOLO con un objeto JSON válido, sin markdown, sin texto extra.\n\nFormato exacto:\n{\"categoria\": \"bache\", \"prioridad\": \"Alta\", \"confianza\": 85, \"esSpam\": false, \"explicacion\": \"Descripción breve\"}\n\nValores permitidos:\n- categoria: bache | fuga_agua | luminaria | semaforo | cableado | otro\n- prioridad: Crítica | Alta | Media | Baja\n- confianza: número entre 0 y 100\n- esSpam: true si la imagen NO muestra infraestructura urbana dañada\n\nTipo declarado: ${data.tipo}\nDescripción: ${data.descripcion}`;\n\nconst content = data.imagenBase64\n  ? [\n      { type: 'text', text: textPrompt },\n      { type: 'image_url', image_url: { url: data.imagenBase64 } }\n    ]\n  : `Analiza esta descripción de incidente urbano sin imagen disponible.\\n\\nTipo: ${data.tipo}\\nDescripción: ${data.descripcion}\\n\\nResponde SOLO con JSON: {\"categoria\":\"${data.tipo}\",\"prioridad\":\"Media\",\"confianza\":60,\"esSpam\":false,\"explicacion\":\"Sin imagen adjunta\"}`;\n\nconst body = {\n  model: 'google/gemini-2.5-flash',\n  max_tokens: 400,\n  messages: [{ role: 'user', content }]\n};\n\nreturn [{ json: { ...data, openrouterBody: body } }];"
      },
      "id": "0f58c909-e514-4ac8-9d83-7435b0705dac",
      "name": "Code in JavaScript4",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [
        8576,
        4688
      ]
    },
    {
      "parameters": {
        "method": "POST",
        "url": "https://openrouter.ai/api/v1/chat/completions",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            {
              "name": "Authorization",
              "value": "Bearer "
            }
          ]
        },
        "sendBody": true,
        "specifyBody": "json",
        "jsonBody": "={{ $json.openrouterBody }}",
        "options": {
          "timeout": 30000
        }
      },
      "id": "5c46edcb-18f9-44c0-929a-d86212ff556f",
      "name": "HTTP Request1",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.4,
      "position": [
        8752,
        4688
      ],
      "retryOnFail": true,
      "maxTries": 3,
      "waitBetweenTries": 2000,
      "continueOnFail": true,
      "onError": "continueErrorOutput"
    },
    {
      "parameters": {
        "jsCode": "// ═══ PARSEO IA — con detección de fallo técnico ═══\nconst rawResponse = $input.item.json;\nlet iaResult = { categoria: null, prioridad: 'Media', confianza: 0, esSpam: false, explicacion: 'IA no disponible' };\nlet iaFallo = false;\n\ntry {\n  // Si el nodo anterior llegó por el output de error, choices no existirá\n  const content = rawResponse.choices?.[0]?.message?.content || '';\n  if (!content.trim()) {\n    iaFallo = true;\n  } else {\n    const cleaned = content.replace(/```json|```/g, '').trim();\n    const jsonMatch = cleaned.match(/\\{[\\s\\S]*?\\}/);\n    if (jsonMatch) {\n      const parsed = JSON.parse(jsonMatch[0]);\n      iaResult = { ...iaResult, ...parsed };\n    } else {\n      iaFallo = true;\n    }\n  }\n} catch (e) {\n  iaFallo = true;\n  console.log('Error parseando IA:', e.message);\n}\n\n// Si confianza = 0 y categoria nula => también es fallo\nif (iaResult.confianza === 0 && !iaResult.categoria) {\n  iaFallo = true;\n}\n\nconst nodoValidar = $('Code — Validar y Análisis Semántico').item.json;\nconst prioridadSemantica = nodoValidar.prioridadSemantica || 'Media';\nconst prioridadMap = { 'Crítica': 4, 'Alta': 3, 'Media': 2, 'Baja': 1 };\nconst prioridadIA = iaResult.prioridad || 'Media';\nconst prioridadFinal = prioridadMap[prioridadSemantica] > prioridadMap[prioridadIA] ? prioridadSemantica : prioridadIA;\n\nconst confianza = iaResult.confianza || 0;\nconst nivelConfianza = confianza >= 75 ? 'alta' : confianza >= 45 ? 'media' : 'baja';\n\nreturn [{ json: {\n  ...nodoValidar,\n  iaCategoria:    iaResult.categoria || nodoValidar.tipo,\n  iaConfianza:    confianza,\n  iaEsSpam:       iaResult.esSpam || false,\n  iaExplicacion:  iaResult.explicacion,\n  iaFallo,\n  prioridadFinal,\n  nivelConfianza,\n  categoriaFinal: iaResult.categoria || nodoValidar.tipo\n} }];"
      },
      "id": "017b6a0f-ddcb-4689-a894-8810c2a7945f",
      "name": "Code — Parsear Resultado IA1",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [
        8944,
        4688
      ],
      "continueOnFail": true
    },
    {
      "parameters": {
        "conditions": {
          "options": {
            "caseSensitive": true,
            "leftValue": "",
            "typeValidation": "strict",
            "version": 1
          },
          "conditions": [
            {
              "id": "ia-fallo-check",
              "leftValue": "={{ $json.iaFallo }}",
              "rightValue": true,
              "operator": {
                "type": "boolean",
                "operation": "equals"
              }
            }
          ],
          "combinator": "and"
        },
        "options": {}
      },
      "id": "84b8fda0-0808-4299-b43f-89ace42c80ef",
      "name": "IF — ¿Falló la IA?1",
      "type": "n8n-nodes-base.if",
      "typeVersion": 2,
      "position": [
        9104,
        4688
      ],
      "continueOnFail": true
    },
    {
      "parameters": {
        "operation": "append",
        "documentId": {
          "__rl": true,
          "value": "1dmzvnPmnqyxJwLrMBTvem3u0yuW8JiNiWJU-vqIfHhk",
          "mode": "list",
          "cachedResultName": "Reportes",
          "cachedResultUrl": "https://docs.google.com/spreadsheets/d/1dmzvnPmnqyxJwLrMBTvem3u0yuW8JiNiWJU-vqIfHhk/edit?usp=drivesdk"
        },
        "sheetName": {
          "__rl": true,
          "value": "gid=0",
          "mode": "list",
          "cachedResultName": "Hoja 1",
          "cachedResultUrl": "https://docs.google.com/spreadsheets/d/1dmzvnPmnqyxJwLrMBTvem3u0yuW8JiNiWJU-vqIfHhk/edit#gid=0"
        },
        "columns": {
          "mappingMode": "defineBelow",
          "value": {
            "Ticket ID": "={{ $json.ticketId }}",
            "Fecha": "={{ new Date($json.fechaEnvio).toLocaleString('es-CO') }}",
            "Nombre": "={{ $json.nombre }}",
            "Documento": "={{ $json.documento }}",
            "Telefono": "={{ $json.telefono }}",
            "Correo": "={{ $json.correo }}",
            "Categoria": "={{ $json.tipo || 'Sin clasificar' }}",
            "Descripcion": "={{ $json.descripcion }}",
            "Latitud": "={{ $json.latitud }}",
            "Longitud": "={{ $json.longitud }}",
            "Direccion": "={{ $json.direccion }}",
            "Severidad": "={{ $json.prioridadSemantica || 'Media' }}",
            "Confianza IA": "=0",
            "Estado": "PENDIENTE - FALLO TÉCNICO",
            "Observaciones": "Fallo en API de visión artificial o Google Sheets. Requiere clasificación y asignación manual."
          },
          "matchingColumns": [],
          "schema": [
            {
              "id": "Ticket ID",
              "displayName": "Ticket ID",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true
            },
            {
              "id": "Fecha",
              "displayName": "Fecha",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true
            },
            {
              "id": "Nombre",
              "displayName": "Nombre",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true
            },
            {
              "id": "Documento",
              "displayName": "Documento",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true
            },
            {
              "id": "Telefono",
              "displayName": "Telefono",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true
            },
            {
              "id": "Correo",
              "displayName": "Correo",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true
            },
            {
              "id": "Categoria",
              "displayName": "Categoria",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true
            },
            {
              "id": "Descripcion",
              "displayName": "Descripcion",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true
            },
            {
              "id": "Latitud",
              "displayName": "Latitud",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true
            },
            {
              "id": "Longitud",
              "displayName": "Longitud",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true
            },
            {
              "id": "Direccion",
              "displayName": "Direccion",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true
            },
            {
              "id": "Severidad",
              "displayName": "Severidad",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true
            },
            {
              "id": "Confianza IA",
              "displayName": "Confianza IA",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true
            },
            {
              "id": "Estado",
              "displayName": "Estado",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true
            },
            {
              "id": "Observaciones",
              "displayName": "Observaciones",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true
            }
          ],
          "attemptToConvertTypes": false,
          "convertFieldsToString": false
        },
        "options": {}
      },
      "id": "1c7b1144-7915-4f94-a42c-c63aa4078413",
      "name": "Sheets — Insertar Fallo Técnico1",
      "type": "n8n-nodes-base.googleSheets",
      "typeVersion": 4.5,
      "position": [
        9568,
        4528
      ],
      "retryOnFail": true,
      "maxTries": 3,
      "waitBetweenTries": 2000,
      "credentials": {
        "googleSheetsOAuth2Api": {
          "id": "mijTwKDUbR6cFILO",
          "name": "Google Sheets account"
        }
      },
      "continueOnFail": true,
      "onError": "continueRegularOutput"
    },
    {
      "parameters": {
        "chatId": "=8546238882",
        "text": "={{ $json.mensajeFallo }}",
        "additionalFields": {
          "disable_notification": false,
          "parse_mode": "Markdown"
        }
      },
      "id": "635359b9-3d7e-4365-bc2f-6d8f19271323",
      "name": "Telegram — Alerta Fallo Técnico1",
      "type": "n8n-nodes-base.telegram",
      "typeVersion": 1.2,
      "position": [
        9696,
        4336
      ],
      "webhookId": "b9019f4b-a29e-4cc6-9571-db074d841ffa",
      "credentials": {
        "telegramApi": {
          "id": "wtizxQmeBNZ42WaQ",
          "name": "Telegram account"
        }
      },
      "continueOnFail": true
    },
    {
      "parameters": {
        "respondWith": "json",
        "responseBody": "={{ JSON.stringify({ success: true, ticketId: $json.ticketId, message: 'Tu reporte fue recibido. Está siendo procesado manualmente por nuestro equipo técnico.', estado: 'PENDIENTE - REVISIÓN MANUAL' }) }}",
        "options": {
          "responseCode": 200,
          "responseHeaders": {
            "entries": [
              {
                "name": "Access-Control-Allow-Origin",
                "value": "*"
              }
            ]
          }
        }
      },
      "id": "fa098e19-a418-4374-8028-8f1f13177e67",
      "name": "Respond — Contingencia al Frontend1",
      "type": "n8n-nodes-base.respondToWebhook",
      "typeVersion": 1.1,
      "position": [
        9920,
        4480
      ]
    },
    {
      "parameters": {
        "jsCode": "const data = $('Code — Parsear Resultado IA1').item.json;\nconst lat  = parseFloat(data.latitud  || 0);\nconst lng  = parseFloat(data.longitud || 0);\n\nlet existentes = [];\ntry {\n  const sheetsData = $input.item.json;\n  existentes = sheetsData.values || [];\n} catch(e) {}\n\nfunction distanciaMetros(lat1, lng1, lat2, lng2) {\n  const R    = 6371000;\n  const dLat = (lat2 - lat1) * Math.PI / 180;\n  const dLng = (lng2 - lng1) * Math.PI / 180;\n  const a    = Math.sin(dLat/2)**2\n             + Math.cos(lat1*Math.PI/180)\n             * Math.cos(lat2*Math.PI/180)\n             * Math.sin(dLng/2)**2;\n  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));\n}\n\nlet esDuplicado    = false;\nlet ticketDuplicado = null;\n\nif (lat && lng && existentes.length > 1) {\n  for (let i = 1; i < existentes.length; i++) {\n    const fila    = existentes[i];\n    const filaLat = parseFloat(fila[8] || 0);\n    const filaLng = parseFloat(fila[9] || 0);\n    if (!filaLat || !filaLng) continue;\n    const dist = distanciaMetros(lat, lng, filaLat, filaLng);\n    if (dist <= 20) {\n      esDuplicado     = true;\n      ticketDuplicado = fila[0];\n      break;\n    }\n  }\n}\n\nreturn [{ json: { ...data, esDuplicado, ticketDuplicado } }];"
      },
      "id": "8ad29c23-b87f-4f3e-b7b5-189dbb61996c",
      "name": "Code — Detectar Duplicados1",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [
        9712,
        4784
      ]
    },
    {
      "parameters": {
        "operation": "append",
        "documentId": {
          "__rl": true,
          "value": "1dmzvnPmnqyxJwLrMBTvem3u0yuW8JiNiWJU-vqIfHhk",
          "mode": "list",
          "cachedResultName": "Reportes",
          "cachedResultUrl": "https://docs.google.com/spreadsheets/d/1dmzvnPmnqyxJwLrMBTvem3u0yuW8JiNiWJU-vqIfHhk/edit?usp=drivesdk"
        },
        "sheetName": {
          "__rl": true,
          "value": "gid=0",
          "mode": "list",
          "cachedResultName": "Hoja 1",
          "cachedResultUrl": "https://docs.google.com/spreadsheets/d/1dmzvnPmnqyxJwLrMBTvem3u0yuW8JiNiWJU-vqIfHhk/edit#gid=0"
        },
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
          "schema": [
            {
              "id": "Ticket ID",
              "displayName": "Ticket ID",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true
            },
            {
              "id": "Fecha",
              "displayName": "Fecha",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true
            },
            {
              "id": "Nombre",
              "displayName": "Nombre",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true
            },
            {
              "id": "Documento",
              "displayName": "Documento",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true
            },
            {
              "id": "Telefono",
              "displayName": "Telefono",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true
            },
            {
              "id": "Correo",
              "displayName": "Correo",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true
            },
            {
              "id": "Categoria",
              "displayName": "Categoria",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true
            },
            {
              "id": "Descripcion",
              "displayName": "Descripcion",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true
            },
            {
              "id": "Latitud",
              "displayName": "Latitud",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true
            },
            {
              "id": "Longitud",
              "displayName": "Longitud",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true
            },
            {
              "id": "Direccion",
              "displayName": "Direccion",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true
            },
            {
              "id": "Severidad",
              "displayName": "Severidad",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true
            },
            {
              "id": "Confianza IA",
              "displayName": "Confianza IA",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true
            },
            {
              "id": "Estado",
              "displayName": "Estado",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true
            },
            {
              "id": "Observaciones",
              "displayName": "Observaciones",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true
            }
          ],
          "attemptToConvertTypes": false,
          "convertFieldsToString": false
        },
        "options": {}
      },
      "id": "18b1f2a6-3d52-4701-8691-6f089c12c14c",
      "name": "Google Sheets — Insertar Reporte1",
      "type": "n8n-nodes-base.googleSheets",
      "typeVersion": 4.5,
      "position": [
        9936,
        4784
      ],
      "retryOnFail": true,
      "maxTries": 3,
      "waitBetweenTries": 2000,
      "credentials": {
        "googleSheetsOAuth2Api": {
          "id": "mijTwKDUbR6cFILO",
          "name": "Google Sheets account"
        }
      },
      "continueOnFail": true,
      "onError": "continueRegularOutput"
    },
    {
      "parameters": {
        "rules": {
          "values": [
            {
              "conditions": {
                "options": {
                  "caseSensitive": true,
                  "leftValue": "",
                  "typeValidation": "strict",
                  "version": 1
                },
                "conditions": [
                  {
                    "id": "alta-confianza",
                    "leftValue": "=={{ $('Code — Parsear Resultado IA1').item.json.nivelConfianza }}",
                    "rightValue": "alta",
                    "operator": {
                      "type": "string",
                      "operation": "equals"
                    }
                  }
                ],
                "combinator": "and"
              },
              "renameOutput": true,
              "outputKey": "0"
            },
            {
              "conditions": {
                "options": {
                  "caseSensitive": true,
                  "leftValue": "",
                  "typeValidation": "strict",
                  "version": 1
                },
                "conditions": [
                  {
                    "id": "media-confianza",
                    "leftValue": "=={{ $('Code — Parsear Resultado IA1').item.json.nivelConfianza }}",
                    "rightValue": "media",
                    "operator": {
                      "type": "string",
                      "operation": "equals"
                    }
                  }
                ],
                "combinator": "and"
              },
              "renameOutput": true,
              "outputKey": "1"
            }
          ]
        },
        "options": {
          "fallbackOutput": "extra"
        }
      },
      "id": "51513296-0e9a-449e-b76e-8c934df14826",
      "name": "Switch — Nivel de Confianza1",
      "type": "n8n-nodes-base.switch",
      "typeVersion": 3,
      "position": [
        10160,
        4784
      ]
    },
    {
      "parameters": {
        "jsCode": "const data = $('Code — Detectar Duplicados1').item.json;\nconst prioridadEmoji = { 'Crítica': '🚨', 'Alta': '⚠️', 'Media': '🔵', 'Baja': '🟢' };\nconst emoji = prioridadEmoji[data.prioridadFinal] || '📋';\nconst mapOrganismo = { bache: 'Secretaría de Infraestructura', fuga_agua: 'Empresa de Acueducto', semaforo: 'Secretaría de Movilidad', luminaria: 'Empresa de Energía', cableado: 'Empresa de Energía / SSPD', otro: 'Alcaldía Municipal' };\nconst organismo = mapOrganismo[data.categoriaFinal] || 'Alcaldía Municipal';\nconst mensaje = `${emoji} *NUEVO REPORTE — ALTA CONFIANZA*\n\n🎫 *Ticket:* \\`${data.ticketId}\\`\n📍 *Tipo:* ${data.categoriaFinal?.toUpperCase()}\n⚡ *Prioridad:* ${data.prioridadFinal}\n🎯 *Confianza IA:* ${data.iaConfianza}%\n📝 *Descripción:* ${data.descripcion?.substring(0, 200) || 'Sin descripción'}\n🗺 *Ubicación:* ${data.direccion || `${data.latitud}, ${data.longitud}`}\n👤 *Ciudadano:* ${data.nombre}\n📞 *Teléfono:* ${data.telefono}\n📧 *Correo:* ${data.correo}\n🏢 *Organismo:* ${organismo}\n\n✅ Clasificado automáticamente por IA SmartCity-Fix`;\nreturn [{ json: { ...data, mensajeTelegram: mensaje, organismo } }];"
      },
      "id": "6285fb41-9f50-4b08-a994-dffd0b79fa6d",
      "name": "Code — Mensaje Alta Confianza1",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [
        10384,
        4608
      ]
    },
    {
      "parameters": {
        "jsCode": "const data = $('Code — Detectar Duplicados1').item.json;\nconst mensaje = `⚠️ *REPORTE — REVISIÓN REQUERIDA*\n\n🎫 *Ticket:* \\`${data.ticketId}\\`\n📍 *Tipo declarado:* ${data.tipo}\n📍 *Categoría IA:* ${data.iaCategoria}\n🎯 *Confianza IA:* ${data.iaConfianza}% *(media — requiere revisión)*\n📝 *Descripción:* ${data.descripcion?.substring(0, 150) || 'Sin descripción'}\n🗺 *Ubicación:* ${data.direccion || `${data.latitud}, ${data.longitud}`}\n👤 *Ciudadano:* ${data.nombre}\n📞 *Teléfono:* ${data.telefono}\n\nPor favor valida este reporte antes de enrutar.`;\nreturn [{ json: { ...data, mensajeTelegram: mensaje, organismo: 'Supervisor de Turno' } }];"
      },
      "id": "88b412ea-101a-4fd8-9454-46d1ef8ae65e",
      "name": "Code — Mensaje Confianza Media1",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [
        10384,
        4784
      ]
    },
    {
      "parameters": {
        "jsCode": "const data = $('Code — Detectar Duplicados1').item.json;\nconst mensaje = `🔴 *REPORTE — VALIDACIÓN MANUAL NECESARIA*\n\n🎫 *Ticket:* \\`${data.ticketId}\\`\n🎯 *Confianza IA:* ${data.iaConfianza}% *(baja)*\n📍 *Tipo declarado:* ${data.tipo}\n📝 *Descripción:* ${data.descripcion?.substring(0, 100) || 'Sin descripción'}\n🗺 *Ubicación:* ${data.direccion || `${data.latitud}, ${data.longitud}`}\n👤 *Ciudadano:* ${data.nombre}\n\nLa IA no pudo clasificar con certeza. Revisión manual requerida.`;\nreturn [{ json: { ...data, mensajeTelegram: mensaje, organismo: 'Validación Manual' } }];"
      },
      "id": "fecc4735-9c79-496a-babe-3996fb26e288",
      "name": "Code — Mensaje Baja Confianza1",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [
        10384,
        4960
      ]
    },
    {
      "parameters": {
        "chatId": "=8546238882",
        "text": "={{ $json.mensajeTelegram }}",
        "additionalFields": {
          "disable_notification": false,
          "parse_mode": "Markdown"
        }
      },
      "id": "cb1655d0-5c51-4a0d-a4fa-ffcfb88ec753",
      "name": "Telegram — Notificar Operadores1",
      "type": "n8n-nodes-base.telegram",
      "typeVersion": 1.2,
      "position": [
        10624,
        4784
      ],
      "webhookId": "9aacf59b-299d-473e-9217-2b073a9d4c80",
      "credentials": {
        "telegramApi": {
          "id": "wtizxQmeBNZ42WaQ",
          "name": "Telegram account"
        }
      },
      "continueOnFail": true
    },
    {
      "parameters": {
        "jsCode": "const data = $('Code — Detectar Duplicados1').item.json;\nconst emoji = { 'Crítica': '🚨', 'Alta': '⚠️', 'Media': '🔵', 'Baja': '🟢' }[data.prioridadFinal] || '📋';\nconst primerNombre = data.nombre ? data.nombre.split(' ')[0] : 'Ciudadano';\nconst msgCiudadano = `✅ *SmartCity-Fix — Reporte Recibido*\n\nHola ${primerNombre}, tu reporte fue registrado exitosamente.\n\n🎫 *Tu ticket:* \\`${data.ticketId}\\`\n📍 *Tipo:* ${data.categoriaFinal}\n${emoji} *Prioridad:* ${data.prioridadFinal}\n📅 *Fecha:* ${new Date(data.fechaEnvio).toLocaleString('es-CO')}\n\n${data.esDuplicado ? '⚠️ *Nota:* Este incidente puede ser similar a uno ya reportado (' + data.ticketDuplicado + ')\\n\\n' : ''}📲 Guarda tu ticket para hacer seguimiento con:\n\\`/ticket ${data.ticketId}\\`\n\nGracias por contribuir a una ciudad mejor 🏙️`;\nreturn [{ json: { ...data, msgCiudadano } }];"
      },
      "id": "7ecd51a9-93d9-401a-ba9c-96363cf052ba",
      "name": "Code — Mensaje Ciudadano",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [
        10896,
        4784
      ]
    },
    {
      "parameters": {
        "chatId": "=8546238882",
        "text": "={{ $json.msgCiudadano }}",
        "additionalFields": {
          "parse_mode": "Markdown"
        }
      },
      "id": "f398249e-953c-4b2b-a00e-c759c147595d",
      "name": "Telegram — Confirmar al Ciudadano",
      "type": "n8n-nodes-base.telegram",
      "typeVersion": 1.2,
      "position": [
        11120,
        4784
      ],
      "webhookId": "4de90c66-7f38-4b48-ab48-99bc64911e55",
      "credentials": {
        "telegramApi": {
          "id": "wtizxQmeBNZ42WaQ",
          "name": "Telegram account"
        }
      },
      "continueOnFail": true
    },
    {
      "parameters": {
        "respondWith": "json",
        "responseBody": "={{ JSON.stringify({ success: true, ticketId: $json.ticketId, categoria: $json.categoriaFinal, prioridad: $json.prioridadFinal, confianza: $json.iaConfianza, duplicado: $json.esDuplicado, ticketDuplicado: $json.ticketDuplicado || null, message: 'Reporte recibido y procesado correctamente' }) }}",
        "options": {
          "responseCode": 200,
          "responseHeaders": {
            "entries": [
              {
                "name": "Access-Control-Allow-Origin",
                "value": "*"
              }
            ]
          }
        }
      },
      "id": "b88eca1d-d895-43c8-ad6f-f08831838191",
      "name": "Respond — Éxito al Frontend2",
      "type": "n8n-nodes-base.respondToWebhook",
      "typeVersion": 1.1,
      "position": [
        11344,
        4784
      ]
    }
  ],
  "connections": {
    "Code — Mensaje Fallo Técnico": {
      "main": [
        [
          {
            "node": "Telegram — Alerta Fallo Técnico1",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Webhook — Consultar Ticket": {
      "main": [
        [
          {
            "node": "IF — Preflight OPTIONS",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "IF — Preflight OPTIONS": {
      "main": [
        [
          {
            "node": "Respond — Preflight OK",
            "type": "main",
            "index": 0
          }
        ],
        [
          {
            "node": "Google Sheets — Leer Ticket",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Google Sheets — Leer Ticket": {
      "main": [
        [
          {
            "node": "Respond — Datos del Ticket",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Code — Calcular Métricas1": {
      "main": [
        [
          {
            "node": "Respond — Métricas JSON1",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Google Sheets — Leer Todos para Métricas1": {
      "main": [
        [
          {
            "node": "Code — Calcular Métricas1",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Webhook — Métricas Dashboard1": {
      "main": [
        [
          {
            "node": "Google Sheets — Leer Todos para Métricas1",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "HTTP — Sheets Buscar Duplicados1": {
      "main": [
        [
          {
            "node": "Code — Detectar Duplicados1",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Webhook — Recibir Reporte": {
      "main": [
        [
          {
            "node": "Code in JavaScript",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Code in JavaScript": {
      "main": [
        [
          {
            "node": "Code — Validar y Análisis Semántico",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Code — Validar y Análisis Semántico": {
      "main": [
        [
          {
            "node": "Code in JavaScript4",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Code in JavaScript4": {
      "main": [
        [
          {
            "node": "HTTP Request1",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "HTTP Request1": {
      "main": [
        [
          {
            "node": "Code — Parsear Resultado IA1",
            "type": "main",
            "index": 0
          }
        ],
        [
          {
            "node": "Code — Parsear Resultado IA1",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Code — Parsear Resultado IA1": {
      "main": [
        [
          {
            "node": "IF — ¿Falló la IA?1",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "IF — ¿Falló la IA?1": {
      "main": [
        [
          {
            "node": "Sheets — Insertar Fallo Técnico1",
            "type": "main",
            "index": 0
          }
        ],
        [
          {
            "node": "HTTP — Sheets Buscar Duplicados1",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Sheets — Insertar Fallo Técnico1": {
      "main": [
        [
          {
            "node": "Code — Mensaje Fallo Técnico",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Telegram — Alerta Fallo Técnico1": {
      "main": [
        [
          {
            "node": "Respond — Contingencia al Frontend1",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Code — Detectar Duplicados1": {
      "main": [
        [
          {
            "node": "Google Sheets — Insertar Reporte1",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Google Sheets — Insertar Reporte1": {
      "main": [
        [
          {
            "node": "Switch — Nivel de Confianza1",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Switch — Nivel de Confianza1": {
      "main": [
        [
          {
            "node": "Code — Mensaje Alta Confianza1",
            "type": "main",
            "index": 0
          }
        ],
        [
          {
            "node": "Code — Mensaje Confianza Media1",
            "type": "main",
            "index": 0
          }
        ],
        [
          {
            "node": "Code — Mensaje Baja Confianza1",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Code — Mensaje Alta Confianza1": {
      "main": [
        [
          {
            "node": "Telegram — Notificar Operadores1",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Code — Mensaje Confianza Media1": {
      "main": [
        [
          {
            "node": "Telegram — Notificar Operadores1",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Code — Mensaje Baja Confianza1": {
      "main": [
        [
          {
            "node": "Telegram — Notificar Operadores1",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Telegram — Notificar Operadores1": {
      "main": [
        [
          {
            "node": "Code — Mensaje Ciudadano",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Code — Mensaje Ciudadano": {
      "main": [
        [
          {
            "node": "Telegram — Confirmar al Ciudadano",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Telegram — Confirmar al Ciudadano": {
      "main": [
        [
          {
            "node": "Respond — Éxito al Frontend2",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  },
  "pinData": {},
  "meta": {
    "templateCredsSetupCompleted": true,
    "instanceId": "0e1cef91477f5e97a75d4fbd4faafee733bc99f65ae7d8af5a1fb8e5cb314922"
  }
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