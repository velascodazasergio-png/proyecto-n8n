/**
 * SmartCity-Fix — app.ts
 * Fuente TypeScript del frontend (compilar con tsc --target ES2020 --strict)
 * Incluye tipos, interfaces, validaciones y lógica completa.
 */

'use strict';

/* ============================================================
   INTERFACES & TYPES
   ============================================================ */

interface Coordinates {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

type IncidentType =
  | 'bache'
  | 'fuga_agua'
  | 'luminaria'
  | 'semaforo'
  | 'cableado'
  | 'otro';

type Priority = 'critical' | 'moderate' | 'low';

type ToastType = 'success' | 'error' | 'info';

interface ReportFormData {
  fullName: string;
  docId: string;
  phone: string;
  email: string;
  incidentType: IncidentType;
  coordinates: Coordinates;
  photoFile: File;
  description: string;
}

interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

interface TicketData {
  id: string;
  type: string;
  address: string;
  /** 1=Recibido … 5=Solucionado */
  status: 1 | 2 | 3 | 4 | 5;
  priority: Priority;
  createdAt: string;
}

interface ChartDataPoint {
  label: string;
  value: number;
  color: string;
}

interface ProgressStep {
  label: string;
  icon: string;
}

/* ============================================================
   CONSTANTS
   ============================================================ */

const MAX_PHOTO_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const PHONE_REGEX = /^[+\d\s\-()]{7,20}$/;

const MOCK_TICKETS: Record<string, TicketData> = {
  'SCF-2024-001234': {
    id: 'SCF-2024-001234',
    type: 'Bache',
    address: 'Av. Principal #34',
    status: 3,
    priority: 'critical',
    createdAt: '2024-11-01',
  },
  'SCF-2024-005678': {
    id: 'SCF-2024-005678',
    type: 'Luminaria',
    address: 'Calle 7 #12',
    status: 5,
    priority: 'low',
    createdAt: '2024-10-25',
  },
  'SCF-2024-009012': {
    id: 'SCF-2024-009012',
    type: 'Semáforo',
    address: 'Carrera 5 con Calle 10',
    status: 1,
    priority: 'moderate',
    createdAt: '2024-11-03',
  },
};

const TICKET_STEPS: ProgressStep[] = [
  { label: 'Recibido',       icon: 'ri-inbox-archive-line' },
  { label: 'En análisis IA', icon: 'ri-robot-2-line' },
  { label: 'Asignado',       icon: 'ri-user-received-line' },
  { label: 'En proceso',     icon: 'ri-tools-line' },
  { label: 'Solucionado',    icon: 'ri-check-double-line' },
];

const BAR_CHART_DATA: ChartDataPoint[] = [
  { label: 'Baches',     value: 87, color: '#3B82F6' },
  { label: 'Luminarias', value: 62, color: '#F59E0B' },
  { label: 'Semáforos',  value: 45, color: '#10B981' },
  { label: 'Fugas',      value: 71, color: '#EF4444' },
  { label: 'Cableado',   value: 38, color: '#8B5CF6' },
  { label: 'Otros',      value: 36, color: '#64748B' },
];

/* ============================================================
   UTILITIES
   ============================================================ */

/** Returns a Promise that resolves after `ms` milliseconds */
const sleep = (ms: number): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, ms));

/** Generates a unique SmartCity-Fix ticket ID */
const generateTicketId = (): string => {
  const year = new Date().getFullYear();
  const rand = Math.floor(Math.random() * 900000) + 100000;
  return `SCF-${year}-${rand}`;
};

/**
 * Safe querySelector with type casting
 * @param id - Element ID
 */
const getEl = <T extends HTMLElement>(id: string): T | null =>
  document.getElementById(id) as T | null;

/* ============================================================
   LOADER
   ============================================================ */
window.addEventListener('load', (): void => {
  const loader = getEl<HTMLDivElement>('loader');
  if (!loader) return;
  setTimeout(() => loader.classList.add('hidden'), 900);
});

/* ============================================================
   NAVBAR
   ============================================================ */
