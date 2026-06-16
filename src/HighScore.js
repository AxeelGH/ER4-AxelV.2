export default class HighScore {
  constructor(position, name, score) {
    this.position = position;
    this.name = name;
    this.score = score;
  }

  update() {}

  render(ctx, x, y, isHighlighted) {
    if (isHighlighted) {
      ctx.fillStyle = "#FFD700";
    } else {
      ctx.fillStyle = "#FFFFFF";
    }
    ctx.font = "14px dungeon";
    ctx.textAlign = "left";
    ctx.fillText(this.position + ".", x, y);
    ctx.fillText(this.name, x + 45, y);
    ctx.fillText(this.score, x + 110, y);
  }
}
