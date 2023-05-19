import { v4 as uuidv4 } from "uuid";
import { Spritesheet } from "./Spritesheet";
import { Sprite } from "./Sprite";
import { Game } from "../../content/Scenes/game";

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
  };
};

export class GameObject {
  xPos: number;
  yPos: number;
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
  };

  constructor(config: GameObjectConfig) {
    this.name = config.name;
    this.id = uuidv4();
    this.zIndex = 0;
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

  update() {}
  physicsUpdate() {}
}
