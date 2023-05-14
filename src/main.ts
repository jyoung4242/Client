//import Components
import { Viewport } from "./components/Viewport";
import { UI } from "@peasy-lib/peasy-ui";
import { frameworkState } from "./state";

//import Scenes
import { Lobby } from "../content/Scenes/lobby";
import { Login } from "../content/Scenes/login";
import { Game } from "../content/Scenes/game";

const datamodel = new frameworkState();
let scenes = [Login, Lobby, Game];

const viewport = new Viewport(datamodel, scenes, scenes[0], 500, "3.75/1.75");

const template = `{
    ${viewport.template}
}`;

const mainView = UI.create(document.body, datamodel, template);
