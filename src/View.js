import globals from "./config/globals.js";
import {
  GameState,
  CELL_SIZE,
  COIN_SIZE,
  SpriteID,
  State,
  ALPHABET,
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

    this.highScoreBackground = new Image();
    this.highScoreBackground.src = "./assets/images/HighScoresBackground.png";
  }
  render() {
    switch (globals.gameState) {
      case GameState.INTRO:
        this.renderIntro();
        break;

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

      case GameState.LOAD_HIGH_SCORES:
        this.renderLoadHighScores();
        break;

      case GameState.ENTER_NAME:
        this.renderEnterName();
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
          const centerX = pos.x + COIN_SIZE / 2;
          const centerY = pos.y + COIN_SIZE / 2;

          this.ctx.save();
          this.ctx.translate(centerX, centerY);
          this.ctx.rotate(globals.rockRotationAngle);

          this.ctx.drawImage(
            img,
            0,
            160,
            32,
            32,
            -COIN_SIZE / 2,
            -COIN_SIZE / 2,
            COIN_SIZE,
            COIN_SIZE,
          );
          this.ctx.restore();
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
      if (globals.powerUp) {
        const powerUp = globals.powerUp;
        const pos = this.gridView.cellToPixel(powerUp.col, powerUp.fil);
        this.ctx.drawImage(
          img,
          0,
          powerUp.row * 32,
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
    if (globals.powerUpHeld) {
      const img = globals.tileSets[0];
      this.ctx.drawImage(
        img,
        0,
        globals.powerUpHeld.row * 32,
        32,
        32,
        360,
        250,
        30,
        30,
      );
    } else {
      ctx.fillStyle = "lightgray";
      ctx.fillText("NONE", 360, 260);
    }

    ctx.fillStyle = "lightblue";
    ctx.font = "16px dungeon";
    ctx.fillText("CURSE BAR", 10, canvas.height - 250);

    const currentCurse = Math.min(1, globals.curseValue / globals.maxCurse);

    this.ctx.fillStyle = "red";
    const fillWidth = 85 * currentCurse;
    this.ctx.fillRect(25, 155, fillWidth, 10);

    const img = globals.tileSets[0];
    this.ctx.drawImage(img, 0, 14 * 32, 112, 32, 10, 140, 112, 32);

    const faceFrames = 7;
    const faceFrame = Math.min(
      faceFrames - 1,
      Math.floor((globals.curseValue / globals.maxCurse) * faceFrames),
    );

    this.ctx.drawImage(img, faceFrame * 32, 15 * 32, 32, 32, 40, 280, 64, 64);
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
    this.ctx.fillText("DOWN ARROW (↓)", X, 180);
    this.ctx.fillStyle = "#FFFFFF";
    this.ctx.fillText("Fast drop", X, 200);

    this.ctx.fillStyle = "#FFD700";
    this.ctx.fillText("SPACE", X, 280);
    this.ctx.fillStyle = "#FFFFFF";
    this.ctx.fillText("Select / PowerUp", X, 300);

    this.ctx.fillStyle = "#888888";
    this.ctx.font = "20px dungeon";
    this.ctx.fillText("Press SPACE to return", 256, 370);
  }

  renderHighscore() {
    this.ctx.drawImage(
      this.highScoreBackground,
      0,
      0,
      this.ctx.canvas.width,
      this.ctx.canvas.height,
    );

    this.ctx.fillStyle = "#FFD700";
    this.ctx.font = "28px dungeon";
    this.ctx.textAlign = "center";
    this.ctx.fillText("HIGH SCORES", this.ctx.canvas.width / 2, 28);

    this.ctx.fillStyle = "#000000ff";
    this.ctx.font = "12px dungeon";
    this.ctx.textAlign = "left";
    this.ctx.fillText("POS", 40, 50);
    this.ctx.fillText("NAME", 85, 50);
    this.ctx.fillText("SCORE", 150, 50);

    this.ctx.fillStyle = "#555555";
    this.ctx.fillRect(20, 55, this.ctx.canvas.width - 40, 1);

    const startIndex = globals.highScorePage * 10;
    const endIndex = Math.min(startIndex + 10, globals.highScores.length);

    for (let i = startIndex; i < endIndex; i++) {
      const hs = globals.highScores[i];
      const y = 72 + (i - startIndex) * 27;
      const isHighlighted =
        globals.highScoreMode === "gameover" && i === globals.newScorePosition;
      hs.render(this.ctx, 30, y, isHighlighted);
    }

    if (globals.highScoreMode === "menu") {
      const totalPages = Math.ceil(globals.highScores.length / 10);
      this.ctx.fillStyle = "#000000ff";
      this.ctx.font = "11px dungeon";
      this.ctx.textAlign = "center";
      this.ctx.fillText(
        "↑ ↓ CHANGE PAGE  |  PAGE " +
          (globals.highScorePage + 1) +
          "/" +
          totalPages,
        this.ctx.canvas.width / 2,
        this.ctx.canvas.height - 40,
      );
    }

    this.ctx.fillStyle = "#000000ff";
    this.ctx.font = "11px dungeon";
    this.ctx.textAlign = "center";
    this.ctx.fillText(
      "Press SPACE to go back to the menu",
      this.ctx.canvas.width / 2,
      this.ctx.canvas.height - 25,
    );
  }

  renderEnterName() {
    this.ctx.drawImage(
      this.secondaryBackground,
      0,
      0,
      this.ctx.canvas.width,
      this.ctx.canvas.height,
    );

    this.ctx.fillStyle = "#FFD700";
    this.ctx.font = "20px dungeon";
    this.ctx.textAlign = "center";
    this.ctx.fillText("INSERT YOUR NAME", 230, 75);

    this.ctx.fillStyle = "#FFFFFF";
    this.ctx.font = "14px dungeon";
    this.ctx.fillText("SCORE: " + globals.score, 230, 105);

    const centerX = 230;
    for (let i = 0; i < 3; i++) {
      const letterX = centerX - 40 + i * 40;

      if (i === globals.nameInputIndex) {
        this.ctx.fillStyle = "#FFD700";
      } else {
        this.ctx.fillStyle = "#FFFFFF";
      }

      this.ctx.font = "40px dungeon";
      this.ctx.textAlign = "center";
      this.ctx.fillText(ALPHABET[globals.nameLetterIndexes[i]], letterX, 170);

      if (i === globals.nameInputIndex) {
        this.ctx.fillStyle = "#FFD700";
        this.ctx.fillRect(letterX - 15, 175, 30, 3);
      }
    }

    this.ctx.fillStyle = "#888888";
    this.ctx.font = "11px dungeon";
    this.ctx.textAlign = "center";
    this.ctx.fillText("← → SELECT POSITION", centerX, 215);
    this.ctx.fillText("↑ ↓ CHANGE LETTER", centerX, 235);
    this.ctx.fillText("Press SPACE to confirm", centerX, 350);
  }

  renderLoadHighScores() {
    this.ctx.fillStyle = "#000000";
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.ctx.fillStyle = "#FFFFFF";
    this.ctx.font = "16px dungeon";
    this.ctx.textAlign = "center";
    this.ctx.fillText(
      "LOADING...",
      this.ctx.canvas.width / 2,
      this.ctx.canvas.height / 2,
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
      "Press SPACE to insert your name",
      this.ctx.canvas.width / 2,
      this.ctx.canvas.height - 50,
    );
  }

  renderWin() {
    this.ctx.drawImage(
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
    this.ctx.fillText("FINAL SCORE: " + globals.score, 350, 300);

    this.ctx.fillStyle = "#FFD700";
    this.ctx.font = "20px dungeon";
    this.ctx.fillText("HIGH SCORE: " + globals.highScore, 342, 330);

    this.ctx.fillStyle = "#FFFFFF";
    this.ctx.font = "16px dungeon";
    this.ctx.fillText(
      "Press SPACE to insert your name",
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
    this.ctx.fillText("LEVEL "+ (globals.currentLevel + 1), this.ctx.canvas.width / 2, 60);

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

  renderIntro() {
    this.ctx.drawImage(this.GameLogo, 150, 0, 250, 200);

    this.ctx.fillStyle = "#FFFFFF";
    this.ctx.font = "40px dungeon";
    this.ctx.fillText("ARE YOU READY?", 10, 280);

    this.ctx.fillStyle = "#888888";
    this.ctx.font = "16px dungeon";
    this.ctx.fillText("Press SPACE to continue", 80, 380);
  }
}
