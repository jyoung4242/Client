import { Scene } from "../../src/components/SceneManager";
import { GameRenderer, RenderState } from "../../src/components/Renderer";
import { Assets } from "@peasy-lib/peasy-assets";
import { Kitchen } from "../Maps/kitchen";
import { Player } from "../Game Objects/Player";
import { Counter } from "../Game Objects/Counter";
import { Bookshelf } from "../Game Objects/Bookshelf";

export class Game extends Scene {
  renderer = GameRenderer;
  renderState = RenderState;

  public template = `<scene-layer class="scene" style="width: 100%; height: 100%; position: absolute; top: 0; left:0; color: white;">
    ${this.renderer.template}
  </scene-layer>`;

  public async init() {
    //Loading Assets
    Assets.initialize({ src: "./content/Assets/" });
    await Assets.load(["lower.png", "DemoUpper.png", "hero.png", "shadow.png", "counter.png", "bookshelf.png"]);

    //Initialize Renderer
    this.renderer.initialize(this.renderState, 2, { width: 400, aspectratio: 3 / 2 });

    //Load Maps
    this.renderer.createMap([new Kitchen(Assets)]);
    this.renderer.changeMap("kitchen");

    //Load Objects
    let objConfig = [new Player(Assets), new Counter(Assets), new Bookshelf(Assets)];
    this.renderer.createObject(objConfig);

    //Set Camera
    this.renderer.cameraFollow("Player");

    //START your engines!
    this.renderer.showCollisionBodies(true);
    this.renderer.engineStart();
  }
  public exit() {}
}
