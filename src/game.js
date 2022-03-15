//  Initialization
let socket;
const c = document.getElementById("Aquarium");
const ctx = c.getContext("2d");

// Configuration Settings
let config = {
  floor: 28, // PX from ground
  ceiling: 28, // PX from ceiling
  sand: 100, // Sand Particles
  waves: 100, // Wave points
  width: 1920, // Canvas width
  height: 1080, //Canvas height
};

// Object Containers
let grains = new Array();
let waves = new Array();
let fishies = new Array();
let fishfood = new Array();
// Performance Vars
let times = new Array();
let fps;
// Import required classes
import aquarium from "./classes/aquarium.js";
import fish from "./classes/new_fish.js";
import sand from "./classes/sand.js";
// Create Default classes;
const Aquarium = new aquarium();
// Utility Functions
function GenerateCanvas() {
  ctx.canvas.width = 1920;
  ctx.canvas.height = 1080;
  ctx.font = "30px Arial";
  ctx.fillText(ctx.canvas.width, 10, 50);
  ctx.fillText(ctx.canvas.height, 10, 100);
  grains = new Array();
  initSand();
}
// Game Functions
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
    Aquarium.draw(c, ctx, config);

    DrawSand();
    // DrawWave();
    // DrawFood();
    DrawFish();
    // DrawFramerate();
    refreshLoop();
  });
}
function CreateFish(params) {
    let newguy;
    switch (params.type) {
      case "minnow":
        newguy = new minnow(params);
        break;
      default:
        newguy = new fish(params);
    }
    fishies.push(newguy);
    console.log(fishies);
  }
//Drawing Functions
function DrawFish() {
    // CHANGE TO THINK
    fishies.forEach((fsh) => fsh.think());
  }
function DrawSand() {
    ctx.fillStyle = "#000000";
    grains.forEach((s) => s.draw(c,ctx,config));
  }
// Initialization Functions
function SocketConfig() {
  // Check if Master or Slave
  socket = io();
  socket.on("Welcome", (isFirst) => {
    if (isFirst) console.log("You're the Master");
    console.log("Connected");
  });
  socket.on("NewFish", (id, name, color)=>{
      CreateFish({id, name, color, type: "default"});
  })
}
function initSand() {
  for (let i = 0; i < config.sand; i++) {
    grains.push(new sand(c,config));
  }
}
function InitializeObjects() {
    initSand();
}

function Start() {
  //Utility
  SocketConfig();
  GenerateCanvas();
  // Drawing
  InitializeObjects();
  // Go
  refreshLoop();
}

Start();
