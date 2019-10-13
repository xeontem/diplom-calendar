const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
let events = require('./events.json');
let trainers = require('./trainers.json');
const Event = require('./schema');
let users = [];
let eventsFromDB = [];

//----------------- DB connection ---------------------
mongoose.connect('mongodb://xeontem:slipknot@ds147842.mlab.com:47842/rs-calendar', { useMongoClient: true });
mongoose.connection.on('connected', function () {
    console.log('Mongoose default connection opened with rs-calendar DB');
    Event.find({}, function (err, docs) {
      docs.map(model => {
        eventsFromDB.push(model.toObject());
      })
  });
});

//----------------- instruments ------------------
function searchEventById(id) {
  let index;
  events.map((event, i) => {
    if(event.id === id) {
      index = i;
    }
  })
  return index;
}

//--------------------- START SERVER ---------------------------
const server = express();

// support JSON-encoded bodies
server.use(bodyParser.json());

// support URL-encoded bodies
server.use(bodyParser.urlencoded({ extended: true }));

// disable CORS
server.all('*', function(req, res, next) {
  console.log('--------------------------------------------------------------');
  console.log('request from: ' + req.connection.remoteAddress);
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

//------------------------- GET ENDPOINTS -----------------------------------------
server.get( '/reset' , (req, res) => {
  console.log('events restored from DB');
  Event.find({}, function (err, docs) {
      if(!docs.map) {
        res.status('200').send({mess: 'something went wrong... try later'});
        return
      }
      events = [];
      docs.map(model => {
        events.push(model.toObject())
      })
  });
  res.status('200').send({mess: 'events successfully resetted'});
});

server.get( '/dbEvents' , (req, res) => {
  console.log('events from db requested');
  res.send(eventsFromDB);
});

server.get( '/events' , (req, res) => {
  console.log('events requested');
  res.send(events);
});

server.get( '/events/*' , (req, res) => {
  let id = req.originalUrl.slice(8);
  console.log('event ' + id + ' requested');
  let event;
  events.map(ev => {
    if(ev.id === id) event = ev;
  });
  res.send(event);
});

server.get( '/trainers' , (req, res) => {
  console.log('trainers requested');
  res.send(trainers);
});

server.get( '/trainers/*' , (req, res) => {
  let id = req.originalUrl.slice(10);
  console.log('trainer ' + id + ' requested');
  let trainer;
  trainers.map(trn => {
    if(trn.id === id) return trainer = trn;
  });
  res.send(trainer);
});


//------------------- POST ENDPOINTS -----------------------------------
server.post('/events', (req, res) => {
  //------------------------ sign up --------------------------
  if(req.body.signin) {
    console.log(`user ${req.body.login} try to register`);
    let ispresent = false;
    users.map(user => {
      if(user.login == req.body.login) ispresent = true;
    });
    if(!ispresent) {
      users.push({
        login: req.body.login,
        password: req.body.password,
        avatar: req.body.avatar
      });
      let message = `user ${req.body.login} successfully registered`
      console.log(message);
      res.send({message});
    } else {
      ispresent = false;
      let message = `user ${req.body.login} already registered`
      console.log(message);
      res.send({message, notregister: true});
    }
    return
  }

  //------------------------ sign in --------------------------
  if(req.body.login) {
    console.log(`user ${req.body.login} try to logIn`);
    let isAdmin = false;
    let avatar;
    users.map(user => {
      if(user.login === req.body.login && user.password === req.body.password){
        isAdmin = true;
        avatar = user.avatar;
      }
    });
    let success = isAdmin ? 'successfull' : 'failed';
    let message = `user ${req.body.login} login ${success}`
    console.log(message);
    res.send({isAdmin, message, avatar});
    return
  }

  //------------------------ delete custom event --------------------------
  if(req.body.delete) {
    let index = searchEventById(req.body.id)
    let filtered = events.slice(0, index);
        filtered = filtered.concat(events.slice(index+1));
        events = filtered;
    console.log('event: ' + req.body.id + ' deleted');
        res.status('200').send();
        return
  }

  //------------------------ store event changes or store new event --------------------------
  let index = searchEventById(req.body.id);
  if(!index) events.push(req.body);
  else events[index] = req.body;
  console.log('new event recieved');
  res.status('200').send();
});

server.listen(process.env.PORT || 4444);
