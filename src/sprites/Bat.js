import Sprite from "./Sprite.js";
import ImageSet from "./ImageSet.js";
import Frames from "./Frames.js";
import globals from "../config/globals.js";
import {
  GRID_COLS,
  GRID_ROWS,
  GRID_ORIGIN_X,
  GRID_ORIGIN_Y,
  CELL_SIZE,
  SpriteID,
  State,
} from "../config/constants.js";

export default class Bat extends Sprite {
  constructor() {
    super();
    this.id = SpriteID.BAT;
    this.state = State.BAT_RIGHT;

    this.col = 0;
    this.fil = Math.floor(Math.random() * (8 - 4 + 1)) + 4;
    this.direction = 1;
    this.moveTimer = 0;
    this.moveInterval = 0.4;

    this.imageSet = new ImageSet(9, 0, 32, 32, 0, 0, 32, 32);
    this.frames = new Frames(4, 8);
  }

  update(dt) {
    this.updateAnimationFrame();
    this.move(dt);
  }

  move(dt) {
    this.moveTimer += dt;
    if (this.moveTimer >= this.moveInterval) {
      this.moveTimer = 0;
      this.col += this.direction;

      if (this.col >= GRID_COLS - 1) {
        this.col = GRID_COLS - 1;
        this.direction = -1;
        this.state = State.BAT_LEFT;
      }
      if (this.col <= 0) {
        this.col = 0;
        this.direction = 1;
        this.state = State.BAT_RIGHT;
      }
    }
  }

  draw(ctx) {
    const img = globals.tileSets[0];
    if (!img || !img.complete) return;

    const x = GRID_ORIGIN_X + this.col * CELL_SIZE;
    const y = GRID_ORIGIN_Y + this.fil * CELL_SIZE;

    let row = 9;
    if (this.state === State.BAT_LEFT) {
      row = 11;
    }

    const srcX = this.frames.frameCounter * 32;
    const srcY = row * 32;

    this.ctx = ctx;
    ctx.drawImage(img, srcX, srcY, 32, 32, x, y, CELL_SIZE, CELL_SIZE);
  }
}
