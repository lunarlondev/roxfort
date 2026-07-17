function wait(milliseconds) {
  return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
}

export class StoryTransitions {
  constructor(stage) {
    this.stage = stage;
    this.busy = false;
    this.reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  async swap(effect, render) {
    if (this.busy) return false;
    this.busy = true;
    if (!this.reducedMotion) {
      this.stage.classList.add("is-leaving");
      await wait(220);
    }
    render();
    this.stage.classList.remove("is-leaving", "is-entering", "effect-critical", "effect-glitch");
    void this.stage.offsetWidth;
    if (!this.reducedMotion) {
      this.stage.classList.add("is-entering");
      if (effect === "critical") this.stage.classList.add("effect-critical");
      if (effect === "glitch") this.stage.classList.add("effect-glitch");
      await wait(380);
    }
    this.stage.classList.remove("is-entering", "effect-critical", "effect-glitch");
    this.busy = false;
    return true;
  }

  pulse(effect = "glitch") {
    if (this.reducedMotion) return;
    this.stage.classList.remove("effect-critical", "effect-glitch");
    void this.stage.offsetWidth;
    this.stage.classList.add(effect === "critical" ? "effect-critical" : "effect-glitch");
    window.setTimeout(() => this.stage.classList.remove("effect-critical", "effect-glitch"), 420);
  }
}
