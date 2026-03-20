const UI = {

    container: document.getElementById("storyContainer"),

    renderNode(nodeId) {
        const node = Engine.getNode(nodeId);

        // ===== ENDING =====
        if (node.type === "ending") {
            this.showEnding(node);
            return;
        }

        // ===== NORMAL NODE =====
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

    showEnding(node) {

        // ending mentése
        if (State.saveEnding) {
            State.saveEnding(node.endingId);
        }

        const overlay = document.getElementById("endingOverlay");

        document.getElementById("endingTitle").innerText = node.title;
        document.getElementById("endingText").innerText = node.text;

        document.getElementById("endingId").innerText =
            "Ending ID: " + node.endingId;

        document.getElementById("endingCount").innerText =
            "Felfedezett endingek: " + (State.seenEndings ? State.seenEndings.length : 0);

        overlay.classList.remove("hidden");

        // minden korábbi choice letiltása
        const allChoices = document.querySelectorAll(".choiceBubble");
        allChoices.forEach(c => c.onclick = null);
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

        const overlay = document.getElementById("endingOverlay");
        if (overlay) {
            overlay.classList.add("hidden");
        }

        this.renderNode("start");
    }
};