/**
 * SmartCity-Fix — app.js
 * Lógica principal del frontend
 * Stack: JavaScript ES6+ (compilado desde app.ts)
 */

'use strict';

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

  // Scroll → clase scrolled
  const onScroll = () => {
    if (!navbar) return;
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Toggle menú móvil
  toggle?.addEventListener('click', () => {
    const open = menu?.classList.toggle('open');
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
  });

  // Cerrar menú al clicar enlace
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      menu?.classList.remove('open');
      toggle?.classList.remove('open');
      toggle?.setAttribute('aria-expanded', 'false');
    });
  });

  // Active link según sección visible
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
   3. FADE-UP — IntersectionObserver para animaciones scroll
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
   4. COUNTERS — animación de números al entrar en viewport
   ============================================================ */
(function initCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;

  /**
   * @param {HTMLElement} el
   * @param {number} target
   */
  const animateCounter = (el, target) => {
    const duration = 1800;
    const start    = performance.now();

    const tick = (now) => {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
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
   5. PROGRESS BARS — animar al entrar en viewport
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
   6. CHARTS — bar chart + line chart con SVG dinámico
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

      // Trigger animation when visible
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

  // ── Indicator bars animation
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

    // Animate line draw on visible
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
   7. GEOLOCALIZACIÓN
   ============================================================ */
(function initGeo() {
  const btn    = document.getElementById('geoBtn');
  const latEl  = document.getElementById('lat');
  const lngEl  = document.getElementById('lng');
  const status = document.getElementById('geoStatus');
  if (!btn) return;

  btn.addEventListener('click', () => {
    if (!navigator.geolocation) {
      showStatus('Tu navegador no soporta geolocalización.', 'error');
      return;
    }

    btn.classList.add('loading');
    btn.disabled = true;
    showStatus('Obteniendo ubicación…', 'info');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        if (latEl) latEl.value = latitude.toFixed(6);
        if (lngEl) lngEl.value = longitude.toFixed(6);
        showStatus(`✓ Ubicación obtenida (precisión ±${Math.round(accuracy)}m)`, 'success');
        btn.classList.remove('loading');
        btn.disabled = false;
        // Clear coord errors
        setFieldValid('lat');
        setFieldValid('lng');
        clearError('err-coords');
      },
      (err) => {
        const msgs = {
          1: 'Permiso denegado. Permite el acceso a tu ubicación.',
          2: 'Ubicación no disponible. Intenta de nuevo.',
          3: 'Tiempo de espera agotado. Intenta de nuevo.',
        };
        showStatus(msgs[err.code] || 'Error al obtener ubicación.', 'error');
        btn.classList.remove('loading');
        btn.disabled = false;
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  });

  /**
   * @param {string} msg
   * @param {'info'|'success'|'error'} type
   */
  function showStatus(msg, type) {
    if (!status) return;
    status.textContent = msg;
    status.style.color = type === 'success'
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

  const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

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

  // Drag & Drop
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
      // Sync with input for FormData
      const dt = new DataTransfer();
      dt.items.add(file);
      input.files = dt.files;
      showPreview(file);
    }
  });

  // Keyboard open
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

/** @param {string} id  */
function setFieldInvalid(id) {
  const el = document.getElementById(id);
  el?.classList.add('invalid');
}

/** @param {string} id  */
function setFieldValid(id) {
  const el = document.getElementById(id);
  el?.classList.remove('invalid');
}

/** @param {string} errId @param {string} msg */
function setError(errId, msg) {
  const el = document.getElementById(errId);
  if (el) el.textContent = msg;
}

/** @param {string} errId */
function clearError(errId) {
  const el = document.getElementById(errId);
  if (el) el.textContent = '';
}

/**
 * Valida el formulario completo.
 * @returns {boolean}
 */
function validateForm() {
  let valid = true;

  /** @param {string} fieldId @param {string} errId @param {string} msg */
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

  // Nombre
  required('fullName', 'err-fullName', 'El nombre es obligatorio.');
  // Documento
  required('docId', 'err-docId', 'El documento es obligatorio.');
  // Teléfono
  const phone = document.getElementById('phone');
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
  // Email
  const email = document.getElementById('email');
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
  // Tipo de incidente
  const incidentChecked = document.querySelector('input[name="incidentType"]:checked');
  if (!incidentChecked) {
    setError('err-incidentType', 'Selecciona el tipo de incidente.');
    valid = false;
  } else {
    clearError('err-incidentType');
  }
  // Coordenadas
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
  // Foto
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
  // Descripción
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
      // Scroll al primer error
      const firstInvalid = form.querySelector('.invalid, .field-error:not(:empty)');
      firstInvalid?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    // Simular envío al backend
    await simulateSubmit();

    submitBtn.classList.remove('loading');
    submitBtn.disabled = false;
  });

  async function simulateSubmit() {
    // Aquí se conectará con el backend n8n
    await sleep(2000);

    const ticketId = generateTicketId();
    showToast(`✓ Reporte enviado. Ticket: ${ticketId}`, 'success', 6000);

    // Rellenar automáticamente el campo de ticket
    const ticketInput = document.getElementById('ticketId');
    if (ticketInput) ticketInput.value = ticketId;

    form.reset();
    document.getElementById('charCount').textContent = '0';
    document.getElementById('previewImg').src = '';
    document.getElementById('uploadPreview').style.display = 'none';
    document.getElementById('uploadPrompt').style.display = '';
    document.getElementById('geoStatus').textContent = '';
  }
})();

