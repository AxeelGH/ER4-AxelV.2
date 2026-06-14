import globals from "../config/globals.js";
import { updateMusic } from "./Music.js";

export default class Asset {
  constructor() {}

  loadAssets() {
    console.log("Loading assets...");
    var tileSet = new Image();
    tileSet.addEventListener("load", this.tileSetLoader.bind(this));
    tileSet.addEventListener("error", this.tileSetLoader.bind(this));
    tileSet.src = "./assets/images/spritesheet.png";
    globals.tileSets[0] = tileSet;
    globals.assetsToLoad.push(tileSet);

    tileSet = new Image();
    tileSet.addEventListener("load", this.tileSetLoader.bind(this));
    tileSet.addEventListener("error", this.tileSetLoader.bind(this));
    tileSet.src = "./assets/images/MapTile.png";
    globals.tileSets[1] = tileSet;
    globals.assetsToLoad.push(tileSet);
  }

  tileSetLoader() {
    globals.assetsLoaded++;
    if (globals.assetsLoaded === globals.assetsToLoad.length) {
      console.log("Everything loaded.");
    }
  }
}