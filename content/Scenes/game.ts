import { SceneState, Scene } from "../../src/components/SceneManager";
import { UI, UIView } from "@peasy-lib/peasy-ui";
import { Input } from "@peasy-lib/peasy-input";

export class Game extends Scene {
  template = `
  <div class="gamestate" style="width: 100%; height: 100%; position: absolute; top: 0; left:0; color: white;">Game</div>`;
  model = {};
  view: UIView | undefined = undefined;

  constructor() {
    super("game");
  }

  public enter(_previous: Scene, ...params: any): void {
    UI.initialize(1000 / 60);

    setTimeout(() => {
      this.view = UI.create(document.querySelector("#Viewport") as HTMLElement, this.model, this.template);
    }, 400);
  }

  public async exit(_next: Scene, ...params: any) {
    this.view?.destroy();
  }

  private wait(ms: number) {
    return new Promise<void>(resolve =>
      setTimeout(() => {
        resolve();
      }, ms)
    );
  }
}
