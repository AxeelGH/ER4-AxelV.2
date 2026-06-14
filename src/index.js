import globals from "./config/globals.js";
import { initGame } from "./game.js";

globals.canvas = document.getElementById("gameScreen");
globals.ctx = globals.canvas.getContext("2d");

initGame();