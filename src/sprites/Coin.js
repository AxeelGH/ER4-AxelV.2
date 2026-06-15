import globals from "../config/globals.js";
import { GRID_COLS } from "../config/constants.js";
import Frames from "./Frames.js";
import ImageSet from "./ImageSet.js";

export default class Coin {
  constructor() {
    this.col = Math.floor(Math.random() * GRID_COLS);
    this.fil = 0;
    this.type = Math.floor(Math.random() * 3);

    this.imageSet = new ImageSet(2 + this.type, 0, 32, 32, 0, 0, 32);
    this.frames = new Frames(14, 3);
  }

  update() {
    this.frames.update();
    this.readKeyboard();
  }

  readKeyboard() {
    if (globals.action.moveLeft) {
      globals.action.moveLeft = false;
      if (this.col > 0) {
        this.col = this.col - 1;
      }
    }

    if (globals.action.moveRight) {
      globals.action.moveRight = false;
      if (this.col < GRID_COLS - 1) {
        this.col = this.col + 1;
      }
    }
    if (globals.action.moveDown) {
      globals.dropInterval = 0.1;
    } else {
      globals.dropInterval = 1.0;
    }
  }
}
