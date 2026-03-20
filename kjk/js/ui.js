const UI = {

    container: document.getElementById("storyContainer"),
    choices: document.getElementById("choices"),

    renderNode(nodeId) {
        const node = Engine.getNode(nodeId);

        // TEXT BLOKK HOZZÁADÁSA (nem töröljük a régit!)
        const block = document.createElement("div");
        block.className = "storyBlock";

        const text = document.createElement("div");
        text.className = "storyText";
        text.innerText = node.text;

        block.appendChild(text);

        // DÖNTÉS BLOKK (INLINE!)
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

    renderChoices(nodeId) {
        // már inline van → nem kell külön
    },

    scrollDown() {
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: "smooth"
        });
    },

    back() {
        if (State.history.length === 0) return;

        State.history.pop(); // current
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