import { Assets } from "@peasy-lib/peasy-assets";
import { GameObject, GameObjectConfig } from "../../src/components/GameObject";
import { Sprite } from "../../src/components/Sprite";

export class Player extends GameObject {
  constructor(assets: any) {
    let config: GameObjectConfig = {
      name: "Player",
      initX: 32,
      initY: 78,
      width: 32,
      height: 32,
      sprites: [new Sprite(assets.image("shadow").src), new Sprite(assets.image("hero").src)],
    };
    super(config);
  }

  update(): void {}
  physicsUpdate(): void {}
}
