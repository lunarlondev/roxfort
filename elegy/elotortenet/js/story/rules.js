export class StoryRules {
  constructor(state) {
    this.state = state;
  }

  evaluate(condition, nodeId) {
    if (!condition) return true;
    if (Array.isArray(condition.all)) return condition.all.every((item) => this.evaluate(item, nodeId));
    if (Array.isArray(condition.any)) return condition.any.some((item) => this.evaluate(item, nodeId));
    if (condition.not) return !this.evaluate(condition.not, nodeId);
    const type = condition.type;
    if (type === "endingSeen" || type === "ending") return this.state.meta.seenEndings.includes(condition.id);
    if (type === "seenChoice") return this.state.meta.seenChoices.includes(condition.id);
    if (type === "runChoice") return this.state.run.steps.some((step) => step.choiceId === condition.id);
    if (type === "combo") return (condition.choices || []).every((id) => this.state.run.steps.some((step) => step.choiceId === id));
    if (type === "nodeSeen") return this.state.meta.seenNodes.includes(condition.id);
    if (type === "visitCount") return this.compare(Number(this.state.meta.nodeVisits[condition.id || nodeId] || 0), condition.operator || "gte", Number(condition.value || 1));
    if (type === "endingCount") return this.compare(this.state.meta.seenEndings.length, condition.operator || "gte", Number(condition.value || 1));
    if (type === "flag") return this.compare(this.state.run.flags[condition.key], condition.operator || "eq", condition.value);
    if (type === "waitOnNode" || type === "time") return this.state.getNodeElapsed(condition.nodeId || nodeId) >= Number(condition.milliseconds ?? condition.delay ?? 0);
    return false;
  }

  compare(actual, operator, expected) {
    if (operator === "eq") return actual === expected;
    if (operator === "neq") return actual !== expected;
    if (operator === "gt") return Number(actual) > Number(expected);
    if (operator === "gte") return Number(actual) >= Number(expected);
    if (operator === "lt") return Number(actual) < Number(expected);
    if (operator === "lte") return Number(actual) <= Number(expected);
    if (operator === "contains") return Array.isArray(actual) ? actual.includes(expected) : String(actual ?? "").includes(String(expected));
    if (operator === "in") return Array.isArray(expected) && expected.includes(actual);
    return false;
  }

  pendingDelay(condition, nodeId) {
    if (!condition || this.evaluate(condition, nodeId)) return 0;
    if (Array.isArray(condition.all)) {
      const pending = [];
      for (const item of condition.all) {
        if (this.evaluate(item, nodeId)) continue;
        const delay = this.pendingDelay(item, nodeId);
        if (delay === null) return null;
        pending.push(delay);
      }
      return pending.length ? Math.max(...pending) : null;
    }
    if (Array.isArray(condition.any)) {
      const pending = condition.any.map((item) => this.pendingDelay(item, nodeId)).filter((value) => value !== null);
      return pending.length ? Math.min(...pending) : null;
    }
    if (condition.not) return null;
    if (condition.type === "waitOnNode" || condition.type === "time") {
      const required = Number(condition.milliseconds ?? condition.delay ?? 0);
      return Math.max(0, required - this.state.getNodeElapsed(condition.nodeId || nodeId));
    }
    return null;
  }
}
