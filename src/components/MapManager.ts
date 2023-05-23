import { v4 as uuidv4 } from "uuid";
export type MapConfig = {
  name: string;
  width: number;
  height: number;
  layers: string[];
  walls: [];
  triggers: [];
};

export type MapLayer = {
  name: string;
  id: string;
  class: string;
  width: number;
  height: number;
  src: string;
  zIndex: number;
  xPos: number;
  yPos: number;
};

export class GameMap {
  id: string;
  name: string;
  width: number;
  height: number;
  spriteLayers = [];
  layers: Array<MapLayer> = [];
  walls: [];
  triggers: [];
  collisionBody = {
    width: 0,
    height: 0,
    offsetX: 0,
    offsetY: 0,
    color: "red",
    isVisible: false,
  }; //not used in this object
  constructor(config: MapConfig) {
    this.id = uuidv4();
    this.name = config.name;
    this.width = config.width;
    this.height = config.height;
    this.walls = [...config.walls];
    this.triggers = [...config.triggers];
    config.layers.forEach((lyr, index) => {
      this.layers.push({
        id: uuidv4(),
        name: this.name,
        class: "map",
        width: this.width,
        height: this.height,
        src: lyr,
        zIndex: index + 1,
        xPos: 0,
        yPos: 0,
      });
    });
  }

  static create(config: MapConfig) {
    return new GameMap(config);
  }
}
