const Engine = {
    story: {},

    async load() {
        const res = await fetch("story.json");
        this.story = await res.json();
    },

    getNode(id) {
        return this.story[id];
    }
};