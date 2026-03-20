(async () => {
    await Engine.load();
    UI.renderNode(State.current);

    document.getElementById("backBtn").onclick = () => UI.back();
    document.getElementById("restartBtn").onclick = () => UI.restart();
})();