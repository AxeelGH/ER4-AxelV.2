import globals from "./config/globals.js";
import {
  GameState,
  SpriteID,
  State,
  ALPHABET,
  Sound,
} from "./config/constants.js";
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
import PowerUp from "./sprites/PowerUp.js";
import HighScore from "./HighScore.js";

class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");

    globals.ctx = this.ctx;

    this.gameState = GameState.INTRO;
    globals.gameState = GameState.INTRO;
    console.log("Game State: LOADING");

    this.inputManager = new Events();
    this.view = new View(this.ctx, this);

    globals.grid = new Grid();
    this.gridView = new GridView(this.ctx);
    globals.chrono = new Chronometer();
    globals.currentSound = Sound.NO_SOUND;

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

      case GameState.INTRO:
        this.updateIntro(dt);
        break;

      case GameState.MENU:
        this.updateMenu(dt);
        break;

      case GameState.PLAYING:
        this.updatePlaying(dt);
        break;

      case GameState.STORY:
        this.updateStory(dt);
        break;

      case GameState.CONTROLS:
        this.updateSecondary(dt);
        break;

      case GameState.HIGHSCORE:
        this.updateHighScore(dt);
        break;

      case GameState.LOAD_HIGH_SCORES:
        this.updateLoadHighScores(dt);
        break;

      case GameState.ENTER_NAME:
        this.updateEnterName(dt);
        break;

      case GameState.GAME_OVER:
        this.updateGameOver(dt);
        break;

      case GameState.WIN:
        this.updateWin(dt);
        break;

      case GameState.BETWEEN_LEVELS:
        this.updateBetweenLevels(dt);
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
          this.stopMusic();
          globals.sounds[Sound.STORY_MUSIC].play();
          globals.sounds[Sound.STORY_MUSIC].volume = 0.5;
          this.gameState = GameState.STORY;
          globals.gameState = GameState.STORY;
          break;
        case 1:
          this.stopMusic();
          globals.sounds[Sound.GAME_MUSIC].play();
          globals.sounds[Sound.GAME_MUSIC].volume = 0.3;
          this.gameState = GameState.PLAYING;
          globals.gameState = GameState.PLAYING;
          globals.levelTime = 120;
          globals.currentLevel = 1;
          globals.goalScore = 1000;
          globals.score = 0;
          globals.powerUp = null;
          globals.powerUpHeld = null;
          globals.powerUpSpawnTimer = 0;
          globals.curseValue = 0;
          globals.curseActive = false;
          globals.dropInterval = globals.dropBaseInterval;
          globals.grid.init();
          break;
        case 2:
          this.gameState = GameState.CONTROLS;
          globals.gameState = GameState.CONTROLS;
          break;
        case 3:
          globals.highScoreMode = "menu";
          globals.highScorePage = 0;
          globals.loadingHighScores = false;
          this.gameState = GameState.LOAD_HIGH_SCORES;
          globals.gameState = GameState.LOAD_HIGH_SCORES;
          break;
      }
    }
  }

  updatePlaying(dt) {
    if (globals.levelTime > 0) {
      globals.levelTime -= dt;
    }
    if (globals.lives <= 0) {
      if (globals.currentLevel === 3) {
        this.gameState = GameState.WIN;
        globals.gameState = GameState.WIN;
      } else {
        this.gameState = GameState.GAME_OVER;
        globals.gameState = GameState.GAME_OVER;
      }
      return;
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

    globals.rockRotationAngle += dt;

    globals.curseValue += globals.curseRate * dt;
    if (globals.curseValue >= globals.maxCurse) {
      if (globals.currentLevel === 3) {
        this.gameState = GameState.WIN;
        globals.gameState = GameState.WIN;
      } else {
        this.gameState = GameState.GAME_OVER;
        globals.gameState = GameState.GAME_OVER;
      }
      return;
    }

    if (globals.curseValue >= 50 && !globals.curseActive) {
      globals.dropBaseInterval = 0.35;
      globals.curseActive = true;
    }

    if (globals.curseValue < 50 && globals.curseActive) {
      globals.curseActive = false;
      globals.dropInterval = 0.7;
    }

    if (globals.levelTime <= 0) {
      if (globals.currentLevel === 3) {
        this.gameState = GameState.WIN;
        globals.gameState = GameState.WIN;
      } else {
        this.gameState = GameState.GAME_OVER;
        globals.gameState = GameState.GAME_OVER;
      }
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

    if (!globals.powerUp && !globals.powerUpHeld) {
      globals.powerUpSpawnTimer += dt;
      if (globals.powerUpSpawnTimer >= 8) {
        globals.powerUpSpawnTimer = 0;
        if (Math.random() < 0.5) {
          this.spawnPowerUp();
        }
      }
    }

    if (globals.powerUp) {
      globals.powerUp.update();
    }

    if (globals.powerUp && globals.currentCoin) {
      if (
        globals.currentCoin.col === globals.powerUp.col &&
        globals.currentCoin.fil === globals.powerUp.fil
      ) {
        globals.powerUpHeld = globals.powerUp;
        globals.powerUp = null;
        globals.sounds[Sound.POWERUP_EFFECT].currentTime = 0;
        globals.sounds[Sound.POWERUP_EFFECT].play();
      }
    }

    if (globals.action.space && globals.powerUpHeld) {
      globals.action.space = false;
      this.usePowerUp();
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
          globals.curseValue += 10;
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
        globals.curseValue += 10;
        this.reduceGoblinRockCount();
        globals.grid.setCell(nextFil, coin.col, 0);
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
    let decreaseCurse = 0;
    globals.sounds[Sound.COIN_EFFECT].currentTime = 0;
    globals.sounds[Sound.COIN_EFFECT].play();
    if (amount === 3) {
      globals.score = globals.score + 100;
      decreaseCurse = 10;
    } else if (amount === 4) {
      globals.score = globals.score + 200;
      decreaseCurse = 20;
    } else {
      globals.score = globals.score + 300;
      decreaseCurse = 30;
    }

    globals.curseValue -= decreaseCurse;

    if (globals.score > globals.highScore) {
      globals.highScore = globals.score;
    }

    if (globals.currentLevel === 1 && globals.score >= globals.goalScore) {
      this.gameState = GameState.BETWEEN_LEVELS;
      globals.gameState = GameState.BETWEEN_LEVELS;
    }
    if (globals.currentLevel === 2 && globals.score >= globals.goalScore) {
      this.gameState = GameState.BETWEEN_LEVELS;
      globals.gameState = GameState.BETWEEN_LEVELS;
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

  spawnPowerUp() {
    const newPowerUp = new PowerUp();

    let tries = 0;
    while (tries < 20) {
      const col = Math.floor(Math.random() * globals.grid.cols);
      const fil = Math.floor(Math.random() * (globals.grid.rows - 5)) + 3;

      if (globals.grid.data[fil][col] === 0) {
        newPowerUp.col = col;
        newPowerUp.fil = fil;
        globals.powerUp = newPowerUp;
        return;
      }
      tries++;
    }
  }

  usePowerUp() {
    globals.sounds[Sound.POWERUP_EFFECT].currentTime = 0;
    globals.sounds[Sound.POWERUP_EFFECT].play();
    if (globals.powerUpHeld.type === SpriteID.POWERUP_BOMB) {
      for (let row = 0; row < globals.grid.rows; row++) {
        for (let col = 0; col < globals.grid.cols; col++) {
          if (globals.grid.data[row][col] === 4) {
            globals.grid.setCell(row, col, 0);
          }
        }
      }
      globals.goblinRef.rockCount = 0;
    } else if (globals.powerUpHeld.type === SpriteID.POWERUP_GOLD) {
      for (let row = 0; row < globals.grid.rows; row++) {
        for (let col = 0; col < globals.grid.cols; col++) {
          const value = globals.grid.data[row][col];
          if (value === 1 || value === 2 || value === 3) {
            globals.grid.setCell(row, col, 3);
          }
        }
      }
    }

    globals.powerUpHeld = null;
  }

  startLevel2() {
    globals.currentLevel = 2;
    globals.goalScore = 1500;
    globals.levelTime = 120;
    globals.powerUp = null;
    globals.powerUpSpawnTimer = 0;
    globals.curseValue = 0;

    globals.grid.init();

    globals.enemies = [];
    const goblin = new Goblin();
    goblin.maxRocks = 4;
    goblin.moveInterval = 0.3;
    const bat1 = new Bat();
    const bat2 = new Bat();
    bat1.moveInterval = 0.2;
    globals.enemies.push(goblin);
    globals.enemies.push(bat1);
    globals.enemies.push(bat2);
    globals.goblinRef = goblin;

    globals.currentCoin = new Coin();
    globals.dropTimer = 0;
  }

  startLevel3() {
    globals.currentLevel = 3;
    globals.goalScore = 9999999;
    globals.levelTime = 120;
    globals.powerUp = null;
    globals.powerUpSpawnTimer = 0;
    globals.curseValue = 0;

    globals.grid.init();

    globals.enemies = [];
    const goblin = new Goblin();
    goblin.maxRocks = 5;
    goblin.moveInterval = 0.3;
    const bat1 = new Bat();
    const bat2 = new Bat();
    const bat3 = new Bat();
    bat1.moveInterval = 0.2;
    bat3.moveInterval = 0.3;
    globals.enemies.push(goblin);
    globals.enemies.push(bat1);
    globals.enemies.push(bat2);
    globals.enemies.push(bat3);
    globals.goblinRef = goblin;

    globals.currentCoin = new Coin();
    globals.dropTimer = 0;
  }

  updateBetweenLevels(dt) {
    if (globals.action.space) {
      globals.action.space = false;
      if (globals.currentLevel === 1) {
        this.startLevel2();
      } else if (globals.currentLevel === 2) {
        this.startLevel3();
      }
      this.gameState = GameState.PLAYING;
      globals.gameState = GameState.PLAYING;
    }
  }

  updateSecondary(dt) {
    if (globals.action.space) {
      globals.action.space = false;
      this.gameState = GameState.MENU;
      globals.gameState = GameState.MENU;
    }
  }

  updateStory(dt) {
    if (globals.action.space) {
      globals.action.space = false;
      this.stopMusic();
      globals.sounds[Sound.SECONDARY_MUSIC].play();
      globals.sounds[Sound.SECONDARY_MUSIC].volume = 0.5;
      this.gameState = GameState.MENU;
      globals.gameState = GameState.MENU;
    }
  }

  updateGameOver(dt) {
    globals.lives = 3;
    if (globals.action.space) {
      globals.action.space = false;
      this.stopMusic();
      globals.sounds[Sound.SECONDARY_MUSIC].play();
      globals.sounds[Sound.SECONDARY_MUSIC].volume = 0.5;
      globals.nameLetterIndexes = [0, 0, 0];
      globals.nameInputIndex = 0;
      globals.enterNameReady = false;
      this.gameState = GameState.ENTER_NAME;
      globals.gameState = GameState.ENTER_NAME;
    }
  }

  updateWin(dt) {
    if (globals.action.space) {
      globals.action.space = false;
      this.stopMusic();
      globals.sounds[Sound.SECONDARY_MUSIC].play();
      globals.sounds[Sound.SECONDARY_MUSIC].volume = 0.5;
      globals.nameLetterIndexes = [0, 0, 0];
      globals.nameInputIndex = 0;
      globals.enterNameReady = false;
      this.gameState = GameState.ENTER_NAME;
      globals.gameState = GameState.ENTER_NAME;
    }
  }

  updateLoadHighScores(dt) {
    console.log("LOAD HIGH SCORE");
    if (!globals.loadingHighScores) {
      globals.loadingHighScores = true;
      this.fetchHighScores();
    }
  }

  async fetchHighScores() {
    try {
      const response = await fetch("http://localhost:8000/api/highscores");
      const data = await response.json();

      globals.highScores = [];
      for (let i = 0; i < data.length; i++) {
        const highScore = new HighScore(i + 1, data[i].name, data[i].score);
        globals.highScores.push(highScore);
      }

      if (globals.highScoreMode === "gameover") {
        globals.newScorePosition = -1;
        for (let i = 0; i < globals.highScores.length; i++) {
          if (
            globals.highScores[i].name === globals.newScoreName &&
            globals.highScores[i].score === globals.score
          ) {
            globals.newScorePosition = i;
            break;
          }
        }
        globals.highScorePage = Math.floor(globals.newScorePosition / 10);
      }
    } catch (error) {
      console.error("Failed to load High Scores:", error);
    }

    globals.action.space = false;
    globals.highScoreDelay = 0.5;
    globals.loadingHighScores = false;
    this.gameState = GameState.HIGHSCORE;
    globals.gameState = GameState.HIGHSCORE;
  }

  updateHighScore(dt) {
    console.log(
      "HIGHSCORE delay:",
      globals.highScoreDelay,
      "space:",
      globals.action.space,
    );

    if (globals.highScoreDelay > 0) {
      globals.highScoreDelay -= dt;
      globals.action.space = false;
      return;
    }
    if (globals.highScoreMode === "menu") {
      const totalPages = Math.ceil(globals.highScores.length / 10);

      if (globals.action.moveUp) {
        globals.action.moveUp = false;
        if (globals.highScorePage > 0) {
          globals.highScorePage = globals.highScorePage - 1;
        }
      }

      if (globals.action.moveDown) {
        globals.action.moveDown = false;
        if (globals.highScorePage < totalPages - 1) {
          globals.highScorePage = globals.highScorePage + 1;
        }
      }
    }

    if (globals.action.space) {
      globals.action.space = false;
      globals.newScorePosition = -1;
      this.gameState = GameState.MENU;
      globals.gameState = GameState.MENU;
    }
  }

  updateEnterName(dt) {
    if (globals.action.moveLeft) {
      globals.action.moveLeft = false;
      if (globals.nameInputIndex > 0) {
        globals.nameInputIndex = globals.nameInputIndex - 1;
      }
    }

    if (globals.action.moveRight) {
      globals.action.moveRight = false;
      if (globals.nameInputIndex < 2) {
        globals.nameInputIndex = globals.nameInputIndex + 1;
      }
    }

    if (globals.action.moveUp) {
      globals.action.moveUp = false;
      globals.nameLetterIndexes[globals.nameInputIndex] =
        globals.nameLetterIndexes[globals.nameInputIndex] + 1;
      if (
        globals.nameLetterIndexes[globals.nameInputIndex] >= ALPHABET.length
      ) {
        globals.nameLetterIndexes[globals.nameInputIndex] = 0;
      }
    }

    if (globals.action.moveDown) {
      globals.action.moveDown = false;
      globals.nameLetterIndexes[globals.nameInputIndex] =
        globals.nameLetterIndexes[globals.nameInputIndex] - 1;
      if (globals.nameLetterIndexes[globals.nameInputIndex] < 0) {
        globals.nameLetterIndexes[globals.nameInputIndex] = ALPHABET.length - 1;
      }
    }

    if (globals.action.space) {
      globals.action.space = false;
      const name =
        ALPHABET[globals.nameLetterIndexes[0]] +
        ALPHABET[globals.nameLetterIndexes[1]] +
        ALPHABET[globals.nameLetterIndexes[2]];
      this.insertHighScore(name, globals.score);
    }
  }

  async insertHighScore(name, score) {
    try {
      await fetch("http://localhost:8000/api/highscores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name, score: score }),
      });
    } catch (error) {
      console.error("Failed storing Highscore:", error);
    }

    globals.newScoreName = name;
    globals.highScoreMode = "gameover";
    globals.loadingHighScores = false;
    this.gameState = GameState.LOAD_HIGH_SCORES;
    globals.gameState = GameState.LOAD_HIGH_SCORES;
  }

  updateIntro() {
    if (globals.action.space) {
      globals.action.space = false;
      this.stopMusic();

      globals.sounds[Sound.SECONDARY_MUSIC].play();
      globals.sounds[Sound.SECONDARY_MUSIC].volume = 0.5;

      this.gameState = GameState.MENU;
      globals.gameState = GameState.MENU;
    }
  }

  stopMusic() {
    if (globals.sounds[Sound.GAME_MUSIC]) {
      globals.sounds[Sound.GAME_MUSIC].pause();
      globals.sounds[Sound.GAME_MUSIC].currentTime = 0;
    }
    if (globals.sounds[Sound.SECONDARY_MUSIC]) {
      globals.sounds[Sound.SECONDARY_MUSIC].pause();
      globals.sounds[Sound.SECONDARY_MUSIC].currentTime = 0;
    }

    if (globals.sounds[Sound.STORY_MUSIC]) {
      globals.sounds[Sound.STORY_MUSIC].pause();
      globals.sounds[Sound.STORY_MUSIC].currentTime = 0;
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
