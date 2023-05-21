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
    };
    super(config);
  }

  update(): void {}
  physicsUpdate(): void {}
}
