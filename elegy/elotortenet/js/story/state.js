import { Storage } from "../storage.js";

export class StoryState {
  constructor(engine) {
    this.engine = engine;
    this.meta = { seenEndings: [], seenChoices: [], seenNodes: [], nodeVisits: {} };
    this.run = null;
    this.metaKey = "";
    this.runKey = "";
  }

  init() {
    const namespace = `${this.engine.meta.id}:v${this.engine.meta.version}`;
    this.metaKey = `${namespace}:meta`;
    this.runKey = `${namespace}:run`;
    this.meta = this.sanitizeMeta(Storage.read(localStorage, this.metaKey, this.meta));
    const savedRun = Storage.read(sessionStorage, this.runKey, null);
    if (this.isValidRun(savedRun)) this.run = savedRun;
    else this.resetRun();
    this.run.enteredAt = Date.now();
    this.recordNodeVisit(this.run.current, false);
    this.saveRun();
  }

  sanitizeMeta(value) {
    return {
      seenEndings: Array.isArray(value?.seenEndings) ? [...new Set(value.seenEndings)] : [],
      seenChoices: Array.isArray(value?.seenChoices) ? [...new Set(value.seenChoices)] : [],
      seenNodes: Array.isArray(value?.seenNodes) ? [...new Set(value.seenNodes)] : [],
      nodeVisits: value?.nodeVisits && typeof value.nodeVisits === "object" ? value.nodeVisits : {}
    };
  }

  isValidRun(value) {
    return Boolean(value && this.engine.getNode(value.current) && Array.isArray(value.steps) && Array.isArray(value.history));
  }

  createFreshRun() {
    return {
      current: this.engine.meta.start,
      steps: [],
      history: [],
      path: [this.engine.meta.start],
      flags: {},
      nodeElapsed: {},
      enteredAt: Date.now()
    };
  }

  resetRun() {
    this.run = this.createFreshRun();
    Storage.remove(sessionStorage, this.runKey);
    this.recordNodeVisit(this.run.current, true);
    this.saveRun();
  }

  saveMeta() {
    Storage.write(localStorage, this.metaKey, this.meta);
  }

  saveRun() {
    const serializable = Storage.clone(this.run);
    serializable.nodeElapsed[serializable.current] = this.getNodeElapsed(serializable.current);
    serializable.enteredAt = null;
    Storage.write(sessionStorage, this.runKey, serializable);
  }

  getNodeElapsed(nodeId) {
    const stored = Number(this.run.nodeElapsed[nodeId] || 0);
    if (this.run.current !== nodeId || !this.run.enteredAt) return stored;
    return stored + Math.max(0, Date.now() - this.run.enteredAt);
  }

  leaveCurrentNode() {
    if (!this.run.enteredAt) return;
    this.run.nodeElapsed[this.run.current] = this.getNodeElapsed(this.run.current);
    this.run.enteredAt = null;
  }

  enterNode(nodeId, countVisit = true) {
    this.run.current = nodeId;
    this.run.enteredAt = Date.now();
    if (!this.run.path.includes(nodeId) || this.run.path[this.run.path.length - 1] !== nodeId) this.run.path.push(nodeId);
    this.recordNodeVisit(nodeId, countVisit);
  }

  recordNodeVisit(nodeId, increment = true) {
    if (!this.meta.seenNodes.includes(nodeId)) this.meta.seenNodes.push(nodeId);
    if (increment) this.meta.nodeVisits[nodeId] = Number(this.meta.nodeVisits[nodeId] || 0) + 1;
    this.saveMeta();
  }

  snapshot() {
    return Storage.clone({
      current: this.run.current,
      steps: this.run.steps,
      path: this.run.path,
      flags: this.run.flags,
      nodeElapsed: this.run.nodeElapsed
    });
  }

  takeChoice(nodeId, choice, nodeText) {
    this.leaveCurrentNode();
    this.run.history.push(this.snapshot());
    this.recordChoice(choice.id);
    this.applyEffects(choice.effects || {});
    this.run.steps.push({
      nodeId,
      choiceId: choice.id,
      prompt: nodeText || "",
      chosen: choice.text,
      tags: choice.tags || [],
      next: choice.next
    });
    this.enterNode(choice.next, true);
    this.saveRun();
  }

  applyEffects(effects) {
    if (effects.set && typeof effects.set === "object") Object.entries(effects.set).forEach(([key, value]) => { this.run.flags[key] = value; });
    if (effects.increment && typeof effects.increment === "object") Object.entries(effects.increment).forEach(([key, value]) => { this.run.flags[key] = Number(this.run.flags[key] || 0) + Number(value || 0); });
    if (Array.isArray(effects.unset)) effects.unset.forEach((key) => delete this.run.flags[key]);
  }

  back() {
    if (!this.run.history.length) return false;
    this.leaveCurrentNode();
    const snapshot = this.run.history.pop();
    this.run.current = snapshot.current;
    this.run.steps = snapshot.steps;
    this.run.path = snapshot.path;
    this.run.flags = snapshot.flags;
    this.run.nodeElapsed = snapshot.nodeElapsed;
    this.run.enteredAt = Date.now();
    this.saveRun();
    return true;
  }

  recordChoice(choiceId) {
    if (!this.meta.seenChoices.includes(choiceId)) {
      this.meta.seenChoices.push(choiceId);
      this.saveMeta();
    }
  }

  recordEnding(endingId) {
    if (!endingId || this.meta.seenEndings.includes(endingId)) return false;
    this.meta.seenEndings.push(endingId);
    this.saveMeta();
    return true;
  }

  clearDiscoveries() {
    this.meta = { seenEndings: [], seenChoices: [], seenNodes: [], nodeVisits: {} };
    this.saveMeta();
  }
}
