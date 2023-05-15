import { Scene } from "../../src/components/SceneManager";
import { AssetManager } from "../../src/components/AssetPool";

export class Loading extends Scene {
  public template = `<div class="scene" style="width: 100%; height: 100%; position: absolute; top: 0; left:0; color: white;">
    <div style="display: flex; flex-direction: column; justify-content: center;align-items: center; position:absolute; top:50%; left: 50%; transform: translate(-50%,-50%); font-size: medium;">
        <label for="file">Downloading:</label>
        <progress id="file" value="32" max="100"> 32% </progress>
    </div>
  </div>`;

  public init() {
    //do this on entry
    console.log("Loading");
  }
}
