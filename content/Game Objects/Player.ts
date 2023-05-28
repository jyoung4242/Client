import { GameObject, GameObjectConfig } from "../../src/components/GameObject";
import { Sprite } from "../../src/components/Sprite";
import { InputManager } from "../../src/components/InputManager";
import { Spritesheet, AnimationSequence } from "../../src/components/Spritesheet";
import { State, States } from "@peasy-lib/peasy-states";
import { CollisionManager, direction } from "../../src/components/CollisionManager";
import { GameMap, MapLayer, collisionBody } from "../../src/components/MapManager";
import { EventManager } from "../../src/components/EventManager";

const MAX_WALKING_SPEED = 1.5;

export class Player extends GameObject {
  collisionbodyoffsetX = 0;
  collisions = new CollisionManager();
  cutscenes;
  animationHandler;
  isMoving: boolean = false;
  isCutscenePlaying = false;
  direction: direction = "down";
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
      startingMap: "kitchen",
      initX: 32,
      initY: 78,
      width: 32,
      height: 32,
      sprites: [new Sprite(assets.image("shadow").src), heroSpritesheet],
      collisionBody: {
        width: 14,
        height: 6,
        offsetX: 8,
        offsetY: 24,
        color: "blue",
      },
    };
    super(config);
    this.cutscenes = new EventManager(this, "CUTSCENE");
    this.isPlayable = true;
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

  animationUpdate = () => (this.spriteLayers[1].animationBinding = this.animationHandler.getFrameDetails());

  update(deltaTime: number, objects: Array<GameObject>, currentMap: GameMap): boolean {
    return true;
  }

  physicsUpdate(deltaTime: number, objects: Array<GameObject>, currentMap: GameMap): boolean {
    //check for object/object collisions
    //filter playable characters out
    if (!currentMap) return true;
    let otherObjects = objects.filter(oo => {
      return this.id != oo.id && oo.currentMap == currentMap.name;
    });
    this.collisionDirections = [];

    /***********************************
     *  object/object collision check
     * ******************************* */
    otherObjects.forEach(o => {
      o.collisionLayers.forEach(cl => {
        let colResult = this.collisions.isObjectColliding({ w: cl.w, h: cl.h, x: cl.x + o.xPos, y: cl.y + o.yPos }, this);
        this.isColliding = colResult.status;
        this.collisionDirections.push(...colResult.collisionDirection);
      });
    });

    /***********************************
     * wall/object collision check
     * ******************************* */
    if (currentMap) {
      currentMap.layers.forEach(ml => {
        ml.wallLayers.forEach(wl => {
          let colResult = this.collisions.isObjectColliding(
            { w: wl.w, h: wl.h, x: wl.x + ml.xPos, y: wl.y + ml.yPos },
            this
          );
          this.isColliding = colResult.status;
          this.collisionDirections.push(...colResult.collisionDirection);
        });
      });
    }

    /***********************************
     * trigger/object collision check
     * ******************************* */
    if (currentMap && !this.isCutscenePlaying) {
      currentMap.layers.forEach(ml => {
        ml.triggerLayers.forEach(async tl => {
          let colResult = this.collisions.isObjectColliding(
            { w: tl.w, h: tl.h, x: tl.x + ml.xPos, y: tl.y + ml.yPos, actions: tl.actions },
            this
          );
          if (colResult.status == true) {
            //trigger Map Action
            //look up actions on layer

            if (colResult.actions) {
              //console.log("found actions");
              //console.log(colResult.actions);

              this.cutscenes.loadSequence(colResult.actions);
              this.isCutscenePlaying = true;
              await this.cutscenes.start();
              this.isCutscenePlaying = false;
            }
          }
        });
      });
    }

    if (this.isMoving && !this.isCutscenePlaying) {
      switch (this.direction) {
        case "down":
          if (!this.isDirectionInArray("down")) this.yPos += MAX_WALKING_SPEED;
          break;
        case "up":
          if (!this.isDirectionInArray("up")) this.yPos -= MAX_WALKING_SPEED;
          break;
        case "left":
          if (!this.isDirectionInArray("left")) this.xPos -= MAX_WALKING_SPEED;
          break;
        case "right":
          if (!this.isDirectionInArray("right")) this.xPos += MAX_WALKING_SPEED;
          break;
      }
    }
    return true;
  }

  leftArrow = () => {
    this.walkingstates.set(isWalking, performance.now(), "left", "walk-left", this);
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

  isDirectionInArray(dir: string): boolean {
    return this.collisionDirections.find(d => d == dir) != undefined;
  }
}

class WalkingStates extends States {}
class isWalking extends State {
  enter(_previous: State | null, ...params: any): void | Promise<void> {
    let newDirection = params[0];
    let newSequence = params[1];
    let parentClass = params[2];
    if (parentClass.direction != newDirection) parentClass.direction = newDirection;
    parentClass.animationHandler.changeSequence(newSequence, 0);
    if (!parentClass.isMoving) parentClass.animationHandler.startAnimation();
    parentClass.isMoving = true;
  }
  exit() {}
}
class isIdle extends State {
  enter(_previous: State | null, ...params: any): void | Promise<void> {
    let parentClass = params[2];
    if (parentClass.isMoving) {
      parentClass.isMoving = false;
      parentClass.animationHandler.changeSequence(`idle-${parentClass.direction}`, 0);
      parentClass.animationHandler.updateFrame();
      parentClass.animationHandler.pauseAnimation();
    }
  }
  exit() {}
}
