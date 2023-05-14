import { Scene } from "../../src/components/SceneManager";
import { State, States } from "@peasy-lib/peasy-states";
export class Login extends Scene {
  name: string = "Login";
  public template = `<div class="scene" style="width: 100%; height: 100%; position: absolute; top: 0; left:0; color: white;">
  <div style="position:absolute; top:50%; left: 50%; transform: translate(-50%,-50%); font-size: xx-large;">Login</div>
  </div>`;

  public init() {
    //do this on entry
    console.log("Login");
  }
}
