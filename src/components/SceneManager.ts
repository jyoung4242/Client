import { State, States } from "@peasy-lib/peasy-states";
import { UI, UIView } from "@peasy-lib/peasy-ui";

export class SceneManager extends States {}

export class Scene extends State {
  public view: UIView | undefined = undefined;
  public template: string = "";

  public enter(previous: State | null) {
    setTimeout(() => {
      this.view = UI.create(document.querySelector("#Viewport") as HTMLElement, this, this.template);
      this.init();
    }, 25);
  }

  public init() {}
  public leave() {
    this.view?.destroy();
  }
}
