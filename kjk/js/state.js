const State = {
    current: "start",
    history: [],
    steps: [],

    reset() {
        this.current = "start";
        this.history = [];
        this.steps = [];
    }
};