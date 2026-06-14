import globals from "./config/globals.js";
import { GameState } from "./config/constants.js";

export class View {
  constructor(ctx, game) {
    this.ctx = ctx;
    this.game = game;

    this.menuBackground = new Image();
    this.menuBackground.src = "./assets/images/MenuBackground.png";

    this.GameLogo = new Image();
    this.GameLogo.src = "./assets/images/GameLogo.png";
  }
    render() {
    switch (globals.gameState) {

        case GameState.MENU:
            this.renderMenu();
            break;
    }
  }

    renderMenu() {
        this.ctx.drawImage(this.menuBackground, 0, 0,this.ctx.canvas.width, this.ctx.canvas.height);

        this.ctx.drawImage(this.GameLogo, 0, 0, 200, 150);
    }

}