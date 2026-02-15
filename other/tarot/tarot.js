const backImage = "https://i.imgur.com/GIOQEMw.png";

const cards = [
{ name: "Ace of Blades", img: "https://i.imgur.com/57AfjcY.png", fortune: "Jóslat szövege ide." },
{ name: "Ace of Chalices", img: "https://i.imgur.com/GTC2zRj.png", fortune: "Jóslat szövege ide." },
{ name: "Death", img: "https://i.imgur.com/U0I4uZf.png", fortune: "Jóslat szövege ide." },
{ name: "The Hermit", img: "https://i.imgur.com/pF4OslD.png", fortune: "Jóslat szövege ide." },
{ name: "III. Blades", img: "https://i.imgur.com/mTYr74O.png", fortune: "Jóslat szövege ide." },
{ name: "IX. Chalices", img: "https://i.imgur.com/FAJlujH.png", fortune: "Jóslat szövege ide." },
{ name: "Judgement", img: "https://i.imgur.com/LVifz7V.png", fortune: "Jóslat szövege ide." },
{ name: "Queen of Blades", img: "https://i.imgur.com/jnKrtrA.png", fortune: "Jóslat szövege ide." },
{ name: "Strength", img: "https://i.imgur.com/OcDGQqK.png", fortune: "Jóslat szövege ide." },
{ name: "The Empress", img: "https://i.imgur.com/qQKsUO0.png", fortune: "Jóslat szövege ide." },
{ name: "The Fool", img: "https://i.imgur.com/y5L9Txx.png", fortune: "Jóslat szövege ide." },
{ name: "The Hanged Man", img: "https://i.imgur.com/PryHI1P.png", fortune: "Jóslat szövege ide." },
{ name: "The Lovers", img: "https://i.imgur.com/SI5onTQ.png", fortune: "Jóslat szövege ide." },
{ name: "The Stars", img: "https://i.imgur.com/5jcVrZC.png", fortune: "Jóslat szövege ide." },
{ name: "The Sun", img: "https://i.imgur.com/Ag8I9nL.png", fortune: "Jóslat szövege ide." },
{ name: "Time", img: "https://i.imgur.com/Znvi0pW.png", fortune: "Jóslat szövege ide." },
{ name: "V. Chalices", img: "https://i.imgur.com/m0a8atj.png", fortune: "Jóslat szövege ide." },
{ name: "VIII. Blades", img: "https://i.imgur.com/zsFjANj.png", fortune: "Jóslat szövege ide." },
{ name: "Wheel of Fortune", img: "https://i.imgur.com/TZI0lyL.png", fortune: "Jóslat szövege ide." },
{ name: "X. Blades", img: "https://i.imgur.com/yDKV7NW.png", fortune: "Jóslat szövege ide." }
];

const fan = document.getElementById("fan");
const result = document.getElementById("result");

let chosen = false;

/* Fisher–Yates shuffle */
for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
}

cards.forEach((cardData, index) => {

    const card = document.createElement("div");
    card.className = "tarot-card";

    const inner = document.createElement("div");
    inner.className = "tarot-inner";

    const back = document.createElement("img");
    back.className = "tarot-face tarot-back";
    back.src = backImage;

    const front = document.createElement("img");
    front.className = "tarot-face tarot-front";
    front.src = cardData.img;

    inner.appendChild(back);
    inner.appendChild(front);
    card.appendChild(inner);

    const spread = 22;
    const rotate = (index - 10) * 2.2;
    const offset = (index - 10) * spread;

    card.style.left = "50%";
    card.style.setProperty("--x", offset + "px");
    card.style.setProperty("--r", rotate + "deg");

    card.addEventListener("click", () => {
        if (chosen) return;
        chosen = true;

        document.querySelectorAll(".tarot-card").forEach(c => {
            if (c !== card) c.classList.add("faded");
        });

        card.classList.add("selected");
        card.classList.add("flipped");

        result.innerHTML = `<strong>${cardData.name}</strong><br>${cardData.fortune}`;
    });

    fan.appendChild(card);
});