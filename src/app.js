let c = document.getElementById("Aquarium");
let ctx = c.getContext("2d");
const socket = io();


//Config Settings
let config = {
  floor: 28,
  ceiling: 28,
  sand: 100,
  waves: 100
};

//Draw Vars
let grains = [];
let waves = [];
let fishes = [];
let fishfood = [];
//Performance Vars
var times = [];
var fps;

class fish {
  constructor(name) {
    //Animation Params
    this.tailIsGrowing = true;
    this.tailMultiplier = 0;
    //RPG Params
    this.name = name;
    this.energy = 100;
    this.hp = 10;
    this.maxHp = 10;
    this.speed = 1;
    this.speedMultiplier = 2;
    this.xp = 0;
    this.toLevel = 10;
    //Movement Params
    this.isBeingChased = false;
    this.isSpooked = false;
    this.isMoving = false;
    this.isDashing = false;
    this.isFacingLeft = false;
    this.target = [0, 0];
    this.x = c.width / 2;
    this.y = c.height / 2;
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
    for (let i = 0; i < fishfood.length; i++) {
      if (
        Math.abs(fishfood[i].x - this.x) <= 20 &&
        Math.abs(fishfood[i].y - this.y) <= 10
      ) {
        let eatenFood = fishfood[i];
        fishfood.splice(i, 1);
        this.xp += eatenFood.value;
        if (this.xp >= this.toLevel) this.levelUp();
        this.yum(eatenFood.value);
      }
    }
  }
  yum(xp) {
    this.hasEaten = true;
    this.timerEaten = 3000;
    this.lastXp = xp;
  }
  levelUp() {
    let boost = Math.floor(Math.random() * 10) + 1;
    for(let i = 0; i < boost; i++)
      {
        switch(Math.floor(Math.random() * 3))
          {
            case 0:
              this.speed +=.2;
              break;
            case 1:
              this.attack += .2;
              break;
            case 2:
              this.maxHp += 1;
              this.hp = this.maxHp;
              break;
          }
      }
    notifications.push({text: "Cody Leveled Up!", duration: 5})
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
    let minSpookDistance = c.width / 2 - 10;
    this.target = [
      Math.floor(Math.random() * c.width),
      Math.floor(Math.random() * c.height)
    ];
    this.move();
  }
  draw() {
    //Setup
    ctx.fillStyle = "black";
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
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    if (this.isFacingLeft) {
      ctx.lineTo(this.x + 30 + this.tailMultiplier / 10, this.y + 30);
      ctx.lineTo(this.x + 30 + this.tailMultiplier / 10, this.y - 30);
    } else {
      ctx.lineTo(this.x - 30 - this.tailMultiplier / 10, this.y + 30);
      ctx.lineTo(this.x - 30 - this.tailMultiplier / 10, this.y - 30);
    }
    ctx.lineTo(this.x, this.y);
    ctx.closePath();
    ctx.lineWidth = 10;
    ctx.strokeStyle = "#666666";
    ctx.stroke();
    // Body
    ctx.beginPath();
    ctx.arc(this.x, this.y, 30, 0, 2 * Math.PI);
    ctx.fillstyle = this.grd;
    ctx.fill();
    ctx.stroke();
    // Eye
    ctx.beginPath();
    ctx.lineWidth = 5;
    this.isFacingLeft
      ? ctx.arc(this.x - 15, this.y - 15, 5, 0, 2 * Math.PI)
      : ctx.arc(this.x + 15, this.y - 15, 5, 0, 2 * Math.PI);
    ctx.fillstyle = "#ffffff";
    ctx.fill();
    ctx.stroke();
    // Fin
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.bezierCurveTo(
      this.x - 7,
      this.y,
      this.x,
      this.y + 4,
      this.x + 7,
      this.y
    );
    ctx.stroke();
    //Name
    ctx.fillText(this.name, this.x - 30, this.y - 50, 60);
    //HP
    ctx.fillStyle = "red";
    ctx.fillRect(this.x - 20, this.y - 40, 50, 10);
    ctx.fillStyle = "green";
    ctx.fillRect(this.x - 20, this.y - 40, (50 / this.maxHp) * this.hp, 10);
    //XP
    if (this.hasEaten && this.timerEaten > 0) {
      this.timerEaten -= 1;
      ctx.fillText("+" + this.lastXp, this.x, this.y - 80);
      if (this.timerEaten <= 0) this.hasEaten = false;
    }
  }
}
class food {
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
class sand {
  constructor() {
    this.x = Math.floor(Math.random() * c.width);
    this.y = c.height - Math.floor(Math.random() * config.floor);
  }
  draw() {
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#000";
    ctx.arc(this.x, this.y, 1, 0, 2 * Math.PI);
    ctx.stroke();
  }
}
class wave {
  constructor(startX) {
    this.amplitude = 10;
    this.speed = 1;
    this.x = startX;
    this.y = config.ceiling + (Math.floor(Math.random() * 20) - 10);
    this.ascending = true;
  }
  getPoint() {
    //this.x --;
    let r = Math.floor(Math.random() * 3);
    switch (r) {
      case 1:
        this.y += this.ascending ? -1 : 1;
        break;
      case 2:
        break;
      case 3:
        this.ascending = !this.ascending;
        break;
    }

    if (this.ascending == true && this.y < 28 - this.amplitude) {
      this.ascending = false;
    }
    if (this.ascending == false && this.y > 28 + this.amplitude) {
      this.ascending = true;
    }
    if (this.x < 0) this.x = c.width;
    return [this.x, this.y];
  }
}
//Fit Aquarium to any size;
function ResizeCanvas() {
  ctx.canvas.width = window.innerWidth;
  ctx.canvas.height = window.innerHeight;
  ctx.font = "30px Arial";
  ctx.fillText(ctx.canvas.width, 10, 50);
  ctx.fillText(ctx.canvas.height, 10, 100);
}

function refreshLoop() {
  window.requestAnimationFrame(function () {
    //FPS
    const now = performance.now();
    while (times.length > 0 && times[0] <= now - 1000) {
      times.shift();
    }
    times.push(now);
    fps = times.length;
    //Updates
    ctx.clearRect(0, 0, c.width, c.height);
    //Drawing
    DrawAquarium();
    DrawSand();
    DrawWave();
    DrawFood();
    DrawFish();
    DrawFramerate();
    refreshLoop();
  });
}

function CreateFish(params) {
  let newguy;
  switch (params.type) {
    case "minnow":
      newguy = new minnow(params.name);
      break;
    default:
      newguy = new fish(params.name);
  }
  fishes.push(newguy);
}
function DrawAquarium() {
  // Water
  ctx.clearRect(0, 0, c.width, c.height);
  ctx.fillStyle = "#0A8BAD";
  ctx.fillRect(0, 0, c.width, c.height);
  // Sandbar
  ctx.fillStyle = "#E4D23D";
  ctx.fillRect(0, c.height - config.floor, c.width, c.height);
}
function DrawFish() {
  // CHANGE TO THINK
  fishes.forEach((fsh) => fsh.think());
}
function DrawFood() {
  fishfood.forEach((fd) => fd.update());
}
function DrawFramerate() {
  ctx.fillStyle = "#000";
  ctx.fillText(fps, 0, 30);
}
function DrawSand() {
  ctx.fillStyle = "#000000";
  grains.forEach((s) => s.draw());
}
function DrawWave() {
  ctx.beginPath();
  ctx.lineWidth = 2;
  ctx.strokeStyle = "#000";
  ctx.moveTo(0, 28);
  waves.sort((a, b) => {
    return a.x - b.x;
  });
  let coords = [0, 28];
  for (let i = 0; i < config.waves; i++) {
    let pt2 = waves[i].getPoint();
    ctx.quadraticCurveTo(coords[0], coords[1], pt2[0], pt2[1]);
    coords[0] = waves[i].x;
    coords[1] = waves[i].y;
  }
  ctx.bezierCurveTo(coords[0], coords[1], coords[0], 28, c.width, 28);
  ctx.stroke();
}

function initSand() {
  for (let i = 0; i < config.sand; i++) {
    grains.push(new sand());
  }
  initWave();
}
function initWave() {
  let waveInterval = c.width / config.waves;
  for (let i = 0; i < config.waves; i++) {
    waves.push(new wave(waveInterval * (i + 1)));
  }
  ctx.beginPath();
  ctx.moveTo(0, 28);
  let coords = [0, 28];
  for (let i = 0; i < config.waves; i++) {
    console.log(waves[i].getPoint());
    ctx.quadraticCurveTo(coords[0], coords[1], waves[i].x, waves[i].y);
    coords[0] = waves[i].x;
    coords[1] = waves[i].y;
  }
  ctx.stroke();
  refreshLoop();
}

function feed(amount) {
  for (let i = 0; i < amount; i++) {
    fishfood.push(new food());
  }
}

function SocketConfig() {
  socket.on("Welcome", (isFirst)=>{
    if(isFirst) console.log("You're the Master!");
  })
}
function Start() {
  SocketConfig();
  ResizeCanvas();
  initSand();
  window.addEventListener("resize", ResizeCanvas);

  setTimeout(() => {
    CreateFish({
      name: "Cody's Fish",
      type: null
    });
    CreateFish({
      name: "BbFish",
      type: null
    });
  }, 100);
}

Start();