const backImage = "https://i.imgur.com/GIOQEMw.png";

const cards = [
{ name: "Ace of Blades", img: "https://i.imgur.com/57AfjcY.png" },
{ name: "Ace of Chalices", img: "https://i.imgur.com/GTC2zRj.png" },
{ name: "Lap 3", img: "https://i.imgur.com/U0I4uZf.png" },
{ name: "Death", img: "https://i.imgur.com/pF4OslD.png" },
{ name: "The Hermit", img: "https://i.imgur.com/mTYr74O.png" },
{ name: "III. Blades", img: "https://i.imgur.com/FAJlujH.png" },
{ name: "IX. Chalices", img: "https://i.imgur.com/LVifz7V.png" },
{ name: "Judgement", img: "https://i.imgur.com/jnKrtrA.png" },
{ name: "Queen of Blades", img: "https://i.imgur.com/OcDGQqK.png" },
{ name: "Strength", img: "https://i.imgur.com/qQKsUO0.png" },
{ name: "The Empress", img: "https://i.imgur.com/y5L9Txx.png" },
{ name: "The Fool", img: "https://i.imgur.com/PryHI1P.png" },
{ name: "The Hanged Man", img: "https://i.imgur.com/SI5onTQ.png" },
{ name: "The Lovers", img: "https://i.imgur.com/5jcVrZC.png" },
{ name: "The Stars", img: "https://i.imgur.com/Ag8I9nL.png" },
{ name: "The Sun", img: "https://i.imgur.com/Znvi0pW.png" },
{ name: "Time", img: "https://i.imgur.com/m0a8atj.png" },
{ name: "V. Chalices", img: "https://i.imgur.com/zsFjANj.png" },
{ name: "VIII. Blades", img: "https://i.imgur.com/TZI0lyL.png" },
{ name: "Wheel of Fortune", img: "https://i.imgur.com/yDKV7NW.png" }
];

const fan = document.getElementById("fan");
const result = document.getElementById("result");

let chosen = false;

/* Shuffle */
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

    const spread = 30;
    const offset = (index - 10) * spread;
    const rotate = (index - 10) * 3;

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

        result.innerHTML = `<strong>${cardData.name}</strong><br>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`;
    });

    fan.appendChild(card);
});