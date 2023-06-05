import { Input } from "@peasy-lib/peasy-input";

export class InputManager {
  static keys: any;
  static mice: any;
  static eventLs: any = [];
  static scalingFactor: number = 1;
  static breakpoints: any = {};

  static register(mapping: any) {
    if (mapping.Keyboard) InputManager.mapKeyBoard(mapping.Keyboard);
    if (mapping.Mouse) {
      InputManager.mapMouseEvents(mapping.Mouse);
      InputManager.setViewportScaling(mapping.Mouse.ViewportScaling);
    }
  }

  static setViewportScaling(breakpoints?: any) {
    if (breakpoints == undefined) return;

    Object.assign(InputManager.breakpoints, breakpoints);
    const screenWidth = window.innerWidth;

    Object.keys(InputManager.breakpoints).forEach(bp => {
      let mbp = InputManager.breakpoints;
      if (mbp[bp].maxwidth && mbp[bp].minwidth) {
        if (screenWidth <= mbp[bp].maxwidth && screenWidth >= mbp[bp].minwidth) {
          InputManager.scalingFactor = mbp[bp].scalingFactor;
          return true;
        }
      } else if (mbp[bp].maxwidth && !mbp[bp].minwidth) {
        if (screenWidth <= mbp[bp].maxwidth) {
          InputManager.scalingFactor = mbp[bp].scalingFactor;
          return true;
        }
      } else if (!mbp[bp].maxwidth && mbp[bp].minwidth) {
        if (screenWidth >= mbp[bp].minwidth) {
          InputManager.scalingFactor = mbp[bp].scalingFactor;
          return true;
        }
      } else {
        return false;
      }
    });
  }

  static regenScalingFactor() {
    const screenWidth = window.innerWidth;
    console.trace("screen: ", screenWidth);
    console.log("breakpoints: ", InputManager.breakpoints);

    Object.keys(InputManager.breakpoints).forEach(bp => {
      let mbp = InputManager.breakpoints;
      if (mbp[bp].maxwidth && mbp[bp].minwidth) {
        if (screenWidth <= mbp[bp].maxwidth && screenWidth >= mbp[bp].minwidth) {
          InputManager.scalingFactor = mbp[bp].scalingFactor;
          return true;
        }
      } else if (mbp[bp].maxwidth && !mbp[bp].minwidth) {
        if (screenWidth <= mbp[bp].maxwidth) {
          InputManager.scalingFactor = mbp[bp].scalingFactor;
          return true;
        }
      } else if (!mbp[bp].maxwidth && mbp[bp].minwidth) {
        if (screenWidth >= mbp[bp].minwidth) {
          InputManager.scalingFactor = mbp[bp].scalingFactor;
          return true;
        }
      } else {
        return false;
      }
    });
  }

  static mapKeyBoard(keyboardMap: any) {
    let mapObject = {};
    InputManager.keys = keyboardMap;

    Object.keys(InputManager.keys).forEach(k => {
      // @ts-ignore
      if (k != "release" && InputManager.keys[k].options.repeat == false) {
        // @ts-ignore
        mapObject[k] = { action: keyboardMap[k].name, repeat: false };
      } else if (k != "release" && InputManager.keys[k].options.repeat == true) {
        // @ts-ignore
        mapObject[k] = { action: keyboardMap[k].name, repeat: true };
        // @ts-ignore
      } else if (k != "release") mapObject[k] = keyboardMap[k].name;
    });
    Input.map(mapObject, (action, doing) => {
      if (doing) {
        let myAction = Object.keys(InputManager.keys).filter((k: any) => {
          return InputManager.keys[k].name === action;
        });
        InputManager.keys[myAction[0]].callback();
      } else {
        if (keyboardMap.release) {
          keyboardMap["release"].callback();
        }
      }
    });
  }

  static mapMouseEvents(mouseEventMap: any) {
    InputManager.mice = mouseEventMap;

    let vp = document.querySelector("#Viewport");
    Object.keys(InputManager.mice).forEach(m => {
      switch (m) {
        case "LeftClick":
          if (vp)
            InputManager.eventLs.push({
              click: vp.addEventListener("click", (e: Event) => {
                InputManager.regenScalingFactor();
                let rect = (e.target as HTMLElement).getBoundingClientRect();
                console.log("rawX: ", (e as MouseEvent).clientX, rect.left, InputManager.scalingFactor);
                console.log("rawY: ", (e as MouseEvent).clientY, rect.top, InputManager.scalingFactor);
                InputManager.mice["LeftClick"].callback({
                  xPos: InputManager.round((e as MouseEvent).clientX, 2),
                  yPos: InputManager.round((e as MouseEvent).clientY, 2),
                  scaledX: InputManager.round(((e as MouseEvent).clientX - rect.left) / InputManager.scalingFactor, 2), //
                  scaledY: InputManager.round(((e as MouseEvent).clientY - rect.top) / InputManager.scalingFactor, 2), //
                });
              }),
            });
          break;
        case "RightClick":
          if (vp)
            InputManager.eventLs.push({
              contextmenu: vp.addEventListener("contextmenu", (e: Event) => {
                InputManager.regenScalingFactor();
                let rect = (e.target as HTMLElement).getBoundingClientRect();
                InputManager.mice["RightClick"].callback({
                  xPos: InputManager.round((e as MouseEvent).clientX, 2),
                  yPos: InputManager.round((e as MouseEvent).clientY, 2),
                  scaledX: InputManager.round(((e as MouseEvent).clientX - rect.left) / InputManager.scalingFactor, 2),
                  scaledY: InputManager.round(((e as MouseEvent).clientY - rect.top) / InputManager.scalingFactor, 2),
                });
              }),
            });
          break;
        case "ViewportScaling":
          break;
        default:
          throw new Error("invalid mouse event passed");
      }
    });
  }

  static clearMapping() {
    let vp = document.querySelector("#Viewport");
    InputManager.keys = {};
    InputManager.mice = {};
    InputManager.eventLs.forEach((ev: any) => {
      vp?.removeEventListener(ev, InputManager.eventLs[ev]);
    });
  }

  // Round half away from zero
  static round = (num: number, decimalPlaces = 0): number => {
    if (num < 0) return -InputManager.round(-num, decimalPlaces);
    var p = Math.pow(10, decimalPlaces);
    var n = num * p;
    var f = n - Math.floor(n);
    var e = Number.EPSILON * n;

    // Determine whether this fraction is a midpoint value.
    return f >= 0.5 - e ? Math.ceil(n) / p : Math.floor(n) / p;
  };
}
