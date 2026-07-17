import { ProfileRenderer } from "./profile-renderer.js";
import { StoryEngine } from "./story/engine.js";
import { StoryState } from "./story/state.js";
import { StoryRules } from "./story/rules.js";
import { StoryTransitions } from "./story/transitions.js";
import { StoryUI } from "./story/ui.js";

async function loadJson(url) {
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) throw new Error(`${url} nem tölthető be (${response.status}).`);
  return response.json();
}

async function bootstrap() {
  try {
    const character = await loadJson("data/character.json");
    new ProfileRenderer(document).render(character);
    const engine = await new StoryEngine().load(character.story?.dataSource || "data/story.json");
    const state = new StoryState(engine);
    state.init();
    const rules = new StoryRules(state);
    const transitions = new StoryTransitions(document.getElementById("storyStage"));
    const ui = new StoryUI({ engine, state, rules, transitions, root: document });
    ui.init();
  } catch (error) {
    console.error(error);
    const storyText = document.getElementById("storyText");
    if (storyText) {
      storyText.innerHTML = "";
      const message = document.createElement("div");
      message.className = "story-error";
      message.textContent = `${error.message} A JSON-fájlok betöltéséhez indítsd az oldalt helyi webszerverről a mellékelt start.bat fájllal.`;
      storyText.appendChild(message);
    }
  }
}

bootstrap();
