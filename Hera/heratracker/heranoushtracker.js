(() => {
  const root = document.getElementById('chaosTracker');
  if (!root) return;

  const source = root.dataset.source || 'heranoushtracker-data.json';
  const state = {
    status: 'all',
    actor: null,
    openCategories: new Set(),
    openDetails: new Set()
  };

  let trackerData = null;

  root.innerHTML = '<div class="chaos-loading">Adatok betöltése...</div>';

  fetch(source)
    .then((response) => {
      if (!response.ok) throw new Error('Nem sikerült betölteni a JSON fájlt.');
      return response.json();
    })
    .then((data) => {
      trackerData = data;
      (data.categories || []).forEach((category) => {
        if (category.open) state.openCategories.add(category.id);
      });
      render();
    })
    .catch((error) => {
      root.innerHTML = `<div class="chaos-error">${escapeText(error.message)} Helyi tesztnél indítsd localhostról, ne sima fájlmegnyitással.</div>`;
    });

  root.addEventListener('click', (event) => {
    const filterButton = event.target.closest('[data-filter]');
    const actorButton = event.target.closest('[data-actor]');
    const clearActorButton = event.target.closest('[data-clear-actor]');
    const detailButton = event.target.closest('[data-detail-id]');

    if (filterButton) {
      rememberOpenCategories();
      state.status = filterButton.dataset.filter;
      render();
      return;
    }

    if (actorButton) {
      rememberOpenCategories();
      const actorId = actorButton.dataset.actor;
      state.actor = state.actor === actorId ? null : actorId;
      render();
      return;
    }

    if (clearActorButton) {
      rememberOpenCategories();
      state.actor = null;
      render();
      return;
    }

    if (detailButton) {
      rememberOpenCategories();
      const detailId = detailButton.dataset.detailId;
      const game = findGameById(detailId);
      const card = detailButton.closest('.chaos-card');
      const detailBox = card ? card.querySelector('.card-extra') : null;

      if (state.openDetails.has(detailId)) {
        state.openDetails.delete(detailId);
        detailButton.textContent = 'Részletek';
        if (card) card.classList.remove('is-expanded');
        if (detailBox) detailBox.classList.remove('is-open');
      } else {
        state.openDetails.add(detailId);
        detailButton.textContent = 'Részletek zárása';
        if (card) card.classList.add('is-expanded');
        if (detailBox) detailBox.classList.add('is-open');
      }

      if (!card || !detailBox || !game) render();
    }
  });

  root.addEventListener('toggle', (event) => {
    const details = event.target.closest('details[data-category-id]');
    if (!details) return;

    if (details.open) {
      state.openCategories.add(details.dataset.categoryId);
    } else {
      state.openCategories.delete(details.dataset.categoryId);
    }
  }, true);

  function render() {
    const profile = trackerData.profile || {};
    const categories = trackerData.categories || [];
    const allGames = categories.flatMap((category) => category.games || []);
    const visibleGames = allGames.filter(matchesFilters);

    root.innerHTML = '';
    root.appendChild(renderSidebar(profile, allGames, visibleGames));
    root.appendChild(renderContent(categories, visibleGames.length));
  }

  function renderSidebar(profile, allGames, visibleGames) {
    const sidebar = el('aside', 'chaos-sidebar');

    const portrait = el('div', 'chaos-portrait');
    const portraitImg = document.createElement('img');
    portraitImg.src = profile.portrait || '';
    portraitImg.alt = profile.name || 'Portré';
    portrait.append(portraitImg, el('div', 'effect-overlay'));

    const idBox = el('div', 'chaos-id');
    const title = document.createElement('h1');
    title.textContent = profile.name || '';
    const role = el('div', 'neon-role');
    role.textContent = profile.role || '';
    idBox.append(title, role);

    const controls = el('div', 'chaos-controls');
    [
      ['all', 'Mind'],
      ['active', 'Aktív'],
      ['closed', 'Lezárt']
    ].forEach(([filter, label]) => {
      const button = el('button', 'ch-btn');
      button.type = 'button';
      button.dataset.filter = filter;
      button.textContent = label;
      if (state.status === filter) button.classList.add('is-active');
      controls.appendChild(button);
    });

    const counts = el('div', 'chaos-mini-counts');
    const activeCount = allGames.filter((game) => game.status === 'active').length;
    const closedCount = allGames.filter((game) => game.status === 'closed').length;
    counts.append(
      countLine('Összes játék', allGames.length),
      countLine('Látható', visibleGames.length),
      countLine('Aktív', activeCount),
      countLine('Lezárt', closedCount)
    );

    sidebar.append(portrait, idBox, controls, counts, renderStats(trackerData.stats || []));
    return sidebar;
  }

  function renderStats(stats) {
    const box = el('div', 'chaos-stats');

    stats.forEach((stat) => {
      const item = el('div', 'stat');
      item.dataset.label = stat.readout || `${stat.label}: ${stat.value}%`;

      const label = document.createElement('label');
      label.textContent = stat.label || '';

      const bar = el('div', `bar level-${stat.level || 'mid'}`);
      const span = document.createElement('span');
      span.style.width = `${Number(stat.value) || 0}%`;
      bar.appendChild(span);
      item.append(label, bar);
      box.appendChild(item);
    });

    return box;
  }

  function renderContent(categories, visibleTotal) {
    const main = el('main', 'chaos-content');
    let renderedCategories = 0;

    const selectedActor = state.actor ? findActorById(state.actor) : null;
    if (selectedActor) {
      main.appendChild(renderActiveActorFilter(selectedActor, visibleTotal));
    }

    categories.forEach((category) => {
      const games = (category.games || []).filter(matchesFilters);
      if (!games.length) return;

      renderedCategories += 1;
      const details = el('details', 'chaos-cat');
      details.dataset.categoryId = category.id;
      if (state.openCategories.has(category.id)) details.open = true;

      const summary = document.createElement('summary');
      summary.append(document.createTextNode(`${category.title} `));
      const count = el('span', 'count');
      count.textContent = `[${games.length}]`;
      summary.appendChild(count);

      const grid = el('div', 'chaos-grid');
      games.forEach((game) => grid.appendChild(renderCard(game)));

      details.append(summary, grid);
      main.appendChild(details);
    });

    if (!renderedCategories || visibleTotal === 0) {
      const empty = el('div', 'chaos-empty');
      empty.textContent = 'Nincs találat ehhez a szűréshez.';
      main.appendChild(empty);
    }

    return main;
  }

  function renderActiveActorFilter(actor, visibleTotal) {
    const strip = el('div', 'chaos-filter-strip');

    const imageBox = el('span', 'filter-actor-image');
    imageBox.appendChild(actorImage(actor, actor.name));

    const text = el('span', 'filter-actor-text');
    const strong = document.createElement('strong');
    strong.textContent = actor.name || humanizeId(actor.id) || 'Szereplő';
    const small = document.createElement('small');
    small.textContent = `${visibleTotal} játék látszik`;
    text.append(strong, small);

    const clear = el('button', 'clear-actor-btn');
    clear.type = 'button';
    clear.dataset.clearActor = 'true';
    clear.textContent = 'Szűrés törlése';

    strip.append(imageBox, text, clear);
    return strip;
  }

  function renderCard(game) {
    const article = el('article', `chaos-card status-${game.status || 'closed'}`);
    article.dataset.status = game.status || 'closed';
    if (state.openDetails.has(game.id)) article.classList.add('is-expanded');

    const visual = el('div', 'card-visual');
    const img = document.createElement('img');
    img.src = game.image || '';
    img.alt = game.title || 'Játék';
    visual.appendChild(img);

    const badge = el('span', `status-badge ${game.status === 'active' ? 'active-badge' : 'closed-badge'}`);
    badge.textContent = game.status === 'active' ? 'Aktív' : 'Lezárt';
    visual.appendChild(badge);

    const data = el('div', 'card-data');
    const title = document.createElement('h3');
    title.textContent = game.title || '';
    title.title = game.title || '';

    const meta = el('div', 'meta');
    const actorEntries = getGameActors(game);
    const actorNames = actorEntries.map((actor) => actor.name || humanizeId(actor.id)).filter(Boolean);
    if (actorNames.length) meta.appendChild(metaLine('NÉV', actorNames.join(' · ')));
    if (game.location) meta.appendChild(metaLine('HELYSZÍN', game.location));
    if (game.date) meta.appendChild(metaLine('DÁTUM', game.date));

    const actorRow = el('div', 'card-actors');
    actorEntries.forEach((actor) => {
      const button = el('button', 'card-actor-btn');
      button.type = 'button';
      button.dataset.actor = actor.id;
      button.title = actor.name || humanizeId(actor.id);
      if (actor.featured) button.classList.add('is-featured');
      if (state.actor === actor.id) button.classList.add('is-active');
      button.appendChild(actorImage(actor, actor.name || humanizeId(actor.id)));
      actorRow.appendChild(button);
    });

    const actions = el('div', 'card-actions');

    const link = el('a', 'gradient-btn open-btn');
    link.href = game.url || '#';
    link.target = '_blank';
    link.rel = 'noopener';
    link.textContent = 'Megnyitás';

    const detailButton = el('button', 'gradient-btn detail-btn');
    detailButton.type = 'button';
    detailButton.dataset.detailId = game.id;
    detailButton.textContent = state.openDetails.has(game.id) ? 'Részletek zárása' : 'Részletek';

    actions.append(detailButton, link);

    data.append(title, meta);
    if (actorRow.childElementCount) data.appendChild(actorRow);
    data.appendChild(actions);
    data.appendChild(renderGameDetails(game, state.openDetails.has(game.id)));

    article.append(visual, data);
    return article;
  }

  function renderGameDetails(game, isOpen = false) {
    const box = el('div', 'card-extra');
    if (isOpen) box.classList.add('is-open');

    const theme = el('p', 'detail-theme');
    const themeLabel = document.createElement('span');
    themeLabel.textContent = 'TÉMA: ';
    const themeText = document.createElement('strong');
    themeText.textContent = game.theme || 'nincs megadva';
    theme.append(themeLabel, themeText);

    const description = el('p', 'detail-description');
    description.textContent = game.description || 'Ehhez a játékhoz még nincs részletes leírás megadva.';

    box.append(theme, description);
    return box;
  }

  function findGameById(gameId) {
    const categories = trackerData.categories || [];
    for (const category of categories) {
      for (const game of category.games || []) {
        if (game.id === gameId) return game;
      }
    }
    return null;
  }

  function matchesFilters(game) {
    const statusOk = state.status === 'all' || game.status === state.status;
    const actorOk = !state.actor || getGameActors(game).some((actor) => actor.id === state.actor);
    return statusOk && actorOk;
  }

  function rememberOpenCategories() {
    root.querySelectorAll('details[data-category-id]').forEach((details) => {
      if (details.open) {
        state.openCategories.add(details.dataset.categoryId);
      } else {
        state.openCategories.delete(details.dataset.categoryId);
      }
    });
  }

  function getGameActors(game) {
    return (game.actors || [])
      .map(normalizeActor)
      .filter((actor) => actor && actor.id);
  }

  function normalizeActor(entry) {
    if (typeof entry === 'string') {
      return {
        id: entry,
        name: humanizeId(entry),
        image: '',
        featured: false
      };
    }

    if (!entry || typeof entry !== 'object') return null;

    const id = entry.id || entry.actorId || slugify(entry.name || entry.image || 'actor');
    return {
      id,
      name: entry.name || humanizeId(id),
      image: entry.image || '',
      featured: entry.featured === true
    };
  }

  function findActorById(actorId) {
    const categories = trackerData.categories || [];
    for (const category of categories) {
      for (const game of category.games || []) {
        const actor = getGameActors(game).find((entry) => entry.id === actorId);
        if (actor) return actor;
      }
    }
    return null;
  }

  function actorImage(actor, altText) {
    const wrap = el('span', 'actor-image-wrap');
    const initial = el('span', 'actor-initial');
    initial.textContent = initials(altText || actor.id);

    const imageName = actor.image || '';
    if (!imageName) {
      wrap.classList.add('has-fallback');
      wrap.appendChild(initial);
      return wrap;
    }

    const img = document.createElement('img');
    img.alt = altText || 'Szereplő';
    img.loading = 'lazy';
    img.addEventListener('load', () => {
      wrap.classList.add('has-image');
    }, { once: true });
    img.addEventListener('error', () => {
      img.remove();
      wrap.classList.remove('has-image');
      wrap.classList.add('has-fallback');
      if (!wrap.contains(initial)) wrap.appendChild(initial);
    }, { once: true });
    img.src = buildActorPath(imageName);

    wrap.append(img, initial);
    return wrap;
  }

  function buildActorPath(imageName) {
    const image = String(imageName || '').trim();
    if (!image) return '';
    if (/^(https?:)?\/\//.test(image) || image.startsWith('/') || image.startsWith('data:')) return image;
    if (image.includes('/')) return image;

    const base = trackerData.actorImagePath || 'actors/';
    return `${base.replace(/\/?$/, '/')}${image}`;
  }

  function countLine(label, value) {
    const line = document.createElement('div');
    line.append(document.createTextNode(`${label}: `));
    const span = document.createElement('span');
    span.textContent = value;
    line.appendChild(span);
    return line;
  }

  function metaLine(label, value) {
    const p = document.createElement('p');
    p.append(document.createTextNode(`${label}: `));
    const span = document.createElement('span');
    span.textContent = value;
    p.appendChild(span);
    return p;
  }

  function initials(name) {
    return (name || '?')
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join('')
      .toUpperCase();
  }

  function humanizeId(id) {
    return String(id || '')
      .replace(/[-_]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .replace(/\b\p{L}/gu, (char) => char.toUpperCase());
  }

  function slugify(text) {
    return String(text || 'actor')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'actor';
  }

  function el(tag, className) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    return element;
  }

  function escapeText(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
})();
