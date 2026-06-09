/**
 * SmartCity-Fix — app.js
 * Lógica principal del frontend
 * Stack: JavaScript ES6+ (compilado desde app.ts)
 */

'use strict';

// ── Reemplaza con la URL del webhook de n8n después de importar el workflow ──
const N8N_WEBHOOK_URL = 'https://stipulate-glade-exclaim.ngrok-free.dev/webhook/smartcity-fix';
//                                                                         ^^^^^^^ sin "-test"';

/* ============================================================
   1. LOADER
   ============================================================ */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  if (!loader) return;
  setTimeout(() => loader.classList.add('hidden'), 900);
});

/* ============================================================
   2. NAVBAR — scroll + toggle móvil + active link
   ============================================================ */
(function initNavbar() {
  const navbar   = document.getElementById('navbar');
  const toggle   = document.getElementById('navToggle');
  const menu     = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  const onScroll = () => {
    if (!navbar) return;
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  toggle?.addEventListener('click', () => {
    const open = menu?.classList.toggle('open');
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      menu?.classList.remove('open');
      toggle?.classList.remove('open');
      toggle?.setAttribute('aria-expanded', 'false');
    });
  });

  const sections = document.querySelectorAll('section[id]');
  const setActive = () => {
    let current = '';
    sections.forEach(sec => {
      const top = sec.getBoundingClientRect().top;
      if (top <= 100) current = sec.id;
    });
    navLinks.forEach(link => {
      const href = link.getAttribute('href')?.replace('#', '');
      link.classList.toggle('active', href === current);
    });
  };
  window.addEventListener('scroll', setActive, { passive: true });
})();

/* ============================================================
   3. FADE-UP
   ============================================================ */
(function initFadeUp() {
  const items = document.querySelectorAll('.fade-up');
  if (!items.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  items.forEach(el => observer.observe(el));
})();

/* ============================================================
   4. COUNTERS
   ============================================================ */
(function initCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;

  const animateCounter = (el, target) => {
    const duration = 1800;
    const start    = performance.now();

    const tick = (now) => {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target).toLocaleString('es-CO');
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el     = entry.target;
          const target = parseInt(el.getAttribute('data-counter') || '0', 10);
          animateCounter(el, target);
          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(el => observer.observe(el));
})();

/* ============================================================
   5. PROGRESS BARS
   ============================================================ */
(function initProgressBars() {
  const bars = document.querySelectorAll('.progress-bar__fill[data-pct]');
  if (!bars.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el  = entry.target;
          const pct = el.getAttribute('data-pct') || '0';
          el.style.width = `${pct}%`;
          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.4 }
  );

  bars.forEach(el => observer.observe(el));
})();

/* ============================================================
   6. CHARTS
   ============================================================ */
