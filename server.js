// Contains Twitter access tokens
var config = require('./config/config');

var express = require('express');
var http = require('http');
var Twit = require('twit');
var fs = require('fs');

// File conversions
var json2csv = require('json2csv');
var jsonexport = require('jsonexport');
var js2xmlparser = require('js2xmlparser');

// Setting up vars for Mongo
var MongoClient = require('mongodb').MongoClient
, format = require('util').format;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;

var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var app = express();
var server = http.createServer(app);
var T = new Twit(config);
app.use(express.bodyParser());

// Allow static files
app.use(express.static(__dirname));
app.use(express.static(__dirname + '/public'));
app.use('/static', express.static('public'));

app.get("/", function (req,res){
  res.sendfile('./public/index.html');
});

MongoClient.connect('mongodb://127.0.0.1:27017/twitter', function(err, db) {
  if (err) throw err;
  console.log("Database connection established");

  db.createCollection("twitCollection", function(err, collection) {
    if (err) throw err;

    console.log("Created twitCollection");
    console.log(collection);
  });

  db.collection('twitCollection').remove();
  var num;

  app.post("/load", urlencodedParser, function (req, res) {

    // Gets the values submitted by user through the form
    var kw =  "\'" +req.body.keyword + "\'";
    num = req.body.quantity;
    params = {
      q: kw,
      count: num
    }

    // Twitter get request using given params
    T.get('search/tweets', params, gotData);

    function gotData(err, data) {
      var path = './public/files/tweets.json'

      fs.writeFile(path, JSON.stringify(data), function(err){
        if (err) throw err
        console.log('Done')
      });

      // Holds the data to be converted from json to csv
      var tweets = data.statuses;
      // Creates the fields to be converted
      var fields = [
        "created_at",
        "id",
        "text",
        "user.id",
        "user.name",
        "user.screen_name",
        "user.location",
        "user.followers_count",
        "user.friends_count",
        "user.created_at",
        "user.time_zone",
        "user.profile_background_color",
        "user.profile_image_url",
        "geo",
        "coordinates",
        "place"
      ];
      // Converts json to csv and xml
      var reader = fs.createReadStream('./public/files/tweets.json');
      var writer = fs.createWriteStream('./public/files/tweets.csv');
      reader.pipe(jsonexport()).pipe(writer);
      fs.writeFile("./public/files/tweets.xml",js2xmlparser.parse("tweet", data), function(err){
        if(err) console.error(err);
      });

      // Reads the json file and inputs the data into the twitCollection
      fs.readFile('./public/files/tweets.json', 'utf8', function (err, data) {
        if (err) throw err;
        var json = JSON.parse(data);

        var insertDocument = function(db) {
          db.collection('twitCollection').insert(json, function(err, results) {
            assert.equal(err, null);
            console.log("Inserted to twitCollection.");
          });
        };
        insertDocument(db);
      });
    }
  });

  // Send data to clientside in order to pull and display tweets
  app.get('/read', function(req, res){
    var twits = db.collection('twitCollection');
    twits.find().toArray(function(err, docs) {
      if (err) {
        throw err;
        return;
      }

      console.log("Pulled twitCollection");
      res.json(docs);
    });
  });

  // Visualization chart data, pulling in data from the database into an array
  app.get("/visualizations", function(req,res){
    var twitcoll = db.collection('twitCollection');
    twitcoll.find().toArray(function(err, docs) {
      if (err) {
        console.log("error in viz");
        throw err;
        return;
      }
        var screenName = [];
        var followers = [];
        var friends = [];
        var times = [];
        var statuses = [];
        var all = [];

      for (index in docs) {

        for(var i=0; i<num; i++){
          var tcoll = docs[index].statuses[i].user;
          var name = tcoll['screen_name'];
          var follower = tcoll['followers_count'];
          var friend = tcoll['friends_count'];
          var time = tcoll['created_at'];
          var status = tcoll['statuses_count'];
          screenName.push(name);
          friends.push(friend);
          followers.push(follower);
          times.push(time);
          statuses.push(status);
        }
      }
      all.push(screenName);
      all.push(friends);
      all.push(followers);
      all.push(times);
      all.push(statuses);
      res.send(all);
    });
  });
});

// This delivers the chosen file format with the chosen name
app.post('/export', function(req, res){

  var fname = req.body.filename;

  if (req.body.type == "CSV") {
    var file = './public/files/tweets.csv';
    res.download(file, fname+'.csv');
  } if (req.body.type == "JSON") {
    var file = './public/files/tweets.json';
    res.download(file, fname+'.json');
  } if (req.body.type == "XML") {
    var file = './public/files/tweets.xml';
    res.download(file, fname+'.xml');
  }
});

var port_number = server.listen(process.env.PORT || 3000);
app.listen(port_number);
