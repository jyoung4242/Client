import { Game } from "../../content/Scenes/game";
import { GameObject } from "./GameObject";

export type direction = "down" | "left" | "up" | "right";

export type TriggerCheck = {
  result: boolean;
  actions: Array<object> | null;
};

type collisionResult = {
  status: boolean;
  collisionDirection: Array<direction>;
};

export class CollisionManager {
  constructor() {}

  isObjectColliding(a: any, b: any): collisionResult {
    let A = this.calcCollisionBox(a);
    let B = this.calcCollisionBox(b);
    let dirs: Array<direction> = [];

    if (A.x < B.x + B.w && A.x + A.w > B.x && A.y < B.y + B.h && A.y + A.h > B.y) {
      let directionCheck: Array<direction> = ["up", "down", "left", "right"];
      directionCheck.forEach(dir => {
        switch (dir) {
          case "left":
            if (this.isLeftFree(a, b) == false) dirs.push("left");
            break;
          case "right":
            if (this.isRightFree(a, b) == false) dirs.push("right");
            break;
          case "up":
            if (this.isUpFree(a, b) == false) dirs.push("up");
            break;
          case "down":
            if (this.isDownFree(a, b) == false) dirs.push("down");
            break;
        }
      });
      return { status: true, collisionDirection: dirs };
    }
    return { status: false, collisionDirection: [] };
  }

  isWallCollision(walls: Array<any>, who: GameObject, direction: direction): boolean {
    let walllength = walls.length;
    for (let i = 0; i < walllength; i++) {
      let w = walls[i];
      switch (direction) {
        case "left":
          if (!this.isLeftFree(w, who)) return true;
          break;
        case "right":
          if (!this.isRightFree(w, who)) {
            return true;
          }
          break;
        case "up":
          if (!this.isUpFree(w, who)) return true;
          break;
        case "down":
          if (!this.isDownFree(w, who)) return true;
          break;
      }
    }
    return false;
  }

  isTriggerCollision(triggers: Array<any>, who: GameObject, direction: direction): TriggerCheck {
    let triggerlength = triggers.length;
    for (let i = 0; i < triggerlength; i++) {
      let t = triggers[i];
      switch (direction) {
        case "left":
          if (!this.isLeftFree(t, who))
            return {
              result: true,
              actions: triggers[i].actions,
            };
          break;
        case "right":
          if (!this.isRightFree(t, who))
            return {
              result: true,
              actions: triggers[i].actions,
            };
          break;
        case "up":
          if (!this.isUpFree(t, who))
            return {
              result: true,
              actions: triggers[i].actions,
            };
          break;
        case "down":
          if (!this.isDownFree(t, who))
            return {
              result: true,
              actions: triggers[i].actions,
            };
          break;
      }
    }
    return {
      result: false,
      actions: null,
    };
  }

  calcCollisionBox = (p: GameObject): { w: number; h: number; x: number; y: number } => {
    return {
      w: p.collisionBodyWidth,
      h: p.collisionBodyHeight,
      x: p.xPos + p.collisionBodyOffsetX,
      y: p.yPos + p.collisionBodyOffsetY,
    };
  };

  isDownFree = (wall: GameObject, player: GameObject): boolean => {
    let a = this.calcCollisionBox(wall);
    let b = this.calcCollisionBox(player);
    if (a.x < b.x + b.w && a.x + a.w >= b.x) {
      const distance = a.y - (b.y + b.h);
      //console.log("down check: ", distance);
      if (distance < -2 && distance >= 0) return false;
    }

    return true;
  };
  isUpFree = (wall: GameObject, player: GameObject): boolean => {
    let a = this.calcCollisionBox(wall);
    let b = this.calcCollisionBox(player);
    if (a.x < b.x + b.w && a.x + a.w >= b.x) {
      const distance = a.y + a.h - b.y;
      //console.log("up check: ", distance);
      if (distance < 3 && distance >= 0) return false;
    }

    return true;
  };
  isLeftFree = (wall: GameObject, player: GameObject): boolean => {
    let a = this.calcCollisionBox(wall);
    let b = this.calcCollisionBox(player);
    if (a.y < b.y + b.h && a.y + a.h >= b.y) {
      const distance = a.x + a.w - b.x;
      //console.log("left check: ", distance);
      if (distance > -2 && distance <= 0) return false;
    }

    return true;
  };
  isRightFree = (wall: GameObject, player: GameObject): boolean => {
    let a = this.calcCollisionBox(wall);
    let b = this.calcCollisionBox(player);

    if (a.y < b.y + b.h && a.y + a.h >= b.y) {
      const distance = a.x - (b.x + b.w);
      //console.log("right check: ", distance);
      if (distance > -2 && distance <= 0) return false;
    }

    return true;
  };
}
