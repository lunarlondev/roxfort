(async () => {
    await Engine.load();
    UI.init();
    UI.renderNode(State.current);

    document.getElementById("backBtn").onclick = () => UI.back();
    document.getElementById("restartBtn").onclick = () => UI.restart();
})();