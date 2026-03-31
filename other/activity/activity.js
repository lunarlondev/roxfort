let wordsData = null;

const modes = ["Rajz", "Korbemagyarazas", "Mutogatas"];

async function loadWords() {
    const response = await fetch("activity.json");
    wordsData = await response.json();
}

function getRandomMode() {
    return modes[Math.floor(Math.random() * modes.length)];
}

function getRandomWord(mode) {
    const list = wordsData[mode];
    return list[Math.floor(Math.random() * list.length)];
}

function drawCard() {
    const mode = getRandomMode();
    const word = getRandomWord(mode);

    document.getElementById("mode").innerText = mode;
    document.getElementById("word").innerText = word;
}

document.getElementById("drawButton").addEventListener("click", drawCard);

loadWords();