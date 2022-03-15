export default class sand {
    constructor(c,config) {
      this.x = Math.floor(Math.random() * c.width);
      this.y = c.height - Math.floor(Math.random() * config.floor);
    }
    draw(c,ctx,config) {
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#000";
      ctx.arc(this.x, this.y, 1, 0, 2 * Math.PI);
      ctx.stroke();
    }
  }