(function initNavbar(): void {
  const navbar   = getEl<HTMLElement>('navbar');
  const toggle   = getEl<HTMLButtonElement>('navToggle');
  const menu     = getEl<HTMLElement>('navMenu');
  const navLinks = document.querySelectorAll<HTMLAnchorElement>('.nav-link');

  const handleScroll = (): void => {
    navbar?.classList.toggle('scrolled', window.scrollY > 20);
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  toggle?.addEventListener('click', (): void => {
    const isOpen = menu?.classList.toggle('open') ?? false;
    toggle.classList.toggle('open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.forEach(link => {
    link.addEventListener('click', (): void => {
      menu?.classList.remove('open');
      toggle?.classList.remove('open');
      toggle?.setAttribute('aria-expanded', 'false');
    });
  });

  // Active section tracking
  const sections = document.querySelectorAll<HTMLElement>('section[id]');
  const trackActive = (): void => {
    let current = '';
    sections.forEach(sec => {
      if (sec.getBoundingClientRect().top <= 100) current = sec.id;
    });
    navLinks.forEach(link => {
      const href = link.getAttribute('href')?.replace('#', '');
      link.classList.toggle('active', href === current);
    });
  };

  window.addEventListener('scroll', trackActive, { passive: true });
})();

/* ============================================================
   FADE-UP OBSERVER
   ============================================================ */
(function initFadeUp(): void {
  const items = document.querySelectorAll<HTMLElement>('.fade-up');
  if (!items.length) return;

  const observer = new IntersectionObserver(
    (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          (entry.target as HTMLElement).classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  items.forEach(el => observer.observe(el));
})();

/* ============================================================
   ANIMATED COUNTERS
   ============================================================ */
(function initCounters(): void {
  const counters = document.querySelectorAll<HTMLElement>('[data-counter]');

  const animate = (el: HTMLElement, target: number): void => {
    const duration = 1800;
    const start    = performance.now();

    const tick = (now: number): void => {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target).toLocaleString('es-CO');
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver(
    (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el     = entry.target as HTMLElement;
          const target = parseInt(el.dataset['counter'] ?? '0', 10);
          animate(el, target);
          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(el => observer.observe(el));
})();

/* ============================================================
   PROGRESS BARS
   ============================================================ */
(function initProgressBars(): void {
  const bars = document.querySelectorAll<HTMLElement>('.progress-bar__fill[data-pct]');

  const observer = new IntersectionObserver(
    (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el  = entry.target as HTMLElement;
          const pct = el.dataset['pct'] ?? '0';
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
   VALIDATION SERVICE
   ============================================================ */
class ValidationService {
  static validateRequired(value: string): boolean {
    return value.trim().length > 0;
  }

  static validateEmail(email: string): boolean {
    return EMAIL_REGEX.test(email.trim());
  }

  static validatePhone(phone: string): boolean {
    return PHONE_REGEX.test(phone.trim());
  }

  static validateCoordinates(lat: number, lng: number): boolean {
    return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
  }

  static validatePhoto(file: File | null): boolean {
    if (!file) return false;
    if (!file.type.startsWith('image/')) return false;
    if (file.size > MAX_PHOTO_SIZE_BYTES) return false;
    return true;
  }

  static validateDescription(desc: string): { valid: boolean; message: string } {
    if (!desc.trim()) return { valid: false, message: 'La descripción es obligatoria.' };
    if (desc.trim().length < 20) return { valid: false, message: 'Mínimo 20 caracteres.' };
    return { valid: true, message: '' };
  }

  /**
   * Validates entire form and returns result
   */
  static validateForm(): ValidationResult {
    const errors: Record<string, string> = {};
    let valid = true;

    const fullName = (getEl<HTMLInputElement>('fullName')?.value ?? '');
    if (!this.validateRequired(fullName)) {
      errors['fullName'] = 'El nombre es obligatorio.';
      valid = false;
    }

    const docId = (getEl<HTMLInputElement>('docId')?.value ?? '');
    if (!this.validateRequired(docId)) {
      errors['docId'] = 'El documento es obligatorio.';
      valid = false;
    }

    const phone = (getEl<HTMLInputElement>('phone')?.value ?? '');
    if (!this.validateRequired(phone)) {
      errors['phone'] = 'El teléfono es obligatorio.';
      valid = false;
    } else if (!this.validatePhone(phone)) {
      errors['phone'] = 'Ingresa un teléfono válido.';
      valid = false;
    }

    const email = (getEl<HTMLInputElement>('email')?.value ?? '');
    if (!this.validateRequired(email)) {
      errors['email'] = 'El correo es obligatorio.';
      valid = false;
    } else if (!this.validateEmail(email)) {
      errors['email'] = 'Ingresa un correo válido.';
      valid = false;
    }

    const checked = document.querySelector<HTMLInputElement>(
      'input[name="incidentType"]:checked'
    );
    if (!checked) {
      errors['incidentType'] = 'Selecciona el tipo de incidente.';
      valid = false;
    }

    const latVal = getEl<HTMLInputElement>('lat')?.value ?? '';
    const lngVal = getEl<HTMLInputElement>('lng')?.value ?? '';
    if (!latVal || !lngVal) {
      errors['coords'] = 'Obtén tu ubicación antes de enviar.';
      valid = false;
    } else if (!this.validateCoordinates(parseFloat(latVal), parseFloat(lngVal))) {
      errors['coords'] = 'Coordenadas fuera de rango.';
      valid = false;
    }

    const photoInput = getEl<HTMLInputElement>('photoInput');
    const photoFile  = photoInput?.files?.[0] ?? null;
    if (!this.validatePhoto(photoFile)) {
      errors['photo'] = 'La fotografía del incidente es obligatoria (JPG/PNG/WEBP · max 10 MB).';
      valid = false;
    }

    const desc = getEl<HTMLTextAreaElement>('description')?.value ?? '';
    const descResult = this.validateDescription(desc);
    if (!descResult.valid) {
      errors['description'] = descResult.message;
      valid = false;
    }

    return { valid, errors };
  }
}

/* ============================================================
   FORM UI HELPERS
   ============================================================ */
const FormUI = {
  setInvalid(id: string): void {
    getEl(id)?.classList.add('invalid');
  },
  setValid(id: string): void {
    getEl(id)?.classList.remove('invalid');
  },
  setError(errId: string, msg: string): void {
    const el = getEl(errId);
    if (el) el.textContent = msg;
  },
  clearError(errId: string): void {
    const el = getEl(errId);
    if (el) el.textContent = '';
  },
  applyErrors(errors: Record<string, string>): void {
    const fieldMap: Record<string, string> = {
      fullName:     'err-fullName',
      docId:        'err-docId',
      phone:        'err-phone',
      email:        'err-email',
      incidentType: 'err-incidentType',
      coords:       'err-coords',
      photo:        'err-photo',
      description:  'err-description',
    };

    // Reset first
    Object.keys(fieldMap).forEach(key => {
      FormUI.setValid(key);
      FormUI.clearError(fieldMap[key]!);
    });

    // Apply errors
    Object.entries(errors).forEach(([key, msg]) => {
      FormUI.setInvalid(key);
      if (fieldMap[key]) FormUI.setError(fieldMap[key]!, msg);
    });

    // Special cases
    if (errors['coords']) {
      FormUI.setInvalid('lat');
      FormUI.setInvalid('lng');
    }
    if (errors['photo']) {
      getEl('uploadZone')?.classList.add('invalid');
    }
  },
};

/* ============================================================
   GEOLOCATION SERVICE
   ============================================================ */
class GeoService {
  static getCurrentPosition(): Promise<Coordinates> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocalización no soportada.'));
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos: GeolocationPosition) => resolve({
          latitude:  pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy:  pos.coords.accuracy,
        }),
        (err: GeolocationPositionError) => reject(err),
        { enableHighAccuracy: true, timeout: 10000 }
      );
    });
  }
}

(function initGeo(): void {
  const btn    = getEl<HTMLButtonElement>('geoBtn');
  const latEl  = getEl<HTMLInputElement>('lat');
  const lngEl  = getEl<HTMLInputElement>('lng');
  const status = getEl<HTMLElement>('geoStatus');
  if (!btn) return;

  const showStatus = (msg: string, type: 'info' | 'success' | 'error'): void => {
    if (!status) return;
    status.textContent = msg;
    const colorMap = { info: 'var(--color-accent)', success: 'var(--color-success)', error: 'var(--color-danger)' };
    status.style.color = colorMap[type];
  };

  btn.addEventListener('click', async (): Promise<void> => {
    btn.classList.add('loading');
    btn.disabled = true;
    showStatus('Obteniendo ubicación…', 'info');

    try {
      const coords = await GeoService.getCurrentPosition();
      if (latEl) latEl.value = coords.latitude.toFixed(6);
      if (lngEl) lngEl.value = coords.longitude.toFixed(6);
      const acc = coords.accuracy ? `±${Math.round(coords.accuracy)}m` : '';
      showStatus(`✓ Ubicación obtenida ${acc}`, 'success');
      FormUI.setValid('lat');
      FormUI.setValid('lng');
      FormUI.clearError('err-coords');
    } catch (err) {
      const geoErr = err as GeolocationPositionError;
      const msgs: Record<number, string> = {
        1: 'Permiso denegado. Habilita la ubicación en tu navegador.',
        2: 'Ubicación no disponible.',
        3: 'Tiempo agotado. Intenta de nuevo.',
      };
      showStatus(msgs[geoErr.code] ?? 'Error al obtener ubicación.', 'error');
    } finally {
      btn.classList.remove('loading');
      btn.disabled = false;
    }
  });
})();

/* ============================================================
   PHOTO UPLOAD
   ============================================================ */
(function initUpload(): void {
  const zone       = getEl<HTMLDivElement>('uploadZone');
  const input      = getEl<HTMLInputElement>('photoInput');
  const prompt     = getEl<HTMLDivElement>('uploadPrompt');
  const preview    = getEl<HTMLDivElement>('uploadPreview');
  const previewImg = getEl<HTMLImageElement>('previewImg');
  const removeBtn  = getEl<HTMLButtonElement>('removePhoto');
  if (!zone || !input) return;

  const showPreview = (file: File): boolean => {
    if (!file.type.startsWith('image/')) {
      showToast('Solo se aceptan imágenes (JPG, PNG, WEBP).', 'error');
      return false;
    }
    if (file.size > MAX_PHOTO_SIZE_BYTES) {
      showToast('La imagen supera el tamaño máximo de 10 MB.', 'error');
      return false;
    }
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>): void => {
      if (previewImg && e.target?.result) {
        previewImg.src = e.target.result as string;
      }
      if (prompt) prompt.style.display = 'none';
      if (preview) preview.style.display = 'block';
      zone.classList.remove('invalid');
      FormUI.clearError('err-photo');
    };
    reader.readAsDataURL(file);
    return true;
  };

  input.addEventListener('change', (): void => {
    const file = input.files?.[0];
    if (file) showPreview(file);
  });

  zone.addEventListener('dragover', (e: DragEvent): void => {
    e.preventDefault();
    zone.classList.add('drag-over');
  });

  zone.addEventListener('dragleave', (): void => zone.classList.remove('drag-over'));

  zone.addEventListener('drop', (e: DragEvent): void => {
    e.preventDefault();
    zone.classList.remove('drag-over');
    const file = e.dataTransfer?.files?.[0];
    if (file) {
      const dt = new DataTransfer();
      dt.items.add(file);
      input.files = dt.files;
      showPreview(file);
    }
  });

  zone.addEventListener('keydown', (e: KeyboardEvent): void => {
    if (e.key === 'Enter' || e.key === ' ') input.click();
  });

  removeBtn?.addEventListener('click', (e: MouseEvent): void => {
    e.stopPropagation();
    input.value = '';
    if (previewImg) previewImg.src = '';
    if (preview) preview.style.display = 'none';
    if (prompt) prompt.style.display = '';
  });
})();

/* ============================================================
   CHAR COUNTER
   ============================================================ */
(function initCharCounter(): void {
  const textarea = getEl<HTMLTextAreaElement>('description');
  const counter  = getEl<HTMLElement>('charCount');
  if (!textarea || !counter) return;
  textarea.addEventListener('input', (): void => {
    counter.textContent = String(textarea.value.length);
  });
})();

/* ============================================================
   FORM SUBMIT
   ============================================================ */
(function initForm(): void {
  const form      = getEl<HTMLFormElement>('reportForm');
  const submitBtn = getEl<HTMLButtonElement>('submitBtn');
  if (!form || !submitBtn) return;

  form.addEventListener('submit', async (e: Event): Promise<void> => {
    e.preventDefault();

    const result = ValidationService.validateForm();
    if (!result.valid) {
      FormUI.applyErrors(result.errors);
      showToast('Por favor, corrige los errores del formulario.', 'error');
      const firstInvalid = form.querySelector<HTMLElement>('.invalid, .field-error:not(:empty)');
      firstInvalid?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    try {
      await sleep(2000); // Simula llamada al backend n8n
      const ticketId = generateTicketId();
      showToast(`✓ Reporte enviado. Ticket: ${ticketId}`, 'success', 6000);

      const ticketInput = getEl<HTMLInputElement>('ticketId');
      if (ticketInput) ticketInput.value = ticketId;

      form.reset();
      const charCount = getEl<HTMLElement>('charCount');
      if (charCount) charCount.textContent = '0';
      const previewImg = getEl<HTMLImageElement>('previewImg');
      if (previewImg) previewImg.src = '';
      const uploadPreview = getEl<HTMLElement>('uploadPreview');
      if (uploadPreview) uploadPreview.style.display = 'none';
      const uploadPrompt = getEl<HTMLElement>('uploadPrompt');
      if (uploadPrompt) uploadPrompt.style.display = '';
      const geoStatus = getEl<HTMLElement>('geoStatus');
      if (geoStatus) geoStatus.textContent = '';
    } finally {
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
    }
  });
})();

/* ============================================================
   TICKET LOOKUP
   ============================================================ */
(function initTicketCheck(): void {
  const checkBtn    = getEl<HTMLButtonElement>('checkTicket');
  const ticketInput = getEl<HTMLInputElement>('ticketId');
  const resultDiv   = getEl<HTMLDivElement>('ticketResult');
  const demoBtn     = document.querySelector<HTMLButtonElement>('.demo-ticket');
  if (!checkBtn || !ticketInput || !resultDiv) return;

  const lookup = async (id: string): Promise<void> => {
    resultDiv.innerHTML = `<p style="color:rgba(255,255,255,.4);font-size:.85rem">Consultando…</p>`;
    await sleep(700);

    const ticket = MOCK_TICKETS[id.toUpperCase()];
    if (!ticket) {
      resultDiv.innerHTML = `<p style="color:var(--color-danger);font-size:.85rem">
        <i class="ri-error-warning-line"></i> Ticket no encontrado.</p>`;
      return;
    }

    const stepsHTML = TICKET_STEPS.map((step, i): string => {
      const idx      = i + 1;
      const isDone   = idx < ticket.status;
      const isActive = idx === ticket.status;
      const cls      = isDone ? 'done' : isActive ? 'active' : '';
      const dot      = isDone
        ? '<i class="ri-check-line"></i>'
        : isActive
        ? '<i class="ri-refresh-line"></i>'
        : String(idx);
      return `
        <div class="progress-step ${cls}">
          <div class="step-dot">${dot}</div>
          <span>${step.label}</span>
        </div>`;
    }).join('');

    resultDiv.innerHTML = `
      <div class="ticket-progress">
        <div class="ticket-info">
          <h4>${ticket.id}</h4>
          <p>${ticket.type} · ${ticket.address}</p>
        </div>
        ${stepsHTML}
      </div>`;
  };

  checkBtn.addEventListener('click', (): void => {
    const id = ticketInput.value.trim();
    if (!id) { showToast('Ingresa un número de ticket.', 'error'); return; }
    void lookup(id);
  });

  ticketInput.addEventListener('keydown', (e: KeyboardEvent): void => {
    if (e.key === 'Enter') checkBtn.click();
  });

  demoBtn?.addEventListener('click', (): void => {
    ticketInput.value = demoBtn.dataset['ticket'] ?? '';
    checkBtn.click();
  });
})();

/* ============================================================
   TOAST
   ============================================================ */
let _toastTimeout: ReturnType<typeof setTimeout>;

function showToast(msg: string, type: ToastType = 'info', duration = 4000): void {
  const toast = getEl<HTMLDivElement>('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.className = `toast toast--${type} show`;
  clearTimeout(_toastTimeout);
  _toastTimeout = setTimeout(() => toast.classList.remove('show'), duration);
}

/* ============================================================
   SMOOTH SCROLL
   ============================================================ */
document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e: MouseEvent): void => {
    const id  = link.getAttribute('href')?.slice(1);
    const sec = id ? document.getElementById(id) : null;
    if (sec) {
      e.preventDefault();
      const navH = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--navbar-h') || '68',
        10
      );
      const top = sec.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ============================================================
   CHARTS
   ============================================================ */
(function initBarChart(): void {
  const barChart = getEl<HTMLDivElement>('barChart');
  if (!barChart) return;

  const maxVal = Math.max(...BAR_CHART_DATA.map(d => d.value));
  barChart.innerHTML = '';

  BAR_CHART_DATA.forEach(item => {
    const pct = (item.value / maxVal) * 100;
    const div = document.createElement('div');
    div.className = 'bar-item';
    div.innerHTML = `
      <div class="bar-item__bar" data-value="${item.value}"
           style="height:0%;background:${item.color};
                  transition:height 1s cubic-bezier(.4,0,.2,1)"></div>
      <span class="bar-item__label">${item.label}</span>`;
    barChart.appendChild(div);

    const bar = div.querySelector<HTMLElement>('.bar-item__bar');
    if (!bar) return;

    const obs = new IntersectionObserver(entries => {
      if (entries[0]?.isIntersecting) {
        setTimeout(() => { bar.style.height = `${pct}%`; }, 100);
        obs.disconnect();
      }
    }, { threshold: 0.3 });
    obs.observe(div);
  });
})();

(function initLineChart(): void {
  const lineChart = getEl<HTMLDivElement>('lineChart');
  if (!lineChart) return;

  const points = [22, 18, 26, 15, 19, 14, 21, 17, 13, 20, 16, 18];
  const labels = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
  const W = 400, H = 160, padX = 20, padY = 20;
  const maxP = Math.max(...points);
  const minP = Math.min(...points);

  const scaleX = (i: number): number => padX + (i / (points.length - 1)) * (W - padX * 2);
  const scaleY = (v: number): number => H - padY - ((v - minP) / (maxP - minP)) * (H - padY * 2);

  const pathD  = points.map((v, i) => `${i === 0 ? 'M' : 'L'}${scaleX(i)},${scaleY(v)}`).join(' ');
  const areaD  = `${pathD} L${scaleX(points.length-1)},${H} L${scaleX(0)},${H} Z`;

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);

  svg.innerHTML = `
    <defs>
      <linearGradient id="lineGrad2" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#3B82F6" stop-opacity="0.2"/>
        <stop offset="100%" stop-color="#3B82F6" stop-opacity="0"/>
      </linearGradient>
    </defs>
    <path d="${areaD}" fill="url(#lineGrad2)"/>
    <path d="${pathD}" fill="none" stroke="#3B82F6" stroke-width="2.5"
          stroke-linecap="round" stroke-linejoin="round"
          stroke-dasharray="1000" stroke-dashoffset="1000" class="line-path"/>
    ${points.map((v, i) => `
      <circle cx="${scaleX(i)}" cy="${scaleY(v)}" r="4"
              fill="#fff" stroke="#3B82F6" stroke-width="2" opacity="0">
        <title>${labels[i]}: ${v}h</title>
      </circle>`).join('')}
    ${labels.map((l, i) => `
      <text x="${scaleX(i)}" y="${H}" text-anchor="middle"
            font-size="10" fill="#94A3B8">${l}</text>`).join('')}`;

  lineChart.appendChild(svg);

  const obs = new IntersectionObserver(entries => {
    if (entries[0]?.isIntersecting) {
      const path = svg.querySelector<SVGPathElement>('.line-path');
      if (path) {
        path.style.transition = 'stroke-dashoffset 1.8s cubic-bezier(.4,0,.2,1)';
        path.style.strokeDashoffset = '0';
      }
      svg.querySelectorAll<SVGCircleElement>('circle').forEach((c, i) => {
        setTimeout(() => c.setAttribute('opacity', '1'), i * 100 + 400);
      });
      obs.disconnect();
    }
  }, { threshold: 0.3 });
  obs.observe(lineChart);
})();

/* ============================================================
   INDICATOR BARS
   ============================================================ */
(function initIndicatorBars(): void {
  const bars = document.querySelectorAll<HTMLElement>('.indicator__bar div');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target as HTMLElement;
        const target = el.style.width;
        el.style.width = '0';
        setTimeout(() => { el.style.width = target; }, 150);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.4 });
  bars.forEach(b => obs.observe(b));
})();
