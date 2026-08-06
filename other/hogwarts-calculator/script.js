const birthDateInput = document.querySelector('#birthDate');
const schoolYearInput = document.querySelector('#schoolYear');
const schoolYearPreview = document.querySelector('#schoolYearPreview');
const resultText = document.querySelector('#resultText');
const resultDetails = document.querySelector('#resultDetails');
const eventsStatus = document.querySelector('#eventsStatus');
const eventsList = document.querySelector('#eventsList');
const charactersStatus = document.querySelector('#charactersStatus');
const charactersList = document.querySelector('#charactersList');

const YEAR_LABELS = {
  1: 'elsőéves',
  2: 'másodéves',
  3: 'harmadéves',
  4: 'negyedéves',
  5: 'ötödéves',
  6: 'hatodéves',
  7: 'hetedéves',
};

const HOST_STYLE_MAP = {
  fontFamily: '--host-font-family',
  fontSize: '--host-font-size',
  textColor: '--host-text-color',
  backgroundColor: '--host-bg-color',
  accentColor: '--host-accent-color',
  radius: '--host-radius',
};

let specialEvents = [];
let notableCharacters = [];
let eventsLoadFailed = false;
let charactersLoadFailed = false;

function parseBirthMonth(value) {
  if (!value) return null;

  const match = value.match(/^(\d{4})-(\d{2})$/);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);

  if (!Number.isInteger(year) || month < 1 || month > 12) return null;
  return { year, month };
}

function parseSchoolYearStart(value) {
  const cleaned = String(value).trim();
  if (!/^\d{4}$/.test(cleaned)) return null;

  const startYear = Number(cleaned);
  if (!Number.isInteger(startYear) || startYear < 1000 || startYear > 9998) return null;

  return startYear;
}

function getFirstHogwartsStartYear(birthDate) {
  return birthDate.year + (birthDate.month <= 8 ? 11 : 12);
}

function formatSchoolYear(startYear) {
  return `${startYear}/${startYear + 1}`;
}

function updateSchoolYearPreview() {
  const startYear = parseSchoolYearStart(schoolYearInput.value);
  schoolYearPreview.textContent = startYear ? `/${startYear + 1}` : '/—';
}

function clearList(listElement) {
  listElement.replaceChildren();
  listElement.hidden = true;
}

function appendEntry(listElement, eyebrow, title, description = '') {
  const item = document.createElement('li');
  item.className = 'entry';

  const meta = document.createElement('p');
  meta.className = 'entry__meta';
  meta.textContent = eyebrow;

  const heading = document.createElement('p');
  heading.className = 'entry__title';
  heading.textContent = title;

  item.append(meta, heading);

  if (description) {
    const details = document.createElement('p');
    details.className = 'entry__description';
    details.textContent = description;
    item.append(details);
  }

  listElement.append(item);
}

function renderEvents(startYear) {
  clearList(eventsList);

  if (!startYear) {
    eventsStatus.textContent = 'Adj meg egy érvényes tanévet.';
    return;
  }

  if (eventsLoadFailed) {
    eventsStatus.textContent = 'A special-events.json fájlt nem sikerült betölteni.';
    return;
  }

  const matchingEvents = specialEvents
    .filter((item) => Number(item.schoolYear) === startYear)
    .sort((a, b) => String(a.date).localeCompare(String(b.date), 'hu'));

  if (matchingEvents.length === 0) {
    eventsStatus.textContent = `A ${formatSchoolYear(startYear)}-es tanévhez nincs rögzített különleges esemény.`;
    return;
  }

  eventsStatus.textContent = `${formatSchoolYear(startYear)} – ${matchingEvents.length} esemény`;
  eventsList.hidden = false;

  for (const item of matchingEvents) {
    appendEntry(eventsList, String(item.date || 'Dátum nélkül'), String(item.event || 'Névtelen esemény'));
  }
}

function getCohortRelation(characterStartYear, ownStartYear) {
  const difference = characterStartYear - ownStartYear;

  if (difference === -1) return 'egy évfolyammal feljebb';
  if (difference === 0) return 'azonos évfolyam';
  if (difference === 1) return 'egy évfolyammal lejjebb';
  return null;
}

function getYearStatus(firstStartYear, selectedStartYear) {
  const schoolYearNumber = selectedStartYear - firstStartYear + 1;

  if (schoolYearNumber < 1) return 'ebben a tanévben még nem roxfortos';
  if (schoolYearNumber > 7) return 'ebben a tanévben már végzett';
  return `ebben a tanévben ${YEAR_LABELS[schoolYearNumber]}`;
}

function renderCharacters(birthDate, selectedStartYear) {
  clearList(charactersList);

  if (!birthDate) {
    charactersStatus.textContent = 'Adj meg egy születési évet és hónapot.';
    return;
  }

  if (charactersLoadFailed) {
    charactersStatus.textContent = 'A notable-characters.json fájlt nem sikerült betölteni.';
    return;
  }

  const ownStartYear = getFirstHogwartsStartYear(birthDate);
  const nearbyCharacters = notableCharacters
    .map((item) => ({
      ...item,
      firstSchoolYear: Number(item.firstSchoolYear),
    }))
    .filter((item) => Number.isInteger(item.firstSchoolYear))
    .map((item) => ({
      ...item,
      relation: getCohortRelation(item.firstSchoolYear, ownStartYear),
    }))
    .filter((item) => item.relation)
    .sort((a, b) => a.firstSchoolYear - b.firstSchoolYear || String(a.name).localeCompare(String(b.name), 'hu'));

  if (nearbyCharacters.length === 0) {
    charactersStatus.textContent = `A karakter első lehetséges tanéve ${formatSchoolYear(ownStartYear)}; ehhez nincs rögzített nevezetes karakter a közeli évfolyamokon.`;
    return;
  }

  charactersStatus.textContent = `A karakter első lehetséges tanéve: ${formatSchoolYear(ownStartYear)}.`;
  charactersList.hidden = false;

  for (const item of nearbyCharacters) {
    const status = selectedStartYear ? getYearStatus(item.firstSchoolYear, selectedStartYear) : '';
    const descriptionParts = [status, item.note].filter(Boolean);

    appendEntry(
      charactersList,
      item.relation,
      String(item.name || 'Névtelen karakter'),
      descriptionParts.join(' · ')
    );
  }
}

