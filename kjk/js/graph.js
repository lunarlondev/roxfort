const Graph = {
    box: document.getElementById("graphBox"),
    svg: document.getElementById("graphLines"),

    nodes: {},
    positions: {},

    render() {
        this.box.querySelectorAll(".graphNode").forEach(n => n.remove());
        this.svg.innerHTML = "";

        this.nodes = Engine.nodes;
        this.positions = {};

        this.layout();
        this.drawNodes();
        this.drawLines();
    },

    layout() {
        const visited = new Set();
        let queue = [{ id: "start", level: 0 }];
        let levels = {};

        while (queue.length > 0) {
            const current = queue.shift();
            if (visited.has(current.id)) continue;
            visited.add(current.id);

            if (!levels[current.level]) levels[current.level] = [];
            levels[current.level].push(current.id);

            const node = this.nodes[current.id];
            if (!node || !node.choices) continue;

            node.choices.forEach(choice => {
                queue.push({ id: choice.next, level: current.level + 1 });
            });
        }

        Object.keys(levels).forEach(level => {
            const arr = levels[level];

            arr.forEach((nodeId, index) => {
                const x = 200 + index * 180;
                const y = 50 + level * 120;

                this.positions[nodeId] = { x, y };
            });
        });
    },

    drawNodes() {
        Object.keys(this.positions).forEach(nodeId => {
            const pos = this.positions[nodeId];
            const node = this.nodes[nodeId];

            const el = document.createElement("div");
            el.className = "graphNode";
            el.style.left = pos.x + "px";
            el.style.top = pos.y + "px";

            if (node.type === "ending") {
                el.classList.add("ending");
            }

            if (State.seenChoices.some(c => node.text?.includes(c))) {
                el.classList.add("visited");
            }

            el.innerText = nodeId;
            this.box.appendChild(el);
        });
    },

    drawLines() {
        Object.keys(this.nodes).forEach(nodeId => {
            const node = this.nodes[nodeId];
            if (!node.choices) return;

            const from = this.positions[nodeId];
            if (!from) return;

            node.choices.forEach(choice => {
                const to = this.positions[choice.next];
                if (!to) return;

                this.drawLine(
                    from.x + 60,
                    from.y + 30,
                    to.x + 60,
                    to.y
                );
            });
        });
    },

    drawLine(x1, y1, x2, y2) {
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");

        line.setAttribute("x1", x1);
        line.setAttribute("y1", y1);
        line.setAttribute("x2", x2);
        line.setAttribute("y2", y2);
        line.setAttribute("stroke", "#555");
        line.setAttribute("stroke-width", "2");

        this.svg.appendChild(line);
    }
};