class SceneManager {
  template = ``;
  public states: Record<string, Record<string, any>> = {};
  public current: Record<string, Scene> = {};
  constructor() {}

  public create(...entries: any[]): Scene[] {
    const created = [];
    let names = [];

    for (const entry of entries) {
      if (typeof entry === "string") {
        names.push(entry);

        continue;
      }

      if (names.length > 0) {
        created.push(
          ...names.map(name => {
            const state = new entry(name);
            if (this.states[state.machine] == null) {
              this.states[state.machine] = {};
            }
            this.states[state.machine][state.name] = state;
            return state;
          })
        );
        names = [];
        continue;
      }
      const state = new entry();
      if (this.states[state.machine] == null) {
        this.states[state.machine] = {};
      }
      this.states[state.machine][state.name] = state;
      created.push(state);
    }

    return created;
  }

  set(state: string | Scene, machine = "default", ...params: any[]): void | Promise<void> {
    const next = typeof state === "string" ? SceneState.states[machine][state] : state;

    let leaving: any;
    let entering: any;

    if (this.current[machine] != null) {
      leaving = this.current[machine].exit(next, ...params);
    }
    if (leaving instanceof Promise) {
      return leaving.then(() => {
        if (next != null) {
          entering = next.enter(this.current[machine], ...params);
        }
        if (entering instanceof Promise) {
          return entering.then(() => {
            this.current[machine] = next;
          });
        }
        this.current[machine] = next;
      });
    }

    if (next != null) {
      entering = next.enter(this.current[machine], ...params);
    }
    if (entering instanceof Promise) {
      return entering.then(() => {
        this.current[machine] = next;
      });
    }
    this.current[machine] = next;
  }

  get(machine = "default"): { state: Scene } {
    return { state: this.current[machine] };
  }
}
export const SceneState = new SceneManager();

export class Scene {
  public constructor(public name: string, public machine = "default") {}
  public enter(_previous: Scene, ...params: any): void {}
  public exit(_next: Scene, ...params: any): void {}
}
