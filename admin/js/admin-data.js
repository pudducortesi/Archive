// =============================================
// BAFF Admin — Data Layer (Supabase CRUD)
// This file MUST be loaded BEFORE admin-ui.js
// =============================================

// =============================================
// CONFIG — Supabase credentials
// =============================================
const SUPABASE_URL = 'https://vvdfrvgloyodqihaiktr.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2ZGZydmdsb3lvZHFpaGFpa3RyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4MzA1NzMsImV4cCI6MjA4ODQwNjU3M30.EdsU_r1anFWaOLAyWW_AauR2riC7pHo-YkRqJEmMMT0';

// =============================================
// SUPABASE REST HELPER
// =============================================
const sb = {
    headers() {
        return {
            'apikey': SUPABASE_KEY,
            'Authorization': 'Bearer ' + SUPABASE_KEY,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
        };
    },
    async select(table, order) {
        const url = SUPABASE_URL + '/rest/v1/' + table + '?order=' + (order || 'created_at.desc');
        const res = await fetch(url, { headers: this.headers() });
        return res.json();
    },
    async insert(table, data) {
        const url = SUPABASE_URL + '/rest/v1/' + table;
        const res = await fetch(url, { method: 'POST', headers: this.headers(), body: JSON.stringify(data) });
        return res.json();
    },
    async update(table, id, data) {
        const url = SUPABASE_URL + '/rest/v1/' + table + '?id=eq.' + id;
        const res = await fetch(url, { method: 'PATCH', headers: this.headers(), body: JSON.stringify(data) });
        return res.json();
    },
    async remove(table, id) {
        const url = SUPABASE_URL + '/rest/v1/' + table + '?id=eq.' + id;
        return fetch(url, { method: 'DELETE', headers: this.headers() });
    },
    async upload(file) {
        const ext = file.name.split('.').pop();
        const name = Date.now() + '-' + Math.random().toString(36).slice(2, 8) + '.' + ext;
        const url = SUPABASE_URL + '/storage/v1/object/media/' + name;
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': 'Bearer ' + SUPABASE_KEY,
                'Content-Type': file.type
            },
            body: file
        });
        if (!res.ok) throw new Error('Upload failed');
        return SUPABASE_URL + '/storage/v1/object/public/media/' + name;
    }
};

// =============================================
// FORM DEFINITIONS
// =============================================
const FORMS = {
    news: [
        { name: 'titolo', label: 'Titolo', type: 'text', required: true },
        { name: 'slug', label: 'Slug', type: 'text', required: true },
        { name: 'categoria', label: 'Categoria', type: 'select', options: ['festival', 'selezione-ufficiale', 'evento', 'biglietteria'] },
        { name: 'testo', label: 'Testo', type: 'textarea' },
        { name: 'immagine_url', label: 'Immagine', type: 'file' },
        { name: 'data_pubblicazione', label: 'Data pubblicazione', type: 'date' },
        { name: 'pubblicato', label: 'Pubblicato', type: 'checkbox' }
    ],
    programma: [
        { name: 'titolo', label: 'Titolo', type: 'text', required: true },
        { name: 'regista', label: 'Regista', type: 'text' },
        { name: 'anno', label: 'Anno', type: 'number' },
        { name: 'durata', label: 'Durata', type: 'text' },
        { name: 'sala', label: 'Sala', type: 'text' },
        { name: 'data_proiezione', label: 'Data proiezione', type: 'date' },
        { name: 'ora', label: 'Ora', type: 'time' },
        { name: 'sezione', label: 'Sezione', type: 'select', options: ['concorso-italiano', 'concorso-internazionale', 'primi-passi', 'eventi-speciali', 'fuori-concorso'] },
        { name: 'poster_url', label: 'Poster', type: 'file' },
        { name: 'pubblicato', label: 'Pubblicato', type: 'checkbox' }
    ],
    ospiti: [
        { name: 'nome', label: 'Nome', type: 'text', required: true },
        { name: 'ruolo', label: 'Ruolo', type: 'text' },
        { name: 'biografia', label: 'Biografia', type: 'textarea' },
        { name: 'foto_url', label: 'Foto', type: 'file' },
        { name: 'pubblicato', label: 'Pubblicato', type: 'checkbox' }
    ],
    sponsor: [
        { name: 'nome', label: 'Nome', type: 'text', required: true },
        { name: 'categoria', label: 'Categoria', type: 'select', options: ['official-partner', 'sponsor', 'technical-partner', 'institutional-partner', 'strategic-partner', 'media-partner', 'partner-culturali', 'patrocinio'] },
        { name: 'ordine', label: 'Ordine', type: 'number' },
        { name: 'link', label: 'Link', type: 'text' },
        { name: 'logo_url', label: 'Logo', type: 'file' },
        { name: 'pubblicato', label: 'Pubblicato', type: 'checkbox' }
    ]
};

