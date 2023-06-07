//import Components
import { Viewport } from "./components/Viewport";
import { UI } from "@peasy-lib/peasy-ui";
import { StateManagement } from "./components/StateManagement";

//import Scenes
import { Loading } from "../content/Scenes/loading";
import { Lobby } from "../content/Scenes/lobby";
import { Login } from "../content/Scenes/login";
import { Game } from "../content/Scenes/game";

export const datamodel = new StateManagement();

let scenes = [Loading, Login, Lobby, Game];

const viewport = Viewport;
viewport.initialize(datamodel, scenes, 400, "3.125/1.75");
const template = `${viewport.template}`;
await UI.create(document.body, datamodel, template).attached;
viewport.setScene(0);
