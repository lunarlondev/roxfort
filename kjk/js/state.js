const State = {
    current: "start",
    history: [],
    steps: [],
    seenEndings: JSON.parse(localStorage.getItem("endings") || "[]"),
    seenChoices: JSON.parse(localStorage.getItem("choices") || "[]"),

    saveEnding(id) {
        if (!id) return;

        if (!this.seenEndings.includes(id)) {
            this.seenEndings.push(id);
            localStorage.setItem("endings", JSON.stringify(this.seenEndings));
        }
    },

    saveChoice(text) {
        if (!this.seenChoices.includes(text)) {
            this.seenChoices.push(text);
            localStorage.setItem("choices", JSON.stringify(this.seenChoices));
        }
    },

    reset() {
        this.current = "start";
        this.history = [];
        this.steps = [];
    }
};