// =============================================
// BAFF Admin — UI Logic (sidebar, modal, toast, navigation, search, pagination)
// Requires: admin-data.js loaded first (provides sb, FORMS, loadAll, etc.)
// =============================================

// =============================================
// PANEL TITLES
// =============================================
const PANEL_TITLES = {
    dashboard: 'Dashboard',
    news: 'News',
    programma: 'Programma',
    ospiti: 'Ospiti',
    sponsor: 'Sponsor'
};

// =============================================
// LOGIN
// =============================================
const ADMIN_PASSWORD = 'baff2026admin';

document.getElementById('loginBtn').addEventListener('click', doLogin);
document.getElementById('loginPassword').addEventListener('keydown', e => {
    if (e.key === 'Enter') doLogin();
});

function doLogin() {
    const pw = document.getElementById('loginPassword').value;
    if (pw === ADMIN_PASSWORD) {
        sessionStorage.setItem('baff_admin', '1');
        showDashboard();
    } else {
        const err = document.getElementById('loginError');
        err.style.display = 'block';
        document.getElementById('loginPassword').classList.add('shake');
        setTimeout(() => document.getElementById('loginPassword').classList.remove('shake'), 400);
    }
}

document.getElementById('logoutBtn').addEventListener('click', () => {
    sessionStorage.removeItem('baff_admin');
    location.reload();
});

function showDashboard() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('adminDashboard').classList.add('active');
    loadAll();
}

if (sessionStorage.getItem('baff_admin')) showDashboard();

// =============================================
// SIDEBAR NAVIGATION
// =============================================
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
        const panel = item.dataset.panel;
        navigateTo(panel);
        closeSidebar();
    });
});

function navigateTo(panel) {
    // Update nav items
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    const activeNav = document.querySelector(`.nav-item[data-panel="${panel}"]`);
    if (activeNav) activeNav.classList.add('active');

    // Update panels
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    const targetPanel = document.getElementById('panel-' + panel);
    if (targetPanel) targetPanel.classList.add('active');

    // Update header title
    document.getElementById('headerTitle').textContent = PANEL_TITLES[panel] || panel;
}

// =============================================
// MOBILE SIDEBAR TOGGLE
// =============================================
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');

document.getElementById('menuToggle').addEventListener('click', () => {
    sidebar.classList.add('open');
    sidebarOverlay.classList.add('open');
});

function closeSidebar() {
    sidebar.classList.remove('open');
    sidebarOverlay.classList.remove('open');
}

sidebarOverlay.addEventListener('click', closeSidebar);

// =============================================
// QUICK ACTIONS (dashboard buttons)
// =============================================
document.querySelectorAll('.quick-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const type = btn.dataset.quick;
        navigateTo(type);
        setTimeout(() => openForm(type), 100);
    });
});

// =============================================
// SEARCH / FILTER
// =============================================
const searchTimers = {};
document.querySelectorAll('[data-search]').forEach(input => {
    input.addEventListener('input', () => {
        const type = input.dataset.search;
        clearTimeout(searchTimers[type]);
        searchTimers[type] = setTimeout(() => filterTable(type, input.value), 200);
    });
});

function filterTable(type, query) {
    const q = query.toLowerCase().trim();
    const tbody = document.getElementById('table-' + type);
    const rows = tbody.querySelectorAll('tr:not(.skeleton-row)');
    let visible = 0;

    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        const match = !q || text.includes(q);
        row.style.display = match ? '' : 'none';
        if (match) visible++;
    });

    document.getElementById('count-' + type).textContent = visible + ' elementi';
}

