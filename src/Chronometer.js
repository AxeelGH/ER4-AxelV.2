export default class Chronometer {
  getTime(totalSeconds) {
    const secondsSafe = Math.max(0, Math.floor(totalSeconds));
    const minutes = Math.floor(secondsSafe / 60);
    const seconds = secondsSafe % 60;
    const minutesStr = minutes < 10 ? "0" + minutes : minutes;
    const secondsStr = seconds < 10 ? "0" + seconds : seconds;
    return `${minutesStr}:${secondsStr}`;
  }
}