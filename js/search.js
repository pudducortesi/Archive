/* ============================================
   BAFF — Static Search
   ============================================ */
(function() {
  'use strict';

  var SEARCH_INDEX = [
    { title: 'Homepage', url: 'index.html', text: 'B.A. Film Festival Busto Arsizio XXIV edizione 21 28 marzo 2026 biglietti pass acquista' },
    { title: 'Il Festival', url: 'festival.html', text: 'festival cinema Busto Arsizio storia chi siamo staff organizzazione B.A. Film Factory' },
    { title: 'Storia del Festival', url: 'festival.html#storia', text: 'storia edizioni 2003 2004 2005 2006 2007 2008 2009 2010 2011 2012 2013 2014 2015 2016 2017 2018 2019 2020 2021 2022 2023 2024 locandine' },
    { title: 'Le Sedi', url: 'festival.html#sedi', text: 'sedi luoghi Cinema Teatro Manzoni Lux Fratello Sole Villa Calcaterra Legnano Castellanza Varese' },
    { title: 'Trasparenza', url: 'festival.html#trasparenza', text: 'trasparenza finanziamenti contributi bilancio' },
    { title: 'Programma', url: 'programma.html', text: 'programma calendario giornaliero proiezioni concorso italiano internazionale eventi speciali masterclass' },
    { title: 'Eventi Speciali', url: 'programma.html#eventi-speciali', text: 'eventi speciali Giovanardi album Scerbanenco romanzo fumetto cinema Chronology of Water Kristen Stewart Cannes anteprima italiana' },
    { title: 'Masterclass', url: 'programma.html#masterclass', text: 'masterclass incontri registi attori cinema' },
    { title: 'Fuori Orario', url: 'programma.html#fuori-orario', text: 'Fuori Orario Rai 3 Brebbia Ferri sperimentale avanguardia underground Il Damo' },
    { title: 'Prima di diventare grandi', url: 'programma.html#prima-di-diventare-grandi', text: 'Prima di diventare grandi La ragazza nella nebbia Carrisi Toni Servillo I tartassati Toto Aldo Fabrizi Steno Vanzina' },
    { title: 'Visioni Future Lab', url: 'programma.html#visioni-future-lab', text: 'Visioni Future Lab giovani cinema futuro laboratorio' },
    { title: 'Mostre', url: 'programma.html#mostre', text: 'mostre esposizioni fotografia arte cinema' },
    { title: 'BAFF in Libreria', url: 'programma.html#baff-in-libreria', text: 'BAFF libreria libri saggi Flashback cinema americano anni 80 Inzaghi Checco Zalone Canova La fine della fine Ferrario Einaudi' },
    { title: 'Selezione Ufficiale', url: 'selezione.html', text: 'selezione ufficiale film concorso italiano internazionale La luce che resta Cenere e vento Nessuno lo sapra I giorni del silenzio Dove comincia il mare' },
    { title: 'Concorso Italiano', url: 'selezione.html#concorso-italiano', text: 'concorso italiano film italiani 2025 2026 Giulia Mancini Alessandro Ferrara Paola Ferretti Roberto Montanari' },
    { title: 'Concorso Internazionale', url: 'selezione.html#concorso-internazionale', text: 'concorso internazionale Francia Spagna Corea Germania Argentina Giappone Les heures perdues La orilla del rio' },
    { title: 'Made in Italy Scuole', url: 'selezione.html#scuole', text: 'Made in Italy Scuole Orfeo Gioia mia Tienimi presente La vita da grandi animazione coming of age studenti' },
    { title: 'Ospiti', url: 'ospiti.html', text: 'ospiti registi attori sceneggiatori masterclass Marco Ferretti Chiara Beltrame Luca Santoro Isabelle Moreau' },
    { title: 'Giuria', url: 'giuria.html', text: 'giuria presidente Lucia Mancini giurati concorso italiano internazionale' },
    { title: 'News', url: 'news.html', text: 'news notizie aggiornamenti comunicati stampa annunci festival' },
    { title: 'Pass e Accreditamenti', url: 'accreditamenti.html', text: 'accreditamenti pass stampa industria studenti cinema richiesta modulo' },
    { title: 'Tickets — Acquista Biglietti', url: 'index.html#biglietteria-home', text: 'biglietti tickets acquista ingresso singolo ridotto pass giornaliero festival abbonamento 8 euro 5 euro 20 euro 80 euro Stripe' },
    { title: 'Immagini', url: 'immagini.html', text: 'immagini foto galleria edizioni 2015 2016 2017 2018 2019 2020 2021 2022 2023 2024' },
    { title: 'Contatti', url: 'contatti.html', text: 'contatti indirizzo Via Magenta 70 Busto Arsizio telefono email info@bafilmfestival.it come raggiungerci' },
    { title: 'Stampa', url: 'stampa.html', text: 'stampa comunicati press kit materiali giornalisti media' },
    { title: 'Friends — Sponsor', url: 'sponsor.html', text: 'friends sponsor partner sostenitori istituzionali Montesino' },
    { title: 'BAFF in Libreria (Festival)', url: 'festival.html#libreria', text: 'libreria libri cinema' },
  ];

  function normalize(str) {
    return str.toLowerCase()
      .replace(/[àáâãäå]/g, 'a')
      .replace(/[èéêë]/g, 'e')
      .replace(/[ìíîï]/g, 'i')
      .replace(/[òóôõö]/g, 'o')
      .replace(/[ùúûü]/g, 'u')
      .replace(/[^a-z0-9\s]/g, ' ');
  }

  function search(query) {
    if (!query || query.trim().length < 2) return [];
    var terms = normalize(query).split(/\s+/).filter(Boolean);
    var results = [];
    SEARCH_INDEX.forEach(function(item) {
      var haystack = normalize(item.title + ' ' + item.text);
      var score = 0;
      terms.forEach(function(term) {
        if (haystack.indexOf(term) !== -1) {
          score += normalize(item.title).indexOf(term) !== -1 ? 3 : 1;
        }
      });
      if (score > 0) results.push({ item: item, score: score });
    });
    results.sort(function(a, b) { return b.score - a.score; });
    return results.slice(0, 8).map(function(r) { return r.item; });
  }

  function initSearch() {
    var overlay = document.getElementById('searchOverlay');
    var input = document.getElementById('searchInput');
    var results = document.getElementById('searchResults');
    var closeBtns = document.querySelectorAll('.search-close, #searchOverlayBackdrop');
    var openBtns = document.querySelectorAll('.search-trigger');

    if (!overlay || !input) return;

    function openSearch() {
      overlay.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      setTimeout(function() { input.focus(); }, 100);
    }

    function closeSearch() {
      overlay.classList.remove('is-open');
      document.body.style.overflow = '';
      input.value = '';
      results.innerHTML = '';
    }

    openBtns.forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        openSearch();
      });
    });

    closeBtns.forEach(function(btn) {
      btn.addEventListener('click', closeSearch);
    });

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') closeSearch();
    });

    input.addEventListener('input', function() {
      var query = input.value.trim();
      if (query.length < 2) {
        results.innerHTML = '<p class="search-overlay__hint">Digita almeno 2 caratteri\u2026</p>';
        return;
      }
      var found = search(query);
      if (found.length === 0) {
        results.innerHTML = '<p class="search-overlay__hint">Nessun risultato per \u201c<strong>' + query + '</strong>\u201d</p>';
        return;
      }
      var html = '<ul class="search-overlay__list">';
      found.forEach(function(item) {
        html += '<li><a href="' + item.url + '" class="search-overlay__result">'
          + '<span class="search-overlay__result-title">' + item.title + '</span>'
          + '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>'
          + '</a></li>';
      });
      html += '</ul>';
      results.innerHTML = html;

      results.querySelectorAll('a').forEach(function(a) {
        a.addEventListener('click', closeSearch);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSearch);
  } else {
    initSearch();
  }
})();
