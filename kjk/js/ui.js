const UI = {
    storyBox: document.getElementById("storyBox"),
    decisionBox: document.getElementById("decisionBox"),
    timelineBox: document.getElementById("timelineBox"),

    secretTimers: {},

    renderNode(nodeId) {
        const node = Engine.getNode(nodeId);
        if (!node) return;

        // ENDING
        if (node.type === "ending") {
            this.renderEnding(node);
            return;
        }

        // STORY TEXT
        this.storyBox.innerText = node.text;

        // CLEAR DECISIONS
        this.decisionBox.innerHTML = "";

        // CREATE DECISIONS
        node.choices.forEach((choice) => {

            // SECRET CHECK
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

            if (choice.image) {
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

        this.renderTimeline();
    },

    renderTimeline() {
    this.timelineBox.innerHTML = "";

    const title = document.createElement("div");
    title.className = "timelineTitle";
    title.innerText = "Útvonalak";
    this.timelineBox.appendChild(title);

    State.steps.forEach((step, index) => {
        const stepBlock = document.createElement("div");
        stepBlock.className = "timelineStep";

        const stepLabel = document.createElement("div");
        stepLabel.className = "timelineStepLabel";
        stepLabel.innerText = `${index + 1}. döntés`;
        stepBlock.appendChild(stepLabel);

        const row = document.createElement("div");
        row.className = "timelineRowCards";

        step.all.forEach((choice) => {

            // TITKOS döntés és még nem fedezted fel → ne jelenjen meg
            if (choice.type === "secret" && !State.seenChoices.includes(choice.text)) {
                return;
            }

            const el = document.createElement("div");
            el.className = "timelineCard";

            // Csak kritikus döntéseknél legyen kép
            if (choice.type === "critical" && choice.image) {
                el.style.backgroundImage = `url(${choice.image})`;
            } else {
                el.classList.add("noImage");
            }

            const overlay = document.createElement("div");
            overlay.className = "timelineOverlay";
            overlay.innerText = choice.text;
            el.appendChild(overlay);

            const chosenThisRun = choice.text === step.chosen;
            const chosenBefore = State.seenChoices.includes(choice.text);

            if (chosenThisRun) {
                if (choice.type === "critical") el.classList.add("timeline-critical");
                else if (choice.type === "secret") el.classList.add("timeline-secret");
                else el.classList.add("timeline-normal");
            }
            else if (chosenBefore) {
                el.classList.add("timeline-seen");
            }
            else {
                el.classList.add("timeline-unknown");
            }

            row.appendChild(el);
        });

        stepBlock.appendChild(row);
        this.timelineBox.appendChild(stepBlock);
    });
}

    createSnapshot() {
        return {
            current: State.current,
            history: [...State.history],
            steps: JSON.parse(JSON.stringify(State.steps)),
            seenEndings: [...State.seenEndings]
        };
    },

    rebuildFromState() {
        this.renderNode(State.current);
        this.renderTimeline();
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
        this.renderNode("start");
    },

    // ===== SECRET SYSTEM =====

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
            return unlock.choices.every(c =>
                State.steps.some(step =>
                    step.chosen === c || step.next === c
                )
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