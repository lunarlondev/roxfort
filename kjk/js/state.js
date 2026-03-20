const State = {
    current: "start",
    history: [],
    steps: [],

    seenEndings: JSON.parse(localStorage.getItem("endings") || "[]"),

    saveEnding(id) {
        if (!this.seenEndings.includes(id)) {
            this.seenEndings.push(id);
            localStorage.setItem("endings", JSON.stringify(this.seenEndings));
        }
    },

    reset() {
        this.current = "start";
        this.history = [];
        this.steps = [];
    }
};