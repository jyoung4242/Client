import { Engine } from "@peasy-lib/peasy-engine";
import { Camera } from "./Camera";
import { GameObjectConfig, GameObject } from "./GameObject";
import { MapConfig, GameMap, MapLayer } from "./MapManager";
import { Physics } from "@peasy-lib/peasy-physics";

export type renderType = Array<MapLayer | GameObject>;
export const RenderState = {
  camera: Camera,
  viewport: {
    width: 400,
    height: 3 / 2,
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
       
        </style>
        <camera-static style="transform: translate(\${renderState.camera.xPos}px,\${renderState.camera.yPos}px);">
            <camera-layer>
                <camera-flash></camera-flash>
                <render-object id="\${obj.id}" data-type="\${obj.name}" class="\${obj.class}" style="transform: translate3d(\${obj.xPos}px, \${obj.yPos}px, 0px);z-index: \${obj.zIndex}; width: \${obj.width}px;height: \${obj.height}px;background-image:url('\${obj.src}');" \${obj<=*renderState.renderedObjects:id}>
                <sprite-layer class="object_sprite" \${sl<=*obj.spriteLayers} style="z-index: \${sl.zIndex}; width: \${sl.width}px;height: \${sl.height}px;background-image:url('\${sl.src}');background-position: \${sl.animationBinding};"></sprite-layer>
                </render-object>
            </camera-layer>
        </camera-static>
    `;

  static initialize(
    state: typeof RenderState,
    objectRenderOrder: number,
    viweportsize: { width: number; aspectratio: number }
  ) {
    GameRenderer.state = state;
    GameRenderer.state.viewport.width = viweportsize.width;
    GameRenderer.state.viewport.height = viweportsize.width * (1 / viweportsize.aspectratio);

    GameRenderer.objectRenderOrder = objectRenderOrder;
    GameRenderer.physicsEngine = Engine.create(GameRenderer.physicsLoop);
    GameRenderer.renderEngine = Engine.create(GameRenderer.renderLoop);
    RenderState.camera.initialize(RenderState.viewport.width, RenderState.viewport.height);
  }

  //#region Objects
  static createObject(config: Array<GameObjectConfig | GameObject>) {
    config.forEach(cfg => {
      let entity;
      if (cfg instanceof GameObject) entity = cfg;
      else entity = GameObject.create(cfg);
      GameRenderer.state.gameObjects.objects.push(entity);
      //Physics.addEntities([entity]);
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

    let numMapLayers = GameRenderer.state.maps.getCurrentMap.layers.length;
    for (let index = 0; index < numMapLayers; index++) {
      if (index >= GameRenderer.objectRenderOrder - 1) {
        GameRenderer.state.maps.getCurrentMap.layers[index].zIndex = index + 3;
      } else GameRenderer.state.maps.getCurrentMap.layers[index].zIndex = index + 1;
      GameRenderer.state.renderedObjects.push(GameRenderer.state.maps.getCurrentMap.layers[index]);
    }
    //OBJECTS LAST
    let numGameObjects = GameRenderer.state.gameObjects.objects.length;
    //console.log(numGameObjects);
    for (let index = 0; index < numGameObjects; index++) {
      //console.log("looping: ", index, GameRenderer.state.gameObjects.objects[index]);

      GameRenderer.state.gameObjects.objects[index].zIndex = GameRenderer.objectRenderOrder + 1;
      GameRenderer.state.renderedObjects.push(GameRenderer.state.gameObjects.objects[index]);
    }
    GameRenderer.state.camera.update();
  }
  static physicsLoop(deltaTime: number, now: number) {
    //@ts-ignore
    GameRenderer.state.gameObjects.objects.forEach(obj => obj.physicsUpdate(deltaTime));
    Physics.update(deltaTime, now);
  }
  //#endregion

  //#region Camera
  static cameraFollow(who: string) {
    //find GameObject with name
    const goIndex = RenderState.gameObjects.objects.findIndex(go => go.name == who);
    if (goIndex != -1) RenderState.camera.follow(RenderState.gameObjects.objects[goIndex]);
  }
  //#endregion
}

/*

<map-layer id="map1" style="width:192px;height:192px;background-image: url('../../content/Assets/DemoLower.png');"></map-layer>
                <object-layer id="object1" style="width:32px;height:32px; transform: translate(50px,125px); ">
                    <sprite-layers>
                        <sprite-layer style="background-image: url('../../content/Assets/shadow.png');"></sprite-layer>    
                        <sprite-layer style="background-image: url('../../content/Assets/hero.png');"></sprite-layer>
                    </sprite-layers>
                </object-layer>
                <map-layer id="map2" style="width:192px;height:192px;background-image: url('../../content/Assets/DemoUpper.png');"></map-layer>


*/
