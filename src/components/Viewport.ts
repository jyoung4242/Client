//Viewport.ts
import { UI } from "@peasy-lib/peasy-ui";

//*************************** */
//Load SceneManager
//*************************** */
import { Scene, SceneState } from "./SceneManager";
import { TransitionManager } from "./TransitionManager";

export class Viewport {
  static state: any = undefined;
  static template: string;

  constructor(
    public state: {
      SceneManager: any;
      Scenes: Array<Scene>;
      currentScene: string;
      switchScene: Function;
      transitionCSSstring: string;
    }
  ) {
    this.state.SceneManager = SceneState;
    this.state.SceneManager.create(...this.state.Scenes);
    this.state.SceneManager.set(this.state.currentScene, "default");
    this.state.transitionCSSstring = "";

    setInterval(() => {
      this.state.transitionCSSstring = "hide_transition";
      if (this.state.currentScene == "lobby") this.state.currentScene = "login";
      else if (this.state.currentScene == "login") this.state.currentScene = "game";
      else this.state.currentScene = "lobby";
      this.state.SceneManager.set(this.state.currentScene);
      this.state.transitionCSSstring = "";
    }, 1000);

    Viewport.template = `
    <style>
        .transition{
            z-index: 99999;
            width: 100%;
            height: 100%;
            background-color: transparent;
            transition: background-color 0.25s;
        }
        .hide_transition{
            background-color: white;
        }
        #Viewport {
        position: var(--position, relative);
        width: 400px;
        aspect-ratio: 3/2;
        border: var(--borderStyle, 3px solid white);
        background-color: black;
        border-radius: var(--bradius, 5px);
        top:50%;
        left:50%;
        transform: translate(-50%,-50%) scale(var(--pixel-size));
        overflow: hidden;
        }
        .gamestate{
            opacity:1;
            transition: opacity 1.4s;
        }
        .gamestate.pui-adding{opacity: 0;}
        .gamestate.pui-removing{opacity: 0;}
    </style>
    <div id="Viewport">
        <scene-transition class="transition \${state.transitionCSSstring}" ></scene-transition>
    </div>`;
  }
  //\${state.tm===state.tmState}
  static create(state: any) {
    return new Viewport(state);
  }
}
UI.register("Viewport", Viewport); // Can be replaced with a property on invoking model
