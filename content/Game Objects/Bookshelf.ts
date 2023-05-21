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
    };
    super(config);
  }

  update(): void {}
  physicsUpdate(): void {}
}
