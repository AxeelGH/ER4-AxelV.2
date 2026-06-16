import globals from "./config/globals.js";
import {
  GameState,
  CELL_SIZE,
  COIN_SIZE,
  SpriteID,
  State,
} from "./config/constants.js";
import GridView from "./map/GridView.js";
import Chronometer from "./Chronometer.js";

export class View {
  constructor(ctx, game) {
    this.ctx = ctx;
    this.game = game;
    this.gridView = new GridView(ctx);

    this.menuBackground = new Image();
    this.menuBackground.src = "./assets/images/MenuBackground.png";

    this.GameLogo = new Image();
    this.GameLogo.src = "./assets/images/GameLogo.png";

    this.secondaryBackground = new Image();
    this.secondaryBackground.src = "./assets/images/StoryBackground.png";

    this.playBackground = new Image();
    this.playBackground.src = "./assets/images/GameBackground.png";

    this.gameOverBackground = new Image();
    this.gameOverBackground.src = "./assets/images/GameOverBackground.png";

    this.winBackground = new Image();
    this.winBackground.src = "./assets/images/WinBackground.png";
  }
  render() {
    switch (globals.gameState) {
      case GameState.MENU:
        this.renderMenu();
        break;

      case GameState.PLAYING:
        this.renderPlaying();
        break;

      case GameState.STORY:
        this.renderStory();
        break;

      case GameState.CONTROLS:
        this.renderControls();
        break;
      case GameState.HIGHSCORE:
        this.renderHighscore();
        break;

      case GameState.GAME_OVER:
        this.renderGameOver();
        break;

      case GameState.WIN:
        this.renderWin();
        break;

      case GameState.BETWEEN_LEVELS:
        this.renderBetweenLevels();
        break;
    }
  }

  renderMenu() {
    this.ctx.drawImage(
      this.menuBackground,
      0,
      0,
      this.ctx.canvas.width,
      this.ctx.canvas.height,
    );

    this.ctx.drawImage(this.GameLogo, 0, 0, 200, 150);

    const options = ["STORY", "PLAY", "CONTROLS", "HIGHSCORE"];
    const startY = 180;
    const spacing = 45;

    for (let i = 0; i < options.length; i++) {
      if (i === globals.menuIndex) {
        this.ctx.fillStyle = "#FFD700";
        this.ctx.font = "bold 18px dungeon";
      } else {
        this.ctx.fillStyle = "#FFFFFF";
        this.ctx.font = "14px dungeon";
      }

      this.ctx.textAlign = "center";
      this.ctx.fillText(
        options[i],
        this.ctx.canvas.width / 2,
        startY + i * spacing,
      );
    }
  }

  renderPlaying() {
    this.ctx.drawImage(
      this.playBackground,
      0,
      0,
      this.ctx.canvas.width,
      this.ctx.canvas.height,
    );
    this.gridView.render();
    this.renderGridContent();
    for (let i = 0; i < globals.enemies.length; i++) {
      globals.enemies[i].draw(this.ctx);
    }
    this.renderHud();
  }

  renderGridContent() {
    const img = globals.tileSets[0];

    if (globals.currentCoin) {
      const coin = globals.currentCoin;
      const pos = this.gridView.cellToPixel(coin.col, coin.fil);
      const srcX = coin.frames.frameCounter * 32;

      let srcY = coin.type * 32;
      if (coin.state === State.EXPLOSION) {
        srcY = 3 * 32;
      }

      this.ctx.drawImage(
        img,
        srcX,
        srcY,
        32,
        32,
        pos.x,
        pos.y,
        COIN_SIZE,
        COIN_SIZE,
      );
    }

    for (let fil = 0; fil < globals.grid.rows; fil++) {
      for (let col = 0; col < globals.grid.cols; col++) {
        const value = globals.grid.data[fil][col];
        if (value === 0) continue;

        const pos = this.gridView.cellToPixel(col, fil);

        if (value === 4) {
          this.ctx.drawImage(
            img,
            0,
            160,
            32,
            32,
            pos.x,
            pos.y,
            COIN_SIZE,
            COIN_SIZE,
          );
        } else if (value === 5) {
          const frame = Math.floor((globals.matchTimer / 0.4) * 8);
          const srcX = frame * 32;
          this.ctx.drawImage(
            img,
            srcX,
            3 * 32,
            32,
            32,
            pos.x,
            pos.y,
            COIN_SIZE,
            COIN_SIZE,
          );
        } else {
          const type = value - 1;
          this.ctx.drawImage(
            img,
            0,
            type * 32,
            32,
            32,
            pos.x,
            pos.y,
            COIN_SIZE,
            COIN_SIZE,
          );
        }
      }
    }
  }

