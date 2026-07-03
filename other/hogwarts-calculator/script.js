const birthDateInput = document.querySelector('#birthDate');
const schoolYearInput = document.querySelector('#schoolYear');
const resultText = document.querySelector('#resultText');
const resultDetails = document.querySelector('#resultDetails');

const YEAR_LABELS = {
  1: 'elsőéves',
  2: 'másodéves',
  3: 'harmadéves',
  4: 'negyedéves',
  5: 'ötödéves',
  6: 'hatodéves',
  7: 'hetedéves',
};

const ZODIAC_SIGNS = [
  { name: 'Bak', from: [12, 22], to: [1, 19] },
  { name: 'Vízöntő', from: [1, 20], to: [2, 18] },
  { name: 'Halak', from: [2, 19], to: [3, 20] },
  { name: 'Kos', from: [3, 21], to: [4, 19] },
  { name: 'Bika', from: [4, 20], to: [5, 20] },
  { name: 'Ikrek', from: [5, 21], to: [6, 20] },
  { name: 'Rák', from: [6, 21], to: [7, 22] },
  { name: 'Oroszlán', from: [7, 23], to: [8, 22] },
  { name: 'Szűz', from: [8, 23], to: [9, 22] },
  { name: 'Mérleg', from: [9, 23], to: [10, 22] },
  { name: 'Skorpió', from: [10, 23], to: [11, 21] },
  { name: 'Nyilas', from: [11, 22], to: [12, 21] },
];

function parseLocalDate(value) {
  if (!value) return null;

  const [year, month, day] = value.split('-').map(Number);
  if (!year || !month || !day) return null;

  const date = new Date(year, month - 1, day);
  const isValid =
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day;

  return isValid ? { year, month, day } : null;
}

function parseSchoolYear(value) {
  const cleaned = value.trim();
  const match = cleaned.match(/^(\d{4})\s*\/\s*(\d{4})$/);

  if (!match) return null;

  const startYear = Number(match[1]);
  const endYear = Number(match[2]);

  if (endYear !== startYear + 1) return null;

  return { startYear, endYear };
}

function isOnOrBeforeAugust31(dateParts) {
  return dateParts.month < 8 || (dateParts.month === 8 && dateParts.day <= 31);
}

function getFirstHogwartsStartYear(birthDate) {
  return birthDate.year + (isOnOrBeforeAugust31(birthDate) ? 11 : 12);
}

function isInRange(month, day, from, to) {
  const current = month * 100 + day;
  const start = from[0] * 100 + from[1];
  const end = to[0] * 100 + to[1];

  if (start <= end) {
    return current >= start && current <= end;
  }

  return current >= start || current <= end;
}

function getZodiacSign(dateParts) {
  return ZODIAC_SIGNS.find((sign) =>
    isInRange(dateParts.month, dateParts.day, sign.from, sign.to)
  )?.name;
}

function formatSchoolYear(startYear) {
  return `${startYear}/${startYear + 1}`;
}

function calculate() {
  const birthDate = parseLocalDate(birthDateInput.value);
  const schoolYear = parseSchoolYear(schoolYearInput.value);

  if (!birthDate) {
    resultText.textContent = 'Adj meg egy születési dátumot.';
    resultDetails.textContent = '';
    return;
  }

  if (!schoolYear) {
    resultText.textContent = 'A tanév formátuma nem jó.';
    resultDetails.textContent = 'Példa: 2006/2007. A második évszámnak eggyel nagyobbnak kell lennie.';
    return;
  }

  const firstStartYear = getFirstHogwartsStartYear(birthDate);
  const hogwartsYear = schoolYear.startYear - firstStartYear + 1;
  const zodiac = getZodiacSign(birthDate);

  if (hogwartsYear < 1) {
    resultText.textContent = `Még nem lenne roxfortos. Horoszkóp: ${zodiac}.`;
  } else if (hogwartsYear > 7) {
    resultText.textContent = `Már végzett volna. Horoszkóp: ${zodiac}.`;
  } else {
    resultText.textContent = `A karakter ${YEAR_LABELS[hogwartsYear]} lenne. Horoszkóp: ${zodiac}.`;
  }

  resultDetails.textContent = `Első lehetséges roxforti tanéve: ${formatSchoolYear(firstStartYear)}. A számítás szerint az adott tanév szeptember 1-je előtt, legkésőbb augusztus 31-ig kell betöltenie a 11-et.`;
}

function importHostStylesWhenPossible() {
  try {
    if (window.parent === window || !window.frameElement) return;

    const parentWindow = window.parent;
    const iframeStyles = parentWindow.getComputedStyle(window.frameElement);
    const parentRootStyles = parentWindow.getComputedStyle(parentWindow.document.documentElement);
    const root = document.documentElement;

    const fontFamily = iframeStyles.fontFamily || parentRootStyles.fontFamily;
    const fontSize = iframeStyles.fontSize || parentRootStyles.fontSize;
    const color = iframeStyles.color || parentRootStyles.color;
    const backgroundColor = iframeStyles.backgroundColor || parentRootStyles.backgroundColor;

    if (fontFamily) root.style.setProperty('--host-font-family', fontFamily);
    if (fontSize) root.style.setProperty('--host-font-size', fontSize);
    if (color) root.style.setProperty('--host-text-color', color);
    if (backgroundColor && backgroundColor !== 'rgba(0, 0, 0, 0)') {
      root.style.setProperty('--host-bg-color', backgroundColor);
    }

    for (const propertyName of parentRootStyles) {
      if (propertyName.startsWith('--')) {
        root.style.setProperty(propertyName, parentRootStyles.getPropertyValue(propertyName));
      }
    }
  } catch (error) {
    // Cross-origin iframe esetén a szülőoldal stílusai nem olvashatók.
    // Ilyenkor a CSS-ben megadott biztonságos alapstílusok maradnak érvényben.
  }
}

function notifyParentAboutHeight() {
  const height = document.documentElement.scrollHeight;
  window.parent?.postMessage(
    { type: 'hogwarts-year-calculator:resize', height },
    '*'
  );
}

birthDateInput.addEventListener('input', calculate);
schoolYearInput.addEventListener('input', calculate);

importHostStylesWhenPossible();
calculate();

if ('ResizeObserver' in window) {
  new ResizeObserver(notifyParentAboutHeight).observe(document.documentElement);
} else {
  window.addEventListener('load', notifyParentAboutHeight);
}
