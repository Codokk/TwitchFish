// Require the framework and instantiate it
const fastify = require('fastify')({ logger: true });
const fs = require('fs');
const io = require('socket.io');
const Path = require('path');
// Declare a route
fastify.get('/', async (req, res) => {
    res.type('text/html').send(fs.createReadStream(Path.join(__dirname + "/src/index.html")))
})

// Run the server!
const start = async () => {
  try {
    await fastify.listen(3000)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()