function calculate() {
  updateSchoolYearPreview();

  const birthDate = parseBirthMonth(birthDateInput.value);
  const schoolYearStart = parseSchoolYearStart(schoolYearInput.value);

  renderEvents(schoolYearStart);
  renderCharacters(birthDate, schoolYearStart);

  if (!birthDate) {
    resultText.textContent = 'Adj meg egy születési évet és hónapot.';
    resultDetails.textContent = '';
    return;
  }

  if (!schoolYearStart) {
    resultText.textContent = 'A tanév kezdőéve nem megfelelő.';
    resultDetails.textContent = 'Négyjegyű évszámot adj meg, például: 2006.';
    return;
  }

  const firstStartYear = getFirstHogwartsStartYear(birthDate);
  const hogwartsYear = schoolYearStart - firstStartYear + 1;

  if (hogwartsYear < 1) {
    resultText.textContent = 'A karakter ebben a tanévben még nem lenne roxfortos.';
  } else if (hogwartsYear > 7) {
    resultText.textContent = 'A karakter ebben a tanévben már végzett volna.';
  } else {
    resultText.textContent = `A karakter ${YEAR_LABELS[hogwartsYear]} lenne a ${formatSchoolYear(schoolYearStart)}-es tanévben.`;
  }

  resultDetails.textContent = `Első roxforti tanévét ekkor kezdte meg: ${formatSchoolYear(firstStartYear)}. `;
}

async function loadJsonData() {
  const [eventsResult, charactersResult] = await Promise.allSettled([
    fetch('special-events.json', { cache: 'no-store' }).then((response) => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    }),
    fetch('notable-characters.json', { cache: 'no-store' }).then((response) => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    }),
  ]);

  if (eventsResult.status === 'fulfilled') {
    specialEvents = Array.isArray(eventsResult.value)
      ? eventsResult.value
      : Array.isArray(eventsResult.value.events)
        ? eventsResult.value.events
        : [];
  } else {
    eventsLoadFailed = true;
  }

  if (charactersResult.status === 'fulfilled') {
    notableCharacters = Array.isArray(charactersResult.value)
      ? charactersResult.value
      : Array.isArray(charactersResult.value.characters)
        ? charactersResult.value.characters
        : [];
  } else {
    charactersLoadFailed = true;
  }

  calculate();
}

function applyHostStyles(styles) {
  if (!styles || typeof styles !== 'object') return;

  const root = document.documentElement;
  for (const [key, cssVariable] of Object.entries(HOST_STYLE_MAP)) {
    const value = styles[key];
    if (typeof value === 'string' && value.trim()) {
      root.style.setProperty(cssVariable, value.trim());
    }
  }
}

function importHostStylesWhenPossible() {
  try {
    if (window.parent === window || !window.frameElement) return;

    const parentWindow = window.parent;
    const iframeStyles = parentWindow.getComputedStyle(window.frameElement);
    const parentRootStyles = parentWindow.getComputedStyle(parentWindow.document.documentElement);

    applyHostStyles({
      fontFamily: iframeStyles.fontFamily || parentRootStyles.fontFamily,
      fontSize: iframeStyles.fontSize || parentRootStyles.fontSize,
      textColor: iframeStyles.color || parentRootStyles.color,
      backgroundColor:
        iframeStyles.backgroundColor !== 'rgba(0, 0, 0, 0)'
          ? iframeStyles.backgroundColor
          : parentRootStyles.backgroundColor,
    });

    const root = document.documentElement;
    for (const propertyName of parentRootStyles) {
      if (propertyName.startsWith('--')) {
        root.style.setProperty(propertyName, parentRootStyles.getPropertyValue(propertyName));
      }
    }
  } catch (error) {
    // Eltérő domainről beágyazott iframe esetén a böngésző nem engedi
    // a szülőoldal stílusainak közvetlen kiolvasását. Ilyenkor postMessage
    // segítségével adhatók át az engedélyezett stílusértékek.
  }
}

function notifyParentAboutHeight() {
  const height = document.documentElement.scrollHeight;
  window.parent?.postMessage(
    { type: 'hogwarts-year-calculator:resize', height },
    '*'
  );
}

window.addEventListener('message', (event) => {
  if (event.data?.type !== 'hogwarts-year-calculator:theme') return;
  applyHostStyles(event.data.styles);
});

birthDateInput.addEventListener('input', calculate);
schoolYearInput.addEventListener('input', calculate);

importHostStylesWhenPossible();
calculate();
loadJsonData();

if ('ResizeObserver' in window) {
  new ResizeObserver(notifyParentAboutHeight).observe(document.documentElement);
} else {
  window.addEventListener('load', notifyParentAboutHeight);
}
