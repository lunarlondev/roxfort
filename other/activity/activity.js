let originalData = null;
let wordsData = null;
let modes = [];

// JSON betöltése
async function loadWords() {
    try {
        const response = await fetch("activity.json");
        originalData = await response.json();

        // kategóriák automatikusan a JSON-ból
        modes = Object.keys(originalData);

        // másolat, hogy tudjunk törölni belőle
        wordsData = JSON.parse(JSON.stringify(originalData));

        console.log("Activity betöltve:", modes);
    } catch (err) {
        console.error("JSON betöltési hiba:", err);
    }
}

// Random szó kategóriából
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

// Új kártya húzás
function drawCard() {
    if (!wordsData || modes.length === 0) {
        console.log("Még tölt a JSON...");
        return;
    }

    const mode = modes[Math.floor(Math.random() * modes.length)];
    const word = drawFromCategory(mode);

    document.getElementById("mode").innerText = mode;
    document.getElementById("word").innerText = word;
}

// Gomb
document.getElementById("drawButton").addEventListener("click", drawCard);

// Indítás
loadWords();



function drawCard() {
    if (!wordsData || modes.length === 0) {
        console.log("Még tölt a JSON...");
        return;
    }

    const mode = modes[Math.floor(Math.random() * modes.length)];
    const word = drawFromCategory(mode);

    document.getElementById("mode").innerText = mode;
    document.getElementById("word").innerText = word;

    // animáció
    const card = document.getElementById("card");
    card.classList.add("animate");
    setTimeout(() => card.classList.remove("animate"), 200);
}