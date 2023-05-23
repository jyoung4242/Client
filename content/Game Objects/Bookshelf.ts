import { GameObject, GameObjectConfig } from "../../src/components/GameObject";
import { Sprite } from "../../src/components/Sprite";

export class Bookshelf extends GameObject {
  constructor(assets: any) {
    let config: GameObjectConfig = {
      name: "Bookshelf",
      initX: 48,
      initY: 48,
      width: 32,
      height: 26,
      sprites: [new Sprite(assets.image("bookshelf").src)],
      collisionBody: {
        width: 20,
        height: 10,
        offsetX: 6,
        offsetY: 16,
        color: "yellow",
        isVisible: false,
      },
    };
    super(config);

    /* this.collisionBody.width = 20;
    this.collisionBody.height = 10;
    this.collisionBody.offsetX = 6;
    this.collisionBody.offsetY = 16; */
  }

  update(): boolean {
    return true;
  }
  physicsUpdate(): boolean {
    return true;
  }
}
