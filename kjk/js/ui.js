const UI = {
    container: document.getElementById("storyContainer"),

    renderNode(id) {
        const node = Engine.getNode(id);
        this.container.innerHTML = "";

        const block = document.createElement("div");
        block.className = "storyBlock";

        const text = document.createElement("div");
        text.className = "storyText";
        text.innerText = node.text;
        block.appendChild(text);

        if (node.type === "ending") {
            const end = document.createElement("div");
            end.className = "endingBlock";
            end.innerHTML = `<div class="endingTitle">${node.title}</div><div>${node.text}</div>`;
            block.appendChild(end);
        }

        if (node.choices) {
            const row = document.createElement("div");
            row.className = "decisionRow";

            node.choices.forEach(choice => {
                const card = document.createElement("div");
                card.className = "choiceCard";

                if (choice.image) {
                    card.style.backgroundImage = `url(${choice.image})`;
                } else {
                    card.classList.add("noImage");
                }

                const overlay = document.createElement("div");
                overlay.className = "choiceOverlay";
                overlay.innerText = choice.text;

                card.appendChild(overlay);

                card.onclick = () => {
                    State.goTo(choice.next);
                    UI.renderNode(State.current);
                };

                row.appendChild(card);
            });

            block.appendChild(row);
        }

        this.container.appendChild(block);

        // SECRET TIMER
        if (node.secretTimer) {
            setTimeout(() => {
                State.goTo("ending_secret");
                UI.renderNode(State.current);
            }, node.secretTimer);
        }
    },

    back() {
        State.back();
        this.renderNode(State.current);
    },

    restart() {
        State.reset();
        this.renderNode(State.current);
    }
};