  renderHud() {
    const chrono = globals.chrono;
    const timeString = chrono.getTime(globals.levelTime);

    const ctx = this.ctx;
    const canvas = ctx.canvas;

    ctx.textAlign = "left";
    ctx.font = "16px dungeon";

    ctx.fillStyle = "lightblue";
    ctx.fillText("SCORE", 360, 120);
    ctx.fillStyle = "lightgray";
    ctx.fillText(" " + globals.score, 345, 135);

    ctx.fillStyle = "lightblue";
    ctx.fillText("LEVEL " + globals.currentLevel, canvas.width - 150, 60);

    ctx.fillStyle = "lightblue";
    ctx.fillText("HIGH SCORE", canvas.width - 150, 80);
    ctx.fillStyle = "lightgray";
    ctx.fillText(" " + globals.highScore, canvas.width - 167, 95);

    ctx.fillStyle = "lightblue";
    ctx.fillText("TIME", 50, canvas.height - 320);
    ctx.fillStyle = "lightgray";
    ctx.fillText(" " + timeString, 30, canvas.height - 305);

    ctx.fillStyle = "lightblue";
    ctx.fillText("GOAL SCORE", 10, canvas.height - 290);
    ctx.fillStyle = "lightgray";
    ctx.textAlign = "left";
    ctx.fillText(" " + globals.goalScore, 40, canvas.height - 275);

    ctx.fillStyle = "lightblue";
    ctx.fillText("LIVES", 360, 155);
    this.renderLives(360, 180, globals.lives);

    ctx.fillStyle = "lightblue";
    ctx.fillText("POWER-UP", 360, 240);
    ctx.fillStyle = "lightgray";
    ctx.fillText(globals.currentPowerUP, 360, 260);
  }

  renderLives(x, y, lives) {
    const ctx = this.ctx;
    ctx.font = "20px dungeon";
    ctx.fillStyle = "#ff6666";
    for (let i = 0; i < lives; i++) {
      ctx.fillText("❤️", x + i * 25, y);
    }
  }

  renderStory() {
    this.ctx.drawImage(
      this.secondaryBackground,
      0,
      0,
      this.ctx.canvas.width,
      this.ctx.canvas.height,
    );

    this.ctx.fillStyle = "#eca409ff";
    this.ctx.font = "32px dungeon";
    this.ctx.textAlign = "center";
    this.ctx.fillText("STORY", 240, 30);

    this.ctx.fillStyle = "#ffffffff";
    this.ctx.font = "11px dungeon";
    this.ctx.textAlign = "center";

    const storyLines = [
      "X.G was walking at night",
      "when he saw a glowing sword.",
      "It had a rare gem called",
      "'Flamestrosyum', known for",
      "its magical properties.",
      "",
      "But Aivan had it,",
      "a greedy merchant in the city,",
      "well known for his shop.",
      "",
      "After losing a bet,",
      "X.G lost his magical glasses.",
      "Now he must dispel Aivan's",
      "curse to retrieve his glasses",
      "and claim the sword.",
    ];

    let yPos = 70;
    for (let i = 0; i < storyLines.length; i++) {
      this.ctx.fillText(storyLines[i], 230, yPos);
      yPos += 18;
    }

    this.ctx.fillStyle = "#888888";
    this.ctx.font = "20px dungeon";
    this.ctx.textAlign = "center";
    this.ctx.fillText("Press SPACE to return", 256, 375);
  }

