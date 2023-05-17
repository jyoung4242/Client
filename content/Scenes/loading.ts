import { Scene } from "../../src/components/SceneManager";
import { Assets } from "@peasy-lib/peasy-assets";
import { Spritesheet, AnimationSequence } from "../../src/components/Spritesheet";
import { SFX } from "../../src/components/Sound API";

export class Loading extends Scene {
  scenestate = {
    earthSrc: "",
    earthAnimationBinding: "0px 0px",
    playSound: () => {
      this.sfx.play("snort");
    },
  };
  animationHandler: any;
  sfx: any;

  public template = `<div class="scene" style="width: 100%; height: 100%; position: absolute; top: 0; left:0; color: white;">
    <div style=" width: 64px; height: 64px; position: absolute; top: 25px; left:25px; background-image: url(\${scenestate.earthSrc}); background-position: \${scenestate.earthAnimationBinding};" ></div>
    <div style="display: flex; flex-direction: column; justify-content: center;align-items: center; position:absolute; top:50%; left: 50%; transform: translate(-50%,-50%); font-size: medium;">
      <label for="file">Downloading:</label>
      <progress id="file" value="32" max="100"> 32% </progress>
      <button \${click @=> scenestate.playSound}>Play Sound</button>
    </div>
  </div>`;

  public async init() {
    //Loading Assets
    Assets.initialize({ src: "./content/Assets/" });
    await Assets.load(["skyrim.png", "earth.png", "snort.wav"]);
    this.scenestate.earthSrc = Assets.image("earth").src;

    //earth animation
    let tempSpritesheet = new Spritesheet(this.scenestate.earthSrc, 256, 16, 16, 64, 64);
    tempSpritesheet.initialize();
    this.animationHandler = new AnimationSequence(tempSpritesheet, this.earthAnimHandler, null, 75);
    this.animationHandler.startAnimation();

    //register sounds
    this.sfx = SFX;
    let rslt = this.sfx.register({ name: "snort", src: Assets.audio("snort").src });
    console.log("sounds", rslt);
  }

  earthAnimHandler = () => (this.scenestate.earthAnimationBinding = this.animationHandler.getFrameDetails());
}