(function initCharts() {
  // ── Bar Chart
  const barChart = document.getElementById('barChart');
  if (barChart) {
    const data = [
      { label: 'Baches',     value: 87, color: '#3B82F6' },
      { label: 'Luminarias', value: 62, color: '#F59E0B' },
      { label: 'Semáforos',  value: 45, color: '#10B981' },
      { label: 'Fugas',      value: 71, color: '#EF4444' },
      { label: 'Cableado',   value: 38, color: '#8B5CF6' },
      { label: 'Otros',      value: 36, color: '#64748B' },
    ];

    const maxVal = Math.max(...data.map(d => d.value));
    barChart.innerHTML = '';

    data.forEach(item => {
      const pct  = (item.value / maxVal) * 100;
      const div  = document.createElement('div');
      div.className = 'bar-item';
      div.innerHTML = `
        <div class="bar-item__bar"
             data-value="${item.value}"
             style="height:0%;background:${item.color};transition:height 1s cubic-bezier(.4,0,.2,1)">
        </div>
        <span class="bar-item__label">${item.label}</span>
      `;
      barChart.appendChild(div);

      const bar = div.querySelector('.bar-item__bar');
      const obs = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
          setTimeout(() => { bar.style.height = `${pct}%`; }, 100);
          obs.disconnect();
        }
      }, { threshold: 0.3 });
      obs.observe(div);
    });
  }

  // ── Indicator bars
  const indicatorBars = document.querySelectorAll('.indicator__bar div');
  const indObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = el.style.width;
        el.style.width = '0';
        setTimeout(() => { el.style.width = target; }, 150);
        indObs.unobserve(el);
      }
    });
  }, { threshold: 0.4 });
  indicatorBars.forEach(b => indObs.observe(b));

  // ── Line Chart (SVG)
  const lineChart = document.getElementById('lineChart');
  if (lineChart) {
    const points = [22, 18, 26, 15, 19, 14, 21, 17, 13, 20, 16, 18];
    const labels = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
    const W = 400, H = 160, padX = 20, padY = 20;
    const maxP = Math.max(...points);
    const minP = Math.min(...points);

    const scaleX = (i) => padX + (i / (points.length - 1)) * (W - padX * 2);
    const scaleY = (v) => H - padY - ((v - minP) / (maxP - minP)) * (H - padY * 2);

    const pathD = points.map((v, i) => {
      const x = scaleX(i), y = scaleY(v);
      return i === 0 ? `M${x},${y}` : `L${x},${y}`;
    }).join(' ');

    const areaD = `${pathD} L${scaleX(points.length-1)},${H} L${scaleX(0)},${H} Z`;

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

    svg.innerHTML = `
      <defs>
        <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#3B82F6" stop-opacity="0.2"/>
          <stop offset="100%" stop-color="#3B82F6" stop-opacity="0"/>
        </linearGradient>
      </defs>
      <path d="${areaD}" fill="url(#lineGrad)"/>
      <path d="${pathD}" fill="none" stroke="#3B82F6" stroke-width="2.5"
            stroke-linecap="round" stroke-linejoin="round"
            stroke-dasharray="1000" stroke-dashoffset="1000"
            class="line-path"/>
      ${points.map((v, i) => `
        <circle cx="${scaleX(i)}" cy="${scaleY(v)}" r="4"
                fill="#fff" stroke="#3B82F6" stroke-width="2"
                opacity="0">
          <title>${labels[i]}: ${v}h</title>
        </circle>
      `).join('')}
      ${labels.map((l, i) => `
        <text x="${scaleX(i)}" y="${H}" text-anchor="middle"
              font-size="10" fill="#94A3B8">${l}</text>
      `).join('')}
    `;

    lineChart.appendChild(svg);

    const lineObs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        const path = svg.querySelector('.line-path');
        if (path) {
          path.style.transition = 'stroke-dashoffset 1.8s cubic-bezier(.4,0,.2,1)';
          path.style.strokeDashoffset = '0';
        }
        svg.querySelectorAll('circle').forEach((c, i) => {
          setTimeout(() => { c.setAttribute('opacity', '1'); }, i * 100 + 400);
        });
        lineObs.disconnect();
      }
    }, { threshold: 0.3 });
    lineObs.observe(lineChart);
  }
})();

/* ============================================================
   7. GEOLOCALIZACIÓN + MAPA LEAFLET
   ============================================================ */
