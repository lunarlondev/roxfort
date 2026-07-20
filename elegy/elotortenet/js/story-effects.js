export class StoryEffects {
  constructor({
    root = document,
    character = {},
    engine = null,
    state = null,
    rules = null,
    transitions = null,
    ui = null
  } = {}) {
    this.root = root;
    this.character = character;
    this.engine = engine;
    this.state = state;
    this.rules = rules;
    this.transitions = transitions;
    this.ui = ui;

    this.refs = {};
    this.observers = [];
    this.timers = new Set();
    this.knownEndingKeys = new Set();
    this.initialized = false;
    this.chapterDuration = 4200;

    this.handleSceneChange =
      this.handleSceneChange.bind(this);
    this.handleChapterStart =
      this.handleChapterStart.bind(this);
    this.handleHit =
      this.handleHit.bind(this);
    this.handleCriticalInjury =
      this.handleCriticalInjury.bind(this);
    this.handleDeath =
      this.handleDeath.bind(this);
    this.handleEndingReached =
      this.handleEndingReached.bind(this);
    this.handleEndingUnlocked =
      this.handleEndingUnlocked.bind(this);
    this.handleRouteUpdate =
      this.handleRouteUpdate.bind(this);
    this.handleRestartEvent =
      this.handleRestartEvent.bind(this);
    this.handleRestartClick =
      this.handleRestartClick.bind(this);
  }

  init() {
    if (this.initialized) return;
    this.initialized = true;

    this.cacheElements();
    this.ensureEndingOverlay();
    this.ensureEndingStyles();
    this.markFixedTimelineItems();
    this.decorateFamilyCards();
    this.prepareChoices();
    this.rememberExistingEndings();

    this.observeFamilyCards();
    this.observeChoices();
    this.observeEndings();
    this.bindEvents();
  }

  cacheElements() {
    const get = (id) => this.root.getElementById(id);

    this.refs.stage = get("storyStage");
    this.refs.text = get("storyText");
    this.refs.choices = get("storyChoices");
    this.refs.endings = get("storyEndings");
    this.refs.timeline = get("characterTimeline");
    this.refs.family = get("familyMembers");
    this.refs.media = get("storyMedia");
    this.refs.restartButton = get("storyRestartBtn");

    this.refs.chapterTransition =
      get("chapterTransition");
    this.refs.chapterRoman =
      get("chapterTransitionRoman");
    this.refs.chapterLabel =
      get("chapterTransitionLabel");
    this.refs.chapterTitle =
      get("chapterTransitionTitle");
  }

  bindEvents() {
    document.addEventListener(
      "story:sceneChange",
      this.handleSceneChange
    );

    document.addEventListener(
      "story:chapterStart",
      this.handleChapterStart
    );

    document.addEventListener(
      "story:hit",
      this.handleHit
    );

    document.addEventListener(
      "story:criticalInjury",
      this.handleCriticalInjury
    );

    document.addEventListener(
      "story:death",
      this.handleDeath
    );

    document.addEventListener(
      "story:endingReached",
      this.handleEndingReached
    );

    document.addEventListener(
      "story:endingUnlocked",
      this.handleEndingUnlocked
    );

    document.addEventListener(
      "story:routeUpdate",
      this.handleRouteUpdate
    );

    document.addEventListener(
      "story:restart",
      this.handleRestartEvent
    );

    /*
     * Tartalék arra az esetre, ha egy későbbi UI-változatból
     * véletlenül kimaradna a story:restart esemény.
     */
    this.refs.restartButton?.addEventListener(
      "click",
      this.handleRestartClick
    );
  }

  handleSceneChange(event) {
    const detail = event.detail || {};

    this.transitionScene(
      detail.type || "scene"
    );

    this.refs.media?.classList.toggle(
      "story-engine__media--chapter",
      detail.chapterImage === true
    );
  }

  handleChapterStart(event) {
    this.showChapter(event.detail || {});
  }

  handleHit() {
    this.playHit();
  }

  handleCriticalInjury() {
    this.playCriticalInjury();
  }

  handleDeath() {
    this.playDeath();
  }

  handleEndingReached(event) {
    const detail = event.detail || {};

    /*
     * Az ending lezárása ugyanazt a vizuális nyelvet használja,
     * mint a fejezetcímek: nagy háttérfelirat, kis címke és főcím.
     */
    this.showChapter({
      roman: "VÉGE",
      label: detail.isNew ? "Új befejezés" : "Befejezés",
      title: detail.title || "Az út véget ért",
      duration: detail.duration || 4800
    });
  }

  ensureEndingOverlay() {
    let overlay = this.root.getElementById("endingReveal");

    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "endingReveal";
      overlay.className = "ending-reveal";
      overlay.hidden = true;
      overlay.setAttribute("aria-live", "polite");
      overlay.setAttribute("aria-atomic", "true");

      overlay.innerHTML = `
        <div class="ending-reveal__veil"></div>
        <div class="ending-reveal__noise"></div>
        <div class="ending-reveal__ring ending-reveal__ring--outer"></div>
        <div class="ending-reveal__ring ending-reveal__ring--inner"></div>
        <div class="ending-reveal__particles" aria-hidden="true"></div>
        <div class="ending-reveal__content">
          <div class="ending-reveal__eyebrow"></div>
          <div class="ending-reveal__number"></div>
          <div class="ending-reveal__title"></div>
          <div class="ending-reveal__line"></div>
          <div class="ending-reveal__hint">Az út véget ért.</div>
        </div>
      `;

      document.body.appendChild(overlay);
    }

    this.refs.endingReveal = overlay;
    this.refs.endingEyebrow =
      overlay.querySelector(".ending-reveal__eyebrow");
    this.refs.endingNumber =
      overlay.querySelector(".ending-reveal__number");
    this.refs.endingTitle =
      overlay.querySelector(".ending-reveal__title");
    this.refs.endingParticles =
      overlay.querySelector(".ending-reveal__particles");

    this.createEndingParticles();
  }

  createEndingParticles() {
    const container = this.refs.endingParticles;
    if (!container || container.childElementCount) return;

    for (let index = 0; index < 18; index += 1) {
      const particle = document.createElement("span");
      particle.className = "ending-reveal__particle";
      particle.style.setProperty("--particle-index", index);
      particle.style.setProperty(
        "--particle-x",
        `${8 + ((index * 37) % 84)}%`
      );
      particle.style.setProperty(
        "--particle-delay",
        `${(index % 7) * 90}ms`
      );
      container.appendChild(particle);
    }
  }

  ensureEndingStyles() {
    if (this.root.getElementById("storyEndingEffectsStyles")) {
      return;
    }

    const style = document.createElement("style");
    style.id = "storyEndingEffectsStyles";
    style.textContent = `
      .ending-reveal {
        --ending-accent: 205, 186, 165;
        --ending-accent-strong: 237, 221, 203;
        position: fixed;
        inset: 0;
        z-index: 9999;
        display: grid;
        place-items: center;
        overflow: hidden;
        pointer-events: none;
        opacity: 0;
        visibility: hidden;
        color: rgb(var(--ending-accent-strong));
        isolation: isolate;
      }

      .ending-reveal[hidden] {
        display: none;
      }

      .ending-reveal.is-active {
        visibility: visible;
        animation: ending-reveal-shell 4.8s both;
      }

      .ending-reveal__veil,
      .ending-reveal__noise,
      .ending-reveal__particles,
      .ending-reveal__ring {
        position: absolute;
        inset: 0;
      }

      .ending-reveal__veil {
        z-index: -4;
        background:
          radial-gradient(
            circle at 50% 45%,
            rgba(var(--ending-accent), .16),
            transparent 30%
          ),
          linear-gradient(
            180deg,
            rgba(3, 4, 7, .82),
            rgba(2, 2, 4, .97)
          );
        backdrop-filter: blur(7px) brightness(.52);
      }

      .ending-reveal__noise {
        z-index: -1;
        opacity: .16;
        background-image:
          repeating-linear-gradient(
            0deg,
            transparent 0 3px,
            rgba(255, 255, 255, .05) 4px 5px
          );
        mix-blend-mode: screen;
        animation: ending-reveal-noise .22s steps(2, end) infinite;
      }

      .ending-reveal__ring {
        z-index: -2;
        margin: auto;
        border-radius: 50%;
        border: 1px solid rgba(var(--ending-accent), .45);
        box-shadow:
          0 0 35px rgba(var(--ending-accent), .18),
          inset 0 0 35px rgba(var(--ending-accent), .08);
      }

      .ending-reveal__ring--outer {
        width: min(72vw, 720px);
        height: min(72vw, 720px);
        animation: ending-ring-outer 4.8s ease-out both;
      }

      .ending-reveal__ring--inner {
        width: min(49vw, 490px);
        height: min(49vw, 490px);
        border-style: dashed;
        animation: ending-ring-inner 4.8s ease-out both;
      }

      .ending-reveal__content {
        position: relative;
        width: min(88vw, 820px);
        padding: 42px 28px;
        text-align: center;
        text-shadow:
          0 0 24px rgba(var(--ending-accent), .34),
          0 2px 2px rgba(0, 0, 0, .9);
      }

      .ending-reveal__eyebrow {
        margin-bottom: 18px;
        color: rgba(var(--ending-accent-strong), .76);
        font-size: clamp(.72rem, 1.2vw, .9rem);
        letter-spacing: .42em;
        text-transform: uppercase;
        opacity: 0;
        animation: ending-eyebrow 4.8s both;
      }

      .ending-reveal__number {
        margin-bottom: 10px;
        color: rgba(var(--ending-accent), .8);
        font-size: clamp(.76rem, 1.4vw, 1rem);
        letter-spacing: .26em;
        opacity: 0;
        animation: ending-number 4.8s both;
      }

      .ending-reveal__title {
        font-family: Georgia, "Times New Roman", serif;
        font-size: clamp(2.2rem, 7vw, 5.8rem);
        font-weight: 400;
        line-height: .98;
        letter-spacing: .04em;
        text-wrap: balance;
        opacity: 0;
        transform: scale(.88);
        animation: ending-title 4.8s cubic-bezier(.16, .8, .24, 1) both;
      }

      .ending-reveal__line {
        width: min(58vw, 420px);
        height: 1px;
        margin: 28px auto 18px;
        background:
          linear-gradient(
            90deg,
            transparent,
            rgba(var(--ending-accent-strong), .85),
            transparent
          );
        transform: scaleX(0);
        animation: ending-line 4.8s ease-out both;
      }

      .ending-reveal__hint {
        color: rgba(var(--ending-accent-strong), .58);
        font-size: .82rem;
        letter-spacing: .2em;
        text-transform: uppercase;
        opacity: 0;
        animation: ending-hint 4.8s both;
      }

      .ending-reveal__particle {
        --particle-x: 50%;
        --particle-delay: 0ms;
        position: absolute;
        left: var(--particle-x);
        bottom: -8%;
        width: 2px;
        height: 22px;
        border-radius: 50%;
        background: rgba(var(--ending-accent-strong), .72);
        box-shadow: 0 0 10px rgba(var(--ending-accent), .54);
        opacity: 0;
        animation:
          ending-particle-rise 3.4s
          var(--particle-delay)
          ease-out both;
      }

      .ending-reveal--death,
      .ending-reveal--death-loop {
        --ending-accent: 143, 17, 44;
        --ending-accent-strong: 236, 176, 185;
      }

      .ending-reveal--revelation {
        --ending-accent: 154, 177, 208;
        --ending-accent-strong: 226, 235, 246;
      }

      .ending-reveal--coexist {
        --ending-accent: 131, 102, 168;
        --ending-accent-strong: 226, 210, 247;
      }

      .ending-reveal--control {
        --ending-accent: 123, 36, 69;
        --ending-accent-strong: 235, 197, 212;
      }

      .ending-reveal--ascension {
        --ending-accent: 178, 146, 82;
        --ending-accent-strong: 247, 226, 175;
      }

      .ending-reveal--corruption {
        --ending-accent: 101, 135, 78;
        --ending-accent-strong: 211, 230, 191;
      }

      .ending-reveal--compassion {
        --ending-accent: 132, 171, 163;
        --ending-accent-strong: 216, 240, 235;
      }

      .ending-reveal--death.is-active .ending-reveal__content,
      .ending-reveal--death-loop.is-active .ending-reveal__content {
        animation: ending-death-shudder 4.8s steps(2, end) both;
      }

      .ending-reveal--death.is-active .ending-reveal__veil,
      .ending-reveal--death-loop.is-active .ending-reveal__veil {
        animation: ending-death-veil 4.8s both;
      }

      .ending-reveal--corruption.is-active .ending-reveal__title {
        animation:
          ending-title 4.8s cubic-bezier(.16, .8, .24, 1) both,
          ending-corruption-pulse .34s steps(2, end) 6;
      }

      body.fx-ending-reveal .story-engine {
        filter: blur(2px) brightness(.5) saturate(.65);
        transform: scale(.992);
        transition:
          filter .35s ease,
          transform .35s ease;
      }

      @keyframes ending-reveal-shell {
        0% {
          opacity: 0;
        }
        8%, 82% {
          opacity: 1;
        }
        100% {
          opacity: 0;
        }
      }

      @keyframes ending-reveal-noise {
        0% {
          transform: translate(0, 0);
        }
        50% {
          transform: translate(-2px, 1px);
        }
        100% {
          transform: translate(1px, -1px);
        }
      }

      @keyframes ending-ring-outer {
        0% {
          opacity: 0;
          transform: scale(.44) rotate(-18deg);
        }
        24% {
          opacity: .75;
        }
        75% {
          opacity: .4;
        }
        100% {
          opacity: 0;
          transform: scale(1.18) rotate(18deg);
        }
      }

      @keyframes ending-ring-inner {
        0% {
          opacity: 0;
          transform: scale(1.34) rotate(35deg);
        }
        22% {
          opacity: .65;
        }
        100% {
          opacity: 0;
          transform: scale(.72) rotate(-40deg);
        }
      }

      @keyframes ending-eyebrow {
        0%, 10% {
          opacity: 0;
          transform: translateY(-12px);
        }
        22%, 78% {
          opacity: 1;
          transform: translateY(0);
        }
        100% {
          opacity: 0;
        }
      }

      @keyframes ending-number {
        0%, 15% {
          opacity: 0;
        }
        28%, 76% {
          opacity: .9;
        }
        100% {
          opacity: 0;
        }
      }

      @keyframes ending-title {
        0%, 14% {
          opacity: 0;
          transform: scale(.84) translateY(16px);
          letter-spacing: .18em;
          filter: blur(8px);
        }
        31%, 76% {
          opacity: 1;
          transform: scale(1) translateY(0);
          letter-spacing: .04em;
          filter: blur(0);
        }
        100% {
          opacity: 0;
          transform: scale(1.035);
          filter: blur(3px);
        }
      }

      @keyframes ending-line {
        0%, 22% {
          transform: scaleX(0);
          opacity: 0;
        }
        38%, 78% {
          transform: scaleX(1);
          opacity: 1;
        }
        100% {
          opacity: 0;
        }
      }

      @keyframes ending-hint {
        0%, 32% {
          opacity: 0;
          transform: translateY(8px);
        }
        46%, 77% {
          opacity: 1;
          transform: translateY(0);
        }
        100% {
          opacity: 0;
        }
      }

      @keyframes ending-particle-rise {
        0%, 12% {
          opacity: 0;
          transform: translateY(0) scaleY(.35);
        }
        28% {
          opacity: .65;
        }
        100% {
          opacity: 0;
          transform:
            translateY(-112vh)
            translateX(calc((var(--particle-index) - 9) * 2px))
            scaleY(1.5);
        }
      }

      @keyframes ending-death-shudder {
        0%, 17%, 100% {
          transform: translate(0);
        }
        19% {
          transform: translate(-9px, 3px) skewX(-1deg);
        }
        21% {
          transform: translate(8px, -2px);
        }
        24% {
          transform: translate(-4px, 1px);
        }
        29% {
          transform: translate(3px, 0);
        }
      }

      @keyframes ending-death-veil {
        0% {
          background: rgba(0, 0, 0, 1);
        }
        13% {
          background: rgba(91, 0, 20, .92);
        }
        18% {
          background: rgba(0, 0, 0, .98);
        }
        22% {
          background: rgba(125, 5, 34, .78);
        }
        32%, 100% {
          background:
            radial-gradient(
              circle at 50% 45%,
              rgba(143, 17, 44, .16),
              transparent 30%
            ),
            linear-gradient(
              180deg,
              rgba(3, 4, 7, .88),
              rgba(2, 2, 4, .98)
            );
        }
      }

      @keyframes ending-corruption-pulse {
        0%, 100% {
          text-shadow:
            0 0 24px rgba(var(--ending-accent), .34),
            0 2px 2px rgba(0, 0, 0, .9);
        }
        50% {
          text-shadow:
            -5px 0 rgba(100, 150, 78, .55),
            5px 0 rgba(100, 54, 122, .38),
            0 0 34px rgba(var(--ending-accent), .7);
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .ending-reveal *,
        .ending-reveal {
          animation-duration: .01ms !important;
          animation-iteration-count: 1 !important;
        }
      }
    `;

    document.head.appendChild(style);
  }

  playEndingReveal({
    id = "",
    title = "Befejezés",
    order = null,
    isNew = false,
    style = "default"
  } = {}) {
    const overlay = this.refs.endingReveal;
    if (!overlay) return;

    const normalizedStyle = String(style || "default")
      .trim()
      .toLowerCase()
      .replaceAll("_", "-");

    const allowedStyles = new Set([
      "default",
      "death",
      "death-loop",
      "revelation",
      "coexist",
      "control",
      "ascension",
      "corruption",
      "compassion"
    ]);

    const resolvedStyle = allowedStyles.has(normalizedStyle)
      ? normalizedStyle
      : "default";

    overlay.className =
      `ending-reveal ending-reveal--${resolvedStyle}`;

    if (this.refs.endingEyebrow) {
      this.refs.endingEyebrow.textContent =
        isNew ? "Új befejezés" : "Befejezés";
    }

    if (this.refs.endingNumber) {
      this.refs.endingNumber.textContent =
        order ? `${order}. befejezés` : id;
    }

    if (this.refs.endingTitle) {
      this.refs.endingTitle.textContent = title;
    }

    overlay.hidden = false;
    document.body.classList.add("fx-ending-reveal");

    void overlay.offsetWidth;
    overlay.classList.add("is-active");

    if (
      resolvedStyle === "death" ||
      resolvedStyle === "death-loop"
    ) {
      this.playDeath();
    }

    this.setTimer(() => {
      overlay.classList.remove("is-active");
      document.body.classList.remove("fx-ending-reveal");

      this.setTimer(() => {
        overlay.hidden = true;
      }, 120);
    }, 4920);
  }

  handleEndingUnlocked(event) {
    const endingId = String(
      event.detail?.id || ""
    );

    if (!endingId) return;

    this.knownEndingKeys.add(endingId);

    const chip = Array.from(
      this.refs.endings?.querySelectorAll(
        ".story-ending-chip"
      ) || []
    ).find(
      (item) =>
        item.dataset.endingId === endingId
    );

    if (chip) {
      this.revealEnding(chip);
    }
  }

  handleRouteUpdate(event) {
    const detail = event.detail || {};

    if (detail.reset) {
      this.resetDynamicTimeline();
    }

    if (Array.isArray(detail.items)) {
      detail.items.forEach(
        (item) => this.appendTimelineItem(item)
      );
    }
  }

  handleRestartEvent() {
    this.resetDynamicTimeline();
    this.clearScreenEffects();
  }

  handleRestartClick() {
    this.setTimer(() => {
      this.resetDynamicTimeline();
      this.clearScreenEffects();
    }, 0);
  }

  transitionScene(type = "scene") {
    const stage = this.refs.stage;
    if (!stage) return;

    stage.classList.remove("is-entering");
    stage.classList.add("is-leaving");

    this.setTimer(() => {
      stage.classList.remove("is-leaving");
      stage.classList.add("is-entering");

      if (this.refs.text) {
        this.refs.text.scrollTop = 0;
      }

      this.refs.media?.classList.toggle(
        "story-engine__media--chapter",
        type === "chapter"
      );

      this.setTimer(() => {
        stage.classList.remove("is-entering");
      }, 480);
    }, 120);
  }

  showChapter({
    roman = "I",
    label = "Fejezet",
    title = "Új fejezet",
    duration = this.chapterDuration
  } = {}) {
    const overlay = this.refs.chapterTransition;
    if (!overlay) return;

    const resolvedDuration =
      Number.isFinite(Number(duration)) && Number(duration) >= 1000
        ? Number(duration)
        : this.chapterDuration;

    if (this.refs.chapterRoman) {
      this.refs.chapterRoman.textContent = roman;
    }

    if (this.refs.chapterLabel) {
      this.refs.chapterLabel.textContent = label;
    }

    if (this.refs.chapterTitle) {
      this.refs.chapterTitle.textContent = title;
    }

    /*
     * Az inline animationDuration felülírja a régi 1.75s CSS-időt,
     * így a CSS-fájlt nem kötelező emiatt módosítani.
     */
    const animatedElements = [
      overlay,
      overlay.querySelector(".chapter-transition__sigil"),
      overlay.querySelector(".chapter-transition__inner")
    ].filter(Boolean);

    animatedElements.forEach((element) => {
      element.style.animationDuration = `${resolvedDuration}ms`;
    });

    overlay.classList.remove("is-active");
    void overlay.offsetWidth;
    overlay.classList.add("is-active");

    this.setTimer(() => {
      overlay.classList.remove("is-active");
    }, resolvedDuration + 80);
  }

  playHit() {
    this.pulseBodyClass("fx-hit", 540);
    this.pulseBodyClass("fx-shake", 340);
  }

  /**
   * Ehhez a CSS-ben az fx-critical-injury body class
   * és a hozzá tartozó glitch keyframe-ek szükségesek.
   */
  playCriticalInjury() {
    this.clearTransientInjuryEffects();

    void document.body.offsetWidth;

    document.body.classList.add(
      "fx-critical-injury"
    );

    this.setTimer(() => {
      document.body.classList.remove(
        "fx-critical-injury"
      );
    }, 1120);
  }

  playDeath() {
    this.clearTransientInjuryEffects();
    document.body.classList.remove("fx-death");

    void document.body.offsetWidth;

    document.body.classList.add("fx-death");

    this.setTimer(() => {
      document.body.classList.remove("fx-death");
    }, 1800);
  }

  pulseBodyClass(className, duration) {
    document.body.classList.remove(className);
    void document.body.offsetWidth;
    document.body.classList.add(className);

    this.setTimer(() => {
      document.body.classList.remove(className);
    }, duration);
  }

  clearTransientInjuryEffects() {
    document.body.classList.remove(
      "fx-hit",
      "fx-shake",
      "fx-critical-injury"
    );
  }

  clearScreenEffects() {
    document.body.classList.remove(
      "fx-hit",
      "fx-shake",
      "fx-critical-injury",
      "fx-death",
      "fx-ending-reveal"
    );
  }

  prepareChoices() {
    const container = this.refs.choices;
    if (!container) return;

    container
      .querySelectorAll(
        ".story-choice--critical"
      )
      .forEach((choice, index) => {
        if (
          choice.dataset.fxCriticalReady === "1"
        ) {
          return;
        }

        choice.dataset.fxCriticalReady = "1";

        this.setTimer(() => {
          choice.classList.add("is-emphasized");

          this.setTimer(() => {
            choice.classList.remove(
              "is-emphasized"
            );
          }, 1600);
        }, index * 90);
      });

    container
      .querySelectorAll(
        ".story-choice--secret"
      )
      .forEach((choice) => {
        choice.dataset.fxSecretReady = "1";
      });
  }

  observeChoices() {
    if (!this.refs.choices) return;

    const observer = new MutationObserver(() => {
      this.prepareChoices();
    });

    observer.observe(this.refs.choices, {
      childList: true,
      subtree: true
    });

    this.observers.push(observer);
  }

  rememberExistingEndings() {
    const seenEndings =
      this.state?.meta?.seenEndings;

    if (Array.isArray(seenEndings)) {
      seenEndings.forEach((endingId) => {
        this.knownEndingKeys.add(
          String(endingId)
        );
      });
      return;
    }

    this.refs.endings
      ?.querySelectorAll(
        ".story-ending-chip--found"
      )
      .forEach((chip) => {
        this.knownEndingKeys.add(
          this.getEndingKey(chip)
        );
      });
  }

  observeEndings() {
    if (!this.refs.endings) return;

    const observer = new MutationObserver(() => {
      this.refs.endings
        .querySelectorAll(
          ".story-ending-chip--found"
        )
        .forEach((chip) => {
          const key = this.getEndingKey(chip);

          if (this.knownEndingKeys.has(key)) {
            return;
          }

          this.knownEndingKeys.add(key);
          this.revealEnding(chip);
        });
    });

    observer.observe(this.refs.endings, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: [
        "class",
        "data-ending-id"
      ]
    });

    this.observers.push(observer);
  }

  getEndingKey(chip) {
    return (
      chip.dataset.endingId ||
      chip.textContent.trim() ||
      String(
        Array.from(
          chip.parentElement?.children || []
        ).indexOf(chip)
      )
    );
  }

  revealEnding(chip) {
    if (!chip) return;

    chip.classList.remove("is-newly-found");
    void chip.offsetWidth;
    chip.classList.add("is-newly-found");

    this.setTimer(() => {
      chip.classList.remove(
        "is-newly-found"
      );
    }, 1500);
  }

  getFamilyMembers() {
    return Array.isArray(
      this.character.family?.members
    )
      ? this.character.family.members
      : [];
  }

  getPortraitUrl(member) {
    return (
      member?.image ||
      member?.portrait ||
      member?.imageSrc ||
      member?.src ||
      ""
    );
  }

  decorateFamilyCards() {
    const container = this.refs.family;
    if (!container) return;

    const members = this.getFamilyMembers();
    const cards = container.querySelectorAll(
      ".profile-family-card"
    );

    cards.forEach((card, index) => {
      if (
        card.querySelector(
          ".profile-family-card__portrait"
        )
      ) {
        return;
      }

      const member = members[index] || {};

      const portraitUrl =
        card.dataset.portrait ||
        this.getPortraitUrl(member);

      if (!portraitUrl) return;

      card.dataset.portrait = portraitUrl;

      const wrapper = document.createElement("div");
      wrapper.className =
        "profile-family-card__portrait";
      wrapper.setAttribute("aria-hidden", "true");

      const image = document.createElement("img");
      image.src = portraitUrl;
      image.alt = "";
      image.loading = "lazy";

      image.addEventListener(
        "error",
        () => wrapper.remove(),
        { once: true }
      );

      wrapper.appendChild(image);
      card.prepend(wrapper);
    });
  }

  observeFamilyCards() {
    if (!this.refs.family) return;

    const observer = new MutationObserver(() => {
      this.decorateFamilyCards();
    });

    observer.observe(this.refs.family, {
      childList: true,
      subtree: true
    });

    this.observers.push(observer);
  }

  markFixedTimelineItems() {
    this.refs.timeline
      ?.querySelectorAll(
        ".character-timeline__item"
      )
      .forEach((item) => {
        item.dataset.timelineFixed = "true";
      });
  }

  appendTimelineItem(item) {
    const timeline = this.refs.timeline;

    if (!timeline || !item?.text) return;

    const key =
      String(item.id || "") ||
      `${item.date || "Történet"}::${item.text}`;

    const duplicate = Array.from(
      timeline.querySelectorAll(
        '[data-timeline-dynamic="true"]'
      )
    ).some(
      (entry) =>
        entry.dataset.timelineKey === key
    );

    if (duplicate) return;

    const entry = document.createElement("article");
    entry.className =
      "character-timeline__item " +
      "character-timeline__item--dynamic";

    entry.dataset.timelineDynamic = "true";
    entry.dataset.timelineKey = key;

    const date = document.createElement("div");
    date.className =
      "character-timeline__date";

    if (item.icon) {
      const badge =
        document.createElement("span");

      badge.className =
        "character-timeline__date-badge";
      badge.textContent = item.icon;
      badge.setAttribute(
        "aria-hidden",
        "true"
      );

      date.appendChild(badge);
    }

    const dateText =
      document.createElement("span");

    dateText.textContent =
      item.date || "Történet";

    date.appendChild(dateText);

    const text = document.createElement("div");
    text.className =
      "character-timeline__text";
    text.textContent = item.text;

    entry.append(date, text);
    timeline.appendChild(entry);
  }

  resetDynamicTimeline() {
    this.refs.timeline
      ?.querySelectorAll(
        '[data-timeline-dynamic="true"]'
      )
      .forEach((entry) => entry.remove());
  }

  setTimer(callback, delay) {
    const timer = window.setTimeout(() => {
      this.timers.delete(timer);
      callback();
    }, delay);

    this.timers.add(timer);
    return timer;
  }

  destroy() {
    this.observers.forEach(
      (observer) => observer.disconnect()
    );

    this.observers = [];

    this.timers.forEach(
      (timer) => clearTimeout(timer)
    );

    this.timers.clear();

    this.refs.restartButton?.removeEventListener(
      "click",
      this.handleRestartClick
    );

    document.removeEventListener(
      "story:sceneChange",
      this.handleSceneChange
    );

    document.removeEventListener(
      "story:chapterStart",
      this.handleChapterStart
    );

    document.removeEventListener(
      "story:hit",
      this.handleHit
    );

    document.removeEventListener(
      "story:criticalInjury",
      this.handleCriticalInjury
    );

    document.removeEventListener(
      "story:death",
      this.handleDeath
    );

    document.removeEventListener(
      "story:endingReached",
      this.handleEndingReached
    );

    document.removeEventListener(
      "story:endingUnlocked",
      this.handleEndingUnlocked
    );

    document.removeEventListener(
      "story:routeUpdate",
      this.handleRouteUpdate
    );

    document.removeEventListener(
      "story:restart",
      this.handleRestartEvent
    );

    this.clearScreenEffects();
    this.initialized = false;
  }
}