  renderControls() {
    this.ctx.drawImage(
      this.secondaryBackground,
      0,
      0,
      this.ctx.canvas.width,
      this.ctx.canvas.height,
    );

    const X = 230;

    this.ctx.fillStyle = "#eca409ff";
    this.ctx.font = "32px dungeon";
    this.ctx.textAlign = "center";
    this.ctx.fillText("CONTROLS", 240, 30);

    this.ctx.font = "16px dungeon";

    this.ctx.fillStyle = "  #FFD700";
    this.ctx.fillText("LEFT ARROW (←)", X, 80);
    this.ctx.fillStyle = "#FFFFFF";
    this.ctx.fillText("Move left", X, 100);

    this.ctx.fillStyle = "#FFD700";
    this.ctx.fillText("RIGHT ARROW (→)", X, 130);
    this.ctx.fillStyle = "#FFFFFF";
    this.ctx.fillText("Move right", X, 150);

    this.ctx.fillStyle = "#FFD700";
    this.ctx.fillText("UP ARROW (↑)", X, 170);
    this.ctx.fillStyle = "#FFFFFF";
    this.ctx.fillText("Rotate piece", X, 190);

    this.ctx.fillStyle = "#FFD700";
    this.ctx.fillText("DOWN ARROW (↓)", X, 210);
    this.ctx.fillStyle = "#FFFFFF";
    this.ctx.fillText("Fast drop", X, 230);

    this.ctx.fillStyle = "#FFD700";
    this.ctx.fillText("SPACE", X, 260);
    this.ctx.fillStyle = "#FFFFFF";
    this.ctx.fillText("Select / PowerUp", X, 280);

    this.ctx.fillStyle = "#888888";
    this.ctx.font = "20px dungeon";
    this.ctx.fillText("Press SPACE to return", 256, 370);
  }

  renderHighscore() {
    this.ctx.fillStyle = "#000000";
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.ctx.fillStyle = "#FFFFFF";
    this.ctx.font = "16px dungeon";
    this.ctx.textAlign = "center";
    this.ctx.fillText(
      "HIGHSCORES -Press SPACE to return",
      this.ctx.canvas.width / 2,
      200,
    );
  }

  renderGameOver() {
    globals.ctx.drawImage(
      this.gameOverBackground,
      0,
      0,
      this.ctx.canvas.width,
      this.ctx.canvas.height,
    );

    this.ctx.fillStyle = "#FF0000";
    this.ctx.font = "48px dungeon";
    this.ctx.textAlign = "center";
    this.ctx.fillText("GAME OVER", this.ctx.canvas.width / 2, 40);

    this.ctx.fillStyle = "#FFFFFF";
    this.ctx.font = "24px dungeon";
    this.ctx.fillText(
      "FINAL SCORE: " + globals.score,
      this.ctx.canvas.width / 2,
      70,
    );

    this.ctx.fillStyle = "#FFD700";
    this.ctx.font = "20px dungeon";
    this.ctx.fillText(
      "HIGH SCORE: " + globals.highScore,
      this.ctx.canvas.width / 2,
      100,
    );

    this.ctx.fillStyle = "#FFFFFF";
    this.ctx.font = "16px dungeon";
    this.ctx.fillText(
      "Press SPACE to return to menu",
      this.ctx.canvas.width / 2,
      this.ctx.canvas.height - 50,
    );
  }

  renderWin() {
    globals.ctx.drawImage(
      this.winBackground,
      0,
      0,
      this.ctx.canvas.width,
      this.ctx.canvas.height,
    );
    this.ctx.fillStyle = "#eca409ff";
    this.ctx.font = "48px dungeon";
    this.ctx.textAlign = "center";
    this.ctx.fillText("YOU WIN!!", this.ctx.canvas.width / 2, 45);

    this.ctx.fillStyle = "#FFFFFF";
    this.ctx.font = "20px dungeon";
    this.ctx.fillText("FINAL SCORE: " + globals.score, 370, 300);

    this.ctx.fillStyle = "#FFD700";
    this.ctx.font = "20px dungeon";
    this.ctx.fillText("HIGH SCORE: " + globals.highScore, 360, 330);

    this.ctx.fillStyle = "#FFFFFF";
    this.ctx.font = "16px dungeon";
    this.ctx.fillText(
      "Press SPACE to return to menu",
      this.ctx.canvas.width / 2,
      375,
    );
  }

  renderBetweenLevels() {
    this.ctx.drawImage(
      this.playBackground,
      0,
      0,
      this.ctx.canvas.width,
      this.ctx.canvas.height,
    );

    this.ctx.fillStyle = "#eca409ff";
    this.ctx.font = "40px dungeon";
    this.ctx.textAlign = "center";
    this.ctx.fillText("LEVEL 2", this.ctx.canvas.width / 2, 60);

    this.ctx.fillStyle = "#FFFFFF";
    this.ctx.font = "40px dungeon";
    this.ctx.fillText("ARE YOU READY?", this.ctx.canvas.width / 2, 210);

    this.ctx.fillStyle = "#888888";
    this.ctx.font = "16px dungeon";
    this.ctx.fillText(
      "Press SPACE to continue",
      this.ctx.canvas.width / 2,
      380,
    );
  }
}
