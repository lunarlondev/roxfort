const State = {
    current: "start",
    history: [],
    steps: [],

    seenEndings: JSON.parse(localStorage.getItem("endings") || "[]"),

    goTo(id) {
        this.history.push(this.current);
        this.current = id;
    },

    back() {
        if (this.history.length > 0) {
            this.current = this.history.pop();
        }
    },

    reset() {
        this.current = "start";
        this.history = [];
        this.steps = [];
    }
};