// =============================================
// MODAL
// =============================================
function openForm(type, data) {
    document.getElementById('form-type').value = type;
    document.getElementById('form-id').value = data ? data.id : '';
    document.getElementById('modalTitle').textContent = data ? 'Modifica ' + PANEL_TITLES[type] : 'Aggiungi ' + PANEL_TITLES[type];

    const fields = FORMS[type];
    const container = document.getElementById('formFields');
    container.innerHTML = fields.map(f => {
        const val = data ? (data[f.name] || '') : '';
        if (f.type === 'textarea') {
            return `<div class="form-group">
                <label>${f.label}</label>
                <textarea name="${f.name}" placeholder="Inserisci ${f.label.toLowerCase()}...">${esc(val)}</textarea>
                ${f.required ? '<div class="form-error">Campo obbligatorio</div>' : ''}
            </div>`;
        }
        if (f.type === 'select') {
            return `<div class="form-group">
                <label>${f.label}</label>
                <select name="${f.name}">${f.options.map(o =>
                    `<option value="${o}" ${val === o ? 'selected' : ''}>${o}</option>`
                ).join('')}</select>
            </div>`;
        }
        if (f.type === 'checkbox') {
            return `<div class="form-group">
                <label class="form-check">
                    <input type="checkbox" name="${f.name}" ${val ? 'checked' : ''}>
                    ${f.label}
                </label>
            </div>`;
        }
        if (f.type === 'file') {
            return `<div class="form-group">
                <label>${f.label}</label>
                <input type="file" name="${f.name}" accept="image/*">
                ${val ? '<p style="font-size:.8rem;color:var(--text-muted);margin-top:.3rem">Attuale: <a href="' + val + '" target="_blank" style="color:var(--accent)">vedi immagine</a></p>' : ''}
            </div>`;
        }
        return `<div class="form-group">
            <label>${f.label}</label>
            <input type="${f.type}" name="${f.name}" value="${esc(val)}" ${f.required ? 'required' : ''} placeholder="Inserisci ${f.label.toLowerCase()}...">
            ${f.required ? '<div class="form-error">Campo obbligatorio</div>' : ''}
        </div>`;
    }).join('');

    // Reset submit button
    const submitBtn = document.getElementById('formSubmitBtn');
    submitBtn.classList.remove('btn--loading');
    submitBtn.disabled = false;

    document.getElementById('modalOverlay').classList.add('open');
}

function closeModal() {
    document.getElementById('modalOverlay').classList.remove('open');
}

// Close modal on overlay click
document.getElementById('modalOverlay').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeModal();
});

// Close modal on Escape key
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        closeModal();
        closeConfirm();
    }
});

// Edit item — fetch from cache or reload
async function editItem(type, id) {
    const data = dataCache[type];
    if (data) {
        const item = data.find(d => d.id === id);
        if (item) { openForm(type, item); return; }
    }
    const freshData = await sb.select(type);
    const item = freshData.find(d => d.id === id);
    if (item) openForm(type, item);
}

// =============================================
// FORM SUBMIT
// =============================================
document.getElementById('entityForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validate required fields
    const type = document.getElementById('form-type').value;
    const id = document.getElementById('form-id').value;
    const fields = FORMS[type];
    let valid = true;

    // Clear previous errors
    document.querySelectorAll('.form-group').forEach(g => g.classList.remove('has-error'));

    for (const f of fields) {
        if (!f.required) continue;
        const el = e.target.querySelector('[name="' + f.name + '"]');
        if (el && !el.value.trim()) {
            el.closest('.form-group').classList.add('has-error');
            valid = false;
        }
    }
    if (!valid) { toast('Compila tutti i campi obbligatori', 'error'); return; }

    // Set loading state
    const submitBtn = document.getElementById('formSubmitBtn');
    submitBtn.classList.add('btn--loading');
    submitBtn.disabled = true;

    const payload = {};

    for (const f of fields) {
        const el = e.target.querySelector('[name="' + f.name + '"]');
        if (!el) continue;

        if (f.type === 'file') {
            if (el.files && el.files[0]) {
                try {
                    toast('Caricamento immagine...', 'info');
                    payload[f.name] = await sb.upload(el.files[0]);
                } catch (err) {
                    toast('Errore upload: ' + err.message, 'error');
                    submitBtn.classList.remove('btn--loading');
                    submitBtn.disabled = false;
                    return;
                }
            }
        } else if (f.type === 'checkbox') {
            payload[f.name] = el.checked;
        } else if (f.type === 'number') {
            payload[f.name] = el.value ? Number(el.value) : null;
        } else {
            payload[f.name] = el.value || null;
        }
    }

    try {
        if (id) {
            await sb.update(type, id, payload);
            toast('Aggiornato con successo!', 'success');
        } else {
            await sb.insert(type, payload);
            toast('Creato con successo!', 'success');
        }
        closeModal();
        loadAll();
    } catch (err) {
        toast('Errore: ' + err.message, 'error');
        submitBtn.classList.remove('btn--loading');
        submitBtn.disabled = false;
    }
});

// =============================================
// CONFIRM DELETE DIALOG
// =============================================
let pendingDelete = null;

