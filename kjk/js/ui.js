const UI = {
    storyBox: document.getElementById("storyBox"),
    decisionBox: document.getElementById("decisionBox"),
    timelineBox: document.getElementById("timelineBox"),

    secretTimers: {},

    // --- CSOMÓPONT MEGJELENÍTÉSE ---
    renderNode(nodeId) {
        const node = Engine.getNode(nodeId);
        if (!node) return;

        if (node.type === "ending") {
            this.renderEnding(node);
            return;
        }

        // Játék közben elrejtjük a timeline-t, hogy ne zavarjon be
        this.timelineBox.style.display = "none";

        this.storyBox.innerText = node.text;
        this.decisionBox.innerHTML = "";

        node.choices.forEach((choice) => {
            // Titkos opciók ellenőrzése
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

            // JAVÍTÁS: Most már minden típusnál betölti a képet, ha létezik
            if (choice.image) {
                item.style.backgroundImage = `url('${choice.image}')`;
                item.classList.remove("noImage");
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

    // --- ENDING MEGJELENÍTÉSE ---
    renderEnding(node) {
        State.saveEnding(node.endingId);

        this.storyBox.innerText = `${node.title}\n\n${node.text}`;
        this.decisionBox.innerHTML = "";

        const stats = document.createElement("div");
        stats.className = "endingStats";
        stats.innerText = `Felfedezett endingek: ${State.seenEndings.length}`;

        this.decisionBox.appendChild(stats);

        // Az ending elérésekor generáljuk le a timeline-t
        this.renderTimeline(node);
    },

    // --- TIMELINE (IDŐVONAL) GENERÁLÁSA ---
    renderTimeline(node) {
        this.timelineBox.innerHTML = "";
        this.timelineBox.style.display = "block";

        const title = document.createElement("div");
        title.className = "timelineTitle";
        title.innerText = "A történeted";
        this.timelineBox.appendChild(title);

        const timeline = document.createElement("div");
        timeline.className = "timeline";

        State.steps.forEach((step, index) => {
            const wrapper = document.createElement("div");
            wrapper.className = "timelineStep";

            const card = document.createElement("div");
            card.className = "timelineCard " + step.type;

            // JAVÍTÁS: A timeline-on is megjelenítjük a képet minden döntéstípusnál
            const chosenOption = step.all.find(c => c.text === step.chosen);
            if (chosenOption && chosenOption.image) {
                card.style.backgroundImage = `url('${chosenOption.image}')`;
            }

            const text = document.createElement("div");
            text.className = "timelineText";
            text.innerText = step.chosen;

            card.appendChild(text);
            wrapper.appendChild(card);

            // Nyíl hozzáadása, ha nem az utolsó elem
            if (index < State.steps.length - 1 || node) {
                const arrow = document.createElement("div");
                arrow.className = "timelineArrow";
                arrow.innerText = "→";
                wrapper.appendChild(arrow);
            }

            timeline.appendChild(wrapper);
        });

        // Ending kártya hozzáadása a sor végére
        if (node) {
            const endingCard = document.createElement("div");
            endingCard.className = "timelineCard ending";

            const endingText = document.createElement("div");
            endingText.className = "timelineText";
            endingText.innerText = node.title;

            endingCard.appendChild(endingText);
            timeline.appendChild(endingCard);
        }

        this.timelineBox.appendChild(timeline);
    },

    // --- ÁLLAPOTKEZELÉS ÉS SEGÉDFÜGGVÉNYEK ---
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
        this.timelineBox.style.display = "none";
        this.renderNode("start");
    },

    // --- TITKOS MECHANIKÁK (IDŐ, COMBO, ENDING) ---
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
                State.steps.some((step) => step.chosen === c)
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