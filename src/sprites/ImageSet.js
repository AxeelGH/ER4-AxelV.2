import globals from "../config/globals.js";

export default class ImageSet {
  constructor(
    initFil,
    initCol,
    xSize,
    ySize,
    xOffset,
    yOffset,
    gridWidth,
    gridHeight,
  ) {
    this.initFil = initFil;
    this.initCol = initCol;
    this.xSize = xSize;
    this.ySize = ySize;
    this.xOffset = xOffset;
    this.yOffset = yOffset;
    this.gridWidth = gridWidth;
    this.gridHeight = gridHeight;
    this.loaded = true;
  }

  draw(ctx, x, y, frame, state) {
    const img = globals.tileSets[0];
    const xTile =
      this.initCol * this.gridWidth + frame * this.gridWidth + this.xOffset;
    const yTile =
      this.initFil * this.gridHeight + state * this.gridHeight + this.yOffset;

    ctx.drawImage(
      img,
      xTile,
      yTile,
      this.xSize,
      this.ySize,
      x,
      y,
      this.xSize,
      this.ySize,
    );
  }
}