function deleteItem(type, id) {
    pendingDelete = { type, id };
    document.getElementById('confirmOverlay').classList.add('open');
}

document.getElementById('confirmCancel').addEventListener('click', closeConfirm);

function closeConfirm() {
    document.getElementById('confirmOverlay').classList.remove('open');
    pendingDelete = null;
}

document.getElementById('confirmDelete').addEventListener('click', async () => {
    if (!pendingDelete) return;
    const { type, id } = pendingDelete;
    const btn = document.getElementById('confirmDelete');
    btn.classList.add('btn--loading');

    try {
        await sb.remove(type, id);
        toast('Eliminato con successo!', 'success');
        loadAll();
    } catch (err) {
        toast('Errore: ' + err.message, 'error');
    }

    btn.classList.remove('btn--loading');
    closeConfirm();
});

// Close confirm on overlay click
document.getElementById('confirmOverlay').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeConfirm();
});

// =============================================
// TOAST NOTIFICATIONS
// =============================================
function toast(msg, type) {
    const container = document.getElementById('toastContainer');
    const icons = {
        success: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
        error: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
        info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>'
    };

    const el = document.createElement('div');
    el.className = 'toast toast--' + type;
    el.innerHTML = (icons[type] || '') + '<span>' + esc(msg) + '</span>';
    container.appendChild(el);

    requestAnimationFrame(() => {
        requestAnimationFrame(() => el.classList.add('show'));
    });

    setTimeout(() => {
        el.classList.remove('show');
        setTimeout(() => el.remove(), 300);
    }, 3500);
}

// =============================================
// SKELETON LOADERS
// =============================================
function showSkeletons(tbodyId, cols) {
    const tbody = document.getElementById(tbodyId);
    let html = '';
    for (let i = 0; i < 4; i++) {
        html += '<tr class="skeleton-row">';
        for (let c = 0; c < cols; c++) {
            const w = c === 0 ? 'w40' : (c === cols - 1 ? 'w60' : ['w80', 'w120'][c % 2]);
            html += `<td><div class="skeleton-block skeleton-block--${w}"></div></td>`;
        }
        html += '</tr>';
    }
    tbody.innerHTML = html;
}

// =============================================
// UPDATE SIDEBAR BADGES
// =============================================
function updateBadge(type, count) {
    const badge = document.getElementById('badge-' + type);
    if (badge) badge.textContent = count;
}

// =============================================
// UPDATE DASHBOARD STATS
// =============================================
function updateStat(type, count) {
    const el = document.getElementById('stat-' + type);
    if (el) {
        el.textContent = count;
        el.classList.remove('stat-skeleton');
    }
}

// =============================================
// UPDATE ACTIVITY FEED
// =============================================
function updateActivityFeed(allData) {
    const feed = document.getElementById('activityFeed');
    const items = [];

    for (const [type, data] of Object.entries(allData)) {
        if (!Array.isArray(data)) continue;
        data.slice(0, 3).forEach(item => {
            const name = item.titolo || item.nome || '—';
            const date = item.created_at ? new Date(item.created_at) : null;
            items.push({ type, name, date });
        });
    }

    items.sort((a, b) => (b.date || 0) - (a.date || 0));
    const top = items.slice(0, 8);

    if (!top.length) {
        feed.innerHTML = '<div class="activity-empty">Nessuna attività recente</div>';
        return;
    }

    feed.innerHTML = top.map(item => {
        const timeStr = item.date ? timeAgo(item.date) : '';
        return `<div class="activity-item">
            <span class="activity-dot activity-dot--${item.type}"></span>
            <span>${esc(item.name)}</span>
            <span class="activity-time">${timeStr}</span>
        </div>`;
    }).join('');
}

function timeAgo(date) {
    const diff = Date.now() - date.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'ora';
    if (mins < 60) return mins + ' min fa';
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return hrs + 'h fa';
    const days = Math.floor(hrs / 24);
    if (days < 7) return days + 'g fa';
    return date.toLocaleDateString('it-IT');
}

// =============================================
// TABLE ROW COUNT
// =============================================
function updateCount(type, count) {
    const el = document.getElementById('count-' + type);
    if (el) el.textContent = count + ' element' + (count === 1 ? 'o' : 'i');
}

// =============================================
// UTILITIES
// =============================================
function esc(str) {
    if (!str) return '';
    const d = document.createElement('div');
    d.textContent = String(str);
    return d.innerHTML;
}
