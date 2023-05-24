import { Engine } from "@peasy-lib/peasy-engine";
import { Camera } from "./Camera";
import { GameObjectConfig, GameObject } from "./GameObject";
import { MapConfig, GameMap, MapLayer } from "./MapManager";

export type renderType = Array<MapLayer | GameObject>;
export const RenderState = {
  camera: Camera,
  viewport: {
    width: 400,
    height: 3 / 2,
  },
  physics: {
    canvas: undefined,
    ctx: <CanvasRenderingContext2D | null>null,
  },
  gameObjects: {
    objects: [] as GameObject[],
  },
  maps: {
    currentMap: "",
    get getCurrentMap() {
      const mapIndex = this.maps.findIndex(m => m.name == this.currentMap);

      return this.maps[mapIndex];
    },
    maps: [] as GameMap[],
  },
  overlays: {
    isCollisionBodiesVisible: false,
    isWallsVisible: false,
    isTriggersVisible: false,
  },
  renderedObjects: <renderType>[],
};

//this will control Camera, Maps, and gameObjects
export class GameRenderer {
  static objectRenderOrder: number;
  static renderEngine: Engine;
  static physicsEngine: Engine;
  static state: typeof RenderState;

  static template = `
        <style>
        camera-static{
            position: absolute;
            top: 0;
            left:0;
            width: 100%;
            height: 100%;
        }
        camera-layer{
            position: relative:
            top: 0;
            left:0;
            width: 100%;
            height: 100%;
            image-rendering: pixelated;
        }

        camera-flash{
            position: absolute;
            top: 0;
            left:0;
            width: 100%;
            height: 100%;
        }
        .map, .gameObject, .object_sprite{
            top:0;
            left:0;
            position:absolute;
            display:block;
            background-repeat: no-repeat;
        }
        .object-sprite{
          position: absolute;
        }
        .border-box{
          position: absolute;
        }
        .canvas{
          width:100%;
          height:100%;
          z-index: 999999;
        }
       
        </style>
        <camera-static style="transform: translate(\${renderState.camera.xPos}px,\${renderState.camera.yPos}px);">
            <camera-layer>
                <camera-flash></camera-flash>
                <render-object id="\${obj.id}" data-type="\${obj.name}" class="\${obj.class}" style="transform: translate3d(\${obj.xPos}px, \${obj.yPos}px, 0px);z-index: \${obj.zIndex}; width: \${obj.width}px;height: \${obj.height}px;background-image:url('\${obj.src}');" \${obj<=*renderState.renderedObjects:id}>
                  <render-inner style="position: relative; width: 100%; height: 100%, top:0px; left: 0px">
                    <sprite-layer class="object_sprite" \${sl<=*obj.spriteLayers} style="z-index: \${sl.zIndex}; width: \${sl.width}px;height: \${sl.height}px;background-image:url('\${sl.src}');background-position: \${sl.animationBinding};"></sprite-layer>
                    <collision-layers \${===obj.isCollisionLayersVisible}>
                      <border-box class="border-box"  \${cl<=*obj.collisionLayers}  style="z-index: 9999;border: 1px solid \${cl.color}; top: \${cl.y}px; left:\${cl.x}px; width: \${cl.w}px; height: \${cl.h}px;"></border-box>
                      <trigger-box class="border-box"  \${tl<=*obj.triggerLayers} style="z-index: 9999;border: 1px solid \${tl.color}; top: \${tl.y}px; left:\${tl.x}px; width: \${tl.w}px; height: \${tl.h}px;"></trigger-box>
                      <wall-box class="border-box"  \${wl<=*obj.wallLayers} style="z-index: 9999;border: 1px solid \${wl.color}; top: \${wl.y}px; left:\${wl.x}px; width: \${wl.w}px; height: \${wl.h}px;"></wall-box>
                    </collision-layers>
                    </render-inner>
                </render-object>
            </camera-layer>
        </camera-static>
        <canvas \${==> renderState.physics.canvas}></canvas>
    `;

  /*
   
  \${===cl.isVisible}\${===tl.isVisible}\${===wl.isVisible}
    */

