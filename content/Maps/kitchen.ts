import { GameMap, MapConfig } from "../../src/components/MapManager";

export class Kitchen extends GameMap {
  constructor(assets: any) {
    let config: MapConfig = {
      name: "kitchen",
      width: 192,
      height: 192,
      layers: [assets.image("lower").src, assets.image("DemoUpper").src],
      walls: [
        {
          x: 10,
          y: 64,
          w: 5,
          h: 96,
          color: "red",
        },
        {
          x: 10,
          y: 162,
          w: 66,
          h: 14,
          color: "red",
        },
        {
          x: 100,
          y: 162,
          w: 75,
          h: 14,
          color: "red",
        },
        {
          x: 175,
          y: 64,
          w: 5,
          h: 96,
          color: "red",
        },
        {
          x: 78,
          y: 178,
          w: 18,
          h: 5,
          color: "red",
        },
        {
          x: 144,
          y: 55,
          w: 30,
          h: 5,
          color: "red",
        },
        {
          x: 130,
          y: 36,
          w: 10,
          h: 42,
          color: "red",
        },
        {
          x: 98,
          y: 36,
          w: 10,
          h: 42,
          color: "red",
        },
        {
          x: 110,
          y: 36,
          w: 18,
          h: 5,
          color: "red",
        },
        {
          x: 16,
          y: 55,
          w: 76,
          h: 5,
          color: "red",
        },
      ],
      triggers: [],
    };
    super(config);
  }
}
