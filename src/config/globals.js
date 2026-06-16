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
  currentLevel: 1,
  goalScore: 0,
  lives: 3,
  chrono: null,
  currentPowerUP: "NONE",
  curse:0,
  levelTime: 120,

  menuIndex: 0,

  grid: null,

  currentCoin: null,
  dropTimer: 0,
  dropInterval: 1.0,

  enemies: [],

  matchTimer:0,
  matchExploding:false,
};
