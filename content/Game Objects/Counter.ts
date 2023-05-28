import { GameObject, GameObjectConfig } from "../../src/components/GameObject";
import { Sprite } from "../../src/components/Sprite";

export class Counter extends GameObject {
  constructor(assets: any) {
    let config: GameObjectConfig = {
      name: "Counter",
      startingMap: "kitchen",
      initX: 112,
      initY: 96,
      width: 32,
      height: 32,
      sprites: [new Sprite(assets.image("counter").src)],
      collisionBody: {
        width: 30,
        height: 24,
        offsetX: 0,
        offsetY: 6,
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