// =============================================
// DATA CACHE
// =============================================
let dataCache = {};

// =============================================
// SVG ICONS for action buttons
// =============================================
const ICON_EDIT = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>';
const ICON_DELETE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>';

// =============================================
// LOAD ALL DATA
// =============================================
async function loadAll() {
    if (!SUPABASE_URL || !SUPABASE_KEY) {
        document.querySelectorAll('tbody').forEach(t => {
            t.innerHTML = '<tr><td colspan="8" class="empty-state"><p>Configura SUPABASE_URL e SUPABASE_KEY</p></td></tr>';
        });
        return;
    }

    // Show skeleton loaders
    showSkeletons('table-news', 6);
    showSkeletons('table-programma', 8);
    showSkeletons('table-ospiti', 5);
    showSkeletons('table-sponsor', 6);

    // Load all in parallel
    const [news, programma, ospiti, sponsor] = await Promise.all([
        sb.select('news', 'data_pubblicazione.desc'),
        sb.select('programma', 'data_proiezione.asc,ora.asc'),
        sb.select('ospiti', 'nome.asc'),
        sb.select('sponsor', 'ordine.asc,nome.asc')
    ]);

    // Cache data
    dataCache = { news, programma, ospiti, sponsor };

    // Render tables
    renderNews(news);
    renderProgramma(programma);
    renderOspiti(ospiti);
    renderSponsor(sponsor);

    // Update dashboard
    updateStat('news', Array.isArray(news) ? news.length : 0);
    updateStat('programma', Array.isArray(programma) ? programma.length : 0);
    updateStat('ospiti', Array.isArray(ospiti) ? ospiti.length : 0);
    updateStat('sponsor', Array.isArray(sponsor) ? sponsor.length : 0);

    // Update sidebar badges
    updateBadge('news', Array.isArray(news) ? news.length : 0);
    updateBadge('programma', Array.isArray(programma) ? programma.length : 0);
    updateBadge('ospiti', Array.isArray(ospiti) ? ospiti.length : 0);
    updateBadge('sponsor', Array.isArray(sponsor) ? sponsor.length : 0);

    // Update counts
    updateCount('news', Array.isArray(news) ? news.length : 0);
    updateCount('programma', Array.isArray(programma) ? programma.length : 0);
    updateCount('ospiti', Array.isArray(ospiti) ? ospiti.length : 0);
    updateCount('sponsor', Array.isArray(sponsor) ? sponsor.length : 0);

    // Update activity feed
    updateActivityFeed(dataCache);
}

// =============================================
// RENDER: NEWS
// =============================================
function renderNews(data) {
    const tbody = document.getElementById('table-news');
    if (!Array.isArray(data) || !data.length) {
        tbody.innerHTML = '<tr><td colspan="6" class="empty-state"><p>Nessuna news</p></td></tr>';
        return;
    }
    tbody.innerHTML = data.map(n => `<tr>
        <td>${n.immagine_url ? '<img src="' + n.immagine_url + '" alt="">' : '<span style="color:var(--text-muted)">—</span>'}</td>
        <td><strong>${esc(n.titolo)}</strong></td>
        <td>${esc(n.categoria)}</td>
        <td>${n.data_pubblicazione || '—'}</td>
        <td><span class="badge badge--${n.pubblicato ? 'yes' : 'no'}"><span class="badge-dot"></span>${n.pubblicato ? 'Pubblicato' : 'Bozza'}</span></td>
        <td class="actions">
            <button class="btn btn--ghost btn--icon" onclick='editItem("news","${n.id}")' title="Modifica">${ICON_EDIT}</button>
            <button class="btn btn--ghost btn--icon" onclick='deleteItem("news","${n.id}")' title="Elimina" style="color:var(--danger)">${ICON_DELETE}</button>
        </td>
    </tr>`).join('');
}

