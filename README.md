# SmartCity-Fix 🏙️

**Sistema Inteligente de Diagnóstico y Enrutamiento de Reportes de Infraestructura Urbana**

> Plataforma frontend SaaS que permite a los ciudadanos reportar daños en infraestructura urbana. Los reportes son procesados por IA multimodal, enrutados automáticamente vía n8n y notificados por Telegram.

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

| Capa        | Tecnología                              |
|-------------|-----------------------------------------|
| Markup      | HTML5 semántico + ARIA                  |
| Estilos     | CSS3 + Custom Properties + Grid/Flexbox |
| Lógica      | JavaScript ES6+ / TypeScript            |
| Íconos      | Remix Icons 4.2 (CDN)                   |
| Tipografía  | Syne (display) + DM Sans (body) — Google Fonts |

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
