(() => {
  const root = document.getElementById('chaosTracker');
  if (!root) return;

  const source = root.dataset.source || 'heranoushtracker-data.json';
  const state = {
    status: 'all',
    actor: null,
    openCategories: new Set()
  };

  let trackerData = null;
  let actorMap = new Map();

  root.innerHTML = '<div class="chaos-loading">Adatok betöltése...</div>';

  fetch(source)
    .then((response) => {
      if (!response.ok) throw new Error('Nem sikerült betölteni a JSON fájlt.');
      return response.json();
    })
    .then((data) => {
      trackerData = data;
      actorMap = new Map((data.actors || []).map((actor) => [actor.id, actor]));
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

    if (filterButton) {
      rememberOpenCategories();
      state.status = filterButton.dataset.filter;
      render();
      return;
    }

    if (actorButton) {
      rememberOpenCategories();
      state.actor = actorButton.dataset.actor;
      render();
      return;
    }

    if (clearActorButton) {
      rememberOpenCategories();
      state.actor = null;
      render();
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
    const actors = trackerData.actors || [];
    const categories = trackerData.categories || [];
    const allGames = categories.flatMap((category) => category.games || []);
    const visibleGames = allGames.filter(matchesFilters);
    const selectedActor = state.actor ? actorMap.get(state.actor) : null;

    root.innerHTML = '';
    root.appendChild(renderSidebar(profile, actors, allGames, visibleGames, selectedActor));
    root.appendChild(renderContent(categories, visibleGames.length));
  }

  function renderSidebar(profile, actors, allGames, visibleGames, selectedActor) {
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

    if (selectedActor) {
      sidebar.appendChild(renderSelectedActor(selectedActor, visibleGames.length));
    }

    if (actors.length) {
      sidebar.appendChild(renderActorPanel(actors));
    }

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

  function renderSelectedActor(actor, count) {
    const wrap = el('div', 'chaos-selected-actor');
    const title = el('p', 'chaos-section-title');
    title.textContent = 'Szűrés';

    const card = el('div', 'selected-actor-card');
    const imageBox = el('div', 'selected-actor-image');
    imageBox.appendChild(actorImage(actor, actor.name));

    const data = el('div', 'selected-actor-data');
    const name = document.createElement('strong');
    name.textContent = actor.name;
    const gameCount = document.createElement('span');
    gameCount.textContent = `${count} játék látszik`;

    const clear = el('button', 'clear-actor-btn');
    clear.type = 'button';
    clear.dataset.clearActor = 'true';
    clear.textContent = 'Szűrés törlése';

    data.append(name, gameCount, clear);
    card.append(imageBox, data);
    wrap.append(title, card);
    return wrap;
  }

  function renderActorPanel(actors) {
    const panel = el('div', 'chaos-actors-panel');
    const title = el('p', 'chaos-section-title');
    title.textContent = 'Szereplők';
    const list = el('div', 'actor-list');

    actors.forEach((actor) => {
      const button = el('button', 'actor-filter-btn');
      button.type = 'button';
      button.dataset.actor = actor.id;
      button.title = actor.name;
      if (actor.featured) button.classList.add('is-featured');
      if (state.actor === actor.id) button.classList.add('is-active');
      button.appendChild(actorImage(actor, actor.name));
      list.appendChild(button);
    });

    panel.append(title, list);
    return panel;
  }

  function renderContent(categories, visibleTotal) {
    const main = el('main', 'chaos-content');
    let renderedCategories = 0;

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

  function renderCard(game) {
    const article = el('article', `chaos-card status-${game.status || 'closed'}`);
    article.dataset.status = game.status || 'closed';

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

    const meta = el('div', 'meta');
    const actorNames = (game.actors || []).map((id) => actorMap.get(id)?.name).filter(Boolean);
    if (actorNames.length) meta.appendChild(metaLine('NÉV', actorNames.join(' · ')));
    if (game.location) meta.appendChild(metaLine('HELYSZÍN', game.location));
    if (game.date) meta.appendChild(metaLine('DÁTUM', game.date));

    const actorRow = el('div', 'card-actors');
    (game.actors || []).forEach((actorId) => {
      const actor = actorMap.get(actorId);
      if (!actor) return;
      const button = el('button', 'card-actor-btn');
      button.type = 'button';
      button.dataset.actor = actor.id;
      button.title = actor.name;
      if (actor.featured) button.classList.add('is-featured');
      if (state.actor === actor.id) button.classList.add('is-active');
      button.appendChild(actorImage(actor, actor.name));
      actorRow.appendChild(button);
    });

    const link = el('a', 'gradient-btn');
    link.href = game.url || '#';
    link.textContent = 'Megnyitás';

    data.append(title, meta);
    if (actorRow.childElementCount) data.appendChild(actorRow);
    data.appendChild(link);
    article.append(visual, data);
    return article;
  }

  function matchesFilters(game) {
    const statusOk = state.status === 'all' || game.status === state.status;
    const actorOk = !state.actor || (game.actors || []).includes(state.actor);
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

  function actorImage(actor, altText) {
    const wrap = document.createElement('span');
    const initial = el('span', 'actor-initial');
    initial.textContent = initials(altText);

    const imageName = actor.image || '';
    if (imageName) {
      const img = document.createElement('img');
      img.src = buildActorPath(imageName);
      img.alt = altText || 'Szereplő';
      img.addEventListener('error', () => {
        img.remove();
      }, { once: true });
      wrap.append(img, initial);
    } else {
      wrap.appendChild(initial);
    }

    return wrap;
  }

  function buildActorPath(imageName) {
    if (/^(https?:)?\/\//.test(imageName) || imageName.startsWith('/')) return imageName;
    const base = trackerData.actorImagePath || 'actors/';
    return `${base.replace(/\/?$/, '/')}${imageName}`;
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
