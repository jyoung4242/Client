import { Scene } from "../../src/components/SceneManager";
import { Camera } from "../../src/components/Camera";

export class Game extends Scene {
  public template = `<div class="scene" style="width: 100%; height: 100%; position: absolute; top: 0; left:0; color: white;">
      ${Camera.template}
  </div>`;

  public init() {
    //do this on entry
    console.log("Game");
  }
}

//
