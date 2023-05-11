import { UI } from "@peasy-lib/peasy-ui";

export class TransitionManager {
  static template: string;

  constructor(public state: { isVisible: boolean }) {
    TransitionManager.template = `
    <style>
        .TMParent{
            width: 100%;
            height: 100%;
        }
        #TransitionManager {
        position: var(--position, absolute);
        width: 100%;
        height: 100%;
        background-color: white;
        top:0;
        left:0;
        z-index: 99999;
        opacity: 1
        transition: opacity 0.25s
        }
        #TransitionManager.pui-adding{opacity:0;}
        #TransitionManager.pui-removing{opacity:0;}
    </style>
    <div class="TM_Parent">
        <div id="TransitionManager" ></div>
    </div>`;
  }

  static create(state: any) {
    return new TransitionManager(state);
  }
  show() {
    this.state.isVisible = true;
  }
  hide() {
    this.state.isVisible = false;
  }
}

UI.register("TranistionManager", TransitionManager); // Can be replaced with a property on invoking model
