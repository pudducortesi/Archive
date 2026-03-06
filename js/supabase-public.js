/**
 * BAFF — Supabase Public Data Loader
 * Loads dynamic content from Supabase for public-facing pages.
 * Include this script BEFORE </body> on news, programma, ospiti, sponsor pages.
 */
(function () {
    'use strict';

    // =============================================
    // CONFIG — Replace with your Supabase credentials
    // =============================================
    const SUPABASE_URL = 'https://vvdfrvgloyodqihaiktr.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2ZGZydmdsb3lvZHFpaGFpa3RyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4MzA1NzMsImV4cCI6MjA4ODQwNjU3M30.EdsU_r1anFWaOLAyWW_AauR2riC7pHo-YkRqJEmMMT0';

    if (!SUPABASE_URL || !SUPABASE_KEY) return; // keep static HTML if not configured

    const API = SUPABASE_URL + '/rest/v1';
    const headers = { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY };

    async function query(table, params) {
        const url = API + '/' + table + '?' + params;
        const res = await fetch(url, { headers });
        if (!res.ok) return [];
        return res.json();
    }

    function esc(s) { if (!s) return ''; const d = document.createElement('div'); d.textContent = s; return d.innerHTML; }

    const lang = document.documentElement.lang || 'it';
    const isEn = lang === 'en';

    // Detect which page we're on
    const path = location.pathname;
    if (path.includes('news')) loadNews();
    else if (path.includes('programma')) loadProgramma();
    else if (path.includes('ospiti')) loadOspiti();
    else if (path.includes('sponsor')) loadSponsor();

    // =============================================
    // NEWS
    // =============================================
    async function loadNews() {
        const data = await query('news', 'pubblicato=eq.true&order=data_pubblicazione.desc');
        if (!data.length) return;

        // Featured — first item
        const featured = data[0];
        const featuredEl = document.querySelector('.news-featured');
        if (featuredEl) {
            featuredEl.innerHTML = `
                <div class="news-featured__image">
                    ${featured.immagine_url ? '<img src="'+featured.immagine_url+'" alt="'+esc(featured.titolo)+'" style="width:100%;height:100%;object-fit:cover">' : ''}
                </div>
                <div class="news-featured__body">
                    <span class="news-card__tag">${esc(featured.categoria)}</span>
                    <h2 class="news-featured__title">${esc(featured.titolo)}</h2>
                    <p class="news-featured__excerpt">${esc(featured.testo)}</p>
                    <time class="news-card__date" datetime="${featured.data_pubblicazione}">${formatDate(featured.data_pubblicazione)}</time>
                </div>`;
        }

        // Grid — remaining items
        const gridEl = document.querySelector('.news-grid');
        if (gridEl && data.length > 1) {
            gridEl.innerHTML = data.slice(1).map(n => `
                <article class="news-card">
                    <div class="news-card__image">
                        ${n.immagine_url ? '<img src="'+n.immagine_url+'" alt="'+esc(n.titolo)+'" style="width:100%;height:100%;object-fit:cover">' : ''}
                    </div>
                    <div class="news-card__body">
                        <span class="news-card__tag">${esc(n.categoria)}</span>
                        <h3 class="news-card__title">${esc(n.titolo)}</h3>
                        <p class="news-card__excerpt">${esc(n.testo)}</p>
                        <time class="news-card__date" datetime="${n.data_pubblicazione}">${formatDate(n.data_pubblicazione)}</time>
                    </div>
                </article>`).join('');
        }
    }

    // =============================================
    // PROGRAMMA
    // =============================================
    async function loadProgramma() {
        const data = await query('programma', 'pubblicato=eq.true&order=data_proiezione.asc,ora.asc');
        if (!data.length) return;

        // Group events by date
        const grouped = {};
        data.forEach(ev => {
            const d = ev.data_proiezione || 'tbd';
            if (!grouped[d]) grouped[d] = [];
            grouped[d].push(ev);
        });

        const dates = Object.keys(grouped).sort();
        const scheduleEl = document.querySelector('.schedule');
        if (!scheduleEl) return;

        // Build tabs
        const dayLabels = isEn
            ? ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
            : ['Dom','Lun','Mar','Mer','Gio','Ven','Sab'];

        const tabsHtml = dates.map((d, i) => {
            const dt = new Date(d + 'T00:00:00');
            const dayName = dayLabels[dt.getDay()];
            const dayNum = dt.getDate();
            return `<button class="schedule__tab ${i===0?'schedule__tab--active':''}" data-day="day-${i+1}">${dayName} ${dayNum}</button>`;
        }).join('');

        const daysHtml = dates.map((d, i) => {
            const events = grouped[d];
            return `<div class="schedule__day ${i===0?'schedule__day--active':''}" id="day-${i+1}">
                ${events.map(ev => `
                    <div class="schedule__event">
                        <span class="schedule__time">${ev.ora ? ev.ora.slice(0,5) : ''}</span>
                        <div class="schedule__event-info">
                            <span class="schedule__event-title">${esc(ev.titolo)}</span>
                            <span class="schedule__event-detail">${esc(ev.sala||'')}${ev.regista ? ' &mdash; ' + esc(ev.regista) : ''}${ev.durata ? ' (' + esc(ev.durata) + ')' : ''}</span>
                        </div>
                        <span class="schedule__event-tag">${formatSezione(ev.sezione)}</span>
                    </div>`).join('')}
            </div>`;
        }).join('');

        scheduleEl.innerHTML = `<div class="schedule__tabs">${tabsHtml}</div>${daysHtml}`;

        // Re-bind tab clicks
        scheduleEl.querySelectorAll('.schedule__tab').forEach(tab => {
            tab.addEventListener('click', () => {
                scheduleEl.querySelectorAll('.schedule__tab').forEach(t => t.classList.remove('schedule__tab--active'));
                scheduleEl.querySelectorAll('.schedule__day').forEach(d => d.classList.remove('schedule__day--active'));
                tab.classList.add('schedule__tab--active');
                document.getElementById(tab.dataset.day).classList.add('schedule__day--active');
            });
        });
    }

    // =============================================
    // OSPITI
    // =============================================
    async function loadOspiti() {
        const data = await query('ospiti', 'pubblicato=eq.true&order=nome.asc');
        if (!data.length) return;

        // Guest grid
        const gridEl = document.querySelector('.guest-grid');
        if (gridEl) {
            gridEl.innerHTML = data.map(o => `
                <div class="guest-card">
                    <div class="guest-card__image">
                        ${o.foto_url ? '<img src="'+o.foto_url+'" alt="'+esc(o.nome)+'" style="width:100%;height:100%;object-fit:cover">' : ''}
                    </div>
                    <div class="guest-card__body">
                        <h3 class="guest-card__name">${esc(o.nome)}</h3>
                        <span class="guest-card__role">${esc(o.ruolo||'')}</span>
                        <p class="guest-card__desc">${esc(o.biografia||'')}</p>
                    </div>
                </div>`).join('');
        }
    }

    // =============================================
    // SPONSOR
    // =============================================
    async function loadSponsor() {
        const data = await query('sponsor', 'pubblicato=eq.true&order=ordine.asc,nome.asc');
        if (!data.length) return;

        // Group by categoria
        const grouped = {};
        data.forEach(s => {
            if (!grouped[s.categoria]) grouped[s.categoria] = [];
            grouped[s.categoria].push(s);
        });

        // Tier order and display config
        const tiers = [
            { key: 'official-partner', title: 'Official Partner', badge: 'platinum', grid: 'platinum', logo: 'platinum' },
            { key: 'sponsor', title: 'Sponsor', badge: 'gold', grid: 'gold', logo: 'gold' },
            { key: 'technical-partner', title: 'Technical Partner', badge: 'silver', grid: 'silver', logo: 'silver' },
            { key: 'institutional-partner', title: 'Institutional Partner', badge: 'institutional', grid: 'institutional', logo: 'institutional' },
            { key: 'strategic-partner', title: 'Strategic Partner', badge: 'strategic', grid: 'strategic', logo: 'strategic' },
            { key: 'media-partner', title: 'Media Partner', badge: 'gold', grid: 'silver', logo: 'silver' },
            { key: 'partner-culturali', title: isEn ? 'Cultural Partners' : 'Partner Culturali', badge: 'silver', grid: 'silver', logo: 'silver' },
            { key: 'patrocinio', title: isEn ? 'Under the Patronage of' : 'Con il Patrocinio di', badge: 'institutional', grid: 'institutional', logo: 'institutional' }
        ];

        // Find the container: all sponsor-section elements between intro and CTA
        const allSections = document.querySelectorAll('.sponsor-section');
        if (!allSections.length) return;

        // Remove existing sponsor sections
        allSections.forEach(sec => sec.remove());

        // Insert new sections before the CTA
        const ctaSection = document.querySelector('.cta-section');
        const parent = ctaSection ? ctaSection.parentElement : document.querySelector('main');

        tiers.forEach((tier, i) => {
            const items = grouped[tier.key];
            if (!items || !items.length) return;

            const section = document.createElement('section');
            section.className = 'sponsor-section' + (i % 2 === 1 ? ' sponsor-section--alt' : '');
            section.innerHTML = `
                <div class="sponsor-section__container">
                    <div class="sponsor-section__header">
                        <span class="sponsor-section__tier-badge sponsor-section__tier-badge--${tier.badge}">${tier.title}</span>
                        <h2 class="sponsor-section__title">${tier.title}</h2>
                    </div>
                    <div class="sponsor-grid sponsor-grid--${tier.grid}">
                        ${items.map(s => `<a href="${s.link||'#'}" class="sponsor-logo sponsor-logo--${tier.logo}" ${s.link?'target="_blank" rel="noopener"':''}>
                            ${s.logo_url ? '<img src="'+s.logo_url+'" alt="'+esc(s.nome)+'" loading="lazy">' : '<span>'+esc(s.nome)+'</span>'}
                        </a>`).join('')}
                    </div>
                </div>`;

            if (ctaSection) parent.insertBefore(section, ctaSection);
            else parent.appendChild(section);
        });
    }

    // =============================================
    // HELPERS
    // =============================================
    function formatDate(dateStr) {
        if (!dateStr) return '';
        const d = new Date(dateStr + 'T00:00:00');
        const months = isEn
            ? ['January','February','March','April','May','June','July','August','September','October','November','December']
            : ['Gennaio','Febbraio','Marzo','Aprile','Maggio','Giugno','Luglio','Agosto','Settembre','Ottobre','Novembre','Dicembre'];
        return d.getDate() + ' ' + months[d.getMonth()] + ' ' + d.getFullYear();
    }

    function formatSezione(s) {
        if (!s) return '';
        const map = {
            'concorso-italiano': isEn ? 'Italian Competition' : 'Concorso',
            'concorso-internazionale': isEn ? 'International Competition' : 'Concorso',
            'primi-passi': isEn ? 'Retrospective' : 'Retrospettiva',
            'eventi-speciali': isEn ? 'Special Event' : 'Evento speciale',
            'fuori-concorso': isEn ? 'Out of Competition' : 'Fuori concorso'
        };
        return map[s] || s;
    }
})();
