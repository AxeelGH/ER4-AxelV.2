import globals from "../config/globals.js";
import { updateMusic } from "./Music.js";

export default class Asset {
  constructor() {}

  loadAssets() {
    console.log("Loading assets...");

  }

  tileSetLoader() {
    globals.assetsLoaded++;
    if (globals.assetsLoaded === globals.assetsToLoad.length) {
      console.log("Everything loaded.");
    }
  }
}