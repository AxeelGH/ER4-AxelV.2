import globals from "../config/globals.js";
import { GRID_COLS, GRID_ROWS, SpriteID } from "../config/constants.js";
import Frames from "./Frames.js";
import ImageSet from "./ImageSet.js";

export default class PowerUp {
  constructor() {
    const random = Math.random();

    if (random < 0.8) {
      this.type = SpriteID.POWERUP_BOMB;
      this.row = 12;
    } else {
      this.type = SpriteID.POWERUP_GOLD;
      this.row = 13;
    }

    this.col = Math.floor(Math.random() * GRID_COLS);
    this.fil = Math.floor(Math.random() * (GRID_ROWS - 5)) + 3;

    this.frames = new Frames(1, 8);
  }

  update() {
    this.frames.update();
  }
}
