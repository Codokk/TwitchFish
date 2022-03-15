// Require the framework and instantiate it
const express = require('express');
const app = express();
const fs = require('fs');
const http = require('http');
const tmi = require('tmi.js');
const Path = require('path');
const { Server } = require("socket.io");
const io = new Server(http.createServer(app));
io.on('connection', (socket) => {
  console.log('a user connected');
});
// Fucking Cors
let ALLOWED_ORIGINS = ["http://localhost:4000", "http://localhost:3000", "http://localhost"];
app.use((req, res, next) => {
    let origin = req.headers.origin;
    let theOrigin = (ALLOWED_ORIGINS.indexOf(origin) >= 0) ? origin : ALLOWED_ORIGINS[0];
    res.header("Access-Control-Allow-Origin", theOrigin);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
})
// Declare routes
app.use("/", express.static(Path.join(__dirname, "src")));
// Twitch Connection
const ttv = new tmi.Client({
	options: { debug: true },
	identity: {
		username: 'TheIntegrator',
		password: 'oauth:rwd1gfhirky7yfd439f1hv6si467c8'
	},
	channels: [ 'techerongames' ]
});

ttv.connect();

ttv.on('message', (channel, tags, message, self) => {
	// "Alca: Hello, World!"
	console.log(`${tags['display-name']}: ${message}`);
});
			
// SocketIO Connection

// Run the default server!
const start = async () => {
  try {
    await app.listen(3000)
  } catch (err) {
    fastify.log.error(err)
    app.exit(1)
  }
}
// Run the socket server!


start()
