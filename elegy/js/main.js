import { ProfileRenderer } from "./profile-renderer.js";
import { StoryEngine } from "./story/engine.js";
import { StoryState } from "./story/state.js";
import { StoryRules } from "./story/rules.js";
import { StoryTransitions } from "./story/transitions.js";
import { StoryUI } from "./story/ui.js";
import { StoryEffects } from "./story-effects.js";

async function loadJson(url) {
  const response = await fetch(url, { cache: "no-store" });

  if (!response.ok) {
    throw new Error(`${url} nem tölthető be (${response.status}).`);
  }

  return response.json();
}

function showBootstrapError(error) {
  console.error(error);

  const storyText = document.getElementById("storyText");
  if (!storyText) return;

  storyText.innerHTML = "";

  const message = document.createElement("div");
  message.className = "story-error";
  message.textContent =
    `${error.message} A JSON-fájlok betöltéséhez indítsd az oldalt ` +
    "helyi webszerverről a mellékelt start.bat fájllal.";

  storyText.appendChild(message);
}

async function bootstrap() {
  let effects = null;

  try {
    const character = await loadJson("data/character.json");

    const profileRenderer = new ProfileRenderer(document);
    profileRenderer.render(character);

    const storySource =
      character.story?.dataSource ||
      "data/story.json";

    const engine = await new StoryEngine().load(storySource);

    const state = new StoryState(engine);
    state.init();

    const rules = new StoryRules(state);

    const stage = document.getElementById("storyStage");
    if (!stage) {
      throw new Error("A storyStage elem nem található az oldalon.");
    }

    const transitions = new StoryTransitions(stage);

    const ui = new StoryUI({
      engine,
      state,
      rules,
      transitions,
      root: document
    });

    ui.init();

    effects = new StoryEffects({
      root: document,
      character,
      engine,
      state,
      rules,
      transitions,
      ui
    });

    effects.init();

    /*
     * Fejlesztői teszteléshez a böngésző konzoljában:
     *
     * storyFX.playHit();
     * storyFX.playDeath();
     * storyFX.showChapter({
     *   roman: "II",
     *   label: "Fejezet",
     *   title: "Az örökség"
     * });
     */
    window.storyFX = effects;
  } catch (error) {
    effects?.destroy();
    showBootstrapError(error);
  }
}

bootstrap();