  static initialize(
    state: typeof RenderState,
    objectRenderOrder: number,
    viweportsize: { width: number; aspectratio: number }
  ) {
    GameRenderer.state = state;
    GameRenderer.state.viewport.width = viweportsize.width;
    GameRenderer.state.viewport.height = viweportsize.width * (1 / viweportsize.aspectratio);
    GameRenderer.objectRenderOrder = objectRenderOrder;
    GameRenderer.physicsEngine = Engine.create({ callback: GameRenderer.physicsLoop, fps: 30, started: false });
    GameRenderer.renderEngine = Engine.create({ callback: GameRenderer.renderLoop, fps: 60, started: false });

    RenderState.camera.initialize(RenderState.viewport.width, RenderState.viewport.height);
    if (RenderState.physics.canvas) {
      RenderState.physics.ctx = (RenderState.physics.canvas as HTMLCanvasElement).getContext("2d");
      (RenderState.physics.canvas as HTMLCanvasElement).width = GameRenderer.state.viewport.width;
      (RenderState.physics.canvas as HTMLCanvasElement).height = GameRenderer.state.viewport.height;
    }
  }

  //#region Objects
  static createObject(config: Array<GameObjectConfig | GameObject>) {
    config.forEach(cfg => {
      let entity;
      if (cfg instanceof GameObject) entity = cfg;
      else entity = GameObject.create(cfg);
      GameRenderer.state.gameObjects.objects.push(entity);
    });
  }

  static destroyObject(id: string) {}

  //#endregion

  //#region Maps

  static createMap(config: Array<MapConfig | GameMap>) {
    config.forEach(cfg => {
      if (cfg instanceof GameMap) GameRenderer.state.maps.maps.push(cfg);
      else GameRenderer.state.maps.maps.push(GameMap.create(cfg));
    });
  }
  static destroyMap(id: string) {}
  static changeMap(name: string) {
    GameRenderer.state.maps.currentMap = name;
  }

  //#endregion

  //#region Engine

  static enginePause(engine?: string) {
    if (engine == "physics") GameRenderer.physicsEngine.pause();
    if (engine == "renderer") GameRenderer.renderEngine.pause();
    else {
      GameRenderer.physicsEngine.pause();
      GameRenderer.renderEngine.pause();
    }
  }
  static engineStart(engine?: string) {
    if (engine == "physics") GameRenderer.physicsEngine.start();
    if (engine == "renderer") GameRenderer.renderEngine.start();
    else {
      GameRenderer.physicsEngine.start();
      GameRenderer.renderEngine.start();
    }
  }

  static renderLoop(deltaTime: number, now: number) {
    GameRenderer.state.renderedObjects.length = 0;
    GameRenderer.state.gameObjects.objects.forEach(obj => obj.update(deltaTime));

    //build out rendered objects for dom rendering
    //MAPS FIRST
    let numGameObjects = GameRenderer.state.gameObjects.objects.length;
    let numMapLayers = GameRenderer.state.maps.getCurrentMap.layers.length;

    for (let index = 0; index < numMapLayers; index++) {
      if (index >= GameRenderer.objectRenderOrder - 1) {
        GameRenderer.state.maps.getCurrentMap.layers[index].zIndex = index + numGameObjects + 1;
      } else GameRenderer.state.maps.getCurrentMap.layers[index].zIndex = index + 1;
      GameRenderer.state.renderedObjects.push(GameRenderer.state.maps.getCurrentMap.layers[index]);
    }
    //OBJECTS LAST
    //sort objects by ypos

    GameRenderer.state.gameObjects.objects.sort(function (a, b) {
      return b.collisionLayers[0].y + b.yPos - (a.collisionLayers[0].y + a.yPos);
    });

    for (let index = numGameObjects; index > 0; index--) {
      GameRenderer.state.gameObjects.objects[index - 1].zIndex = GameRenderer.objectRenderOrder + 1;
      GameRenderer.state.renderedObjects.push(GameRenderer.state.gameObjects.objects[index - 1]);
    }
    GameRenderer.state.camera.update();
  }
  static physicsLoop(deltaTime: number, now: number) {
    GameRenderer.state.gameObjects.objects.forEach(obj =>
      obj.physicsUpdate(deltaTime, GameRenderer.state.gameObjects.objects)
    );
  }
  //#endregion

  //#region Camera
  static cameraFollow(who: string) {
    //find GameObject with name
    const goIndex = RenderState.gameObjects.objects.findIndex(go => go.name == who);
    if (goIndex != -1) RenderState.camera.follow(RenderState.gameObjects.objects[goIndex]);
  }

  static showCollisionBodies(visible: boolean) {
    RenderState.gameObjects.objects.forEach(o => (o.isCollisionLayersVisible = visible));
    RenderState.maps.maps.forEach(m => m.layers.forEach(ml => (ml.isCollisionLayersVisible = visible)));
  }

  //#endregion
}
