(() => {
  /* =========================
     WIZBURGER
  ========================= */
  const WIZBURGER_WORD = "WizBurger";
  const WIZBURGER_LOOP_TIME = 10000;
  const WIZBURGER_COLORS = ["#FBDB4A", "#F3934A", "#EB547D", "#9F6AA7", "#5476B3", "#2BB19B"];

  const wizburgerLogo = document.getElementById("wizburger-logo");

  function wizburgerBuild() {
    if (!wizburgerLogo) return;

    wizburgerLogo.innerHTML = "";
    WIZBURGER_WORD.split("").forEach((char, i) => {
      const span = document.createElement("span");
      span.className = "letter";
      span.textContent = char;
      span.style.color = WIZBURGER_COLORS[i % WIZBURGER_COLORS.length];

      span.style.animation = "none";
      wizburgerLogo.appendChild(span);

      void span.offsetHeight;

      span.style.animation = "wizburger-popIn 0.6s ease-out forwards";
      span.style.animationDelay = `${i * 0.08}s`;
    });
  }

  wizburgerBuild();
  window.setInterval(wizburgerBuild, WIZBURGER_LOOP_TIME);

  /* =========================
     SKOWER
  ========================= */
  (function initSkower() {
    const root = document.querySelector("[data-skower-ad]");
    if (!root) return;

    const wipe = root.querySelector(".skowerAd-wipe");
    const button = root.querySelector(".skowerAd-icon");
    let dirtTimer = null;

    function makeDirty() {
      root.classList.remove("is-clean");
    }

    function cleanNow() {
      if (!wipe) return;

      if (dirtTimer) {
        clearTimeout(dirtTimer);
        dirtTimer = null;
      }

      wipe.style.animation = "none";
      wipe.style.opacity = "1";
      void wipe.offsetWidth;

      wipe.style.animation = "skowerWipe 900ms ease-in-out forwards";

      setTimeout(() => {
        root.classList.add("is-clean");
      }, 450);

      setTimeout(() => {
        wipe.style.opacity = "0";
      }, 950);

      dirtTimer = setTimeout(() => {
        makeDirty();
      }, 5000);
    }

    makeDirty();

    if (button) {
      button.addEventListener("click", cleanNow);
    }
  })();

  /* =========================
     DEBODOR
  ========================= */
  (function initDebodor() {
    const ad = document.querySelector("[data-debodor]");
    if (!ad) return;

    const bottle = document.getElementById("potion-bottle");
    const visualTarget = document.getElementById("visual-target");
    const resetBtn = document.getElementById("reset-btn");

    if (!bottle || !visualTarget || !resetBtn) return;

    let clicks = 0;

    function spawnDrop() {
      const drop = document.createElement("div");
      drop.className = "debodor-drop";

      const bRect = bottle.getBoundingClientRect();
      const aRect = ad.getBoundingClientRect();

      drop.style.left = (bRect.left - aRect.left + bRect.width / 2) + "px";
      drop.style.top = (bRect.top - aRect.top + bRect.height - 20) + "px";

      ad.appendChild(drop);
      setTimeout(() => drop.remove(), 700);
    }

    function spawnSparkles() {
      const rect = visualTarget.getBoundingClientRect();
      const aRect = ad.getBoundingClientRect();

      const count = 40;
      for (let i = 0; i < count; i++) {
        setTimeout(() => {
          const s = document.createElement("div");
          s.className = "debodor-sparkle";
	s.innerHTML = Math.random() > 0.5 ? '✨' : '✦'

          const x = rect.left - aRect.left + (Math.random() * rect.width);
          const y = rect.top - aRect.top + (Math.random() * rect.height);

          s.style.left = x + "px";
          s.style.top = y + "px";
          const size = (Math.random() * 10 + 8);
          s.style.width = size + "px";
          s.style.height = size + "px";

          ad.appendChild(s);

          s.animate(
            [
              { transform: "translate(0,0) scale(0.2)", opacity: 0 },
              { transform: "translate(0,0) scale(1.2)", opacity: 1, offset: 0.3 },
              { transform: `translate(${(Math.random() - 0.5) * 80}px, ${(Math.random() - 0.5) * 80}px) scale(0.2)`, opacity: 0 }
            ],
            { duration: 1500, easing: "ease-out" }
          ).onfinish = () => s.remove();
        }, i * 25);
      }
    }

    function magicalTransformation() {
      ad.classList.add("state-transformed");
      spawnSparkles();
      setTimeout(() => resetBtn.classList.add("visible"), 2000);
    }

    function applyPotion() {
      if (clicks >= 2) return;

      bottle.style.transition = "0.2s";
      bottle.style.transform = "rotate(-15deg) scale(1.1)";
      setTimeout(() => (bottle.style.transform = "rotate(0) scale(1)"), 200);

      spawnDrop();

      clicks += 1;
      if (clicks === 2) {
        setTimeout(magicalTransformation, 600);
      }
    }

    function resetPotion() {
      clicks = 0;
      ad.classList.remove("state-transformed");
      resetBtn.classList.remove("visible");
    }

    bottle.addEventListener("click", applyPotion);
    bottle.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        applyPotion();
      }
    });

    resetBtn.addEventListener("click", resetPotion);
  })();
})();
