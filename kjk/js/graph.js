const Graph = {
    box: document.getElementById("graphBox"),
    svg: document.getElementById("graphLines"),

    positions: {},
    levels: {},

    render() {
        if (!this.box || !this.svg) return;

        this.box.querySelectorAll(".graphNode").forEach((node) => node.remove());
        this.svg.innerHTML = "";
        this.positions = {};
        this.levels = {};

        const story = Engine.story;
        if (!story || !story.start) return;

        this.buildLayout(story);
        this.drawConnections(story);
        this.drawNodes(story);
    },

    buildLayout(story) {
        const visited = new Set();
        const queue = [{ id: "start", level: 0 }];

        while (queue.length > 0) {
            const current = queue.shift();
            if (visited.has(current.id)) continue;
            visited.add(current.id);

            if (!this.levels[current.level]) {
                this.levels[current.level] = [];
            }
            this.levels[current.level].push(current.id);

            const node = story[current.id];
            if (!node || !node.choices) continue;

            node.choices.forEach((choice) => {
                if (choice.type === "secret" && !State.seenChoices.includes(choice.text)) {
                    return;
                }
                queue.push({ id: choice.next, level: current.level + 1 });
            });
        }

        Object.keys(this.levels).forEach((levelKey) => {
            const level = Number(levelKey);
            const nodes = this.levels[level];
            const spacingX = 170;
            const spacingY = 130;
            const startX = 40;
            const y = 40 + level * spacingY;

            nodes.forEach((nodeId, index) => {
                const x = startX + index * spacingX;
                this.positions[nodeId] = { x, y };
            });
        });

        const maxX = Math.max(...Object.values(this.positions).map((p) => p.x), 0) + 180;
        const maxY = Math.max(...Object.values(this.positions).map((p) => p.y), 0) + 120;

        this.svg.setAttribute("width", String(maxX));
        this.svg.setAttribute("height", String(maxY));
    },

    drawConnections(story) {
        Object.entries(story).forEach(([nodeId, node]) => {
            if (!node.choices || !this.positions[nodeId]) return;

            node.choices.forEach((choice) => {
                if (choice.type === "secret" && !State.seenChoices.includes(choice.text)) {
                    return;
                }

                const from = this.positions[nodeId];
                const to = this.positions[choice.next];
                if (!to) return;

                const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
                line.setAttribute("x1", String(from.x + 65));
                line.setAttribute("y1", String(from.y + 68));
                line.setAttribute("x2", String(to.x + 65));
                line.setAttribute("y2", String(to.y));
                line.setAttribute("stroke", "#4a4a56");
                line.setAttribute("stroke-width", "2");
                line.setAttribute("stroke-linecap", "round");

                this.svg.appendChild(line);
            });
        });
    },

    drawNodes(story) {
        Object.entries(this.positions).forEach(([nodeId, pos]) => {
            const node = story[nodeId];
            if (!node) return;

            const el = document.createElement("div");
            el.className = "graphNode";
            el.style.left = `${pos.x}px`;
            el.style.top = `${pos.y}px`;

            if (node.type === "ending") {
                el.classList.add("graph-ending");
                el.innerText = node.title || nodeId;
            } else {
                el.classList.add("graph-story");
                el.innerText = this.getNodeLabel(nodeId, node);
            }

            if (this.isNodeInCurrentRun(nodeId)) {
                el.classList.add("graph-current");
            } else if (this.isNodeSeenBefore(nodeId, node)) {
                el.classList.add("graph-seen");
            } else {
                el.classList.add("graph-unknown");
            }

            this.box.appendChild(el);
        });
    },

    getNodeLabel(nodeId, node) {
        if (nodeId === "start") return "Start";
        if (node.text) return node.text.slice(0, 42) + (node.text.length > 42 ? "..." : "");
        return nodeId;
    },

    isNodeInCurrentRun(nodeId) {
        if (nodeId === "start") return true;
        return State.steps.some((step) => step.next === nodeId);
    },

    isNodeSeenBefore(nodeId, node) {
        if (node.type === "ending" && node.endingId) {
            return State.seenEndings.includes(node.endingId);
        }

        return State.steps.some((step) => step.next === nodeId);
    }
};