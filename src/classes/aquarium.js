export default class aquariumm {
  draw(c, ctx, config) {
    // Water
    ctx.fillStyle = "#0A8BAD";
    ctx.fillRect(0, 0, c.width, c.height);
    // Sandbar
    ctx.fillStyle = "#E4D23D";
    ctx.fillRect(0, c.height - config.floor, c.width, c.height);
  }
}
