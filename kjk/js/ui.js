const UI = {
    container: document.getElementById("storyContainer"),
    secretTimers: {},

    renderNode(nodeId) {
        const node = Engine.getNode(nodeId);
        if (!node) return;

        if (node.type === "ending") {
            this.renderEnding(node);
            return;
        }

        const block = document.createElement("section");
        block.className = "storyBlock";

        const text = document.createElement("div");
        text.className = "storyText";
        text.innerText = node.text;
        block.appendChild(text);

        const decision = document.createElement("div");
        decision.className = "decisionRow";

        node.choices.forEach((choice) => {

            // ===== SECRET CHECK =====
            if (choice.type === "secret") {
                if (!this.isSecretUnlocked(choice)) {
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

                this.lockDecision(decision, choice.text);

                State.steps.push({
                    node: nodeId,
                    prompt: node.text,
                    chosen: choice.text,
                    all: node.choices.map((c) => ({
                        text: c.text,
                        image: c.image || null
                    }))
                });

                State.current = choice.next;
                this.renderNode(choice.next);
            };

            decision.appendChild(item);
        });

        block.appendChild(decision);
        this.container.appendChild(block);

        this.scrollDown();
    },

    renderEnding(node) {
        State.saveEnding(node.endingId);

        const endingBlock = document.createElement("section");
        endingBlock.className = "storyBlock endingBlock";

        const title = document.createElement("div");
        title.className = "endingTitle";
        title.innerText = node.title;

        const text = document.createElement("div");
        text.className = "storyText";
        text.innerText = node.text;

        const stats = document.createElement("div");
        stats.className = "endingStats";
        stats.innerText = `Felfedezett endingek: ${State.seenEndings.length}`;

        endingBlock.appendChild(title);
        endingBlock.appendChild(text);
        endingBlock.appendChild(stats);

        this.container.appendChild(endingBlock);

        this.renderTimeline();

        const allChoices = document.querySelectorAll(".choiceCard");
        allChoices.forEach((card) => {
            card.onclick = null;
            card.disabled = true;
        });

        this.scrollDown();
    },

    renderTimeline() {
        const oldTimeline = this.container.querySelector(".timelineBlock");
        if (oldTimeline) {
            oldTimeline.remove();
        }

        const timeline = document.createElement("section");
        timeline.className = "timelineBlock";

        const title = document.createElement("div");
        title.className = "timelineTitle";
        title.innerText = "Útvonalad";
        timeline.appendChild(title);

        State.steps.forEach((step, index) => {
            const stepBlock = document.createElement("div");
            stepBlock.className = "timelineStep";

            const stepLabel = document.createElement("div");
            stepLabel.className = "timelineStepLabel";
            stepLabel.innerText = `${index + 1}. döntés`;
            stepBlock.appendChild(stepLabel);

            const prompt = document.createElement("div");
            prompt.className = "timelinePrompt";
            prompt.innerText = step.prompt;
            stepBlock.appendChild(prompt);

            const row = document.createElement("div");
            row.className = "timelineRowCards";

            step.all.forEach((choice) => {
                const el = document.createElement("div");
                el.className = "timelineCard";

                if (choice.image) {
                    el.style.backgroundImage = `url(${choice.image})`;
                } else {
                    el.classList.add("noImage");
                }

                const overlay = document.createElement("div");
                overlay.className = "timelineOverlay";
                overlay.innerText = choice.text;
                el.appendChild(overlay);

                if (choice.text === step.chosen) {
                    el.classList.add("chosen");
                } else {
                    el.classList.add("notChosen");
                }

                row.appendChild(el);
            });

            stepBlock.appendChild(row);
            timeline.appendChild(stepBlock);
        });

        this.container.appendChild(timeline);
    },

    lockDecision(decisionRow, chosenText) {
        [...decisionRow.children].forEach((el) => {
            const label = el.querySelector(".choiceOverlay")?.innerText || "";

            if (label === chosenText) {
                el.classList.add("chosen");
            } else {
                el.classList.add("notChosen");
            }

            el.onclick = null;
            el.disabled = true;
        });
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
        this.container.innerHTML = "";

        let currentNodeId = "start";

        for (const step of State.steps) {
            const node = Engine.getNode(currentNodeId);
            if (!node || node.type === "ending") break;

            const block = document.createElement("section");
            block.className = "storyBlock";

            const text = document.createElement("div");
            text.className = "storyText";
            text.innerText = node.text;
            block.appendChild(text);

            const decision = document.createElement("div");
            decision.className = "decisionRow";

            node.choices.forEach((choice) => {
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

                if (choice.text === step.chosen) {
                    item.classList.add("chosen");
                } else {
                    item.classList.add("notChosen");
                }

                item.onclick = null;
                item.disabled = true;

                decision.appendChild(item);
            });

            block.appendChild(decision);
            this.container.appendChild(block);

            const chosenChoice = node.choices.find((c) => c.text === step.chosen);
            if (!chosenChoice) break;

            currentNodeId = chosenChoice.next;
        }

        this.renderNode(State.current);
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
    this.container.innerHTML = "";
    this.renderNode("start");
}

    scrollDown() {
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: "smooth"
        });
    },

    // ===== SECRET SYSTEM =====

    isSecretUnlocked(choice) {
        if (!choice.unlock) return true;

        if (choice.unlock.type === "time") {
            const key = this.getSecretKey(choice, State.current);
            const start = this.secretTimers[key];
            if (!start) return false;

            return Date.now() - start >= choice.unlock.delay;
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
    return `${nodeId}_${choice.next}`;
}
};


