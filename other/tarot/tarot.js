const backImage = "https://i.imgur.com/GIOQEMw.png";

const cards = [
{ name: "Ace of Blades", img: "https://i.imgur.com/57AfjcY.png", fortune: "Új lehetőségek, új ötletek. De csak ésszel!" },
{ name: "Ace of Chalices", img: "https://i.imgur.com/GTC2zRj.png", fortune: "Új kapcsolat a láthatáron. Na de szerelem vagy csalódás?" },
{ name: "Death", img: "https://i.imgur.com/U0I4uZf.png", fortune: "A régi szereped meghal, ne sajnáld, nem állt jól!" },
{ name: "The Hermit", img: "https://i.imgur.com/pF4OslD.png", fortune: "Ne törődj azokkal, akik nem akarnak megérteni. Jobb neked egyedül, mint magadban!" },
{ name: "III. Blades", img: "https://i.imgur.com/mTYr74O.png", fortune: "Amit elveszítesz, az valójában csak illúzió volt." },
{ name: "IX. Chalices", img: "https://i.imgur.com/FAJlujH.png", fortune: "Nincs más dolgod, mint ölbe tett kézzel várni azt, amire amúgy is számítanál." },
{ name: "Judgement", img: "https://i.imgur.com/LVifz7V.png", fortune: "Végítélet? Szállj egy kicsit magadba, csillagom!" },
{ name: "Queen of Blades", img: "https://i.imgur.com/jnKrtrA.png", fortune: "Szükséged lesz egy kis tisztánlátásra és igazságosságra, hogy megoldódjanak a gondjaid!" },
{ name: "Strength", img: "https://i.imgur.com/OcDGQqK.png", fortune: "Menni fog, csak tanusíts egy kis önfegyelmet!" },
{ name: "The Empress", img: "https://i.imgur.com/qQKsUO0.png", fortune: "Nem te vagy túl sok szívem,ők túl kevések." },
{ name: "The Fool", img: "https://i.imgur.com/y5L9Txx.png", fortune: "Egy „miért ne?” többet ér, mint száz „mi lesz, ha...”" },
{ name: "The Hanged Man", img: "https://i.imgur.com/PryHI1P.png", fortune: "A helyzet csak akkor mozdul, ha te végre helyben maradsz." },
{ name: "The Lovers", img: "https://i.imgur.com/SI5onTQ.png", fortune: "Egy kapcsolat tükröt tart eléd,de nem minden szög előnyös, amit megmutat. "},
{ name: "The Stars", img: "https://i.imgur.com/5jcVrZC.png", fortune: "Nem mindenki örül annak, hogy ragyogsz, de ez nem a te problémád." },
{ name: "The Sun", img: "https://i.imgur.com/Ag8I9nL.png", fortune: "Nem azért süt rád a nap, mert szerencséd van, hanem mert kiléptél az árnyékból." },
{ name: "Time", img: "https://i.imgur.com/Znvi0pW.png", fortune: "Mindennek megvan a maga helye és ideje. Ne fuss, mert elesel!" },
{ name: "V. Chalices", img: "https://i.imgur.com/m0a8atj.png", fortune: "Ha három kehely kiömlött, azzal a kettővel foglalkozz, ami még tele van." },
{ name: "VIII. Blades", img: "https://i.imgur.com/zsFjANj.png", fortune: "Nyomd le a kilincset, valójában nem te vagy bezárva, hanem az ajtó." },
{ name: "Wheel of Fortune", img: "https://i.imgur.com/TZI0lyL.png", fortune: "A kontroll illúzió, a mozgás állandó, erre nincs hatásod." },
{ name: "X. Blades", img: "https://i.imgur.com/yDKV7NW.png", fortune: "Babája, ennél lejjebb már nem lesz és ez egy jó hír." }
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