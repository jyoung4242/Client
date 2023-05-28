import { Game } from "../../content/Scenes/game";
import { GameEvent } from "./EventManager";
import { GameObject } from "./GameObject";
import { collisionBody } from "./MapManager";

export type direction = "down" | "left" | "up" | "right";

export type TriggerCheck = {
  result: boolean;
  actions: Array<object> | null;
};

type collisionResult = {
  status: boolean;
  collisionDirection: Array<direction>;
  actions?: Array<GameEvent>;
};

export class CollisionManager {
  constructor() {}

  isObjectColliding(a: any, b: any): collisionResult {
    //let A = this.calcCollisionBox(a);
    let B = this.calcCollisionBox(b);

    let dirs: Array<direction> = [];
    let myActions: Array<GameEvent> = [];

    if (a.x < B.x + B.w && a.x + a.w > B.x && a.y < B.y + B.h && a.y + a.h > B.y) {
      let directionCheck: Array<direction> = ["up", "down", "left", "right"];
      directionCheck.forEach(dir => {
        switch (dir) {
          case "left":
            if (this.isLeftFree(a, b) == false) {
              dirs.push("left");
              if (a.actions) {
                myActions = [...a.actions];
              }
            }
            break;
          case "right":
            if (this.isRightFree(a, b) == false) {
              dirs.push("right");
              if (a.actions) {
                myActions = [...a.actions];
              }
            }
            break;
          case "up":
            if (this.isUpFree(a, b) == false) {
              dirs.push("up");
              if (a.actions) {
                myActions = [...a.actions];
              }
            }
            break;
          case "down":
            if (this.isDownFree(a, b) == false) {
              dirs.push("down");
              if (a.actions) {
                myActions = [...a.actions];
              }
            }
            break;
        }
      });
      return { status: true, collisionDirection: dirs, actions: myActions };
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
      w: p.collisionLayers[0].w,
      h: p.collisionLayers[0].h,
      x: p.xPos + p.collisionLayers[0].x,
      y: p.yPos + p.collisionLayers[0].y,
    };
  };

  isDownFree = (wall: collisionBody, player: GameObject): boolean => {
    //let a = this.calcCollisionBox(wall);
    let b = this.calcCollisionBox(player);

    if (wall.x < b.x + b.w && wall.x + wall.w >= b.x) {
      const distance = wall.y - (b.y + b.h);
      if (distance > -2 && distance <= 0) return false;
    }

    return true;
  };
  isUpFree = (wall: collisionBody, player: GameObject): boolean => {
    //let a = this.calcCollisionBox(wall);
    let b = this.calcCollisionBox(player);
    if (wall.x < b.x + b.w && wall.x + wall.w >= b.x) {
      const distance = wall.y + wall.h - b.y;
      //console.log("up check: ", distance);
      if (distance < 3 && distance >= 0) return false;
    }

    return true;
  };
  isLeftFree = (wall: collisionBody, player: GameObject): boolean => {
    //let a = this.calcCollisionBox(wall);
    let b = this.calcCollisionBox(player);
    if (wall.y < b.y + b.h && wall.y + wall.h >= b.y) {
      const distance = wall.x + wall.w - b.x;
      //console.log("left check: ", distance);
      if (distance < 2 && distance >= 0) return false;
    }

    return true;
  };
  isRightFree = (wall: collisionBody, player: GameObject): boolean => {
    //let a = this.calcCollisionBox(wall);
    let b = this.calcCollisionBox(player);

    if (wall.y < b.y + b.h && wall.y + wall.h >= b.y) {
      const distance = wall.x - (b.x + b.w);
      //console.log("right check: ", distance);
      if (distance > -2 && distance <= 0) return false;
    }

    return true;
  };
}
