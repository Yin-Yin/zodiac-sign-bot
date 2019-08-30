// ## express server ##
var bodyParser = require('body-parser')
var express = require('express');
var app = express();
var apiAiModule = require('./api-ai/api-ai.js')
// var dialogFlowModule = require('./dialogflow/dialogflow.js')

app.use((req, res, next) => {

  // -----------------------------------------------------------------------
  // authentication middleware

  const auth = { login: process.env.login, password: process.env.password }

  // parse login and password from headers
  const b64auth = (req.headers.authorization || '').split(' ')[1] || ''
  const [login, password] = new Buffer(b64auth, 'base64').toString().split(':')

  // Verify login and password are set and correct
  if (!login || !password || login !== auth.login || password !== auth.password) {
    res.set('WWW-Authenticate', 'Basic realm="401"')
    res.status(401).send('Authentication required.')
    return
  }

  // -----------------------------------------------------------------------
  // Access granted...
  next()

})

// parse application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
  res.send('Hi there, this is the webhook for the zodiac sign bot. For more info got to: <a href="https://github.com/Yin-Yin/zodiac-sign-bot/">Zodiac Sign Bot GitHub Page</a>');
});

//dialogflow v 1
app.post('/intent', function(req, res) {
  // console.log("req.body",req.body)
  let intentName = req.body.result.metadata.intentName;
  let parameters = req.body.result.parameters;
  let contexts = req.body.result.contexts;
  //console.log("contexts",contexts);
  //console.log("parameters",parameters);
  //es.setHeader('Content-Type', 'application/json'); //Requires application/json MIME type

  apiAiModule.getResponse(intentName, parameters, contexts).then((response) =>
    // "speech" is the spoken version of the response, "displayText" is the visual version, "messages" are for the different messengers, "contextOut" is the context for api.ai
    // Don't build the response JSON here, led to errors while developing
    res.send(JSON.stringify({
      "speech": response.speech,
      "displayText": response.displayText,
      "messages": response.messages,
      "contextOut": response.contextOut
    }))
  )
})

/*
//dialogflow v 2
app.post('/dialogflow', function(req, res) {
  console.log("app post /dialogflow");
  dialogFlowModule.handleRequest(req, res);
})
*/

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
