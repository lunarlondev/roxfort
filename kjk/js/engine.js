const Engine = {
    story: {},

    async load() {
        try {
            const res = await fetch("./story.json");
            this.story = await res.json();
        } catch (e) {
            console.error("Story load failed:", e);
            this.story = {};
        }
    },

    getNode(id) {
        return this.story[id] || null;
    }
};