import globals from "../config/globals.js";
import { Key } from "../config/constants.js";

export class Events {
  constructor() {
    this.initEvents();
  }

  initEvents() {
    window.addEventListener("keydown", this.keyDown, false);
    window.addEventListener("keyup", this.keyUp, false);
  }

  keyDown(event) {
    switch (event.keyCode) {
      case Key.UP:
        globals.action.moveUp = true;
        break;

      case Key.DOWN:
        globals.action.moveDown = true;
        break;

      case Key.LEFT:
        globals.action.moveLeft = true;
        break;

      case Key.RIGHT:
        globals.action.moveRight = true;
        break;

      case Key.SPACE:
        globals.action.space = true;
        break;
    }
  }

  keyUp(event) {
    switch (event.keyCode) {
      case Key.UP:
        globals.action.moveUp = false;
        break;

      case Key.DOWN:
        globals.action.moveDown = false;
        break;

      case Key.LEFT:
        globals.action.moveLeft = false;
        break;

      case Key.RIGHT:
        globals.action.moveRight = false;
        break;

      case Key.SPACE:
        globals.action.space = false;
        break;
    }
  }
}