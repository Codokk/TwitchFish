export default class fish {
  constructor(params) {
    this.c = document.getElementById("Aquarium");
    this.ctx = this.c.getContext("2d");
    //Animation Params
    this.tailIsGrowing = true;
    this.tailMultiplier = 0;
    this.color = params.color;
    //RPG Params
    this.name = params.name;
    this.energy = 100;
    this.hp = 10;
    this.maxHp = 10;
    this.speed = 1;
    this.speedMultiplier = 2;
    this.xp = 0;
    this.toLevel = 10;
    this.isAlive = true;
    //Movement Params
    this.isBeingChased = false;
    this.isSpooked = false;
    this.isMoving = false;
    this.isDashing = false;
    this.isFacingLeft = false;
    this.target = [0, 0];
    this.x = this.c.width / 2;
    this.y = this.c.height / 2;
    //Food Params
    this.hasEaten = false;
    this.timerEaten = 0;
    this.lastXp = 0;
    //Misc
    this.timeout = 0;
  }
  think() {
    // Eat, Sleep, Poop, Swim, Sleep
    if (this.isMoving == false && this.timeout <= 0) {
      this.setMove();
    } else if (this.isMoving == false && this.timeout > 0) {
      this.draw();
      this.timeout--;
    } else {
      this.move();
    }
    this.collisionCheck();
  }
  collisionCheck() {
    //Food
    // for (let i = 0; i < fishfood.length; i++) {
    //   if (
    //     Math.abs(fishfood[i].x - this.x) <= 20 &&
    //     Math.abs(fishfood[i].y - this.y) <= 10
    //   ) {
    //     let eatenFood = fishfood[i];
    //     fishfood.splice(i, 1);
    //     this.xp += eatenFood.value;
    //     if (this.xp >= this.toLevel) this.levelUp();
    //     this.yum(eatenFood.value);
    //   }
    // }
  }
  yum(xp) {
    this.hasEaten = true;
    this.timerEaten = 3000;
    this.lastXp = xp;
  }
  levelUp() {
    let boost = Math.floor(Math.random() * 10) + 1;
    for (let i = 0; i < boost; i++) {
      switch (Math.floor(Math.random() * 3)) {
        case 0:
          this.speed += 0.2;
          break;
        case 1:
          this.attack += 0.2;
          break;
        case 2:
          this.maxHp += 1;
          this.hp = this.maxHp;
          break;
      }
    }
    notifications.push({ text: "Cody Leveled Up!", duration: 5 });
  }
  move() {
    switch (Math.floor(Math.random() * 4)) {
      case 1:
        this.moveX();
        break;
      case 2:
        this.moveY();
        break;
      case 3:
        this.moveX(1);
        this.moveY(1);
        break;
      case 4:
        this.isSpooked
          ? Math.floor(Math.Random() * 2) == 1
            ? this.moveX()
            : this.moveY()
          : (this.energy -= 1);
        break;
    }
    if (Math.abs(this.target[0] - this.x) <= 3) this.x = this.target[0];
    if (Math.abs(this.target[1] - this.y) <= 3) this.y = this.target[1];
    this.draw();
    if (this.target[0] == this.x && this.target[1] == this.y) {
      this.isMoving = false;
      this.isDashing = false;
      this.timeout = Math.floor(Math.random() * 1000);
    }
  }
  moveX() {
    if (this.x > this.target[0]) {
      this.isFacingLeft = true;
      this.x -= this.speed * (this.isDashing ? this.speedMultiplier : 1);
    } else {
      this.isFacingLeft = false;
      this.x += this.speed * (this.isDashing ? this.speedMultiplier : 1);
    }
  }
  moveY() {
    if (this.y > this.target[1]) {
      this.y -= this.speed * (this.isDashing ? this.speedMultiplier : 1);
    } else {
      this.y += this.speed * (this.isDashing ? this.speedMultiplier : 1);
    }
  }
  setMove(isSpooked = false) {
    this.isMoving = true;
    isSpooked
      ? (this.isDashing = true)
      : (this.isDashing = 18 >= Math.floor(Math.random() * 100));
    let minSpookDistance = this.c.width / 2 - 10;
    this.target = [
      Math.floor(Math.random() * this.c.width),
      Math.floor(Math.random() * this.c.height),
    ];
    this.move();
  }
  draw() {
    //Setup
    this.ctx.fillStyle = "black";
    //Tail
    if (this.isMoving) {
      if (this.tailIsGrowing) {
        this.tailMultiplier++;
      } else {
        this.tailMultiplier--;
      }
      if (this.tailMultiplier > 100 || this.tailMultiplier < 0)
        this.tailIsGrowing = !this.tailIsGrowing;
    }
    this.ctx.beginPath();
    this.ctx.moveTo(this.x, this.y);
    if (this.isFacingLeft) {
      this.ctx.lineTo(this.x + 30 + this.tailMultiplier / 10, this.y + 30);
      this.ctx.lineTo(this.x + 30 + this.tailMultiplier / 10, this.y - 30);
    } else {
      this.ctx.lineTo(this.x - 30 - this.tailMultiplier / 10, this.y + 30);
      this.ctx.lineTo(this.x - 30 - this.tailMultiplier / 10, this.y - 30);
    }
    this.ctx.lineTo(this.x, this.y);
    this.ctx.closePath();
    this.ctx.lineWidth = 10;
    this.ctx.strokeStyle = "#222222";
    this.ctx.stroke();
    // Body
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, 30, 0, 2 * Math.PI);
    this.ctx.fillStyle = this.color;
    this.ctx.fill();
    this.ctx.stroke();
    // Eye
    this.ctx.beginPath();
    this.ctx.lineWidth = 5;
    this.isFacingLeft
      ? this.ctx.arc(this.x - 15, this.y - 15, 5, 0, 2 * Math.PI)
      : this.ctx.arc(this.x + 15, this.y - 15, 5, 0, 2 * Math.PI);
    this.ctx.fillStyle = "#ffffff";
    this.ctx.fill();
    this.ctx.stroke();
    // Fin
    this.ctx.beginPath();
    this.ctx.moveTo(this.x, this.y);
    this.ctx.bezierCurveTo(
      this.x - 7,
      this.y,
      this.x,
      this.y + 4,
      this.x + 7,
      this.y
    );
    this.ctx.stroke();
    //Name
    this.ctx.fillText(this.name, this.x - 30, this.y - 50, 60);
    //HP
    this.ctx.fillStyle = "red";
    this.ctx.fillRect(this.x - 20, this.y - 40, 50, 10);
    this.ctx.fillStyle = "green";
    this.ctx.fillRect(this.x - 20, this.y - 40, (50 / this.maxHp) * this.hp, 10);
    //XP
    if (this.hasEaten && this.timerEaten > 0) {
      this.timerEaten -= 1;
      this.ctx.fillText("+" + this.lastXp, this.x, this.y - 80);
      if (this.timerEaten <= 0) this.hasEaten = false;
    }
  }
}
