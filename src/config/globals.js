import { FPS, GameState } from "./constants.js";

export default {
  canvas: {},
  ctx: {},
  previousCycleMilliseconds: 0,
  deltaTime: 0,
  cycleRealTime: 0,
  frameTimeObj: 1 / FPS,
  gameState: GameState.INVALID,

  action: {},
  assetsToLoad: [],
  assetsLoaded: 0,
  tileSets: [],

  score: 0,
  highScore: 0,
  level: 1,
  lives: 3,

  menuIndex: 0,

  grid: null,
};
