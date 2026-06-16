import { Sound } from "../config/constants.js";
import globals from "../config/globals.js";

export function updateMusic() {
  const buffer = 0.28;
  const music = globals.sounds[Sound.START_MUSIC];
  if (music && music.currentTime !== undefined) {
    if (music.currentTime > music.duration - buffer) {
      music.currentTime = 0;
      music.play();
    }
  }
}
