import { GameObject, GameObjectConfig } from "../../src/components/GameObject";
import { Sprite } from "../../src/components/Sprite";
import { InputManager } from "../../src/components/InputManager";
import { Spritesheet, AnimationSequence } from "../../src/components/Spritesheet";
import { State, States } from "@peasy-lib/peasy-states";

export class Player extends GameObject {
  animationHandler;
  isMoving: boolean = false;
  direction: "up" | "down" | "left" | "right" = "down";
  walkingstates = new WalkingStates();
  demosequence = {
    "walk-up": [8, 9, 10, 11],
    "walk-down": [0, 1, 2, 3],
    "walk-left": [12, 13, 14, 15],
    "walk-right": [4, 5, 6, 7],
    "idle-down": [0],
    "idle-up": [8],
    "idle-left": [12],
    "idle-right": [4],
  };

  constructor(assets: any) {
    let heroSpritesheet = new Spritesheet(assets.image("hero").src, 16, 4, 4, 32, 32);
    heroSpritesheet.initialize();

    let config: GameObjectConfig = {
      name: "Player",
      initX: 32,
      initY: 78,
      width: 32,
      height: 32,
      sprites: [new Sprite(assets.image("shadow").src), heroSpritesheet],
    };
    super(config);
    this.animationHandler = new AnimationSequence(heroSpritesheet, this.animationUpdate, this.demosequence, 150);
    this.animationHandler.changeSequence("idle-down");
    this.walkingstates.register(isWalking, isIdle);
    this.walkingstates.set(isIdle, performance.now(), "down", "idle-down", this);

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
        " ": {
          name: "space",
          callback: this.interact,
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
  }

  animationUpdate = () => {
    this.spriteLayers[1].animationBinding = this.animationHandler.getFrameDetails();
  };
  update(deltaTime: number): void {}
  physicsUpdate(deltaTime: number): void {}

  leftArrow = () => {
    this.walkingstates.set(isWalking, performance.now(), "left", "walk-left", this);
    /*  if (this.animationHandler.currentSequence != "walk-left") this.animationHandler.changeSequence("walk-left", 0);
    this.direction = "left";
    if (!this.isMoving) this.animationHandler.startAnimation();
    this.isMoving = true; */
  };
  rightArrow = () => {
    this.walkingstates.set(isWalking, performance.now(), "right", "walk-right", this);
  };
  upArrow = () => {
    this.walkingstates.set(isWalking, performance.now(), "up", "walk-up", this);
  };
  downArrow = () => {
    this.walkingstates.set(isWalking, performance.now(), "down", "walk-down", this);
  };
  releasedKey = () => {
    this.walkingstates.set(isIdle, performance.now(), this.direction, `idle-${this.direction}`, this);
  };
  interact = () => {
    console.log("space pressed");
  };
}

class WalkingStates extends States {}

class isWalking extends State {
  enter(_previous: State | null, ...params: any): void | Promise<void> {
    let newDirection = params[0];
    let newSequence = params[1];
    let parentClass = params[2];

    if (parentClass.direction != newDirection) {
      parentClass.animationHandler.changeSequence(newSequence, 0);
      parentClass.direction = newDirection;
      if (!parentClass.isMoving) parentClass.animationHandler.startAnimation();
      parentClass.isMoving = true;
    }
  }
  exit() {}
}
class isIdle extends State {
  enter(_previous: State | null, ...params: any): void | Promise<void> {
    let parentClass = params[2];
    if (parentClass.isMoving) {
      parentClass.isMoving = false;
      switch (parentClass.direction) {
        case "down":
          parentClass.animationHandler.changeSequence("idle-down", 0);
          break;
        case "left":
          parentClass.animationHandler.changeSequence("idle-left", 0);
          break;
        case "up":
          parentClass.animationHandler.changeSequence("idle-up", 0);
          break;
        case "right":
          parentClass.animationHandler.changeSequence("idle-right", 0);
          break;
      }
      parentClass.animationHandler.updateFrame();
      parentClass.animationHandler.pauseAnimation();
    }
  }
  exit() {}
}
