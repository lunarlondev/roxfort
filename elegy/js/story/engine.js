export class StoryEngine {
  constructor() {
    this.data = null;
    this.nodes = {};
    this.meta = {};
  }

  async load(url) {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) throw new Error(`A történet nem tölthető be (${response.status}).`);
    const data = await response.json();
    this.validate(data);
    this.data = data;
    this.nodes = data.nodes;
    this.meta = data.meta;
    return this;
  }

  validate(data) {
    if (!data || typeof data !== "object") throw new Error("A story.json tartalma hibás.");
    if (!data.meta?.id || !data.meta?.version || !data.meta?.start) throw new Error("A történet metaadatai hiányosak.");
    if (!data.nodes || typeof data.nodes !== "object") throw new Error("A történet csomópontjai hiányoznak.");
    if (!data.nodes[data.meta.start]) throw new Error(`A kezdő csomópont nem létezik: ${data.meta.start}`);
    const choiceIds = new Set();
    const endingIds = new Set();
    Object.entries(data.nodes).forEach(([nodeId, node]) => {
      if (!node || typeof node !== "object") throw new Error(`Hibás csomópont: ${nodeId}`);
      if (node.type === "ending") {
        if (!node.endingId) throw new Error(`Az endingId hiányzik: ${nodeId}`);
        if (endingIds.has(node.endingId)) throw new Error(`Duplikált endingId: ${node.endingId}`);
        endingIds.add(node.endingId);
        return;
      }
      if (!Array.isArray(node.choices) || node.choices.length === 0) throw new Error(`Nincs választás a csomópontban: ${nodeId}`);
      node.choices.forEach((choice) => {
        if (!choice.id) throw new Error(`Választásazonosító hiányzik: ${nodeId}`);
        if (choiceIds.has(choice.id)) throw new Error(`Duplikált választásazonosító: ${choice.id}`);
        choiceIds.add(choice.id);
        if (!choice.next || !data.nodes[choice.next]) throw new Error(`Hibás célpont a(z) ${choice.id} választásnál: ${choice.next}`);
      });
    });
  }

  getNode(id) {
    return this.nodes[id] || null;
  }

  getEndings() {
    return Object.entries(this.nodes)
      .filter(([, node]) => node.type === "ending")
      .map(([nodeId, node]) => ({ nodeId, ...node }))
      .sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
  }
}
