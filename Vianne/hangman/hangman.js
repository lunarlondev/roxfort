const MAX_WRONG = 6;
const parts = document.querySelectorAll(".part");

/* ====== NYERŐ SZÖVEGEK ====== */
const winTexts = [
    "YOU ATE THAT. NO CRUMBS.",
    "SLAY.",
    "MAIN CHARACTER ENERGY.",
    "ABSOLUTELY ICONIC.",
    "NAILED IT."
];

/* ====== ADATOK ====== */
const data = [
    {
        category: "VIANNE ÉS A VILÁG",
        word: "CHEERLEADER",
        hint: "SZURKOLÓ"
    },
    {
        category: "VIANNE ÉS A VILÁG",
        word: "LEGILIMENCIA",
        hint: "MÁGIKUS KÉPESSÉG, AMIVEL RITKÁN SZÜLETNEK"
    },
    {
        category: "VIANNE ÉS A VILÁG",
        word: "VWITCHGANG",
        hint: "VIANNE KÖZELI BARÁTI KÖRE"
    },
    {
        category: "VIANNE ÉS A VILÁG",
        word: "KOALA",
        hint: "ROKU SZERINT AZ AGYA"
    },
    {
        category: "VIANNE ÉS A VILÁG",
        word: "FLAMINGÓ",
        hint: "VIANNE KEDVENC MADARA"
    },
    {
        category: "VIANNE ÉS A VILÁG",
        word: "JOVIÁLIS",
        hint: "KEDÉLYES, DERŰS"
    },
    {
        category: "VIANNE ÉS A VILÁG",
        word: "EIFFEL TORONY",
        hint: "EURÓPAI LÁTVÁNYOSSÁG"
    },
    {
        category: "VIANNE ÉS A VILÁG",
        word: "VIENNA",
        hint: "EURÓPAI VÁROS"
    },

    {
        category: "ARANYKÖPÉSEK",
        word: "USA SZOMSZÉDJA USB",
        hint: "…ÉS AZ USSR AZÉRT VAN MESSZE, MERT AZ ABC-BEN IS HÁTRÉBB VAN"
    },
    {
        category: "ARANYKÖPÉSEK",
        word: "PROBLÉMÁD VAN NEKED NEM MENYASSZONYOD",
        hint: "VIANNE LEGIGAZABB MONDÁSA"
    },
    {
        category: "ARANYKÖPÉSEK",
        word: "VIHETNEK AZ UFO-K",
        hint: "51-ES KÖRZET"
    },
    {
        category: "ARANYKÖPÉSEK",
        word: "ŐSEMBEREK ÉS AUTÓK",
        hint: "MAGNIX KÖZLEKEDÉSI ESZKÖZZEL KAPCSOLATOS"
    },
    {
        category: "ARANYKÖPÉSEK",
        word: "HÓVAL FÚJT PULYKA",
        hint: "MADRI APU KEDVES ELMECSPAPDÁJA"
    },
    {
        category: "ARANYKÖPÉSEK",
        word: "ÍÍÍÍÍÍ EGY KUTYA ÉS MENNYI FEJE VAN",
        hint: "CERBERUS"
    }
];

let current;
let guessed = [];
let wrong = 0;
let gameOver = false;

/* ====== START ====== */
function startGame() {
    current = data[Math.floor(Math.random() * data.length)];
    guessed = [];
    wrong = 0;
    gameOver = false;

    document.getElementById("category").textContent = current.category;
    document.getElementById("hint-text").textContent = "";
    document.getElementById("wrong").textContent = "";

    parts.forEach(p => p.style.opacity = 0);

    renderWord();
    renderKeyboard();
}

/* ====== SZÓ RAJZOLÁS ====== */
function renderWord(lastCorrectLetter = null) {
    const wordEl = document.getElementById("word");
    wordEl.innerHTML = "";

    current.word.split("").forEach(letter => {
        const span = document.createElement("div");
        span.className = "letter";

        if (letter === " " || letter === "-") {
            span.textContent = letter;
            span.style.borderBottom = "none";
        } else if (guessed.includes(letter) || gameOver) {
            span.textContent = letter;
            if (letter === lastCorrectLetter) {
                explodeSpark(span);
            }
        }
        wordEl.appendChild(span);
    });
}

/* ====== BILLENTYŰZET ====== */
function renderKeyboard() {
    const kb = document.getElementById("keyboard");
    kb.innerHTML = "";

    const letters = "AÁBCDEÉFGHIÍJKLMNOÓÖŐPQRSTUÚÜŰVWXYZ-";
    letters.split("").forEach(l => {
        const btn = document.createElement("button");
        btn.textContent = l;
        btn.disabled = gameOver;
        btn.onclick = () => guess(l, btn);
        kb.appendChild(btn);
    });
}

/* ====== TIPP ====== */
function guess(letter, btn) {
    if (gameOver) return;
    btn.disabled = true;

    if (current.word.includes(letter)) {
        guessed.push(letter);
        renderWord(letter);
        checkWin();
    } else {
        wrong++;
        document.getElementById("wrong").textContent = `HIBÁK: ${wrong}/${MAX_WRONG}`;
        if (parts[wrong - 1]) {
            parts[wrong - 1].style.opacity = 1;
        }
        if (wrong >= MAX_WRONG) {
            loseGame();
        }
    }
}

/* ====== NYERÉS ====== */
function checkWin() {
    const lettersOnly = current.word.replace(/[^A-ZÁÉÍÓÖŐÚÜŰ]/g, "");
    const unique = [...new Set(lettersOnly.split(""))];

    if (unique.every(l => guessed.includes(l))) {
        gameOver = true;
        document.getElementById("wrong").textContent =
            winTexts[Math.floor(Math.random() * winTexts.length)];
        renderKeyboard();
    }
}

/* ====== VESZTÉS ====== */
function loseGame() {
    gameOver = true;
    document.getElementById("wrong").textContent = "VESZTETTÉL.";
    renderWord();
    renderKeyboard();
}

/* ====== CSILLAGROBBANÁS ====== */
function explodeSpark(target) {
    for (let i = 0; i < 28; i++) {
        const s = document.createElement("div");
        s.className = "spark";
        s.textContent = Math.random() > 0.5 ? "✦" : "✨";

        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * 36 + 12;

        s.style.left = "50%";
        s.style.top = "50%";

        target.appendChild(s);

        s.animate([
            { transform: "translate(-50%,-50%) scale(0)", opacity: 0 },
            { transform: `translate(${Math.cos(angle)*dist}px, ${Math.sin(angle)*dist}px) scale(1)`, opacity: 1 },
            { transform: `translate(${Math.cos(angle)*dist*1.7}px, ${Math.sin(angle)*dist*1.7}px) scale(0)`, opacity: 0 }
        ], {
            duration: 700,
            easing: "ease-out"
        }).onfinish = () => s.remove();
    }
}

/* ====== HINT ====== */
document.getElementById("hint-btn").onclick = () => {
    document.getElementById("hint-text").textContent = current.hint;
};

startGame();
