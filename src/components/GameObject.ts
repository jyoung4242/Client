import { v4 as uuidv4 } from "uuid";
import { Spritesheet } from "./Spritesheet";
import { Sprite } from "./Sprite";
import { direction } from "./CollisionManager";
import { collisionBody } from "./MapManager";

export type spriteLayer = Array<Sprite | Spritesheet>;

export type GameObjectConfig = {
  name: string;
  initX: number;
  initY: number;
  sprites: Array<Sprite | Spritesheet>;
  height: number;
  width: number;
  collisionBody?: {
    width: number;
    height: number;
    offsetX: number;
    offsetY: number;
    color: string;
    isVisible: boolean;
  };
};

export class GameObject {
  xPos = 0;
  yPos = 0;
  isPlayable: boolean = false;
  isColliding: boolean = false;
  collisionDirections: Array<direction> = [];
  velocity = { x: 0, y: 0 };
  id: string;
  name: string;
  zIndex: number;
  width: number;
  height: number;
  class = "gameObject";
  spriteLayers: spriteLayer = [];
  collisionLayers: Array<collisionBody> = [];
  wallLayers = []; //not used in Gameobjects
  triggerLayers = []; //not used in Gameobjects
  collisionBodyWidth = 0;
  collisionBodyHeight = 0;
  collisionBodyOffsetX = 0;
  collisionBodyOffsetY = 0;
  collisionBodyColor = "green";
  collisionBodyIsVisible = false;

  constructor(config: GameObjectConfig) {
    this.name = config.name;
    this.id = uuidv4();
    this.zIndex = 2;
    this.height = config.height;
    this.width = config.width;
    this.spriteLayers = [...config.sprites];
    this.xPos = config.initX;
    this.yPos = config.initY;
    if (config.collisionBody) {
      this.collisionLayers.push({
        w: config.collisionBody.width,
        h: config.collisionBody.height,
        x: config.collisionBody.offsetX,
        y: config.collisionBody.offsetY,
        color: config.collisionBody.color,
      });
    }
    /*  if (config.collisionBody) {
      this.collisionBodyWidth = config.collisionBody.width;
      this.collisionBodyHeight = config.collisionBody.height;
      this.collisionBodyOffsetX = config.collisionBody.offsetX;
      this.collisionBodyOffsetY = config.collisionBody.offsetY;
      this.collisionBodyColor = config.collisionBody.color;
      this.collisionBodyIsVisible = config.collisionBody.isVisible;
    } */
  }

  static create(config: GameObjectConfig) {
    return new GameObject(config);
  }

  update(deltaTime: number): boolean {
    return true;
  }
  physicsUpdate(deltaTime: number, objects: Array<GameObject>): boolean {
    return true;
  }
}
