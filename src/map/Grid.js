import { GRID_COLS, GRID_ROWS } from "../config/constants.js";

export default class Grid {
  constructor() {
    this.cols = GRID_COLS;
    this.rows = GRID_ROWS;
    this.data = [];

    this.init();
  }

  init() {
    for (let row = 0; row < this.rows; row++) {
      this.data[row] = [];
      for (let col = 0; col < this.cols; col++) {
        this.data[row][col] = 0;
      }
    }
  }

  getCell(row, col) {
    return this.data[row][col];
  }

  setCell(row, col, value) {
    this.data[row][col] = value;
  }
}
