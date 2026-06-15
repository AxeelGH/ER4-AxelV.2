import globals from "./config/globals.js";
import { GameState } from "./config/constants.js";
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
  }
  render() {
    switch (globals.gameState) {
      case GameState.MENU:
        this.renderMenu();
        break;

      case GameState.PLAYING:
        this.renderPlaying();
        this.renderHud();
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
}
