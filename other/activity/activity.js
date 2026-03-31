let wordsData = null;
const modes = ["Rajz", "Körbeírás", "Mutogatás"];

let deck = [];
let currentIndex = 0;

// JSON betöltése
async function loadWords() {
    const response = await fetch("activity.json");
    wordsData = await response.json();
    buildDeck();
}

// Pakli létrehozása
function buildDeck() {
    deck = [];

    modes.forEach(mode => {
        wordsData[mode].forEach(word => {
            deck.push({
                mode: mode,
                word: word
            });
        });
    });

    shuffleDeck();
    currentIndex = 0;
}

// Pakli keverése
function shuffleDeck() {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

// Kártyahúzás
function drawCard() {
    if (deck.length === 0) return;

    if (currentIndex >= deck.length) {
        buildDeck();
    }

    const card = deck[currentIndex];
    currentIndex++;

    document.getElementById("mode").innerText = card.mode;
    document.getElementById("word").innerText = card.word;
}

document.getElementById("drawButton").addEventListener("click", drawCard);

// Indítás
loadWords();