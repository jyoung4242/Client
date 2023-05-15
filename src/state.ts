import { Lobby } from "../content/Scenes/lobby";
import { Login } from "../content/Scenes/login";
import { Game } from "../content/Scenes/game";

export class frameworkState {
  viewport: any;
  sceneManager: any;
  transitionManager: any;

  constructor() {
    this.viewport = {
      width: 400,
      aspectRatio: "3/2",
      borderThickness: "3px",
      borderColor: "white",
      borderRadius: "5px",
    };
    this.sceneManager = { currentScene: "Login", Scenes: [] };

    this.transitionManager = {
      stylestring: "",
      get cssString() {
        console.log("this", this.stylestring);
        return this.stylestring;
      },
    };
  }

  setTransition = (toggleswitch: boolean): Promise<void> => {
    return new Promise((res, rej) => {
      if (toggleswitch == true) this.transitionManager.stylestring = "hide_transition";
      else this.transitionManager.stylestring = "";
      setTimeout(() => {
        res();
      }, 250);
    });
  };
}