// =============================================
// RENDER: PROGRAMMA
// =============================================
function renderProgramma(data) {
    const tbody = document.getElementById('table-programma');
    if (!Array.isArray(data) || !data.length) {
        tbody.innerHTML = '<tr><td colspan="8" class="empty-state"><p>Nessun evento in programma</p></td></tr>';
        return;
    }
    tbody.innerHTML = data.map(p => `<tr>
        <td>${p.poster_url ? '<img src="' + p.poster_url + '" alt="">' : '<span style="color:var(--text-muted)">—</span>'}</td>
        <td><strong>${esc(p.titolo)}</strong></td>
        <td>${esc(p.regista || '')}</td>
        <td>${esc(p.sala || '')}</td>
        <td>${p.data_proiezione || '—'}</td>
        <td>${p.ora ? p.ora.slice(0, 5) : '—'}</td>
        <td><span class="badge badge--${p.pubblicato ? 'yes' : 'no'}"><span class="badge-dot"></span>${p.pubblicato ? 'Pubblicato' : 'Bozza'}</span></td>
        <td class="actions">
            <button class="btn btn--ghost btn--icon" onclick='editItem("programma","${p.id}")' title="Modifica">${ICON_EDIT}</button>
            <button class="btn btn--ghost btn--icon" onclick='deleteItem("programma","${p.id}")' title="Elimina" style="color:var(--danger)">${ICON_DELETE}</button>
        </td>
    </tr>`).join('');
}

// =============================================
// RENDER: OSPITI
// =============================================
function renderOspiti(data) {
    const tbody = document.getElementById('table-ospiti');
    if (!Array.isArray(data) || !data.length) {
        tbody.innerHTML = '<tr><td colspan="5" class="empty-state"><p>Nessun ospite</p></td></tr>';
        return;
    }
    tbody.innerHTML = data.map(o => `<tr>
        <td>${o.foto_url ? '<img src="' + o.foto_url + '" alt="">' : '<span style="color:var(--text-muted)">—</span>'}</td>
        <td><strong>${esc(o.nome)}</strong></td>
        <td>${esc(o.ruolo || '')}</td>
        <td><span class="badge badge--${o.pubblicato ? 'yes' : 'no'}"><span class="badge-dot"></span>${o.pubblicato ? 'Pubblicato' : 'Bozza'}</span></td>
        <td class="actions">
            <button class="btn btn--ghost btn--icon" onclick='editItem("ospiti","${o.id}")' title="Modifica">${ICON_EDIT}</button>
            <button class="btn btn--ghost btn--icon" onclick='deleteItem("ospiti","${o.id}")' title="Elimina" style="color:var(--danger)">${ICON_DELETE}</button>
        </td>
    </tr>`).join('');
}

// =============================================
// RENDER: SPONSOR
// =============================================
function renderSponsor(data) {
    const tbody = document.getElementById('table-sponsor');
    if (!Array.isArray(data) || !data.length) {
        tbody.innerHTML = '<tr><td colspan="6" class="empty-state"><p>Nessuno sponsor</p></td></tr>';
        return;
    }
    tbody.innerHTML = data.map(s => `<tr>
        <td>${s.logo_url ? '<img src="' + s.logo_url + '" alt="">' : '<span style="color:var(--text-muted)">—</span>'}</td>
        <td><strong>${esc(s.nome)}</strong></td>
        <td>${esc(s.categoria)}</td>
        <td>${s.ordine}</td>
        <td><span class="badge badge--${s.pubblicato ? 'yes' : 'no'}"><span class="badge-dot"></span>${s.pubblicato ? 'Pubblicato' : 'Bozza'}</span></td>
        <td class="actions">
            <button class="btn btn--ghost btn--icon" onclick='editItem("sponsor","${s.id}")' title="Modifica">${ICON_EDIT}</button>
            <button class="btn btn--ghost btn--icon" onclick='deleteItem("sponsor","${s.id}")' title="Elimina" style="color:var(--danger)">${ICON_DELETE}</button>
        </td>
    </tr>`).join('');
}
