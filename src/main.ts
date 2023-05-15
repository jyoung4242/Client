//import Components
import { Viewport } from "./components/Viewport";
import { UI } from "@peasy-lib/peasy-ui";
import { frameworkState } from "./state";

//import Assets
import { AssetManager } from "./components/AssetPool";

//import Scenes
import { Loading } from "../content/Scenes/loading";
import { Lobby } from "../content/Scenes/lobby";
import { Login } from "../content/Scenes/login";
import { Game } from "../content/Scenes/game";

const datamodel = new frameworkState();
let scenes = [Loading, Login, Lobby, Game];

const viewport = new Viewport(datamodel, scenes, scenes[0], 400, "3.255/1.75");
const template = `${viewport.template}`;
const mainView = UI.create(document.body, datamodel, template);
