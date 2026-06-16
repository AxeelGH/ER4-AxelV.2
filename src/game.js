import globals from "./config/globals.js";
import { GameState } from "./config/constants.js";
import { Events } from "./events/Events.js";
import { View } from "./View.js";
import Grid from "./map/Grid.js";
import GridView from "./map/GridView.js";
import Asset from "./assets/assets.js";
import Chronometer from "./Chronometer.js";
import Sprite from "./sprites/Sprite.js";
import Coin from "./sprites/Coin.js";
import Goblin from "./sprites/Goblin.js";

class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");

    globals.ctx = this.ctx;

    this.gameState = GameState.LOADING;
    globals.gameState = GameState.LOADING;
    console.log("Game State: LOADING");

    this.inputManager = new Events();
    this.view = new View(this.ctx, this);

    globals.grid = new Grid();
    this.gridView = new GridView(this.ctx);
    globals.chrono = new Chronometer();

    globals.currentCoin = new Coin();
    globals.goblin = new Goblin();

    globals.action = {
      moveUp: false,
      moveDown: false,
      moveLeft: false,
      moveRight: false,
      confirm: false,
    };
  }

  static async create(canvas, gameData) {
    console.log("Initializing...");
    const game = new Game(canvas, gameData);

    globals.gameInstance = game;

    globals.sprites = [];
    globals.tileSets = [];
    globals.assetsToLoad = [];
    globals.assetsLoaded = 0;

    game.assets = new Asset();
    game.assets.loadAssets();

    return game;
  }

  execute() {
    globals.previousCycleMilliseconds = 0;

    function gameLoop(currentTime) {
      requestAnimationFrame(gameLoop);

      if (globals.previousCycleMilliseconds === 0) {
        globals.previousCycleMilliseconds = currentTime;
        return;
      }

      const elapsedSeconds =
        (currentTime - globals.previousCycleMilliseconds) / 1000;
      globals.previousCycleMilliseconds = currentTime;

      globals.deltaTime += elapsedSeconds;
      globals.cycleRealTime += elapsedSeconds;

      if (globals.cycleRealTime >= globals.frameTimeObj) {
        if (globals.gameInstance) {
          globals.gameInstance.update(globals.deltaTime);
          globals.gameInstance.render();
        }

        globals.cycleRealTime -= globals.frameTimeObj;
        globals.deltaTime = 0;
      }
    }

    requestAnimationFrame(gameLoop);
  }

  loading(dt) {
    if (
      globals.assetsLoaded === globals.assetsToLoad.length &&
      globals.assetsToLoad.length > 0
    ) {
      this.gameState = GameState.MENU;
      globals.gameState = GameState.MENU;
      console.log("Game State: MENU");
    }
  }

  update(dt) {
    switch (this.gameState) {
      case GameState.LOADING:
        this.loading(dt);
        break;

      case GameState.MENU:
        this.updateMenu(dt);
        break;

      case GameState.PLAYING:
        this.updatePlaying(dt);
        break;

      case GameState.STORY:
        this.updateSecondary(dt);
        break;

      case GameState.CONTROLS:
        this.updateSecondary(dt);
        break;

      case GameState.HIGHSCORE:
        this.updateSecondary(dt);
        break;

      default:
        break;
    }
  }

  updateMenu(dt) {
    if (globals.action.moveUp) {
      globals.action.moveUp = false;
      globals.menuIndex = globals.menuIndex > 0 ? globals.menuIndex - 1 : 3;
    }

    if (globals.action.moveDown) {
      globals.action.moveDown = false;
      globals.menuIndex = globals.menuIndex < 3 ? globals.menuIndex + 1 : 0;
    }

    if (globals.action.space) {
      globals.action.space = false;

      switch (globals.menuIndex) {
        case 0:
          this.gameState = GameState.STORY;
          globals.gameState = GameState.STORY;
          break;
        case 1:
          this.gameState = GameState.PLAYING;
          globals.gameState = GameState.PLAYING;
          globals.levelTime = 120;
          break;
        case 2:
          this.gameState = GameState.CONTROLS;
          globals.gameState = GameState.CONTROLS;
          break;
        case 3:
          this.gameState = GameState.HIGHSCORE;
          globals.gameState = GameState.HIGHSCORE;
          break;
      }
    }
  }

  updatePlaying(dt) {
    if (globals.levelTime > 0) {
      globals.levelTime -= dt;
    }
    if (globals.levelTime <= 0) {
      this.gameState = GameState.GAME_OVER;
      globals.gameState = GameState.GAME_OVER;
    }
    if (!globals.currentCoin) return;

    globals.currentCoin.update();
    globals.goblin.update(dt);

    globals.dropTimer += dt;
    if (globals.dropTimer >= globals.dropInterval) {
      globals.dropTimer = 0;

      const coin = globals.currentCoin;
      const nextFil = coin.fil + 1;

      if (nextFil >= globals.grid.rows ||
        globals.grid.data[nextFil][coin.col] !== 0
      ) {
        globals.grid.setCell(coin.fil, coin.col, coin.type + 1);
        globals.currentCoin = new Coin();
      } else {
        coin.fil = nextFil;
      }
    }
  }

  updateSecondary(dt) {
    if (globals.action.space) {
      globals.action.space = false;
      this.gameState = GameState.MENU;
      globals.gameState = GameState.MENU;
    }
  }

  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.view.render();
  }
}

export async function initGame() {
  const canvas = globals.canvas;
  const game = await Game.create(canvas);
  globals.gameInstance = game;
  game.execute();
}

export { Game };
