export default class Sprite {
  update() {
    console.log("Sprite update method called");
  }

  updateAnimationFrame() {
    this.frames.frameChangeCounter++;
    if (this.frames.frameChangeCounter >= this.frames.speed) {
      this.frames.frameCounter++;
      this.frames.frameChangeCounter = 0;
    }
    if (this.frames.frameCounter >= this.frames.framesPerState) {
      this.frames.frameCounter = 0;
    }
  }
}
