import { SceneManager } from "./SceneManager";

export class Viewport {
  template: string;
  state: any;
  sceneManager = new SceneManager();
  width: number;
  aspectRatio: string;

  constructor(state: any, scenes: any, width?: number, aspectRatio?: string) {
    this.state = state;
    console.log(this.state);

    width ? (this.width = width) : (this.width = 400);
    aspectRatio ? (this.aspectRatio = aspectRatio) : (this.aspectRatio = "3/2");
    this.state.viewport.width = this.width;
    this.state.viewport.aspectRatio = this.aspectRatio;

    this.template = `
    <style>
        :root {
          --pixel-size: 2.5;
          --aspectRatio: 3/2;
          --vpWidth: 400px;
          --vpColor: black;
          --bRadius: 5px;
          --bThickness: 3px;
          --bColor: white;
          --bodyColor: rgb(23, 23, 23);
        }

        @media (max-width: 1100px) {
          :root {
            --pixel-size: 1.5;
          }
        }

        @media (max-width: 675px) {
          :root {
            --pixel-size: 0.75;
          }
        }
        body {
          width: 100%;
          height: 100%;
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          background-color: var(--bodyColor,rgb(23, 23, 23));
        }
        .scene{
          position: absolute;
          top: 0;
          left:0;
          width: 100%;
          height: 100%;
        }
        .Transition{
            position: absolute;
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
          top:50%;
          left:50%;
          transform: translate(-50%,-50%) scale(var(--pixel-size));
          width: var(--vpWidth, 400px);
          aspect-ratio: var(--aspectRatio, 3/2);
          background-color: black;
          border-style: solid;
          border-color: var(--bColor, white);
          border-width: var(--bThickness, 3px);
          border-radius: var(--bRadius, 5px);
          overflow: hidden;
        }

    </style>
    <div id="Viewport" style="--aspectRatio: \${viewport.aspectRatio}; --vpWidth: \${viewport.width}px;" >
        <div class="Transition \${transitionManager.stylestring}"></div>
    </div>`;

    this.state.sceneManager.scenes = [...scenes];
    this.sceneManager.register(...scenes);
  }

  setScene = (sceneIndex: number) => {
    this.state.sceneManager.currentScene = this.state.sceneManager.scenes[sceneIndex];
    this.sceneManager.set(this.state.sceneManager.currentScene);
  };
}
