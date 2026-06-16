import globals from "./config/globals.js";
import { GameState, SpriteID, State } from "./config/constants.js";
import { Events } from "./events/Events.js";
import { View } from "./View.js";
import Grid from "./map/Grid.js";
import GridView from "./map/GridView.js";
import Asset from "./assets/assets.js";
import Chronometer from "./Chronometer.js";
import Sprite from "./sprites/Sprite.js";
import Coin from "./sprites/Coin.js";
import Goblin from "./sprites/Goblin.js";
import Bat from "./sprites/Bat.js";

class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");

    globals.ctx = this.ctx;

    this.gameState = GameState.WIN;
    globals.gameState = GameState.WIN;
    console.log("Game State: LOADING");

    this.inputManager = new Events();
    this.view = new View(this.ctx, this);

    globals.grid = new Grid();
    this.gridView = new GridView(this.ctx);
    globals.chrono = new Chronometer();

    globals.currentCoin = new Coin();
    globals.enemies = [];
    const goblin = new Goblin();
    const bat = new Bat();
    globals.enemies.push(goblin);
    globals.enemies.push(bat);
    globals.goblinRef = goblin;

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

      case GameState.GAME_OVER:
        this.updateGameOver(dt);
        break;

      case GameState.WIN:
        this.updateWin(dt);
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
    if (globals.matchExploding) {
      globals.matchTimer += dt;
      if (globals.matchTimer >= 0.4) {
        for (let row = 0; row < globals.grid.rows; row++) {
          for (let col = 0; col < globals.grid.cols; col++) {
            if (globals.grid.data[row][col] === 5) {
              globals.grid.setCell(row, col, 0);
            }
          }
        }
        this.applyGravity();
        globals.matchExploding = false;
      }
      return;
    }
    if (globals.levelTime <= 0) {
      this.gameState = GameState.GAME_OVER;
      globals.gameState = GameState.GAME_OVER;
    }
    if (!globals.currentCoin) return;

    if (globals.currentCoin.state === State.EXPLOSION) {
      globals.currentCoin.explosionTimer += dt;
      globals.currentCoin.frames.update();
      if (globals.currentCoin.explosionTimer >= 0.4) {
        globals.currentCoin = new Coin();
      }
      return;
    }

    globals.currentCoin.update();
    for (let i = 0; i < globals.enemies.length; i++) {
      globals.enemies[i].update(dt);
    }

    for (let i = 0; i < globals.enemies.length; i++) {
      const enemy = globals.enemies[i];
      if (enemy.id === SpriteID.BAT) {
        if (
          globals.currentCoin.col === enemy.col &&
          globals.currentCoin.fil === enemy.fil
        ) {
          if (!globals.currentCoin.exploding) {
            globals.currentCoin.explode();
          }
          globals.lives--;
          return;
        }
      }
    }

    globals.dropTimer += dt;
    if (globals.dropTimer >= globals.dropInterval) {
      globals.dropTimer = 0;

      const coin = globals.currentCoin;
      const nextFil = coin.fil + 1;

      if (nextFil >= globals.grid.rows) {
        globals.grid.setCell(coin.fil, coin.col, coin.type + 1);
        this.checkMatches(coin.fil, coin.col);
        globals.currentCoin = new Coin();
        globals.dropTimer = 0;
      } else if (globals.grid.data[nextFil][coin.col] === 4) {
        coin.explode();
        globals.lives--;
        this.reduceGoblinRockCount();
        globals.grid.setCell(nextFil, coin.col, 0);

        if (globals.lives <= 0) {
          this.gameState = GameState.GAME_OVER;
          globals.gameState = GameState.GAME_OVER;
        }
      } else if (globals.grid.data[nextFil][coin.col] !== 0) {
        globals.grid.setCell(coin.fil, coin.col, coin.type + 1);
        this.checkMatches(coin.fil, coin.col);
        globals.currentCoin = new Coin();
        globals.dropTimer = 0;
      } else {
        coin.fil = nextFil;
      }
    }
  }

  reduceGoblinRockCount() {
    for (let i = 0; i < globals.enemies.length; i++) {
      if (globals.enemies[i].id === SpriteID.GOBLIN) {
        globals.enemies[i].rockCount = globals.enemies[i].rockCount - 1;
      }
    }
  }

  checkMatches(row, col) {
    const type = globals.grid.data[row][col];
    if (type === 0 || type === 4 || type === 5) return;

    let count = 1;

    let c = col - 1;
    while (c >= 0 && globals.grid.data[row][c] === type) {
      count++;
      c--;
    }

    c = col + 1;
    while (c < globals.grid.cols && globals.grid.data[row][c] === type) {
      count++;
      c++;
    }

    if (count >= 3) {
      let start = col;
      while (start > 0 && globals.grid.data[row][start - 1] === type) {
        start--;
      }
      let end = col;
      while (
        end < globals.grid.cols - 1 &&
        globals.grid.data[row][end + 1] === type
      ) {
        end++;
      }
      for (let x = start; x <= end; x++) {
        globals.grid.setCell(row, x, 5);
      }
      globals.matchExploding = true;
      globals.matchTimer = 0;
      this.addPoints(count);
    }

    count = 1;

    let r = row - 1;
    while (r >= 0 && globals.grid.data[r][col] === type) {
      count++;
      r--;
    }
    r = row + 1;
    while (r < globals.grid.rows && globals.grid.data[r][col] === type) {
      count++;
      r++;
    }

    if (count >= 3) {
      let start = row;
      while (start > 0 && globals.grid.data[start - 1][col] === type) {
        start--;
      }
      let end = row;
      while (
        end < globals.grid.rows - 1 &&
        globals.grid.data[end + 1][col] === type
      ) {
        end++;
      }
      for (let y = start; y <= end; y++) {
        globals.grid.setCell(y, col, 5);
      }
      globals.matchExploding = true;
      globals.matchTimer = 0;
      this.addPoints(count);
    }
  }

  addPoints(amount) {
    if (amount === 3) {
      globals.score = globals.score + 100;
    } else if (amount === 4) {
      globals.score = globals.score + 200;
    } else {
      globals.score = globals.score + 300;
    }

    if (globals.score >= 1000) {
      this.gameState = GameState.WIN;
      globals.gameState = GameState.WIN;
    }
  }

  applyGravity() {
    for (let col = 0; col < globals.grid.cols; col++) {
      for (let row = globals.grid.rows - 1; row >= 0; row--) {
        const value = globals.grid.data[row][col];

        if (value !== 0 && value !== 4) {
          let newRow = row;
          while (
            newRow + 1 < globals.grid.rows &&
            globals.grid.data[newRow + 1][col] === 0
          ) {
            newRow++;
          }

          if (newRow !== row) {
            globals.grid.setCell(newRow, col, value);
            globals.grid.setCell(row, col, 0);
          }
        }
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

  updateGameOver(dt) {
    globals.lives = 3;
    if (globals.action.space) {
      globals.action.space = false;
      this.gameState = GameState.MENU;
      globals.gameState = GameState.MENU;
    }
  }

  updateWin(dt) {
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
