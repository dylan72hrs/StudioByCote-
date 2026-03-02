/**
 * ============================================
 * RESERVATION.JS — Sistema de reserva completo
 * Studio By Cote
 * ============================================
 * 5 pasos: Servicios → Fecha/Hora → Pago → Datos → Confirmar
 * Integración N8N vía Webhooks (PRODUCCIÓN). Flatpickr calendar.
 */

(function () {
    'use strict';

    // =============================================
    // N8N WEBHOOK ENDPOINTS — PRODUCCIÓN
    // =============================================
    var N8N_BASE = 'https://n8nstudio-b9afe5bvcue9e5gv.brazilsouth-01.azurewebsites.net';

    var API = {
        AVAILABILITY: N8N_BASE + '/webhook/availability',
        UPLOAD_PROOF: N8N_BASE + '/webhook/upload-proof',
        CREATE_BOOKING: N8N_BASE + '/webhook/create-booking'
    };

    // =============================================
    // STATE CENTRAL
    // =============================================
    var state = {
        services: [],
        date: null,
        time: null,
        takenSlots: [],
        proofFile: null,
        proofBlobUrl: null,
        proofFileUrl: null,       // URL devuelta por /upload-proof
        clientName: '',
        clientEmail: '',
        clientWA: '',
        step: 1,
        submitting: false,
        uploading: false,
        detailService: null,
        sessionId: 'SES-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6)
    };

    // =============================================
    // HELPERS
    // =============================================
    function $(s) { return document.querySelector(s); }
    function $$(s) { return document.querySelectorAll(s); }
    function fmtDate(iso) {
        if (!iso) return '-';
        var p = iso.split('-');
        return p[2] + '/' + p[1] + '/' + p[0];
    }

    // =============================================
    // DOM CACHE
    // =============================================
    var els = {};

    function cacheDom() {
        els.stepPanels = $$('.rv-step');
        els.stepDots = $$('.rv-indicator .step-dot');
        // Step 1
        els.search = $('#service-search');
        els.catFilter = $('#category-filter');
        els.svList = $('#services-list');
        els.cartList = $('#cart-items');
        els.cartTotal = $('#cart-total');
        els.cartDur = $('#cart-duration');
        els.cartCount = $('#cart-count');
        els.cartEmpty = $('#cart-empty');
        els.btnStep2 = $('#btn-to-step2');
        // Detail panel
        els.detailPanel = $('#sv-detail-panel');
        els.detailClose = $('#sv-detail-close');
        els.detailName = $('#sv-detail-name');
        els.detailPrice = $('#sv-detail-price');
        els.detailDuration = $('#sv-detail-duration');
        els.detailDesc = $('#sv-detail-desc');
        els.detailIncludes = $('#sv-detail-includes');
        els.detailWarning = $('#sv-detail-warning');
        els.detailAdd = $('#sv-detail-add');
        // Step 2
        els.dateInput = $('#rv-date');
        els.timeSlots = $('#rv-time-slots');
        els.btnStep3 = $('#btn-to-step3');
        els.btnBack1 = $('#btn-back-1');
        els.noSlots = $('#no-slots-msg');
        els.monthLabel = $('#current-month-label');
        // Step 3
        els.fileInput = $('#proof-file');
        els.filePreview = $('#file-preview');
        els.fileName = $('#file-name');
        els.fileSize = $('#file-size');
        els.btnRemoveFile = $('#btn-remove-file');
        els.btnStep4 = $('#btn-to-step4');
        els.btnBack2 = $('#btn-back-2');
        els.fileError = $('#file-error');
        // Step 4
        els.inputName = $('#client-name');
        els.inputEmail = $('#client-email');
        els.inputWA = $('#client-whatsapp');
        els.btnStep5 = $('#btn-to-step5');
        els.btnBack3 = $('#btn-back-3');
        // Step 5
        els.sumSvcs = $('#summary-services');
        els.sumTotal = $('#summary-total');
        els.sumDur = $('#summary-duration');
        els.sumDate = $('#summary-date');
        els.sumTime = $('#summary-time');
        els.sumClient = $('#summary-client');
        els.sumProof = $('#summary-proof');
        els.btnConfirm = $('#btn-confirm');
        els.btnBack4 = $('#btn-back-4');
        els.btnWA = $('#btn-whatsapp');
        els.loader = $('#confirm-loader');
        els.error = $('#confirm-error');
    }

    // =============================================
    // INIT
    // =============================================
    function init() {
        cacheDom();
        buildCategories();
        renderServices('all', '');
        setupFlatpickr();
        bindAll();
        preselect();
    }

    // =============================================
    // FLATPICKR — Premium calendar, current month only
    // =============================================
    var fpInstance = null;

    function setupFlatpickr() {
        var now = new Date();
        var year = now.getFullYear();
        var month = now.getMonth();
        var today = new Date(year, month, now.getDate());
        var lastDay = new Date(year, month + 1, 0);

        var monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        if (els.monthLabel) els.monthLabel.textContent = monthNames[month] + ' ' + year;

        fpInstance = flatpickr(els.dateInput, {
            locale: 'es',
            dateFormat: 'Y-m-d',
            altInput: true,
            altFormat: 'j \\de F, Y',
            minDate: today,
            maxDate: lastDay,
            disableMobile: false,
            monthSelectorType: 'static',
            animate: true,
            theme: 'dark',
            onReady: function (selectedDates, dateStr, instance) {
                var nav = instance.calendarContainer.querySelectorAll('.flatpickr-prev-month, .flatpickr-next-month');
                nav.forEach(function (el) { el.style.display = 'none'; });
            },
            onChange: function (selectedDates) {
                if (selectedDates.length > 0) {
                    var d = selectedDates[0];
                    state.date = formatISO(d);
                    state.time = null;
                    checkStep2();
                    fetchSlots(state.date);
                } else {
                    state.date = null;
                    state.time = null;
                    checkStep2();
                    els.timeSlots.innerHTML = '<p style="color:#888;">Selecciona una fecha primero.</p>';
                }
            }
        });
    }

    function formatISO(d) {
        return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    }

    // =============================================
    // STEP 1: CATALOG + SEARCH + CART
    // =============================================
    function buildCategories() {
        var cats = getCategories();
        var html = '<option value="all">Todas las categorías</option>';
        cats.forEach(function (c) { html += '<option value="' + c + '">' + c + '</option>'; });
        els.catFilter.innerHTML = html;
    }

    function renderServices(cat, query) {
        query = (query || '').toLowerCase().trim();
        var list = SERVICES_DATA;
        if (cat !== 'all') list = list.filter(function (s) { return s.category === cat; });
        if (query.length >= 2) {
            list = list.filter(function (s) {
                var haystack = (s.name + ' ' + s.category + ' ' + (s.desc || '')).toLowerCase();
                return haystack.indexOf(query) !== -1;
            });
        }
        var html = '';
        list.forEach(function (s) {
            var sel = state.services.some(function (x) { return x.id === s.id; });
            var hasWarn = s.warning && s.warning.indexOf('HERPES') !== -1;
            html += '<div class="sv-row' + (sel ? ' sv-selected' : '') + (hasWarn ? ' sv-has-warn' : '') + '" data-id="' + s.id + '">'
                + '<div class="sv-info">'
                + '<h4>' + s.name + '</h4>'
                + '<span class="sv-meta">' + s.duration + ' min · ' + formatCLP(s.price) + '</span>'
                + (hasWarn ? '<span class="sv-warn-badge"><i class="fas fa-exclamation-triangle"></i> Requiere evaluación</span>' : '')
                + '</div>'
                + '<div class="sv-actions">'
                + '<button class="sv-info-btn" data-id="' + s.id + '" aria-label="Ver detalle"><i class="fas fa-info-circle"></i></button>'
                + '<button class="sv-toggle" aria-label="' + (sel ? 'Quitar' : 'Agregar') + '">'
                + '<i class="fas ' + (sel ? 'fa-check' : 'fa-plus') + '"></i></button>'
                + '</div></div>';
        });
        if (list.length === 0) {
            html = '<p style="color:#888; text-align:center; padding:20px;">No se encontraron servicios.</p>';
        }
        els.svList.innerHTML = html;
    }

    function toggleSvc(id) {
        var exists = state.services.some(function (s) { return s.id === id; });
        if (exists) {
            state.services = state.services.filter(function (s) { return s.id !== id; });
        } else {
            var svc = SERVICES_DATA.find(function (s) { return s.id === id; });
            if (svc) state.services.push(svc);
        }
        updateCart();
    }

    function updateCart() {
        var total = 0, dur = 0, html = '';
        state.services.forEach(function (s) {
            total += s.price; dur += s.duration;
            html += '<div class="cart-row" data-id="' + s.id + '">'
                + '<span class="cart-name">' + s.name + '</span>'
                + '<span class="cart-price">' + formatCLP(s.price) + '</span>'
                + '<button class="cart-remove" aria-label="Quitar"><i class="fas fa-times"></i></button></div>';
        });
        els.cartList.innerHTML = html;
        els.cartTotal.textContent = formatCLP(total);
        els.cartDur.textContent = dur + ' min';
        els.cartCount.textContent = state.services.length;
        els.cartEmpty.style.display = state.services.length === 0 ? 'block' : 'none';
        els.btnStep2.disabled = state.services.length === 0;
        renderServices(els.catFilter.value, els.search.value);
    }

    // =============================================
    // SERVICE DETAIL PANEL
    // =============================================
    function showDetail(id) {
        var svc = SERVICES_DATA.find(function (s) { return s.id === id; });
        if (!svc) return;
        state.detailService = svc;

        els.detailName.textContent = svc.name;
        els.detailPrice.textContent = formatCLP(svc.price);
        els.detailDuration.textContent = svc.duration + ' min';
        els.detailDesc.textContent = svc.desc || '';

        // Includes
        if (svc.includes && svc.includes.length) {
            var li = '<h4><i class="fas fa-check-circle" style="color:var(--accent);"></i> Qué incluye:</h4><ul class="detail-includes-list">';
            svc.includes.forEach(function (i) { li += '<li>' + i + '</li>'; });
            li += '</ul>';
            els.detailIncludes.innerHTML = li;
        } else {
            els.detailIncludes.innerHTML = '';
        }

        // Warning
        if (svc.warning) {
            els.detailWarning.innerHTML = '<i class="fas fa-exclamation-triangle"></i> ' + svc.warning;
            els.detailWarning.style.display = 'block';
        } else {
            els.detailWarning.style.display = 'none';
        }

        // Update add button
        var inCart = state.services.some(function (x) { return x.id === id; });
        els.detailAdd.innerHTML = inCart
            ? '<i class="fas fa-check"></i> Ya en el carrito'
            : '<i class="fas fa-plus"></i> Agregar al carrito';
        els.detailAdd.disabled = inCart;

        els.detailPanel.style.display = 'block';
        els.detailPanel.scrollTop = 0;
    }

    function closeDetail() {
        els.detailPanel.style.display = 'none';
        state.detailService = null;
    }

    // =============================================
    // STEP 2: DATE/TIME — Availability from N8N
    // =============================================
    var MANUAL_BLOCKS = {
        '2026-03-02': ['14:00'],
        '2026-03-03': ['10:00'],
        '2026-03-04': ['10:00', '11:00', '12:00', '14:00', '15:00', '16:00'],
        '2026-03-06': ['16:00'],
        '2026-03-12': ['15:00'],
        '2026-03-13': ['10:00', '11:00', '12:00', '14:00', '15:00', '16:00'],
        '2026-03-14': ['10:00', '11:00', '12:00', '14:00', '15:00', '16:00'],
        '2026-03-16': ['10:00', '11:00', '12:00', '14:00', '15:00', '16:00'],
        '2026-03-23': ['10:00', '11:00']
    };

    function fetchSlots(dateStr) {
        els.timeSlots.innerHTML = '<p style="color:var(--soft);"><i class="fas fa-spinner fa-spin"></i> Cargando horarios...</p>';

        fetch(API.AVAILABILITY + '?date=' + dateStr)
            .then(function (r) { return r.json(); })
            .then(function (data) {
                var tk = (data && data.taken) ? data.taken : [];
                // Merge manual blocks
                if (MANUAL_BLOCKS[dateStr]) {
                    MANUAL_BLOCKS[dateStr].forEach(function (t) { if (tk.indexOf(t) === -1) tk.push(t); });
                }
                state.takenSlots = tk;
                renderSlots();
            })
            .catch(function () {
                console.warn('N8N availability endpoint unreachable — using manual blocks only.');
                var tk = [];
                if (MANUAL_BLOCKS[dateStr]) {
                    MANUAL_BLOCKS[dateStr].forEach(function (t) { tk.push(t); });
                }
                state.takenSlots = tk;
                renderSlots();
            });
    }

    function renderSlots() {
        var slots = ['10:00', '11:00', '12:00', '14:00', '15:00', '16:00'];
        var html = '', avail = 0;
        slots.forEach(function (t) {
            var taken = state.takenSlots.indexOf(t) !== -1;
            var sel = state.time === t;
            if (taken) {
                html += '<button class="time-slot-btn ts-taken" disabled title="Ocupado">' + t + '</button>';
            } else {
                avail++;
                html += '<button class="time-slot-btn' + (sel ? ' ts-selected' : '') + '" data-time="' + t + '">' + t + '</button>';
            }
        });
        els.timeSlots.innerHTML = html;
        if (els.noSlots) els.noSlots.style.display = avail === 0 ? 'block' : 'none';
    }

    function checkStep2() {
        els.btnStep3.disabled = !(state.date && state.time);
    }

    // =============================================
    // STEP 3: FILE UPLOAD (comprobante)
    // =============================================
    function onFile(e) {
        var file = e.target.files && e.target.files[0];
        if (!file) return;

        var ok = ['image/jpeg', 'image/png', 'application/pdf'];
        if (ok.indexOf(file.type) === -1) { showFileErr('Solo JPG, PNG o PDF.'); els.fileInput.value = ''; return; }
        if (file.size > 10 * 1024 * 1024) { showFileErr('Máximo 10 MB.'); els.fileInput.value = ''; return; }

        state.proofFile = file;
        state.proofFileUrl = null; // Reset proof URL when new file is selected
        if (state.proofBlobUrl) URL.revokeObjectURL(state.proofBlobUrl);

        els.fileName.textContent = file.name;
        els.fileSize.textContent = (file.size / 1024 / 1024).toFixed(2) + ' MB';

        if (file.type.startsWith('image/')) {
            state.proofBlobUrl = URL.createObjectURL(file);
            els.filePreview.innerHTML = '<img src="' + state.proofBlobUrl + '" alt="Comprobante" class="proof-img-preview">';
        } else {
            els.filePreview.innerHTML = '<div class="proof-pdf-icon"><i class="fas fa-file-pdf"></i><span>PDF</span></div>';
        }

        var area = $('#upload-area');
        if (area) area.classList.add('has-file');
        els.btnRemoveFile.style.display = 'inline-flex';
        els.btnStep4.disabled = false;
        hideFileErr();
    }

    function removeFile() {
        state.proofFile = null;
        state.proofFileUrl = null;
        if (state.proofBlobUrl) { URL.revokeObjectURL(state.proofBlobUrl); state.proofBlobUrl = null; }
        els.fileInput.value = '';
        els.fileName.textContent = '';
        els.fileSize.textContent = '';
        els.filePreview.innerHTML = '';
        var area = $('#upload-area');
        if (area) area.classList.remove('has-file');
        els.btnRemoveFile.style.display = 'none';
        els.btnStep4.disabled = true;
    }

    function showFileErr(m) { if (els.fileError) { els.fileError.textContent = m; els.fileError.style.display = 'block'; } }
    function hideFileErr() { if (els.fileError) els.fileError.style.display = 'none'; }

    // =============================================
    // UPLOAD PROOF TO N8N (POST /webhook/upload-proof)
    // Called when user proceeds from Step 3 → Step 4
    // =============================================
    async function uploadProof() {
        if (!state.proofFile) return false;

        // If already uploaded successfully, skip re-upload
        if (state.proofFileUrl) return true;

        state.uploading = true;
        els.btnStep4.disabled = true;
        els.btnStep4.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subiendo comprobante...';

        try {
            var fd = new FormData();
            fd.append('sessionId', state.sessionId);
            fd.append('file', state.proofFile);

            var r = await tFetch(API.UPLOAD_PROOF, { method: 'POST', body: fd }, 30000);

            if (!r.ok) throw new Error('Upload failed: ' + r.status);

            var data = await r.json();

            // n8n returns: { sessionId, proofFileUrl, driveFileId, publicUrl }
            state.proofFileUrl = data.proofFileUrl || null;

            if (!state.proofFileUrl) {
                throw new Error('No proofFileUrl returned from server');
            }

            console.log('✅ Comprobante subido:', state.proofFileUrl);
            return true;
        } catch (e) {
            console.error('❌ Error subiendo comprobante:', e);
            showFileErr('Error al subir el comprobante. Intenta de nuevo.');
            return false;
        } finally {
            state.uploading = false;
            els.btnStep4.disabled = false;
            els.btnStep4.innerHTML = 'Continuar <i class="fas fa-arrow-right"></i>';
        }
    }

    // =============================================
    // STEP 4: CLIENT VALIDATION
    // =============================================
    function validateClient() {
        var n = els.inputName.value.trim();
        var e = els.inputEmail.value.trim();
        var w = els.inputWA.value.trim();

        var nOk = n.length >= 3;
        var eOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
        var wOk = /^\+56\d{8,9}$/.test(w);

        mark(els.inputName, nOk, n.length > 0);
        mark(els.inputEmail, eOk, e.length > 0);
        mark(els.inputWA, wOk, w.length > 0);

        els.btnStep5.disabled = !(nOk && eOk && wOk);
        if (nOk && eOk && wOk) {
            state.clientName = n;
            state.clientEmail = e;
            state.clientWA = w;
        }
        return nOk && eOk && wOk;
    }

    function mark(el, valid, touched) {
        el.classList.toggle('field-valid', valid && touched);
        el.classList.toggle('field-invalid', !valid && touched);
    }

    // =============================================
    // STEP 5: SUMMARY + SUBMIT
    // =============================================
    function renderSummary() {
        var total = 0, dur = 0, html = '';
        state.services.forEach(function (s) {
            total += s.price; dur += s.duration;
            html += '<div class="sum-row"><span>' + s.name + '</span><span>' + formatCLP(s.price) + '</span></div>';
        });
        els.sumSvcs.innerHTML = html;
        els.sumTotal.textContent = formatCLP(total);
        els.sumDur.textContent = dur + ' min';
        els.sumDate.textContent = fmtDate(state.date);
        els.sumTime.textContent = state.time || '-';

        els.sumClient.innerHTML = '<p><strong>' + state.clientName + '</strong></p>'
            + '<p><i class="fab fa-whatsapp" style="color:#25d366;"></i> ' + state.clientWA + '</p>'
            + '<p><i class="fas fa-envelope" style="color:var(--soft);"></i> ' + state.clientEmail + '</p>';

        els.sumProof.innerHTML = state.proofFileUrl
            ? '<i class="fas fa-check-circle" style="color:var(--accent);"></i> Comprobante subido correctamente'
            : (state.proofFile
                ? '<i class="fas fa-check-circle" style="color:var(--accent);"></i> ' + state.proofFile.name
                : '<i class="fas fa-times-circle" style="color:#ff6666;"></i> Sin comprobante');

        buildWAMsg(total);
    }

    function buildWAMsg(total) {
        var m = 'Hola, quiero reservar:\n\n';
        state.services.forEach(function (s) { m += '• ' + s.name + ': ' + formatCLP(s.price) + '\n'; });
        m += '\n💰 Total: ' + formatCLP(total);
        m += '\n📅 Fecha: ' + fmtDate(state.date);
        m += '\n🕐 Hora: ' + state.time;
        m += '\n\n👤 ' + state.clientName;
        m += '\n📱 ' + state.clientWA;
        m += '\n\nQuedo atenta/o a confirmación. ¡Gracias! ✨';
        els.btnWA.href = 'https://wa.me/message/JXGXGJEPIQZSI1?text=' + encodeURIComponent(m);
    }

    // =============================================
    // SUBMIT — POST /webhook/create-booking
    // =============================================
    async function submit() {
        if (state.submitting) return;

        // ---- Pre-flight validations ----
        if (!state.date || !state.time) {
            showError('Falta seleccionar fecha y hora.'); return;
        }
        if (!state.clientName || !state.clientEmail) {
            showError('Faltan datos del cliente.'); return;
        }
        if (state.services.length === 0) {
            showError('Debes seleccionar al menos un servicio.'); return;
        }
        if (!state.proofFileUrl) {
            showError('Falta el comprobante de pago. Vuelve al paso 3.'); return;
        }

        state.submitting = true;
        els.error.style.display = 'none';
        els.loader.style.display = 'flex';
        els.btnConfirm.disabled = true;

        try {
            // Calculate totals
            var totalPriceCLP = 0;
            var totalDurationMin = 0;
            state.services.forEach(function (s) {
                totalPriceCLP += s.price;
                totalDurationMin += s.duration;
            });

            // Build services array with EXACT field names n8n expects
            var servicesPayload = state.services.map(function (s) {
                return {
                    id: s.id,
                    name: s.name,
                    durationMin: s.duration,
                    priceCLP: s.price
                };
            });

            // Build payload with EXACT field names
            var payload = {
                bookingId: 'BK-' + Date.now(),
                sessionId: state.sessionId,
                date: state.date,
                time: state.time,
                clientName: state.clientName,
                clientEmail: state.clientEmail,
                clientWhatsApp: state.clientWA,
                services: servicesPayload,
                totalDurationMin: totalDurationMin,
                totalPriceCLP: totalPriceCLP,
                proofFileUrl: state.proofFileUrl
            };

            console.log('📤 Enviando reserva:', JSON.stringify(payload, null, 2));

            var res = await tFetch(API.CREATE_BOOKING, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            }, 15000);

            // Handle 409 — slot taken
            if (res.status === 409) {
                showError('⚠️ Hora no disponible, elige otra. Alguien acaba de reservar ese horario.');
                els.btnConfirm.disabled = false;
                // Re-fetch availability to update UI
                fetchSlots(state.date);
                return;
            }

            if (!res.ok) {
                var errText = '';
                try { errText = await res.text(); } catch (_) { }
                throw new Error('Error del servidor: ' + res.status + (errText ? ' — ' + errText : ''));
            }

            // Success
            console.log('✅ Reserva enviada correctamente.');
            showSuccess();

        } catch (err) {
            console.error('❌ Error al crear reserva:', err);
            showError('Error al enviar la reserva. Verifica tu conexión e intenta de nuevo.');
            els.btnConfirm.disabled = false;
        } finally {
            state.submitting = false;
            els.loader.style.display = 'none';
        }
    }

    function showError(msg) {
        els.error.textContent = msg;
        els.error.style.display = 'block';
    }

    function showSuccess() {
        // Replace confirm section with success message
        var section = $('.rv-summary-section');
        if (section) {
            section.innerHTML =
                '<div style="text-align:center; padding:40px 20px;">'
                + '<i class="fas fa-check-circle" style="font-size:4rem; color:var(--accent); margin-bottom:20px;"></i>'
                + '<h2 style="color:var(--soft); margin-bottom:15px;">¡Reserva enviada a confirmación! ✨</h2>'
                + '<p style="color:#ccc; max-width:400px; margin:0 auto 25px;">La dueña revisará tu comprobante y confirmará tu reserva. '
                + 'Te llegará un correo y/o mensaje de confirmación.</p>'
                + '<a href="index.html" class="btn-primary" style="display:inline-block; text-decoration:none; padding:14px 30px;">'
                + '<i class="fas fa-home"></i> Volver al inicio</a>'
                + '</div>';
        }
    }

    // =============================================
    // FETCH WITH TIMEOUT
    // =============================================
    function tFetch(url, opts, ms) {
        return new Promise(function (ok, fail) {
            var ac = new AbortController();
            var t = setTimeout(function () { ac.abort(); }, ms);
            fetch(url, Object.assign({}, opts, { signal: ac.signal }))
                .then(function (r) { clearTimeout(t); ok(r); })
                .catch(function (e) { clearTimeout(t); fail(e); });
        });
    }

    // =============================================
    // STEP NAVIGATION
    // =============================================
    function goStep(n) {
        state.step = n;
        els.stepPanels.forEach(function (p, i) { p.classList.toggle('active', i === n - 1); });
        els.stepDots.forEach(function (d, i) { d.classList.toggle('active', i < n); });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // =============================================
    // PRESELECTION (from URL param ?service=xxx)
    // =============================================
    function preselect() {
        var p = new URLSearchParams(window.location.search);
        var id = p.get('service');
        if (id && SHOWCASE_CARDS[id]) {
            var cat = SHOWCASE_CARDS[id].filterCategory;
            var svc = SERVICES_DATA.find(function (s) { return s.category === cat; });
            if (svc && !state.services.some(function (x) { return x.id === svc.id; })) {
                state.services.push(svc);
                updateCart();
            }
            els.catFilter.value = cat;
            renderServices(cat, '');
        }
    }

    // =============================================
    // EVENT BINDING
    // =============================================
    function bindAll() {
        // Search
        var searchTimer = null;
        els.search.addEventListener('input', function () {
            clearTimeout(searchTimer);
            searchTimer = setTimeout(function () {
                renderServices(els.catFilter.value, els.search.value);
            }, 200);
        });

        // Category
        els.catFilter.addEventListener('change', function () {
            renderServices(els.catFilter.value, els.search.value);
        });

        // Service list (delegation)
        els.svList.addEventListener('click', function (e) {
            var infoBtn = e.target.closest('.sv-info-btn');
            if (infoBtn) { e.stopPropagation(); showDetail(infoBtn.dataset.id); return; }
            var toggleBtn = e.target.closest('.sv-toggle');
            if (toggleBtn) { var row = toggleBtn.closest('.sv-row'); if (row) toggleSvc(row.dataset.id); return; }
            var row = e.target.closest('.sv-row');
            if (row) toggleSvc(row.dataset.id);
        });

        // Cart remove (delegation)
        els.cartList.addEventListener('click', function (e) {
            var btn = e.target.closest('.cart-remove');
            if (btn) { var row = btn.closest('.cart-row'); if (row) { state.services = state.services.filter(function (s) { return s.id !== row.dataset.id; }); updateCart(); } }
        });

        // Detail panel
        els.detailClose.addEventListener('click', closeDetail);
        els.detailAdd.addEventListener('click', function () {
            if (state.detailService) {
                toggleSvc(state.detailService.id);
                closeDetail();
            }
        });

        // Step nav: Step 1 → Step 2
        els.btnStep2.addEventListener('click', function () { goStep(2); });
        els.btnBack1.addEventListener('click', function () { goStep(1); });

        // Time slots (delegation)
        els.timeSlots.addEventListener('click', function (e) {
            var btn = e.target.closest('.time-slot-btn:not(:disabled)');
            if (btn && btn.dataset.time) {
                state.time = btn.dataset.time;
                $$('.time-slot-btn').forEach(function (b) { b.classList.remove('ts-selected'); });
                btn.classList.add('ts-selected');
                checkStep2();
            }
        });

        // Step 2 → Step 3
        els.btnStep3.addEventListener('click', function () { goStep(3); });
        els.btnBack2.addEventListener('click', function () { goStep(2); });

        // File input
        els.fileInput.addEventListener('change', onFile);
        els.btnRemoveFile.addEventListener('click', removeFile);

        // Step 3 → Step 4 (UPLOAD proof here, then advance)
        els.btnStep4.addEventListener('click', async function () {
            if (!state.proofFile) {
                showFileErr('Debes subir un comprobante antes de continuar.');
                return;
            }
            var success = await uploadProof();
            if (success) {
                goStep(4);
            }
        });
        els.btnBack3.addEventListener('click', function () { goStep(3); });

        // Client form validation
        els.inputName.addEventListener('input', validateClient);
        els.inputEmail.addEventListener('input', validateClient);
        els.inputWA.addEventListener('input', validateClient);

        // Step 4 → Step 5
        els.btnStep5.addEventListener('click', function () {
            if (validateClient()) { renderSummary(); goStep(5); }
        });
        els.btnBack4.addEventListener('click', function () { goStep(4); });

        // Submit booking
        els.btnConfirm.addEventListener('click', function (e) { e.preventDefault(); submit(); });
    }

    // =============================================
    // BOOT
    // =============================================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
