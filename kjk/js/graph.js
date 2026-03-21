const Graph = {
    box: document.getElementById("graphBox"),
    svg: document.getElementById("graphLines"),
    nodesLayer: document.getElementById("graphNodes"),

    positions: {},
    levels: {},

    render() {
        this.svg.innerHTML = "";
        this.nodesLayer.innerHTML = "";
        this.positions = {};
        this.levels = {};

        const story = Engine.story;
        if (!story) return;

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

            node.choices.forEach(choice => {
                queue.push({ id: choice.next, level: current.level + 1 });
            });
        }

        Object.keys(this.levels).forEach(levelKey => {
            const level = Number(levelKey);
            const nodes = this.levels[level];

            nodes.forEach((nodeId, index) => {
                const x = 80 + index * 200;
                const y = 50 + level * 130;
                this.positions[nodeId] = { x, y };
            });
        });
    },

    drawConnections(story) {
        Object.entries(story).forEach(([nodeId, node]) => {
            if (!node.choices) return;

            const from = this.positions[nodeId];
            if (!from) return;

            node.choices.forEach(choice => {
                const to = this.positions[choice.next];
                if (!to) return;

                const path = document.createElementNS("http://www.w3.org/2000/svg", "path");

                const d = `
                    M ${from.x + 70} ${from.y + 70}
                    C ${from.x + 70} ${from.y + 110},
                      ${to.x + 70} ${to.y - 40},
                      ${to.x + 70} ${to.y}
                `;

                path.setAttribute("d", d);
                path.setAttribute("stroke", "#555");
                path.setAttribute("fill", "none");
                path.setAttribute("stroke-width", "2");

                this.svg.appendChild(path);
            });
        });
    },

    drawNodes(story) {
        Object.entries(this.positions).forEach(([nodeId, pos]) => {
            const node = story[nodeId];
            if (!node) return;

            const el = document.createElement("div");
            el.className = "graphNode";
            el.style.left = pos.x + "px";
            el.style.top = pos.y + "px";

            if (nodeId === "start") el.classList.add("start");
            if (node.type === "ending") el.classList.add("ending");

            if (State.steps.some(step => step.next === nodeId)) {
                el.classList.add("current");
            } else if (State.seenEndings.includes(node.endingId)) {
                el.classList.add("visited");
            }

            el.innerText = nodeId;
            this.nodesLayer.appendChild(el);
        });
    }
};