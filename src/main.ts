//import Components
import { Viewport } from "./components/Viewport";
import { UI } from "@peasy-lib/peasy-ui";
import { Lobby } from "../content/Scenes/lobby";
import { Login } from "../content/Scenes/login";
import { Game } from "../content/Scenes/game";
import { TransitionManager } from "./components/TransitionManager";

const model = {
  TransitionManager,
  Viewport,
  vp: {
    SceneManager: undefined,
    currentScene: "login",
    Scenes: [Login, Lobby, Game],
    transitionCSSstring: "",
  },
};
const template = `{
    <my-viewport pui="Viewport===vp"></my-viewport>
}`;

const mainView = UI.create(document.body, model, template);
