const fastify = require('fastify')({ logger: true })
const RaySo = require('rayso-api');
const path = require('path')

fastify.register(require('fastify-static'), {
  root: path.join(__dirname, 'public'),
  prefix: '/public/',
})

fastify.get('/', async (req, reply) => {
  return reply.sendFile('index.html')
})

fastify.get('/generate', async (request, reply) => {
  var darkMode = request.query.darkMode ? JSON.parse(request.query.darkMode) : false
  var title = request.query.title || "RaySo"
  var theme = request.query.theme || "raindrop"
  var lang = request.query.lang || "auto"
  var bg = request.query.bg ? JSON.parse(request.query.bg) : true
  var padding = request.query.padding ? JSON.parse(request.query.padding) : 64
  var text = request.query.text || ""
  if (!text) {
    return { "error": true, "message": "Provide text"}
  }
  if (![16, 32, 64, 128].includes(padding)) {
    return { "error": true, "message": "padding must be one of 16, 32, 64, 128" }
  }
  if (!["breeze", "candy", "crimson", "falcon", "meadow", "raindrop", "sunset", "midnight"].includes(theme)) {
    return { "error": true, "message": "Available themes: breeze, candy, crimson, falcon, meadow, midnight, raindrop, sunset!" }
  }
//  console.log(process.env.BROWSER_PATH)
  var raySo = new RaySo({
    "title": title,
    "darkMode": darkMode,
    "theme": theme,
    "language": lang,
    "background": bg,
    "padding": padding,
    "browserPath": process.env.BROWSER_PATH
  });

  raySo
    .cook(text)
    .then((response) => {
      reply.type('image/png');
      reply.send(response)
    })
    .catch((err) => {
      console.error(err);
    });
})

fastify.post('/generate', async (request, reply) => {
  var darkMode = request.query.darkMode ? JSON.parse(request.query.darkMode) : false
  var title = request.body.title || "RaySo"
  var theme = request.body.theme || "raindrop"
  var lang = request.body.lang || "auto"
  var bg = request.body.bg ? JSON.parse(request.query.bg) : true
  var padding = request.query.padding ? JSON.parse(request.query.padding) : 64
  if (![16, 32, 64, 128].includes(padding)) {
    return { "error": true, "message": "padding must be one of 16, 32, 64, 128" }
  }
  if (!["breeze", "candy", "crimson", "falcon", "meadow", "raindrop", "sunset", "midnight"].includes(theme)) {
    return { "error": true, "message": "Available themes: breeze, candy, crimson, falcon, meadow, midnight, raindrop, sunset!" }
  }
  var raySo = new RaySo({
    "title": title,
    "darkMode": darkMode,
    "theme": theme,
    "language": lang,
    "background": bg,
    "padding": padding,
    "browserPath": process.env.BROWSER_PATH
  });

  raySo
    .cook(request.body.code || request.query.code || "Give Some codes DUDE!")
    .then((response) => {
      reply.type('image/png');
      reply.send(response)
    })
    .catch((err) => {
      console.error(err);
    });
})

const start = async () => {
  try {
    await fastify.listen(process.env.PORT || 3000)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()
