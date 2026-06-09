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

*Pipeline completo: Webhook → OpenAI Vision → Google Sheets → Telegram Bot.*

---

**Nodo de clasificación IA**

![Nodo OpenAI Vision en n8n](https://i.ibb.co/Wpx5nwTb/Captura-de-pantalla-2026-06-09-182153.png)

*Configuración del nodo de análisis de imagen con clasificación y priorización automática.*

---

### 📱 Notificaciones Telegram

**Notificación de nuevo reporte**

![Telegram - Reporte recibido](https://i.ibb.co/7t2KTFmL/Captura-de-pantalla-2026-06-09-182230.png)

*Mensaje enviado al ciudadano con el ID de ticket generado y estado inicial.*

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

## Integración Backend (pendiente)

El formulario está preparado para conectarse a un backend n8n mediante `fetch`:

```javascript
// En app.js — función simulateSubmit()
// Reemplazar el await sleep(2000) con:
const formData = new FormData(form);
const response = await fetch('https://tu-n8n.com/webhook/smartcity-fix', {
  method: 'POST',
  body: formData,
});
const data = await response.json();
```

### Flujo backend esperado:

1. **Webhook n8n** recibe FormData (campos + imagen)
2. **OpenAI Vision** analiza la imagen → clasifica y prioriza
3. **Google Sheets** registra el reporte con ID de ticket
4. **Telegram Bot** notifica al ciudadano con estado inicial
5. Retorna `{ ticketId: "SCF-2024-XXXXXX" }` al frontend

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