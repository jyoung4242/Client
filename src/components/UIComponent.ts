//container.ts
import { UI } from "@peasy-lib/peasy-ui";

const button1 = {
  buttonText: "Add One",
  style: "--top: 10px; --left: 40px;",
};
const button2 = {
  buttonText: "Minus One",
  style: "--background-color: blue; --top: 10px; --left: 120px;",
};
const label1 = {
  style: "--top: 100px; --left: 50%; --transform: translateX(-50%);",
};

export class MyContainer {
  addButton;
  subButton;
  myLabel;

  static template: string = `
  <style>
    :root {
      position: var(--position, relative);
      width: var(--width, 200px);
      height: var(--height, 250px);
      border: var(--border, 1px solid white);
      margin: var(--margin, 25px);
      padding: var(--padding, 10px);
    }
  </style>
  <div>
    <my-button pui="MyButton === addButton" style="\${addButton.style}"></my-button>
    <my-button pui="MyButton === subButton" style="\${subButton.style}"></my-button>
    <my-label pui="MyLabel === myLabel" style="\${myLabel.style}"></my-label>
  </div>`;

  constructor(public state: { counter: number }) {
    this.addButton = { ...button1, ...{ callback: this.incCounter } };
    this.subButton = { ...button2, ...{ callback: this.decCounter } };
    this.myLabel = Object.assign(this.state, label1);
  }

  incCounter = () => {
    console.log("count up");
    this.state.counter += 1;
    console.log(this.state.counter);
  };

  decCounter = () => {
    console.log("count down");
    this.state.counter -= 1;
    console.log(this.state.counter);
  };

  static create(state: any) {
    return new MyContainer(state);
  }
}
UI.register("MyContainer", MyContainer); // Can be replaced with a property on invoking model
