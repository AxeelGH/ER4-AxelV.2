import Sprite from "./Sprite.js";
import ImageSet from "./ImageSet.js";
import Frames from "./Frames.js";
import globals from "../config/globals.js";
import { GRID_COLS, GRID_ROWS, GRID_ORIGIN_X, GRID_ORIGIN_Y, CELL_SIZE } from "../config/constants.js";

export default class Goblin extends Sprite {
  constructor() {
    super();
    this.col = 0;
    this.direction = 1;
    this.moveTimer = 0;
    this.moveInterval = 0.5;
    this.throwTimer = 0;
    this.throwInterval = 5.0;
    this.rockCount = 0;
    this.maxRocks = 3;

    this.imageSet = new ImageSet(7, 0, 32, 32, 0, 0, 32, 32);
    this.frames = new Frames(1, 8);
  }

  update(dt) {
    this.updateAnimationFrame();
    this.move(dt);
    this.throw(dt);
  }

  move(dt) {
    this.moveTimer += dt;
    if (this.moveTimer >= this.moveInterval) {
      this.moveTimer = 0;
      this.col += this.direction;

      if (this.col >= GRID_COLS - 1) {
        this.col = GRID_COLS - 1;
        this.direction = -1;
      }
      if (this.col <= 0) {
        this.col = 0;
        this.direction = 1;
      }
    }
  }

  throw(dt) {
    this.throwTimer += dt;
    if (this.throwTimer >= this.throwInterval) {
      this.throwTimer = 0;
      this.spawnRock();
    }
  }

spawnRock() {
    if (this.rockCount >= this.maxRocks) return;

    const minFil = 5;
    let tries = 0;

    while (tries < 20) {
        const fil = Math.floor(Math.random() * (GRID_ROWS - minFil)) + minFil;
        if (globals.grid.data[fil][this.col] === 0) {
            globals.grid.setCell(fil, this.col, 4);
            this.rockCount++;
            return;
        }
        tries++;
    }
}

  draw(ctx) {
    const img = globals.tileSets[0];
    if (!img || !img.complete) return;

    const x = GRID_ORIGIN_X + this.col * CELL_SIZE;
    const y = GRID_ORIGIN_Y + GRID_ROWS * CELL_SIZE + 4;

    this.imageSet.draw(ctx, x, y, this.frames.frameCounter, 0);
  }
}