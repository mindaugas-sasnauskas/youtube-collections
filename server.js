var path = require('path');
var session = require('cookie-session');
var config = require('./config')();

var express = require('express');
var app = express();
// app.set('port', (process.env.PORT || 5000));
app.disable('etag');
app.set('trust proxy', true);

// Configure the session and session storage.
// MemoryStore isn't viable in a multi-server configuration, so we
// use encrypted cookies. Redis or Memcache is a great option for
// more secure sessions, if desired.
// [START session]
app.use(session({
  secret: config.secret,
  signed: true
}));
// [END session]

// OAuth2
var oauth2 = require('./lib/oauth2')(config.oauth2);
app.use(oauth2.router);


app
  .use(express.static('./public'))
  .get('/data', function (req, res) {
    data = readFileSync('data.json')
    res.send(data);
  })
  .get('/', function (req, res) {
    if (req.session.profile) {

      if (req.session.profile.id ==config.cust.userId || req.session.profile.id ==config.cust.quser) {

        res.sendFile('public/main.html', {
          "root": "."
        })
      }
    }else {
      res.sendFile('public/login.html', {
        "root": "."
      })
    }
  });
//post

app.post('/data', function (request, response) {
  console.log("post");
  var fullBody = '';
  request.on('data', function (chunk) {
    // append the current chunk of data to the fullBody variable
    fullBody += chunk.toString();
    fullBody = JSON.parse(fullBody)
    response.send("got");
    console.log(fullBody);
    var obj = readFileSync('data.json');
    if (fullBody.type == "subsctiptions-list") {
      obj.subscriptions = fullBody.list
    } else if (fullBody.type == "add") {
      data = {
        title: fullBody.title,
        channelId: fullBody.channelId,
        playlistId: fullBody.uploadsId
      }
      console.log(fullBody);
      obj.collections[fullBody.collection].push(data);
    } else if (fullBody.type == "remove") {

      console.log("fullBody");
      for (var i = 0; i < obj.collections[fullBody.collection].length; i++) {

        if (obj.collections[fullBody.collection][i].channelId == fullBody.channelId) {
          obj.collections[fullBody.collection].splice(i, 1);

        }
      }
    } else if (fullBody.type == "add-new-collection") {
      obj.collections[fullBody.title] = [];
    } else if (fullBody.type == "remove-collection") {
      delete obj.collections[fullBody.title];

    } else {
      console.log("unknown request");
    }
    write2file(obj);
  });
  // write2file(request);
});


// Setup modules and dependencies
var images = require('./lib/images')(config.gcloud, config.cloudStorageBucket);
var model = require('./app/model')(config);

// app
//  app.use('/app', require('./app/crud')(model, images, oauth2));

  app.use('/api', require('./app/api')(model));



// Basic 404 handler
app.use(function (req, res) {
  res.status(404).send('Not Found');
});

// Basic error handler
app.use(function (err, req, res, next) {
  /* jshint unused:false */
  console.error(err);
  // If our routes specified a specific response, then send that. Otherwise,
  // send a generic message so as not to leak anything.
  res.status(500).send(err.response || 'Something broke!');
});

if (module === require.main) {
  // Start the server
  var server = app.listen(config.port, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('App listening at http://%s:%s', host, port);
  });
}


// read files
var ytdl = require('ytdl-core');
var bodyParser = require('body-parser')
var fs = require('fs');

function write2file(data) {
  var data_tmp;

  data_tmp = data;
  fs.writeFile("data.json", JSON.stringify(data), function (err) {
    if (err) {
      return console.log(err);
    }

    console.log("The file was saved!");
  });
}

function readFileSync(file) {
  var obj = JSON.parse(fs.readFileSync(file, 'utf8'));
  //  console.log(obj);
  return obj;
}


module.exports = app;
