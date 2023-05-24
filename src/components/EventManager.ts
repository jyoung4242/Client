import { Event } from "./Event";

export class EventManager {
  static async runEvent(e: Event): Promise<any> {
    return new Promise(resolve => {});
  }

  static async init(events: Array<Event>) {
    for (let i = 0; i < events.length; i++) {
      await EventManager.runEvent(events[i]);
    }
  }
}

async function sleep(seconds: number) {
  return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

/*
  static register(e: Event) {
    EventManager.events.set(e.type, e);
    console.log(EventManager.events);
  } */
