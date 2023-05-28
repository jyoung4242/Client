import { GameObject, GameObjectConfig } from "../../src/components/GameObject";
import { Sprite } from "../../src/components/Sprite";

export class Bookshelf extends GameObject {
  constructor(assets: any) {
    let config: GameObjectConfig = {
      name: "Bookshelf",
      startingMap: "kitchen",
      initX: 48,
      initY: 48,
      width: 32,
      height: 26,
      sprites: [new Sprite(assets.image("bookshelf").src)],
      collisionBody: {
        width: 30,
        height: 10,
        offsetX: 0,
        offsetY: 16,
        color: "cyan",
      },
    };
    super(config);
  }

  update(): boolean {
    return true;
  }
  physicsUpdate(): boolean {
    return true;
  }
}
