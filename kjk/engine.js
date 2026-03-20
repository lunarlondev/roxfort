let story = {};
let state = {
    current: "start",
    path: [],
    history: []
};

let seenEndings = JSON.parse(localStorage.getItem("endings") || "[]");

async function loadStory() {
    const res = await fetch("story.json");
    story = await res.json();
    render();
}

function render() {
    const node = story[state.current];

    if (node.type === "ending") {
        showEnding(node);
        return;
    }

    document.getElementById("endingScreen").classList.add("hidden");

    document.getElementById("text").innerText = node.text;

    const choicesDiv = document.getElementById("choices");
    choicesDiv.innerHTML = "";

    node.choices.forEach(choice => {
        const btn = document.createElement("button");
        btn.innerText = choice.text;

        btn.onclick = () => {
            state.history.push(JSON.parse(JSON.stringify(state)));

            state.path.push({
                node: state.current,
                choice: choice.text,
                allChoices: node.choices.map(c => c.text)
            });

            state.current = choice.next;
            render();
        };

        choicesDiv.appendChild(btn);
    });
}

function showEnding(node) {
    document.getElementById("game").innerHTML = "";

    document.getElementById("endingScreen").classList.remove("hidden");
    document.getElementById("endingTitle").innerText = node.title;
    document.getElementById("endingText").innerText = node.text;

    if (!seenEndings.includes(node.endingId)) {
        seenEndings.push(node.endingId);
        localStorage.setItem("endings", JSON.stringify(seenEndings));
    }

    renderTimeline();
}

function renderTimeline() {
    const timeline = document.getElementById("timeline");
    const missed = document.getElementById("missed");

    timeline.innerHTML = "";
    missed.innerHTML = "";

    state.path.forEach(step => {
        const div = document.createElement("div");
        div.className = "timelineNode";

        div.innerHTML = `
            <div>${step.node}</div>
            <div class="timelineChoice">${step.choice}</div>
        `;

        timeline.appendChild(div);

        step.allChoices.forEach(choice => {
            if (choice !== step.choice) {
                const m = document.createElement("div");
                m.className = "missedChoice";
                m.innerText = "Nem választott: " + choice;
                missed.appendChild(m);
            }
        });
    });
}

document.getElementById("backBtn").onclick = () => {
    if (state.history.length > 0) {
        state = state.history.pop();
        render();
    }
};

document.getElementById("restartBtn").onclick = () => {
    state = {
        current: "start",
        path: [],
        history: []
    };

    document.getElementById("game").innerHTML = `
        <div id="text" class="text"></div>
        <div id="choices" class="choices"></div>
    `;

    render();
};

loadStory();