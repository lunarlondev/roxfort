let originalData = null;
let wordsData = null;

const modes = ["Rajz", "Korbemagyarazas", "Mutogatas"];

// JSON betöltése
async function loadWords() {
    const response = await fetch("activity.json");
    originalData = await response.json();

    // másolat, hogy tudjunk belőle törölni
    wordsData = JSON.parse(JSON.stringify(originalData));
}

// Random elem kiválasztása és törlése
function drawFromCategory(mode) {
    if (wordsData[mode].length === 0) {
        // ha elfogyott, visszatöltjük
        wordsData[mode] = [...originalData[mode]];
    }

    const randomIndex = Math.floor(Math.random() * wordsData[mode].length);
    const word = wordsData[mode][randomIndex];

    // kivesszük, hogy ne ismétlődjön
    wordsData[mode].splice(randomIndex, 1);

    return word;
}

// Kártyahúzás
function drawCard() {
    const mode = modes[Math.floor(Math.random() * modes.length)];
    const word = drawFromCategory(mode);

    document.getElementById("mode").innerText = mode;
    document.getElementById("word").innerText = word;
}

document.getElementById("drawButton").addEventListener("click", drawCard);
document.getElementById("skipButton").addEventListener("click", drawCard);

// Indítás
loadWords();