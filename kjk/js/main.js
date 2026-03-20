(async () => {
    await Engine.load();
    UI.renderNode(State.current);

    document.getElementById("backBtn").onclick = () => UI.back();
    document.getElementById("restartBtn").onclick = () => UI.restart();
})();
document.getElementById("restartEndingBtn").onclick = () => {
    document.getElementById("endingOverlay").classList.add("hidden");
    UI.restart();
};