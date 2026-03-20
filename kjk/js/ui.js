const UI = {

    container: document.getElementById("storyContainer"),

    renderNode(nodeId) {
        const node = Engine.getNode(nodeId);

        // ===== ENDING =====
        if (node.type === "ending") {
            this.renderEnding(node);
            return;
        }

        // ===== NORMAL =====
        const block = document.createElement("div");
        block.className = "storyBlock";

        const text = document.createElement("div");
        text.className = "storyText";
        text.innerText = node.text;

        block.appendChild(text);

        const decision = document.createElement("div");
        decision.className = "decisionRow";

        node.choices.forEach(choice => {
            const item = document.createElement("div");
            item.className = "choiceBubble";

            item.innerText = choice.text;

            item.onclick = () => {
                this.lockDecision(decision, choice.text);

                State.history.push(JSON.parse(JSON.stringify(State)));

                State.steps.push({
                    node: nodeId,
                    chosen: choice.text,
                    all: node.choices.map(c => c.text)
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

        // ===== TRACKING FIX =====
        State.saveEnding(node.endingId);

        // ===== ENDING BLOKK =====
        const block = document.createElement("div");
        block.className = "storyBlock endingBlock";

        const title = document.createElement("div");
        title.className = "endingTitle";
        title.innerText = "ENDING: " + node.title;

        const text = document.createElement("div");
        text.className = "storyText";
        text.innerText = node.text;

        const stats = document.createElement("div");
        stats.className = "endingStats";
        stats.innerText =
            "Felfedezett endingek: " + State.seenEndings.length;

        block.appendChild(title);
        block.appendChild(text);
        block.appendChild(stats);

        this.container.appendChild(block);

        // ===== TIMELINE =====
        this.renderTimeline();

        // ===== LOCK ALL =====
        const allChoices = document.querySelectorAll(".choiceBubble");
        allChoices.forEach(c => c.onclick = null);

        this.scrollDown();
    },

    renderTimeline() {

        const timeline = document.createElement("div");
        timeline.className = "timelineBlock";

        const title = document.createElement("div");
        title.className = "timelineTitle";
        title.innerText = "Útvonalad";

        timeline.appendChild(title);

        State.steps.forEach(step => {

            const row = document.createElement("div");
            row.className = "timelineRow";

            step.all.forEach(choice => {
                const el = document.createElement("div");
                el.className = "timelineChoice";

                el.innerText = choice;

                if (choice === step.chosen) {
                    el.classList.add("chosen");
                } else {
                    el.classList.add("notChosen");
                }

                row.appendChild(el);
            });

            timeline.appendChild(row);
        });

        this.container.appendChild(timeline);
    },

    lockDecision(decisionRow, chosenText) {
        [...decisionRow.children].forEach(el => {
            if (el.innerText === chosenText) {
                el.classList.add("chosen");
            } else {
                el.classList.add("notChosen");
            }
            el.onclick = null;
        });
    },

    scrollDown() {
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: "smooth"
        });
    },

    back() {
        if (State.history.length === 0) return;

        const prev = State.history.pop();
        if (!prev) return;

        Object.assign(State, prev);

        this.container.innerHTML = "";
        State.steps = [];

        this.renderNode(State.current);
    },

    restart() {
        State.reset();
        this.container.innerHTML = "";
        this.renderNode("start");
    }
};