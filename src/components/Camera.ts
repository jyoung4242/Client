export type ShakeDirection = "horizontal" | "vertical" | "random";

export class Camera {
  //shaking props
  isShaking: boolean = false;
  shakeType: ShakeDirection = "horizontal";
  shakeAngle = 0;
  shakeFrequency = 0;
  shakeDuration = 0;
  shakeMagnitude = 0;
  shakeElapsedTime = 0;
  shakeIntervalTime = 0;

  static template = `
  <style>
    .camera{
        position: var(--position, relative);
          top:50%;
          left:50%;
          transform: translate(-50%,-50%);
          width: 100%;
          height: 100%
    }

    .camera_flash{}
  </style>
  <div class="camera">
    <div class="camera_flash"></div>
    <div style="position:absolute; top:50%; left: 50%; transform: translate(-50%,-50%); font-size: xx-large;">Camera(Game)</div>
  </div>`;
  //TODO- camera flash binding -  \${===camera.flash}
  shake(shakeType: ShakeDirection, magnitude: number, duration: number, interval: number) {
    this.shakeElapsedTime = 0;
    this.shakeIntervalTime = 0;
    this.shakeType = shakeType;
    this.shakeMagnitude = magnitude;
    this.shakeDuration = duration;
    this.shakeFrequency = interval;
    this.isShaking = true;
    //TODO - get instance of framework state into Camera
    //const event = new CustomEvent("cameraShakeComplete", { detail: { whoID: this.state.objects[0] } });
    //document.dispatchEvent(event);
  }

  flash() {
    //TODO - get instance of framework state into Camera
    /* this.state.camera.flash = true;
    setTimeout(() => {
      this.state.camera.flash = false;
    }, 10); */
  }

  follow(who: any) {
    //TODO - get instance of framework state into Camera
    //this.state.camera.follow = who;
  }

  shakeUpdate(time: number): any {
    if (!this.isShaking) return { shakeX: 0, shakeY: 0 };

    this.shakeElapsedTime += time * 1000;
    this.shakeIntervalTime += time * 1000;
    //console.log("shaking:", this.shakeIntervalTime, this.shakeDuration);
    // We're done shaking
    if (this.shakeElapsedTime >= this.shakeDuration) {
      this.isShaking = false;
      return { shakeX: 0, shakeY: 0 };
    }

    while (this.shakeIntervalTime >= this.shakeFrequency) {
      this.shakeIntervalTime -= this.shakeFrequency;
      // Reset interval time and recalculate shake offset
      switch (this.shakeType) {
        case "horizontal":
          this.shakeAngle = this.shakeAngle === 0 ? 180 : 0;
          break;
        case "vertical":
          this.shakeAngle = this.shakeAngle === 90 ? 270 : 90;
          break;
        case "random":
          this.shakeAngle = Math.floor(Math.random() * 360);
          break;
      }
    }

    // Convert to radians
    const theta = (this.shakeAngle * Math.PI) / 180;
    // Convert magnitude and angle to vector
    return { shakeX: this.shakeMagnitude * Math.cos(theta), shakeY: this.shakeMagnitude * Math.sin(theta) };
  }

  update() {
    //TODO - get instance of framework state into Camera
    /* let targetpositionX = this.state.viewport.x / 6 - this.state.camera.follow.w / 2;
    let targetpositionY = this.state.viewport.y / 6 - this.state.camera.follow.h / 2;
    let { shakeX, shakeY } = this.shakeUpdate(0.1);
    this.state.camera.x = targetpositionX - this.state.camera.follow.x + shakeX;
    this.state.camera.y = targetpositionY - this.state.camera.follow.y + shakeY; */
  }
}
