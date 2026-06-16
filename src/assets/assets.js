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

    let startMusic = document.querySelector("#startMusic");
    startMusic.addEventListener("canplaythrough", this.tileSetLoader, false);
    startMusic.addEventListener("timeupdate", updateMusic, false);
    startMusic.load();
    globals.sounds.push(startMusic);
    globals.assetsToLoad.push(startMusic);

    let gameMusic = document.querySelector("#gameMusic");
    gameMusic.addEventListener("canplaythrough", this.tileSetLoader, false);
    gameMusic.addEventListener("timeupdate", updateMusic, false);
    gameMusic.load();
    globals.sounds.push(gameMusic);
    globals.assetsToLoad.push(gameMusic);

    let storyMusic = document.querySelector("#storyMusic");
    storyMusic.addEventListener("canplaythrough", this.tileSetLoader, false);
    storyMusic.addEventListener("timeupdate", updateMusic, false);
    storyMusic.load();
    globals.sounds.push(storyMusic);
    globals.assetsToLoad.push(storyMusic);
  }

  tileSetLoader() {
    globals.assetsLoaded++;
    if (globals.assetsLoaded === globals.assetsToLoad.length) {
      console.log("Everything loaded.");
    }
    for (let i = 0; i < globals.sounds.length; i++) {
      globals.sounds[i].removeEventListener(
        "canplaythrough",
        this.tileSetLoader,
        false,
      );
    }
  }
}
