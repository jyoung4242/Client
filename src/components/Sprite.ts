export class Sprite {
  width: number;
  height: number;
  zIndex: number;
  src: string;
  animationBinding: string = "0px 0px";
  constructor(src: string) {
    this.width = 32;
    this.height = 32;
    this.zIndex = 2;
    this.src = src;
  }
}
