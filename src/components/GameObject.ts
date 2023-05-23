import { v4 as uuidv4 } from "uuid";
import { Spritesheet } from "./Spritesheet";
import { Sprite } from "./Sprite";
import { direction } from "./CollisionManager";

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
  collisionBody = {
    width: 0,
    height: 0,
    offsetX: 0,
    offsetY: 0,
    color: "red",
    isVisible: false,
  };

  constructor(config: GameObjectConfig) {
    this.name = config.name;
    this.id = uuidv4();
    this.zIndex = 2;
    this.height = config.height;
    this.width = config.width;
    this.spriteLayers = [...config.sprites];
    this.xPos = config.initX;
    this.yPos = config.initY;
    if (config.collisionBody) Object.assign(this.collisionBody, config.collisionBody);
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
