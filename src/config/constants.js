export const GameState = {
  INVALID: -1,
  LOADING: 0,
  MENU: 1,
  PLAYING: 2,
  STORY: 3,
  GAME_OVER: 4,
  HIGHSCORE: 5,
  CONTROLS: 6,
  WIN: 7,
  BETWEEN_LEVELS: 8,
  LOAD_HIGH_SCORES: 9,
  ENTER_NAME: 10,
  INTRO: 11,
};

export const FPS = 60;

export const Key = {
  LEFT: 37,
  RIGHT: 39,
  DOWN: 40,
  UP: 38,
  SPACE: 32,
};

export const TILE_SIZE = 32;
export const CELL_SIZE = 16;

export const GRID_COLS = 10;
export const GRID_ROWS = 19;
export const GRID_ORIGIN_X = 180;
export const GRID_ORIGIN_Y = 32;
export const COIN_SIZE = 20;

export const SpriteID = {
    COIN: 0,
    ROCK: 1,
    GOBLIN: 2,
    BAT: 3,
    POWERUP_BOMB: 4,
    POWERUP_GOLD: 5,
};

export const State = {
    
    COIN: 0,
    EXPLOSION: 1,

    BAT_LEFT: 0,
    BAT_RIGHT: 1,

    POWERUP_BOMB: 4,
    POWERUP_GOLD:5,
}

export const ALPHABET = [
  'A','B','C','D','E','F','G','H','I','J','K','L','M',
  'N','O','P','Q','R','S','T','U','V','W','X','Y','Z'
];

export const Sound = {
  NO_MUSIC: -1,
  SECONDARY_MUSIC: 0,
  GAME_MUSIC: 1,
  STORY_MUSIC: 2,

};