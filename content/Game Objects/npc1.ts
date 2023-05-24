import { GameObject, GameObjectConfig } from "../../src/components/GameObject";
import { Sprite } from "../../src/components/Sprite";
import { Spritesheet } from "../../src/components/Spritesheet";

export class NPC1 extends GameObject {
  constructor(assets: any) {
    let npcSpritesheet = new Spritesheet(assets.image("npc2").src, 16, 4, 4, 32, 32);
    npcSpritesheet.initialize();

    let config: GameObjectConfig = {
      name: "NPC1",
      initX: 70,
      initY: 90,
      width: 32,
      height: 32,
      sprites: [new Sprite(assets.image("shadow").src), npcSpritesheet],
      collisionBody: {
        width: 14,
        height: 6,
        offsetX: 8,
        offsetY: 24,
        color: "blue",
      },
    };
    super(config);
  }
}
