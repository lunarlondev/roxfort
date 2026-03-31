let wordsData = null;
const modes = ["Rajz", "Korbemagyarazas", "Mutogatas"];

let deck = [];

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
}

// Random kártya húzás
function drawCard() {
    if (!deck || deck.length === 0) {
        buildDeck();
    }

    const randomIndex = Math.floor(Math.random() * deck.length);
    const card = deck[randomIndex];

    deck.splice(randomIndex, 1);

    document.getElementById("mode").innerText = card.mode;
    document.getElementById("word").innerText = card.word;
}

document.getElementById("drawButton").addEventListener("click", drawCard);
document.getElementById("skipButton").addEventListener("click", drawCard);

// Indítás
loadWords();