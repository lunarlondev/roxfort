const WIZBURGER_WORD = "WizBurger";
const WIZBURGER_LOOP_TIME = 10000;

const WIZBURGER_COLORS = [
  "#FBDB4A",
  "#F3934A",
  "#EB547D",
  "#9F6AA7",
  "#5476B3",
  "#2BB19B"
];

const wizburgerLogo = document.getElementById("wizburger-logo");

function wizburgerBuild() {
  wizburgerLogo.innerHTML = "";

  WIZBURGER_WORD.split("").forEach((char, i) => {
    const span = document.createElement("span");
    span.className = "letter";
    span.textContent = char;
    span.style.color = WIZBURGER_COLORS[i % WIZBURGER_COLORS.length];

    span.style.animation = "none";
    wizburgerLogo.appendChild(span);

    /* force reflow */
    void span.offsetHeight;

    span.style.animation = "wizburger-popIn 0.6s ease-out forwards";
    span.style.animationDelay = `${i * 0.08}s`;
  });
}

wizburgerBuild();
setInterval(wizburgerBuild, WIZBURGER_LOOP_TIME);
