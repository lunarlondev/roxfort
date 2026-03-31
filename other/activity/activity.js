const wordsData = {
    "Rajz": [
        "Patronus",
        "Hippogriff",
        "Thestral",
        "Aranycikesz",
        "Merengo",
        "Idonyero",
        "Mandragora",
        "Varazspalca",
        "Lathatatlanna tevo kopeny",
        "Bagoly posta"
    ],

    "Korbemagyarazas": [
        "Horcrux",
        "Animagia",
        "Szazfule fozet",
        "Mumus",
        "Vedobubaj",
        "Atok",
        "Varazspalca mag",
        "Varazstargy",
        "Tiltott varazslat",
        "Varazslo parbaj"
    ],

    "Mutogatas": [
        "_____ karakter varazsol",
        "_____ karakter seprun repul",
        "_____ karakter bajitalt foz",
        "_____ karakter mumussal talalkozik",
        "_____ karakter patronust idez",
        "_____ karakter titkos ajtot keres",
        "_____ karakter parbajozik",
        "_____ karakter elront egy varazslatot",
        "_____ karakter sarkany elol menekul",
        "_____ karakter titkos folyoson lopakodik"
    ]
};

const modes = ["Rajz", "Korbemagyarazas", "Mutogatas"];

let deck = [];
let currentIndex = 0;

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
    if (currentIndex >= deck.length) {
        buildDeck();
    }

    const card = deck[currentIndex];
    currentIndex++;

    document.getElementById("mode").innerText = card.mode;
    document.getElementById("word").innerText = card.word;
}

document.getElementById("drawButton").addEventListener("click", drawCard);

// Indításkor pakli létrehozása
buildDeck();