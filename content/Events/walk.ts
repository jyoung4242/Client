import { direction } from "../../src/components/CollisionManager";
import { GameEvent } from "../../src/components/EventManager";
import { GameObject } from "../../src/components/GameObject";

export class WalkEvent extends GameEvent {
  who: GameObject;
  direction: direction;
  distance: number;
  resolution: ((value: void | PromiseLike<void>) => void) | undefined;

  constructor(who: GameObject, direction: direction, distance: number) {
    super("walk");
    this.who = who;
    this.direction = direction;
    this.distance = distance;
  }

  init(): Promise<void> {
    return new Promise(resolve => {
      document.addEventListener("walkCompleted", this.completeHandler);
      this.who.startBehavior("walk", this.direction, this.distance);
      this.resolution = resolve;
    });
  }

  completeHandler = (e: any) => {
    if (e.detail === this.who) {
      document.removeEventListener("walkCompleted", this.completeHandler);
      if (this.resolution) this.resolution();
    }
  };
}