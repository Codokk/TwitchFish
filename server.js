// Libraries Setup
const express = require("express");
const app = express();
const http = require("http");
const tmi = require('tmi.js');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const path = require("path");
const { exit } = require("process");
let MasterSocket = false;
// Game Vars
let fishies = new Array();
//Routing
app.use("/", express.static(path.join(__dirname,"src")));

//SocketIO
io.on("connection", (socket) => {
  if(!MasterSocket) {
      MasterSocket = socket;
      MasterSocket.on("disconnect", () => {
          console.log("Master socket disconnected");
          // Kills program if master socket is closed;
          exit();
      })
      socket.emit("Welcome", true);
  } else {
      socket.emit("Welcome", false);
  }
});
io.on("RequestingFish", (socket) =>{

})
io.on("UpdateFishLocation", (socket) =>{
    if(socket === MasterSocket) console.log("MASTER WANTS A COOKIE");
})
io.on("FishCreated", (socket, fish) => {
    fishies.push(fish);
})
//Twitch Start
const ttv = new tmi.Client({
  options: { debug: true },
  identity: {
    username: "TheIntegrator",
    password: "oauth:rwd1gfhirky7yfd439f1hv6si467c8",
  },
  channels: ["techerongames"],
});
ttv.connect();
ttv.on("message", (channel, tags, message, self) => {
  console.log(`${tags["display-name"]}: ${message}`);
  if(message.toLowerCase().substring(0,8) == "!newfish") CreateNewFish(tags, message);
});

//Game code
function CreateNewFish(tags, msg) {
    if(msg.length > 10) {
        // Clean the input string
        let name = msg.substring( 9, msg.length);
        name = name.replaceAll("  ","");
        tags['display-name'] = name;
    }
    io.emit("NewFish", tags['user-id'], tags['display-name'], tags['color']);
}

//Server Start
server.listen(3000, () => {
  console.log("listening on *:3000");
});
