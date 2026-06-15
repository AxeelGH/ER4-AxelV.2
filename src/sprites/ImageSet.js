import globals from "../config/globals.js";

export default class ImageSet {
  constructor(initFil, initCol, xSize, ySize, xOffset, yOffset, gridSize) {
    this.initFil = initFil;
    this.initCol = initCol;
    this.xSize = xSize;
    this.ySize = ySize;
    this.xOffset = xOffset;
    this.yOffset = yOffset;
    this.gridSize = gridSize;
    this.loaded = true;
  }

  draw(ctx, x, y, frame, state) {
    const img = globals.tileSets[0];

    const column = this.initCol + frame;
    const row = this.initFil + state;

    ctx.drawImage(img, column * this.xSize, row * this.ySize, this.xSize, this.ySize, x, y, this.xSize, this.ySize);
  }
}
