const UI = {
    storyBox: document.getElementById("storyBox"),
    decisionBox: document.getElementById("decisionBox"),
    timelineBox: document.getElementById("timelineBox"),
    graphBox: document.getElementById("graphBox"),

    secretTimers: {},

    renderNode(nodeId) {
        const node = Engine.getNode(nodeId);
        if (!node) return;

        if (node.type === "ending") {
            this.renderEnding(node);
            return;
        }

        this.hideProgressViews();

        this.storyBox.innerText = node.text;
        this.decisionBox.innerHTML = "";

        node.choices.forEach((choice) => {
            if (choice.type === "secret") {
                if (!this.isSecretUnlocked(choice, nodeId)) {
                    this.setupSecretUnlock(choice, nodeId);
                    return;
                }
            }

            const item = document.createElement("button");
            item.type = "button";

            const type = choice.type || "normal";
            item.className = `choiceCard choice-${type}`;

            if (choice.type === "critical" && choice.image) {
                item.style.backgroundImage = `url(${choice.image})`;
            } else {
                item.classList.add("noImage");
            }

            const overlay = document.createElement("div");
            overlay.className = "choiceOverlay";
            overlay.innerText = choice.text;
            item.appendChild(overlay);

            item.onclick = () => {
                State.history.push(this.createSnapshot());
                State.saveChoice(choice.text);

                State.steps.push({
                    node: nodeId,
                    prompt: node.text,
                    chosen: choice.text,
                    type: choice.type || "normal",
                    next: choice.next,
                    all: node.choices.map((c) => ({
                        text: c.text,
                        image: c.image || null,
                        type: c.type || "normal"
                    }))
                });

                State.current = choice.next;
                this.renderNode(choice.next);
            };

            this.decisionBox.appendChild(item);
        });
    },

    renderEnding(node) {
    State.saveEnding(node.endingId);

    this.storyBox.innerText = `${node.title}\n\n${node.text}`;
    this.decisionBox.innerHTML = "";

    const stats = document.createElement("div");
    stats.className = "endingStats";
    stats.innerText = `Felfedezett endingek: ${State.seenEndings.length}`;

    this.decisionBox.appendChild(stats);

    this.timelineBox.style.display = "block";
    this.graphBox.style.display = "block";

    this.renderTimelineSummary();
    Graph.render();
}

    renderTimelineSummary() {
    this.timelineBox.innerHTML = "";

    const title = document.createElement("div");
    title.className = "timelineTitle";
    title.innerText = "Útvonal";
    this.timelineBox.appendChild(title);

    const summary = document.createElement("div");
    summary.className = "timelineSummary";

    const labels = State.steps.map(step => step.chosen);
    summary.innerText = labels.join(" → ");

    this.timelineBox.appendChild(summary);
}

    hideProgressViews() {
        if (this.timelineBox) this.timelineBox.style.display = "none";
        if (this.graphBox) this.graphBox.style.display = "none";
    },

    showProgressViews() {
        if (this.timelineBox) this.timelineBox.style.display = "block";
        if (this.graphBox) this.graphBox.style.display = "block";
    },

    createSnapshot() {
        return {
            current: State.current,
            history: [...State.history],
            steps: JSON.parse(JSON.stringify(State.steps)),
            seenEndings: [...State.seenEndings]
        };
    },

    rebuildFromState() {
        const currentNode = Engine.getNode(State.current);
        if (currentNode?.type === "ending") {
            this.renderEnding(currentNode);
        } else {
            this.renderNode(State.current);
        }
    },

    back() {
        if (State.history.length === 0) return;

        const prev = State.history.pop();
        if (!prev) return;

        State.current = prev.current;
        State.history = prev.history;
        State.steps = prev.steps;
        State.seenEndings = prev.seenEndings;

        this.rebuildFromState();
    },

    restart() {
        State.reset();
        this.secretTimers = {};
        this.storyBox.innerHTML = "";
        this.decisionBox.innerHTML = "";
        this.timelineBox.innerHTML = "";
        if (this.graphBox) {
            this.graphBox.querySelectorAll(".graphNode").forEach((node) => node.remove());
        }
        if (Graph?.svg) {
            Graph.svg.innerHTML = "";
        }
        this.renderNode("start");
    },

    isSecretUnlocked(choice, nodeId) {
        if (!choice.unlock) return true;

        const unlock = choice.unlock;

        if (unlock.type === "time") {
            const key = this.getSecretKey(choice, nodeId);
            const start = this.secretTimers[key];
            if (!start) return false;
            return Date.now() - start >= unlock.delay;
        }

        if (unlock.type === "combo") {
            return unlock.choices.every((c) =>
                State.steps.some((step) => step.chosen === c || step.next === c)
            );
        }

        if (unlock.type === "ending") {
            return State.seenEndings.includes(unlock.id);
        }

        return false;
    },

    setupSecretUnlock(choice, nodeId) {
        const key = this.getSecretKey(choice, nodeId);

        if (this.secretTimers[key]) return;
        this.secretTimers[key] = Date.now();

        if (choice.unlock?.type === "time") {
            setTimeout(() => {
                if (State.current === nodeId) {
                    this.rebuildFromState();
                }
            }, choice.unlock.delay);
        }
    },

    getSecretKey(choice, nodeId) {
        return `${nodeId}_${choice.next}_${choice.text}`;
    }
};