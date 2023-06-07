import { Scene } from "../../src/components/SceneManager";
import { Assets } from "@peasy-lib/peasy-assets";
import { InputManager } from "../../src/components/InputManager";
import { Spritesheet, AnimationSequence } from "../../src/components/Spritesheet";
import { SFX } from "../../src/components/Sound API";

export class Loading extends Scene {
  gamePadButtons: any;
  gamePadAxes: any;
  scenestate = {
    earthSrc: "",
    earthAnimationBinding: "0px 0px",
    playSound: () => {
      SFX.play("snort");
    },
    inputlog: "",
  };
  animationHandler: any;

  public template = `<div class="scene" style="width: 100%; height: 100%; position: absolute; top: 0; left:0; color: white;">
    <div style=" width: 64px; height: 64px; position: absolute; top: 25px; left:25px; background-image: url(\${scenestate.earthSrc}); background-position: \${scenestate.earthAnimationBinding};" ></div>
    <div style="display: flex; flex-direction: column; justify-content: center;align-items: center; position:absolute; top:50%; left: 50%; transform: translate(-50%,-50%); font-size: medium;">
      <label for="file">Downloading:</label>
      <progress id="file" value="32" max="100"> 32% </progress>
      <button \${click @=> scenestate.playSound}>Play Sound</button>
      <div style="font-size: x-small;">
        Input Log: \${scenestate.inputlog}
      </div>
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
    SFX.register({ name: "snort", src: Assets.audio("snort").src });

    InputManager.register({
      Keyboard: {
        ArrowLeft: {
          name: "leftA",
          callback: this.leftArrow,
          options: {
            repeat: false,
          },
        },
        ArrowRight: {
          name: "rightA",
          callback: this.rightArrow,
          options: {
            repeat: false,
          },
        },
        ArrowUp: {
          name: "upA",
          callback: this.upArrow,
          options: {
            repeat: false,
          },
        },
        ArrowDown: {
          name: "downA",
          callback: this.downArrow,
          options: {
            repeat: false,
          },
        },
        release: {
          callback: this.releasedKey,
        },
      },
      Touch: {},
      Mouse: {
        ViewportScaling: [
          { scalingFactor: 0.75, maxwidth: 675 },
          { scalingFactor: 1.5, maxwidth: 1100, minwidth: 675 },
          { scalingFactor: 2.5, minwidth: 1100 },
        ],
        LeftClick: {
          name: "mouseClick",
          callback: this.mouseClick,
        },
        RightClick: {
          name: "rightClick",
          callback: this.rightClick,
        },
      },
      Gamepad: {
        buttons: [
          this.crossButton,
          this.circleButton,
          this.squareButton,
          this.triangleButton,
          this.l1Button,
          this.r1Button,
          this.l2Button,
          this.r2Button,
          null,
          null,
          null,
          null,
          this.dpadUp,
          this.dpadDown,
          this.dpadLeft,
          this.dpadRight,
          null,
          null,
        ],
        axes: [
          {
            "0.75": this.leftStickRight,
            "-0.75": this.leftStickLeft,
          },
          {
            "0.75": this.leftStickDown,
            "-0.75": this.leftStickUp,
          },
          {
            "0.75": this.rightStickRight,
            "-0.75": this.rightStickLeft,
          },
          {
            "0.75": this.rightStickDown,
            "-0.75": this.rightStickUp,
          },
        ],
      },
    });
  }

  public exit() {
    //Spritesheet and AnimationSequence will do its own garbagecollection
    SFX.clear();
    Assets.clear();
    InputManager.clearMapping();
  }

  earthAnimHandler = () => (this.scenestate.earthAnimationBinding = this.animationHandler.getFrameDetails());
  leftArrow = () => {
    this.scenestate.inputlog = "left arrow pressed";
  };
  rightArrow = () => {
    this.scenestate.inputlog = "right arrow pressed";
  };
  upArrow = () => {
    this.scenestate.inputlog = "up arrow pressed";
  };
  downArrow = () => {
    this.scenestate.inputlog = "down arrow pressed";
  };
  mouseClick = (mousedata: any) => {
    console.log(mousedata);

    this.scenestate.inputlog = `scaled mouse click: x: ${mousedata.scaledX}, y: ${mousedata.scaledY}`;
  };
  rightClick = (mousedata: any) => {
    this.scenestate.inputlog = `right click:  x: ${mousedata.scaledX}, y: ${mousedata.scaledY}`;
  };
  releasedKey = () => {
    this.scenestate.inputlog = "";
  };

  //GAMEPAD CALLBACKS
  dpadLeft = () => {
    this.scenestate.inputlog = `GamePad Dpad-left`;
  };
  dpadRight = () => {
    this.scenestate.inputlog = `GamePad Dpad-right`;
  };
  dpadUp = () => {
    this.scenestate.inputlog = `GamePad Dpad-up`;
  };
  dpadDown = () => {
    this.scenestate.inputlog = `GamePad Dpad-down`;
  };
  squareButton = () => {
    this.scenestate.inputlog = `GamePad square button`;
  };
  triangleButton = () => {
    this.scenestate.inputlog = `GamePad triangle button`;
  };
  circleButton = () => {
    this.scenestate.inputlog = `GamePad circle button`;
  };
  crossButton = () => {
    this.scenestate.inputlog = `GamePad X (cross) button`;
  };
  l1Button = () => {
    this.scenestate.inputlog = `GamePad L1 button`;
  };
  l2Button = () => {
    this.scenestate.inputlog = `GamePad L2 button`;
  };
  r1Button = () => {
    this.scenestate.inputlog = `GamePad R1 button`;
  };
  r2Button = () => {
    this.scenestate.inputlog = `GamePad R2 button`;
  };

  leftStickUp = () => {
    this.scenestate.inputlog = `GamePad Left Stick Up`;
  };
  rightStickUp = () => {
    this.scenestate.inputlog = `GamePad Right Stick Up`;
  };
  leftStickDown = () => {
    this.scenestate.inputlog = `GamePad Left Stick Down`;
  };
  rightStickDown = () => {
    this.scenestate.inputlog = `GamePad Right Stick Down`;
  };
  leftStickLeft = () => {
    this.scenestate.inputlog = `GamePad Left Stick Left`;
  };
  rightStickLeft = () => {
    this.scenestate.inputlog = `GamePad Right Stick Left`;
  };
  leftStickRight = () => {
    this.scenestate.inputlog = `GamePad Left Stick Right`;
  };
  rightStickRight = () => {
    this.scenestate.inputlog = `GamePad Right Stick Right`;
  };
}
