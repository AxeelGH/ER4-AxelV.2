import globals from "./config/globals.js";
import { GameState } from "./config/constants.js";
import { Events } from "./events/Events.js";
import { View } from "./View.js";

class Game {
  constructor(canvas, gameData) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");

    globals.ctx = this.ctx;
    this.gameData = gameData;

    this.gameState = GameState.MENU;
    globals.gameState = GameState.MENU;
    console.log("Game State: MENU");

    this.inputManager = new Events();
    this.view = new View(this.ctx, this);

    globals.action = {
      moveUp: false,
      moveDown: false,
      moveLeft: false,
      moveRight: false,
      confirm: false,
    };
  }

    execute() {
    globals.previousCycleMilliseconds = 0;

    function gameLoop(currentTime) {
      requestAnimationFrame(gameLoop);

      if (globals.previousCycleMilliseconds === 0) {
        globals.previousCycleMilliseconds = currentTime;
        return;
      }

      const elapsedSeconds = (currentTime - globals.previousCycleMilliseconds) / 1000;
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
  
  update(dt) {
    switch (this.gameState) {
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

  export function initGame() {
  const canvas = globals.canvas;
  const game = new Game(canvas);
  globals.gameInstance = game;
  game.execute();
}

export {Game};