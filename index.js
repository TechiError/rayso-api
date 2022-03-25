const fastify = require('fastify')({ logger: true })
const getScreenshot = require('./functions/rayso')
const path = require('path')

fastify.register(require('fastify-static'), {
  root: path.join(__dirname, 'public'),
  prefix: '/public/',
})
fastify.register(require('fastify-formbody'))

fastify.get('/', async (req, reply) => {
  return reply.sendFile('index.html')
})

fastify.get('/generate', async (request, reply) => {
  var darkMode = (String(request.query.darkMode).toLowerCase() === 'true');
  var title = request.query.title || "RaySo";
  var theme = request.query.theme || "raindrop"
  var lang = request.query.lang || "auto"
  var bg = request.query.bg ? (String(request.query.bg).toLowerCase() === 'true') : true
  var padding = request.query.padding ? JSON.parse(Number(request.query.padding)) : 32
  var text = request.query.text || ""
  if (!text) {
    reply.send({ "error": true, "message": "Provide text" })
    return reply
  }
  if (![16, 32, 64, 128].includes(padding)) {
    reply.send({ "error": true, "message": "padding must be one of 16, 32, 64, 128" })
    return reply
  }
  if (!["breeze", "candy", "crimson", "falcon", "meadow", "raindrop", "sunset", "midnight"].includes(theme)) {
    reply.send({ "error": true, "message": "Available themes: breeze, candy, crimson, falcon, meadow, midnight, raindrop, sunset!" })
    return reply
  }

  try {
    var image = await getScreenshot(title, text, theme, padding, bg, darkMode, lang)
    reply.type('image/png')
    reply.send(image)
  } catch (error) {
    reply.type('application/json')
    reply.send({ "error": true, "message": error })
  }
})


fastify.post('/generate', async (request, reply) => {
  var text = request.body.text
  var darkMode = (String(request.body.darkMode).toLowerCase() === 'true');
  var title = request.body.title
  var theme = request.body.theme
  var lang = request.body.lang
  var bg = request.body.bg ? (String(request.body.bg).toLowerCase() === 'true') : true
  var padding = request.body.padding ? JSON.parse(Number(request.body.padding)) : 32
  if (![16, 32, 64, 128].includes(padding)) {
    return { "error": true, "message": "padding must be one of 16, 32, 64, 128" }
  }
  if (!["breeze", "candy", "crimson", "falcon", "meadow", "raindrop", "sunset", "midnight"].includes(theme)) {
    return { "error": true, "message": "Available themes: breeze, candy, crimson, falcon, meadow, midnight, raindrop, sunset!" }
  }
  try {
    var image = await getScreenshot(title, text, theme, padding, bg, darkMode, lang)
    reply.type('image/png')
    reply.send(image)
  } catch (error) {
    reply.type('application/json')
    reply.send({ "error": true, "message": error })
  }
})

const start = async () => {
  try {
    //var image = await getScreenshot("RaySo", "Give Some codes DUDE!", "raindrop", 64, true, false, "auto")
    await fastify.listen(process.env.PORT || 3000, process.env.HOST || '0.0.0.0')
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()