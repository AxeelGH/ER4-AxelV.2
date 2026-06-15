import globals from "../config/globals.js";
import {
  CELL_SIZE,
  GRID_ORIGIN_X,
  GRID_ORIGIN_Y,
  TILE_SIZE,
} from "../config/constants.js";
import { levelData } from "./Level.js";

export default class GridView {
  constructor(ctx) {
    this.ctx = ctx;
  }

  cellToPixel(col, row) {
    const x = GRID_ORIGIN_X + col * CELL_SIZE;
    const y = GRID_ORIGIN_Y + row * CELL_SIZE;
    return { x, y };
  }

  render() {
    //this.renderGrid();
    this.renderBorder();
  }

  renderGrid() {
    const grid = globals.grid;
    this.ctx.fillStyle = "#000000";
    this.ctx.fillRect(
      GRID_ORIGIN_X,
      GRID_ORIGIN_Y,
      CELL_SIZE * grid.cols,
      CELL_SIZE * grid.rows,
    );
  }

  renderBorder() {
    const img = globals.tileSets[1];

    const DRAW_SIZE = 16; 

    for (let fila = 0; fila < levelData.length; fila++) {
      for (let col = 0; col < levelData[fila].length; col++) {
        const value = levelData[fila][col];
        if (value !== 0) {
            const xTile = (value - 1) * TILE_SIZE;  
            const xPos = GRID_ORIGIN_X - DRAW_SIZE + col * DRAW_SIZE;  
            const yPos = GRID_ORIGIN_Y - DRAW_SIZE + fila * DRAW_SIZE;

          this.ctx.drawImage(
            img,
            xTile,
            0,
            TILE_SIZE,
            TILE_SIZE,
            xPos,
            yPos,
            16,
            16,
          );
        }
      }
    }
  }
}
