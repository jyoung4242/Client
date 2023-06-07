import { GameObject, GameObjectConfig } from "../../src/components/GameObject";
import { Sprite } from "../../src/components/Sprite";
import { StoryFlagManager } from "../../src/components/StoryFlagManager";

export class Planter extends GameObject {
  constructor(assets: any, StoryFlags: StoryFlagManager) {
    let config: GameObjectConfig = {
      name: "Planter",
      startingMap: "outside",
      initX: 128,
      initY: 128,
      width: 31,
      height: 48,
      sprites: [new Sprite(assets.image("planter").src)],
      collisionBody: {
        width: 30,
        height: 38,
        offsetX: 0,
        offsetY: 8,
        color: "cyan",
      },
    };
    super(config);
    this.SM = StoryFlags;
  }

  update(): boolean {
    return true;
  }
  physicsUpdate(): boolean {
    return true;
  }
}
