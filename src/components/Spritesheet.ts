export class Spritesheet {
  frames = [];
  constructor(src: string, frames: number, frameW: number, frameH: number) {}
}

export class AnimationSequence {
  constructor(spritesheet: Spritesheet, frames: Array<any>, speed: number, direction?: "forwards" | "reverse") {}
}
