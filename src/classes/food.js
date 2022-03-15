export default class food {
    constructor() {
      this.x = Math.floor(Math.random() * c.width);
      this.y = 0 - Math.random() * 50;
      this.value = Math.floor(Math.random() * 10) + 1;
      this.fallSpeed = 1;
    }
    update() {
      if (this.y < config.ceiling + 10) this.y += 2;
      if (Math.floor(Math.random() * 2) == 1) this.y += this.fallSpeed / 10;
      this.draw();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, 3, 0, 2 * Math.PI);
      ctx.fillstyle = this.grd;
      ctx.fill();
      ctx.stroke();
    }
  }