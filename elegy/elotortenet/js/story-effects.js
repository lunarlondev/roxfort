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
    this.markFixedTimelineItems();
    this.decorateFamilyCards();
    this.prepareChoices();
    this.rememberExistingEndings();

    this.observeFamilyCards();
    this.observeChoices();
    this.observeEndings();
    this.bindEvents();

    /*
     * A main.js-ben a StoryUI initje megelőzheti a StoryEffects initjét.
     * Emiatt az első node eseményeit egyszer újraküldjük, amikor már
     * minden listener biztosan él.
     */
    this.setTimer(() => {
      this.ui?.emitCurrentPresentation?.({
        force: true
      });
    }, 0);
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
    title = "Új fejezet"
  } = {}) {
    const overlay = this.refs.chapterTransition;
    if (!overlay) return;

    if (this.refs.chapterRoman) {
      this.refs.chapterRoman.textContent = roman;
    }

    if (this.refs.chapterLabel) {
      this.refs.chapterLabel.textContent = label;
    }

    if (this.refs.chapterTitle) {
      this.refs.chapterTitle.textContent = title;
    }

    overlay.classList.remove("is-active");
    void overlay.offsetWidth;
    overlay.classList.add("is-active");

    this.setTimer(() => {
      overlay.classList.remove("is-active");
    }, 1780);
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
      "fx-death"
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
