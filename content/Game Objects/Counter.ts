import { GameObject, GameObjectConfig } from "../../src/components/GameObject";
import { Sprite } from "../../src/components/Sprite";

export class Counter extends GameObject {
  constructor(assets: any) {
    let config: GameObjectConfig = {
      name: "Counter",
      initX: 112,
      initY: 96,
      width: 32,
      height: 32,
      sprites: [new Sprite(assets.image("counter").src)],
      collisionBody: {
        width: 26,
        height: 26,
        offsetX: 3,
        offsetY: 10,
        color: "red",
        isVisible: false,
      },
    };
    super(config);

    this.collisionBody.width = 26;
    this.collisionBody.height = 26;
    this.collisionBody.offsetX = 3;
    this.collisionBody.offsetY = 10;
  }

  update(): boolean {
    return true;
  }
  physicsUpdate(): boolean {
    return true;
  }
}
