const State = {
    current: "start",
    history: [],
    steps: [],

    seenEndings: JSON.parse(localStorage.getItem("endings") || "[]"),
    seenChoices: JSON.parse(localStorage.getItem("choices") || "[]"),
    seenSecrets: JSON.parse(localStorage.getItem("secrets") || "[]"),

    saveEnding(id) {
        if (!id) return;
        if (!this.seenEndings.includes(id)) {
            this.seenEndings.push(id);
            localStorage.setItem("endings", JSON.stringify(this.seenEndings));
        }
    },

    saveChoice(choice) {
        if (!this.seenChoices.includes(choice)) {
            this.seenChoices.push(choice);
            localStorage.setItem("choices", JSON.stringify(this.seenChoices));
        }
    },

    saveSecret(id) {
        if (!id) return;
        if (!this.seenSecrets.includes(id)) {
            this.seenSecrets.push(id);
            localStorage.setItem("secrets", JSON.stringify(this.seenSecrets));
        }
    },

    reset() {
        this.current = "start";
        this.history = [];
        this.steps = [];
    }
};