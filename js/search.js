/* ============================================
   BAFF — Full-Text Static Search
   ============================================ */
(function() {
  'use strict';

  var SEARCH_INDEX = [
    {
      title: 'Homepage',
      url: 'index.html',
      section: 'Home',
      body: 'B.A. Film Festival Busto Arsizio XXIV Edizione 21 28 Marzo 2026 Scopri il programma Acquista i tuoi Pass Ingresso Singolo una proiezione a scelta 8 euro Ingresso Ridotto Under 26 Over 65 5 euro Pass Giornaliero tutte le proiezioni di una giornata 20 euro Pass Festival accesso illimitato intera edizione 80 euro Pass Festival Ridotto 60 euro accreditamenti aperti cinema Busto Arsizio'
    },
    {
      title: 'Il Festival',
      url: 'festival.html',
      section: 'Festival',
      body: 'Dal 2003 il cinema a Busto Arsizio Il B.A. Film Festival è una manifestazione cinematografica nata nel 2003 con lo scopo di valorizzare le produzioni italiane di qualità con particolare attenzione alle diverse professionalità che operano nel campo dell audiovisivo e di diffondere la cultura cinematografica attraverso proiezioni e laboratori per gli studenti Made in Italy Scuole e incontro ravvicinato tra grandi personalità del cinema e il pubblico B.A. Film Factory organizzazione staff'
    },
    {
      title: 'Programma',
      url: 'programma.html',
      section: 'Programma',
      body: 'Programma XXIV Edizione 21-28 Marzo 2026 Concorso Italiano cinema italiano contemporaneo 8 film in concorso Concorso Internazionale opere provenienti da tutto il mondo 10 film I Primi Passi dei Maestri retrospettiva opere prime grandi registi Eventi Speciali Masterclass registi attori incontri autori tavole rotonde proiezioni speciali Calendario proiezioni eventi giorno per giorno Cerimonia di apertura Cinema Teatro Sociale Masterclass cinema del reale Palazzo Marliani-Cicogna'
    },
    {
      title: 'Eventi Speciali',
      url: 'programma.html#eventi-speciali',
      section: 'Programma',
      body: 'Eventi Speciali Giovanardi album Scerbanenco romanzo fumetto cinema Chronology of Water Kristen Stewart Cannes anteprima italiana Un album italiano Gianluca Giovanardi omaggio alla grande tradizione cantautoriale italiana tra cinema e musica Scerbanenco noir graphic novel fumetti adattamento cinematografico La città che non dorme mai Milano'
    },
    {
      title: 'Masterclass',
      url: 'programma.html#masterclass',
      section: 'Programma',
      body: 'Masterclass incontri esclusivi protagonisti del cinema contemporaneo Marco Ferretti Il paesaggio come personaggio trent anni di cinema tra realtà e poesia Cinema Teatro Sociale Isabelle Moreau Scrivere tra due lingue la sceneggiatura come ponte culturale David Okonkwo New African Cinema voci emergenti dal continente africano'
    },
    {
      title: 'Fuori Orario',
      url: 'programma.html#fuori-orario',
      section: 'Programma',
      body: 'Fuori Orario Rai 3 Brebbia Ferri sperimentale avanguardia underground Il Damo cinema sperimentale cortometraggi ricerca visiva'
    },
    {
      title: 'Prima di diventare grandi',
      url: 'programma.html#prima-di-diventare-grandi',
      section: 'Programma',
      body: 'Prima di diventare grandi La ragazza nella nebbia Donato Carrisi Toni Servillo I tartassati Totò Aldo Fabrizi Steno Vanzina retrospettiva opere prime grandi registi maestri del cinema'
    },
    {
      title: 'Visioni Future Lab',
      url: 'programma.html#visioni-future-lab',
      section: 'Programma',
      body: 'Visioni Future Lab giovani cinema futuro laboratorio nuove generazioni sperimentazione tecnologia audiovisivo digitale'
    },
    {
      title: 'BAFF in Libreria',
      url: 'programma.html#baff-in-libreria',
      section: 'Programma',
      body: 'BAFF in Libreria libri saggi Flashback cinema americano anni 80 Inzaghi Checco Zalone Canova La fine della fine Ferrario Einaudi presentazioni libri autori editoria cinematografica'
    },
    {
      title: 'Selezione Ufficiale',
      url: 'selezione.html',
      section: 'Selezione',
      body: 'Selezione Ufficiale film in concorso XXIV Edizione cuore pulsante della manifestazione voci significative cinema contemporaneo italiano e internazionale comitato di selezione critici programmatori 1200 opere 45 paesi 12 titoli in concorso Concorso Italiano Concorso Internazionale I Primi Passi dei Maestri'
    },
    {
      title: 'La luce che resta',
      url: 'selezione.html#concorso-italiano',
      section: 'Concorso Italiano',
      body: 'La luce che resta di Giulia Mancini Italia 2025 104 minuti film concorso italiano cinema'
    },
    {
      title: 'Cenere e vento',
      url: 'selezione.html#concorso-italiano',
      section: 'Concorso Italiano',
      body: 'Cenere e vento di Alessandro Ferrara Italia 2025 118 minuti film concorso italiano cinema'
    },
    {
      title: 'Nessuno lo saprà',
      url: 'selezione.html#concorso-italiano',
      section: 'Concorso Italiano',
      body: 'Nessuno lo saprà di Paola Ferretti Italia 2026 95 minuti film concorso italiano cinema'
    },
    {
      title: 'I giorni del silenzio',
      url: 'selezione.html#concorso-italiano',
      section: 'Concorso Italiano',
      body: 'I giorni del silenzio di Roberto Montanari Italia 2025 112 minuti film concorso italiano cinema'
    },
    {
      title: 'Dove comincia il mare',
      url: 'selezione.html#concorso-italiano',
      section: 'Concorso Italiano',
      body: 'Dove comincia il mare di Francesca Ferro Italia 2026 98 minuti film concorso italiano cinema'
    },
    {
      title: "L'ultimo treno per Ferrara",
      url: 'selezione.html#concorso-italiano',
      section: 'Concorso Italiano',
      body: "L'ultimo treno per Ferrara di Enrico Damiani Italia 2025 108 minuti film concorso italiano cinema"
    },
    {
      title: 'Les heures perdues',
      url: 'selezione.html#concorso-internazionale',
      section: 'Concorso Internazionale',
      body: 'Les heures perdues di Claire Dumont Francia 2025 110 minuti film concorso internazionale cinema'
    },
    {
      title: 'La orilla del río',
      url: 'selezione.html#concorso-internazionale',
      section: 'Concorso Internazionale',
      body: 'La orilla del río di Pablo Mendoza Spagna 2026 102 minuti film concorso internazionale cinema'
    },
    {
      title: 'Baram-ui sigan',
      url: 'selezione.html#concorso-internazionale',
      section: 'Concorso Internazionale',
      body: 'Baram-ui sigan di Park Joon-ho Corea del Sud 2025 126 minuti film concorso internazionale cinema'
    },
    {
      title: 'Die stille Mauer',
      url: 'selezione.html#concorso-internazionale',
      section: 'Concorso Internazionale',
      body: 'Die stille Mauer di Katrin Weissmann Germania 2025 film concorso internazionale cinema'
    },
    {
      title: 'El abrazo del río',
      url: 'selezione.html#concorso-internazionale',
      section: 'Concorso Internazionale',
      body: 'El abrazo del río di Matías Delgado Argentina 2026 film concorso internazionale cinema'
    },
    {
      title: 'Midnattssol',
      url: 'selezione.html#concorso-internazionale',
      section: 'Concorso Internazionale',
      body: 'Midnattssol di Erik Lindqvist Svezia 2025 film concorso internazionale cinema Thomas Lindqvist attore protagonista'
    },
    {
      title: 'Made in Italy — Scuole',
      url: 'selezione.html#scuole',
      section: 'Selezione',
      body: 'Made in Italy Scuole Orfeo Gioia mia Tienimi presente La vita da grandi animazione coming of age studenti cortometraggi giovani talenti cinema scuole'
    },
    {
      title: 'Ospiti',
      url: 'ospiti.html',
      section: 'Ospiti',
      body: 'Ospiti della XXIV edizione Marco Ferretti regista ospite d onore nato a Roma 1962 esordio La luce di settembre Premio della Critica Festival di Venezia Cannes Berlino Toronto Vento di pianura Il confine dell acqua Cenere viva 2025 anteprima mondiale BAFF Chiara Beltrame attrice protagonista Cenere viva David di Donatello 2024 Luca Santoro regista documentario Terra madre Locarno Isabelle Moreau sceneggiatrice Les jours longs Notte chiara Roberto Mancuso critico cinematografico Corriere della Sera neorealismo Elena Vicari regista Sotto il cielo di marzo Premio Solinas Thomas Lindqvist attore svedese Midnattssol Giulia Ferrara sceneggiatrice Ombre italiane Nastri d Argento David Okonkwo regista anglo-nigeriano The Quiet Road Sundance 2025'
    },
    {
      title: 'Giuria',
      url: 'giuria.html',
      section: 'Giuria',
      body: 'Giuria XXIV Edizione 2026 Presidente di Giuria Lucia Mancini regista sceneggiatrice Roma 1962 Le stanze vuote David di Donatello migliore opera prima dodici lungometraggi documentari identità memoria Leone d Oro alla carriera Mostra del Cinema di Venezia 2018 Centro Sperimentale di Cinematografia Marco Rinaldi regista Il confine invisibile Terre lontane Nastri d Argento Sofia Bellini critico cinematografico Corriere della Sera Cahiers du Cinéma Cineforum neorealismo Giulia Ferretti attrice Coppa Volpi Venezia 2022 Sorrentino Garrone Alessandro Bianchi produttore Luce Nuova Films Ana Torres critico Sight and Sound BFI London Film Festival Carlos Vega direttore fotografia Goya Alejandro Iñárritu Alfonso Cuarón Yuki Tanaka programmatore Tokyo International Film Festival cinema asiatico'
    },
    {
      title: 'News',
      url: 'news.html',
      section: 'News',
      body: 'News novità B.A. Film Festival Annunciata la Selezione Ufficiale XXIV edizione dodici lungometraggi italiani dieci opere internazionali premi commissione quattrocento opere Masterclass con Lucia Mancini presidente giuria cinema Teatro Sociale BAFF in Libreria presentazioni editoriali cinema Made in Italy Scuole laboratori studenti istituti Villa Calcaterra apertura vendite biglietti online Stripe proiezioni eventi speciali accreditamenti'
    },
    {
      title: 'Pass e Accreditamenti',
      url: 'accreditamenti.html',
      section: 'Accreditamenti',
      body: 'Accreditamenti BAFF 2026 professionisti settore cinematografico giornalisti studenti cinema accesso prioritario proiezioni eventi speciali aree riservate stampa industria Stampa giornalisti critici cinematografici blogger operatori media Industria distributori produttori agenti vendita esercenti buyer programmatori festival Studenti iscritti scuole cinema audiovisivo università DAMS accademie belle arti modulo richiesta accreditamento'
    },
    {
      title: 'Biglietteria',
      url: 'biglietteria.html',
      section: 'Biglietteria',
      body: 'Biglietteria acquista biglietti XXIV Edizione Ingresso Singolo 8 euro una proiezione Ingresso Ridotto 5 euro Under 26 Over 65 Pass Giornaliero 20 euro tutte proiezioni giornata Pass Festival 80 euro accesso illimitato intera edizione Pass Festival Ridotto 60 euro riduzioni tariffe ridotte cinema accessibile studenti disabili accompagnatori giornalisti accreditati'
    },
    {
      title: 'Immagini',
      url: 'immagini.html',
      section: 'Immagini',
      body: 'Immagini foto galleria edizioni del festival 2024 2023 2022 2021 2020 2019 2018 2017 2016 2015 fotografie archivio storia visiva BAFF'
    },
    {
      title: 'Contatti',
      url: 'contatti.html',
      section: 'Contatti',
      body: 'Contatti siamo qui per aiutarti Richiesta Accreditamento accrediti stampa industria studenti Richiesta Interviste materiali press kit richieste media Indirizzo Via Magenta 70 21052 Busto Arsizio VA Italia Email info@bafilmfestival.it telefono 0331 070847 lunedì venerdì 10 18 Scrivici modulo informazioni biglietteria collaborazione proposta artistica ufficio stampa altro'
    },
    {
      title: 'Area Stampa',
      url: 'stampa.html',
      section: 'Stampa',
      body: 'Area Stampa rassegna copertura mediatica festival articoli servizi Il Manifesto Astrid Saints tormentoni horror favola nera Ciak Bertrand Bonello premiato BAFF Michelle Pfeiffer BAFF 2024 TGR Buongiorno Regione BAFF 2023 IRIS Note di Cinema rassegna stampa cartacea Malpensa24 L informazione online'
    },
    {
      title: 'Friends — Sponsor',
      url: 'sponsor.html',
      section: 'Sponsor',
      body: 'Friends partner rendono possibile il festival B.A. Film Festival aziende enti istituzioni cinema cultura Busto Arsizio proiezioni eventi masterclass attività formative Official Partner Sponsor Istituzionali Main Sponsor sponsor sostenitori Montesino'
    },
    {
      title: 'Acquista Biglietti',
      url: 'shop.html',
      section: 'Shop',
      body: 'Acquista Biglietti shop online XXIV Edizione Singolo Ingresso 8 euro proiezione a scelta Singolo Ingresso Ridotto 5 euro Under 18 Over 65 Studenti Abbonamento Giornaliero 20 euro tutte proiezioni accesso prioritario eventi speciali Abbonamento Festival 80 euro masterclass bag ufficiale omaggio Abbonamento Festival Ridotto 60 euro pagamento Stripe carta credito checkout'
    },
    {
      title: 'I Luoghi del Festival',
      url: 'luoghi.html',
      section: 'Luoghi',
      body: 'I Luoghi del Festival sale cinematografiche Busto Arsizio dintorni Cinema Teatro Fratello Sole Via D Azeglio Cinema Lux Piazza San Donato Cinema Teatro Manzoni Via Calatafimi Teatro Sociale Delia Cajelli Piazza Plebiscito sala principale eventi premiazioni Cinema San Giovanni Bosco Via Bergamo Cinelandia Corso Sempione Villa Calcaterra Istituto Antonioni Via Magenta sede principale Spazio Festival Piazza San Giovanni Biblioteca Comunale G.B. Roggia Sala Monaco Via Marliani Legnano Sala Ratti Corso Magenta Castellanza Cinema Teatro Dante Via Dante Alighieri Varese Camera di Commercio Sala Campiotti Piazza Monte Grappa treno Milano linea S5 S6 autostrada A8'
    },
    {
      title: 'La Storia del Festival',
      url: 'storia.html',
      section: 'Storia',
      body: 'La Storia del Festival vent anni di cinema a Busto Arsizio B.A. Film Festival nasce nel 2003 passione gruppo appassionati cinema oltre vent anni centinaia di film masterclass omaggi grandi maestri cinema italiano e internazionale punto di riferimento cinema d autore nord Italia edizioni 2024 XXII 2023 XXI 2022 XX 2021 XIX 2020 XVIII 2019 XVII 2018 XVI 2017 XV 2016 XIV 2015 XIII 2014 XII 2013 XI 2012 X 2011 IX 2010 VIII 2009 VII 2008 VI 2007 V 2006 IV 2005 III 2004 II 2003 I edizione locandine'
    },
    {
      title: 'Comunicati Stampa',
      url: 'comunicati.html',
      section: 'Stampa',
      body: 'Comunicati Stampa notizie ufficiali B.A. Film Festival comunicati stampa Ufficio stampa Emilia Carnaghi Storyfinders Lionella Bianca Fiorillo info@bafilmfestival.it 0331 070847 XXIV edizione 2026 2025 annuncio edizione B.A. Film Factory date programma preliminare Busto Arsizio'
    },
    {
      title: 'Trasparenza',
      url: 'trasparenza.html',
      section: 'Trasparenza',
      body: 'Trasparenza finanziamenti pubblici contributi istituzionali normativa trasparenza B.A. Film Factory Regione Lombardia bando promozione educativa culturale DG Cinema MiC Ministero della Cultura bilancio rendiconto'
    },
    {
      title: 'Privacy Policy',
      url: 'privacy.html',
      section: 'Legale',
      body: 'Privacy Policy informativa sul trattamento dei dati personali GDPR protezione dati cookie consenso diritti interessati B.A. Film Factory titolare trattamento'
    },
    {
      title: 'Note Legali',
      url: 'note-legali.html',
      section: 'Legale',
      body: 'Note Legali condizioni utilizzo sito web proprietà intellettuale copyright contenuti B.A. Film Festival responsabilità limitazioni'
    },
    {
      title: 'Cookie Policy',
      url: 'cookie.html',
      section: 'Legale',
      body: 'Cookie Policy informativa utilizzo cookie tecnici analitici profilazione consenso preferenze navigazione GDPR B.A. Film Festival'
    }
  ];

  function normalize(str) {
    return str.toLowerCase()
      .replace(/[àáâãäå]/g, 'a')
      .replace(/[èéêë]/g, 'e')
      .replace(/[ìíîï]/g, 'i')
      .replace(/[òóôõö]/g, 'o')
      .replace(/[ùúûü]/g, 'u')
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function getExcerpt(body, query, maxLen) {
    maxLen = maxLen || 120;
    var normalBody = normalize(body);
    var normalQuery = normalize(query);
    var terms = normalQuery.split(/\s+/).filter(Boolean);
    // Find best position — prefer first matched term
    var bestPos = -1;
    for (var t = 0; t < terms.length; t++) {
      var pos = normalBody.indexOf(terms[t]);
      if (pos !== -1 && (bestPos === -1 || pos < bestPos)) {
        bestPos = pos;
      }
    }
    if (bestPos === -1) bestPos = 0;
    // Map position back from normalized to original body
    // Since normalization is char-by-char, positions correspond closely
    var start = Math.max(0, bestPos - 40);
    var end = Math.min(body.length, start + maxLen);
    if (start > 0) {
      // Move to next word boundary
      var spaceIdx = body.indexOf(' ', start);
      if (spaceIdx !== -1 && spaceIdx < start + 15) start = spaceIdx + 1;
    }
    var excerpt = body.substring(start, end);
    if (start > 0) excerpt = '\u2026' + excerpt;
    if (end < body.length) excerpt = excerpt + '\u2026';
    // Highlight matched terms in excerpt
    terms.forEach(function(term) {
      if (term.length < 2) return;
      var regex = new RegExp('(' + term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
      excerpt = excerpt.replace(regex, '<strong>$1</strong>');
    });
    return excerpt;
  }

  function search(query) {
    if (!query || query.trim().length < 2) return [];
    var terms = normalize(query).split(/\s+/).filter(Boolean);
    var results = [];
    SEARCH_INDEX.forEach(function(item) {
      var haystackTitle = normalize(item.title);
      var haystackBody = normalize(item.body);
      var haystack = haystackTitle + ' ' + haystackBody;
      var score = 0;
      var matchedTerms = 0;
      terms.forEach(function(term) {
        if (haystack.indexOf(term) !== -1) {
          matchedTerms++;
          // Title matches worth more
          if (haystackTitle.indexOf(term) !== -1) {
            score += 10;
          }
          // Body matches
          var bodyIdx = 0;
          var bodyCount = 0;
          while ((bodyIdx = haystackBody.indexOf(term, bodyIdx)) !== -1) {
            bodyCount++;
            bodyIdx += term.length;
          }
          score += Math.min(bodyCount, 5);
        }
      });
      // All terms must match for multi-word queries
      if (terms.length > 1 && matchedTerms < terms.length) {
        score = 0;
      }
      if (score > 0) {
        results.push({
          item: item,
          score: score,
          excerpt: getExcerpt(item.body, query)
        });
      }
    });
    results.sort(function(a, b) { return b.score - a.score; });
    return results.slice(0, 10);
  }

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function initSearch() {
    var overlay = document.getElementById('searchOverlay');
    var input = document.getElementById('searchInput');
    var resultsEl = document.getElementById('searchResults');
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
      resultsEl.innerHTML = '';
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

    var debounceTimer;
    input.addEventListener('input', function() {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(function() {
        var query = input.value.trim();
        if (query.length < 2) {
          resultsEl.innerHTML = '<p class="search-overlay__hint">Digita almeno 2 caratteri\u2026</p>';
          return;
        }
        var found = search(query);
        if (found.length === 0) {
          resultsEl.innerHTML = '<p class="search-overlay__hint">Nessun risultato per \u201c<strong>' + escapeHtml(query) + '</strong>\u201d</p>';
          return;
        }
        var html = '<ul class="search-overlay__list">';
        found.forEach(function(r) {
          html += '<li><a href="' + r.item.url + '" class="search-overlay__result">'
            + '<div class="search-overlay__result-info">'
            + '<span class="search-overlay__result-title">' + escapeHtml(r.item.title) + '</span>'
            + '<span class="search-overlay__result-section">' + escapeHtml(r.item.section) + '</span>'
            + '<span class="search-overlay__result-excerpt">' + r.excerpt + '</span>'
            + '</div>'
            + '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>'
            + '</a></li>';
        });
        html += '</ul>';
        resultsEl.innerHTML = html;

        resultsEl.querySelectorAll('a').forEach(function(a) {
          a.addEventListener('click', closeSearch);
        });
      }, 150);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSearch);
  } else {
    initSearch();
  }
})();