(function initGeoMap() {
  const btn       = document.getElementById('geoBtn');
  const latEl     = document.getElementById('lat');
  const lngEl     = document.getElementById('lng');
  const statusEl  = document.getElementById('geoStatus');
  const mapEl     = document.getElementById('incidentMap');
  const addressEl = document.getElementById('geoAddress');
  if (!btn || !mapEl) return;

  const DEFAULT_LAT  = 4.6097;
  const DEFAULT_LNG  = -74.0817;
  const DEFAULT_ZOOM = 13;

  const map = L.map('incidentMap', {
    center: [DEFAULT_LAT, DEFAULT_LNG],
    zoom: DEFAULT_ZOOM,
    zoomControl: true,
  });

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors',
    maxZoom: 19,
  }).addTo(map);

  const markerIcon = L.divIcon({
    className: 'leaflet-custom-marker',
    html: '<div class="custom-marker-pin"><i class="ri-map-pin-2-fill"></i></div>',
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -38],
  });

  let marker = null;

  function placeMarker(lat, lng) {
    if (latEl) latEl.value = lat.toFixed(6);
    if (lngEl) lngEl.value = lng.toFixed(6);
    setFieldValid('lat');
    setFieldValid('lng');
    clearError('err-coords');

    if (marker) {
      marker.setLatLng([lat, lng]);
    } else {
      marker = L.marker([lat, lng], { icon: markerIcon, draggable: true }).addTo(map);
      marker.on('dragend', (e) => {
        const { lat: newLat, lng: newLng } = e.target.getLatLng();
        placeMarker(newLat, newLng);
        reverseGeocode(newLat, newLng);
      });
    }

    marker.bindPopup(
      `<strong>Incidente reportado</strong><br>Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)}`
    ).openPopup();
  }

  async function reverseGeocode(lat, lng) {
    if (!addressEl) return;
    addressEl.innerHTML = '<span class="geo-addr-loading"><i class="ri-loader-4-line"></i> Obteniendo dirección…</span>';
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=es`;
      const res  = await fetch(url, { headers: { 'Accept-Language': 'es' } });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const data = await res.json();
      const addr = data.display_name || 'Dirección no disponible';
      addressEl.innerHTML = `
        <div class="geo-addr-result">
          <i class="ri-map-pin-user-line"></i>
          <span>${addr}</span>
        </div>`;
    } catch {
      addressEl.innerHTML = `<span class="geo-addr-error"><i class="ri-error-warning-line"></i> No se pudo obtener la dirección.</span>`;
    }
  }

  map.on('click', (e) => {
    placeMarker(e.latlng.lat, e.latlng.lng);
    reverseGeocode(e.latlng.lat, e.latlng.lng);
  });

  btn.addEventListener('click', () => {
    if (!navigator.geolocation) {
      showGeoStatus('Tu navegador no soporta geolocalización.', 'error');
      return;
    }

    btn.classList.add('loading');
    btn.disabled = true;
    showGeoStatus('Obteniendo ubicación…', 'info');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        placeMarker(latitude, longitude);
        map.flyTo([latitude, longitude], 16, { animate: true, duration: 1.2 });
        reverseGeocode(latitude, longitude);
        showGeoStatus(`✓ Ubicación obtenida (precisión ±${Math.round(accuracy)}m)`, 'success');
        btn.classList.remove('loading');
        btn.disabled = false;
      },
      (err) => {
        const msgs = {
          1: 'Permiso denegado. Permite el acceso a tu ubicación.',
          2: 'Ubicación no disponible. Intenta de nuevo.',
          3: 'Tiempo de espera agotado. Intenta de nuevo.',
        };
        showGeoStatus(msgs[err.code] || 'Error al obtener ubicación.', 'error');
        btn.classList.remove('loading');
        btn.disabled = false;
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  });

  function showGeoStatus(msg, type) {
    if (!statusEl) return;
    statusEl.textContent = msg;
    statusEl.style.color = type === 'success'
      ? 'var(--color-success)'
      : type === 'error'
      ? 'var(--color-danger)'
      : 'var(--color-accent)';
  }
})();

/* ============================================================
   8. UPLOAD DE FOTO
   ============================================================ */
(function initUpload() {
  const zone       = document.getElementById('uploadZone');
  const input      = document.getElementById('photoInput');
  const prompt     = document.getElementById('uploadPrompt');
  const preview    = document.getElementById('uploadPreview');
  const previewImg = document.getElementById('previewImg');
  const removeBtn  = document.getElementById('removePhoto');
  if (!zone || !input) return;

  const MAX_SIZE = 10 * 1024 * 1024;

  const showPreview = (file) => {
    if (!file.type.startsWith('image/')) {
      showToast('Solo se aceptan imágenes (JPG, PNG, WEBP).', 'error');
      return false;
    }
    if (file.size > MAX_SIZE) {
      showToast('La imagen supera el tamaño máximo de 10 MB.', 'error');
      return false;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      previewImg.src = e.target.result;
      prompt.style.display = 'none';
      preview.style.display = 'block';
      zone.classList.remove('invalid');
      clearError('err-photo');
    };
    reader.readAsDataURL(file);
    return true;
  };

  input.addEventListener('change', () => {
    if (input.files?.[0]) showPreview(input.files[0]);
  });

  zone.addEventListener('dragover', (e) => {
    e.preventDefault();
    zone.classList.add('drag-over');
  });

  zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));

  zone.addEventListener('drop', (e) => {
    e.preventDefault();
    zone.classList.remove('drag-over');
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const dt = new DataTransfer();
      dt.items.add(file);
      input.files = dt.files;
      showPreview(file);
    }
  });

  zone.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') input.click();
  });

  removeBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    input.value = '';
    previewImg.src = '';
    preview.style.display = 'none';
    prompt.style.display = '';
  });
})();

/* ============================================================
   9. TEXTAREA — contador de caracteres
   ============================================================ */
(function initCharCounter() {
  const textarea = document.getElementById('description');
  const counter  = document.getElementById('charCount');
  if (!textarea || !counter) return;

  textarea.addEventListener('input', () => {
    counter.textContent = String(textarea.value.length);
  });
})();

/* ============================================================
   10. VALIDACIONES
   ============================================================ */
function setFieldInvalid(id) {
  const el = document.getElementById(id);
  el?.classList.add('invalid');
}

function setFieldValid(id) {
  const el = document.getElementById(id);
  el?.classList.remove('invalid');
}

function setError(errId, msg) {
  const el = document.getElementById(errId);
  if (el) el.textContent = msg;
}

function clearError(errId) {
  const el = document.getElementById(errId);
  if (el) el.textContent = '';
}

function validateForm() {
  let valid = true;

  const required = (fieldId, errId, msg) => {
    const el = document.getElementById(fieldId);
    if (!el?.value.trim()) {
      setFieldInvalid(fieldId);
      setError(errId, msg);
      valid = false;
    } else {
      setFieldValid(fieldId);
      clearError(errId);
    }
  };

  required('fullName', 'err-fullName', 'El nombre es obligatorio.');
  required('docId',    'err-docId',    'El documento es obligatorio.');

  const phone    = document.getElementById('phone');
  const phoneVal = phone?.value.trim() || '';
  if (!phoneVal) {
    setFieldInvalid('phone');
    setError('err-phone', 'El teléfono es obligatorio.');
    valid = false;
  } else if (!/^[+\d\s\-()]{7,20}$/.test(phoneVal)) {
    setFieldInvalid('phone');
    setError('err-phone', 'Ingresa un teléfono válido.');
    valid = false;
  } else {
    setFieldValid('phone');
    clearError('err-phone');
  }

  const email    = document.getElementById('email');
  const emailVal = email?.value.trim() || '';
  if (!emailVal) {
    setFieldInvalid('email');
    setError('err-email', 'El correo es obligatorio.');
    valid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
    setFieldInvalid('email');
    setError('err-email', 'Ingresa un correo válido.');
    valid = false;
  } else {
    setFieldValid('email');
    clearError('err-email');
  }

  const incidentChecked = document.querySelector('input[name="incidentType"]:checked');
  if (!incidentChecked) {
    setError('err-incidentType', 'Selecciona el tipo de incidente.');
    valid = false;
  } else {
    clearError('err-incidentType');
  }

  const lat = document.getElementById('lat');
  const lng = document.getElementById('lng');
  if (!lat?.value || !lng?.value) {
    setFieldInvalid('lat');
    setFieldInvalid('lng');
    setError('err-coords', 'Obtén tu ubicación antes de enviar.');
    valid = false;
  } else {
    const latNum = parseFloat(lat.value);
    const lngNum = parseFloat(lng.value);
    if (latNum < -90 || latNum > 90 || lngNum < -180 || lngNum > 180) {
      setFieldInvalid('lat');
      setFieldInvalid('lng');
      setError('err-coords', 'Coordenadas fuera de rango.');
      valid = false;
    } else {
      setFieldValid('lat');
      setFieldValid('lng');
      clearError('err-coords');
    }
  }

  const photoInput = document.getElementById('photoInput');
  if (!photoInput?.files?.length) {
    const zone = document.getElementById('uploadZone');
    zone?.classList.add('invalid');
    setError('err-photo', 'La fotografía del incidente es obligatoria.');
    valid = false;
  } else {
    const zone = document.getElementById('uploadZone');
    zone?.classList.remove('invalid');
    clearError('err-photo');
  }

  const desc = document.getElementById('description');
  if (!desc?.value.trim()) {
    setFieldInvalid('description');
    setError('err-description', 'La descripción es obligatoria.');
    valid = false;
  } else if (desc.value.trim().length < 20) {
    setFieldInvalid('description');
    setError('err-description', 'La descripción debe tener al menos 20 caracteres.');
    valid = false;
  } else {
    setFieldValid('description');
    clearError('err-description');
  }

  return valid;
}

/* ============================================================
   11. FORMULARIO — submit
   ============================================================ */
(function initForm() {
  const form      = document.getElementById('reportForm');
  const submitBtn = document.getElementById('submitBtn');
  if (!form || !submitBtn) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showToast('Por favor, corrige los errores del formulario.', 'error');
      const firstInvalid = form.querySelector('.invalid, .field-error:not(:empty)');
      firstInvalid?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    await simulateSubmit();

    submitBtn.classList.remove('loading');
    submitBtn.disabled = false;
  });

  async function simulateSubmit() {
  const photoFile = document.getElementById('photoInput')?.files?.[0];
  let photoBase64 = '';
  if (photoFile) {
    photoBase64 = await fileToBase64(photoFile);
  }

  // ── Genera ticketId local por si n8n falla ──
  const localTicketId = generateTicketId();

  const payload = {
    ticketId:       localTicketId,
    fullName:       document.getElementById('fullName')?.value  || '',
    docId:          document.getElementById('docId')?.value     || '',
    phone:          document.getElementById('phone')?.value     || '',
    email:          document.getElementById('email')?.value     || '',
    incidentType:   document.querySelector('input[name="incidentType"]:checked')?.value || '',
    lat:            document.getElementById('lat')?.value       || '',
    lng:            document.getElementById('lng')?.value       || '',
    direccion:      document.getElementById('geoAddress')?.querySelector('span')?.textContent?.trim() || '',
    description:    document.getElementById('description')?.value || '',
    // ── Si no hay foto manda string vacío, nunca null ──
    photoBase64:    photoBase64 || '',
    fechaEnvio:     new Date().toISOString(),
    telegramChatId: '',
  };

  let ticketId = localTicketId;

  try {
    const res = await fetch(N8N_WEBHOOK_URL, {
      method:  'POST',
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const data = await res.json().catch(() => ({}));
      if (data.ticketId) ticketId = data.ticketId;
      showToast(`✓ Reporte enviado. Ticket: ${ticketId}`, 'success', 7000);
    } else if (res.status === 400) {
      // n8n rechazó por spam o validación
      const data = await res.json().catch(() => ({}));
      const msg = data.message || 'Reporte rechazado por el sistema.';
      showToast(`⚠️ ${msg}`, 'error', 7000);
      return; // no resetear el form, deja que el usuario corrija
    } else {
      throw new Error(`HTTP ${res.status}`);
    }
  } catch (err) {
    console.warn('n8n no disponible, usando modo demo:', err.message);
    showToast(`✓ Reporte registrado (demo). Ticket: ${ticketId}`, 'success', 6000);
  }


    const ticketInput = document.getElementById('ticketId');
    if (ticketInput) ticketInput.value = ticketId;

    form.reset();
    document.getElementById('charCount').textContent = '0';
    document.getElementById('previewImg').src = '';
    document.getElementById('uploadPreview').style.display = 'none';
    document.getElementById('uploadPrompt').style.display  = '';
    document.getElementById('geoStatus').textContent = '';
    const addrEl = document.getElementById('geoAddress');
    if (addrEl) addrEl.innerHTML = '';
  }

  function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload  = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
})();

/* ============================================================
   12. TICKET STATUS
   ============================================================ */
(function initTicketCheck() {
  const checkBtn    = document.getElementById('checkTicket');
  const ticketInput = document.getElementById('ticketId');
  const resultDiv   = document.getElementById('ticketResult');
  const demoBtn     = document.querySelector('.demo-ticket');
  if (!checkBtn || !ticketInput || !resultDiv) return;

  const STEPS = [
    { label: 'Recibido'       },
    { label: 'En análisis IA' },
    { label: 'Asignado'       },
    { label: 'En proceso'     },
    { label: 'Solucionado'    },
  ];

  const lookup = async (id) => {
    resultDiv.innerHTML = `<p style="color:rgba(255,255,255,.4);font-size:.85rem">
      <i class="ri-loader-4-line" style="animation:spin 1s linear infinite;"></i>
      Consultando base de datos…
    </p>`;

    try {
      const url = `https://stipulate-glade-exclaim.ngrok-free.dev/webhook/get-ticket?id=${encodeURIComponent(id)}`;

      // ── fetch único con ngrok-skip-browser-warning ──
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'ngrok-skip-browser-warning': 'true',
        },
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const ticket = await res.json();

      if (!ticket || !ticket.ticketId) {
        throw new Error('Ticket no encontrado');
      }

      const mapaEstados = {
        'Pendiente':   1,
        'Análisis IA': 2,
        'Asignado':    3,
        'En proceso':  4,
        'Solucionado': 5,
        'Duplicado':   5,
      };
      const statusNum = mapaEstados[ticket.estado] || 1;

      const stepsHTML = STEPS.map((step, i) => {
        const idx      = i + 1;
        const isDone   = idx < statusNum;
        const isActive = idx === statusNum;
        const cls      = isDone ? 'done' : isActive ? 'active' : '';
        const dot      = isDone
          ? '<i class="ri-check-line"></i>'
          : isActive
          ? '<i class="ri-refresh-line"></i>'
          : `${idx}`;
        return `
          <div class="progress-step ${cls}">
            <div class="step-dot">${dot}</div>
            <span>${step.label}</span>
          </div>`;
      }).join('');

      resultDiv.innerHTML = `
        <div class="ticket-progress">
          <div class="ticket-info">
            <h4>${ticket.ticketId}</h4>
            <p>${ticket.categoria.toUpperCase()} · Severidad: ${ticket.prioridad}</p>
            <p style="font-size:.75rem;color:rgba(255,255,255,.4)">📅 ${ticket.fecha}</p>
          </div>
          ${stepsHTML}
        </div>`;

    } catch (err) {
      resultDiv.innerHTML = `
        <p style="color:var(--color-danger);font-size:.85rem">
          <i class="ri-error-warning-line"></i> Ticket no encontrado o inválido.
        </p>`;
    }
  };

  checkBtn.addEventListener('click', () => {
    const id = ticketInput.value.trim();
    if (!id) {
      showToast('Ingresa un número de ticket.', 'error');
      return;
    }
    lookup(id);
  });

  ticketInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') checkBtn.click();
  });

  demoBtn?.addEventListener('click', () => {
    ticketInput.value = demoBtn.dataset.ticket;
    checkBtn.click();
  });
})();

/* ============================================================
   13. TOAST
   ============================================================ */
function showToast(msg, type = 'info', duration = 4000) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.textContent = msg;
  toast.className   = `toast toast--${type} show`;

  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.classList.remove('show');
  }, duration);
}

/* ============================================================
   14. SMOOTH SCROLL
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const id  = link.getAttribute('href')?.slice(1);
    const sec = id ? document.getElementById(id) : null;
    if (sec) {
      e.preventDefault();
      const top = sec.getBoundingClientRect().top + window.scrollY
        - parseInt(getComputedStyle(document.documentElement).getPropertyValue('--navbar-h') || '68', 10);
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ============================================================
   15. HELPERS
   ============================================================ */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function generateTicketId() {
  const year = new Date().getFullYear();
  const rand = Math.floor(Math.random() * 900000) + 100000;
  return `SCF-${year}-${rand}`;
}