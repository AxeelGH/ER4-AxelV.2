import PowerUp from "../sprites/PowerUp.js";
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
  goalScore: 1000,
  lives: 3,
  chrono: null,
  curse: 0,
  levelTime: 120,

  menuIndex: 0,

  grid: null,

  currentCoin: null,
  dropTimer: 0,
  dropInterval: 0.7,
  dropBaseInterval: 0.7,

  enemies: [],

  matchTimer: 0,
  matchExploding: false,

  powerUp: null,
  powerUpHeld: null,
  powerUpSpawnTimer: 0,

  maxCurse: 100,
  curseValue: 0,
  curseRate: 1.5,
  curseActive: false,

  highScores: [],
  highScoreMode: "menu",
  highScorePage: 0,
  nameLetterIndexes: [0, 0, 0],
  nameInputIndex: 0,
  newScorePosition: -1,
  loadingHighScores: false,
  newScoreName: "",
  highScoreReady: false,
  highScoreDelay: 0,
};
