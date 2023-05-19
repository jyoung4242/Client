import { Scene } from "../../src/components/SceneManager";
import { GameRenderer, RenderState } from "../../src/components/Renderer";
import { InputManager } from "../../src/components/InputManager";
import { Assets } from "@peasy-lib/peasy-assets";
import { MapConfig } from "../../src/components/MapManager";
import { GameObject, GameObjectConfig } from "../../src/components/GameObject";
import { Sprite } from "../../src/components/Sprite";
import { Spritesheet } from "../../src/components/Spritesheet";
import { Player } from "../Game Objects/Player";

export class Game extends Scene {
  renderer = GameRenderer;
  renderState = RenderState;
  hero: HTMLImageElement | undefined;
  mapUpper: HTMLImageElement | undefined;
  mapLower: HTMLImageElement | undefined;
  shadow: HTMLImageElement | undefined;
  bookcase: HTMLImageElement | undefined;
  counter: HTMLImageElement | undefined;

  public template = `<scene-layer class="scene" style="width: 100%; height: 100%; position: absolute; top: 0; left:0; color: white;">
    ${this.renderer.template}
  </scene-layer>`;

  public async init() {
    //Loading Assets
    Assets.initialize({ src: "./content/Assets/" });
    await Assets.load(["lower.png", "DemoUpper.png", "hero.png", "shadow.png", "counter.png", "bookshelf.png"]);
    this.shadow = Assets.image("shadow");
    this.mapUpper = Assets.image("DemoUpper");
    this.mapLower = Assets.image("lower");
    this.hero = Assets.image("hero");
    this.bookcase = Assets.image("bookshelf");
    this.counter = Assets.image("counter");

    InputManager.register({
      Keyboard: {
        ArrowLeft: {
          name: "leftA",
          callback: this.leftArrow,
          options: {
            repeat: false,
          },
        },
        ArrowRight: {
          name: "rightA",
          callback: this.rightArrow,
          options: {
            repeat: false,
          },
        },
        ArrowUp: {
          name: "upA",
          callback: this.upArrow,
          options: {
            repeat: false,
          },
        },
        ArrowDown: {
          name: "downA",
          callback: this.downArrow,
          options: {
            repeat: false,
          },
        },
        release: {
          callback: this.releasedKey,
        },
      },
      Touch: {},
      Mouse: {},
      Gamepad: {},
    });
    this.renderer.initialize(this.renderState, 2, { width: 400, aspectratio: 3 / 2 });

    //load maps
    const mapconfig: Array<MapConfig> = [
      {
        name: "kitchen",
        width: 192,
        height: 192,
        layers: [this.mapLower.src, this.mapUpper.src],
        walls: [],
        triggers: [],
      },
    ];
    this.renderer.createMap(mapconfig);
    this.renderer.changeMap("kitchen");

    //load objects

    let objConfig: Array<GameObjectConfig | GameObject> = [
      new Player(Assets),
      {
        name: "Counter1",
        initX: 112,
        initY: 96,
        width: 32,
        height: 32,
        sprites: [new Sprite(this.counter.src)],
      },
      {
        name: "Bookshelf1",
        initX: 48,
        initY: 48,
        width: 32,
        height: 26,
        sprites: [new Sprite(this.bookcase.src)],
      },
    ];
    this.renderer.createObject(objConfig);

    //start your engines!!!!
    this.renderer.cameraFollow("Player");
    this.renderer.engineStart();
  }
  public exit() {}

  leftArrow() {}
  rightArrow() {}
  upArrow() {}
  downArrow() {}
  releasedKey() {}
}

//
