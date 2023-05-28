import { GameMap, MapConfig } from "../../src/components/MapManager";

export class OutsideMap extends GameMap {
  constructor(assets: any) {
    let config: MapConfig = {
      name: "outside",
      width: 256,
      height: 288,
      layers: [assets.image("outsideLower").src, assets.image("outsideUpper").src],
      walls: [],
      triggers: [],
    };
    super(config);
  }
}