/* ============================================================
   12. TICKET STATUS
   ============================================================ */
(function initTicketCheck() {
  const checkBtn  = document.getElementById('checkTicket');
  const ticketInput = document.getElementById('ticketId');
  const resultDiv = document.getElementById('ticketResult');
  const demoBtn   = document.querySelector('.demo-ticket');
  if (!checkBtn || !ticketInput || !resultDiv) return;

  /** Mock data */
  const MOCK_TICKETS = {
    'SCF-2024-001234': { type: 'Bache', address: 'Av. Principal #34', status: 3 },
    'SCF-2024-005678': { type: 'Luminaria', address: 'Calle 7 #12', status: 5 },
    'SCF-2024-009012': { type: 'Semáforo', address: 'Carrera 5 con Calle 10', status: 1 },
  };

  const STEPS = [
    { label: 'Recibido',       icon: 'ri-inbox-archive-line' },
    { label: 'En análisis IA', icon: 'ri-robot-2-line' },
    { label: 'Asignado',       icon: 'ri-user-received-line' },
    { label: 'En proceso',     icon: 'ri-tools-line' },
    { label: 'Solucionado',    icon: 'ri-check-double-line' },
  ];

  const lookup = async (id) => {
    resultDiv.innerHTML = `<p style="color:rgba(255,255,255,.4);font-size:.85rem">Consultando…</p>`;
    await sleep(700);

    const ticket = MOCK_TICKETS[id.toUpperCase()];
    if (!ticket) {
      resultDiv.innerHTML = `
        <p style="color:var(--color-danger);font-size:.85rem">
          <i class="ri-error-warning-line"></i> Ticket no encontrado.
        </p>`;
      return;
    }

    const stepsHTML = STEPS.map((step, i) => {
      const idx    = i + 1;
      const isDone = idx < ticket.status;
      const isActive = idx === ticket.status;
      const cls    = isDone ? 'done' : isActive ? 'active' : '';
      const dotContent = isDone
        ? '<i class="ri-check-line"></i>'
        : isActive
        ? '<i class="ri-refresh-line"></i>'
        : `${idx}`;
      return `
        <div class="progress-step ${cls}">
          <div class="step-dot">${dotContent}</div>
          <span>${step.label}</span>
        </div>
      `;
    }).join('');

    resultDiv.innerHTML = `
      <div class="ticket-progress">
        <div class="ticket-info">
          <h4>${id.toUpperCase()}</h4>
          <p>${ticket.type} · ${ticket.address}</p>
        </div>
        ${stepsHTML}
      </div>
    `;
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
/**
 * @param {string} msg
 * @param {'success'|'error'|'info'} type
 * @param {number} [duration=4000]
 */
function showToast(msg, type = 'info', duration = 4000) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.textContent = msg;
  toast.className = `toast toast--${type} show`;

  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.classList.remove('show');
  }, duration);
}

/* ============================================================
   14. SMOOTH SCROLL — anclas
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
/** @param {number} ms @returns {Promise<void>} */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/** @returns {string} */
function generateTicketId() {
  const year = new Date().getFullYear();
  const rand = Math.floor(Math.random() * 900000) + 100000;
  return `SCF-${year}-${rand}`;
}
