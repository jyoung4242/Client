import { GameMap, MapConfig } from "../../src/components/MapManager";

export class Kitchen extends GameMap {
  constructor(assets: any) {
    let config: MapConfig = {
      name: "kitchen",
      width: 192,
      height: 192,
      layers: [assets.image("lower").src, assets.image("DemoUpper").src],
      walls: [],
      triggers: [],
    };
    super(config);
  }
}
