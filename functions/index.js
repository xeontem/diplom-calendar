const functions = require('firebase-functions');

const mongoose = require('mongoose');
let events = require('./events.json');
let trainers = require('./trainers.json');
const Event = require('./schema');
let users = [];
let eventsFromDB = [];

// const fs = require('fs');
// const chunk = require('lodash/chunk');

// fs.readdir('./src/pages', (err, files) => {
//   const chunks = chunk(files
//     .filter(path => path.includes('.njk'))
//     .map(path => path.slice(0, -4)), 20);

//   const file = fs.createWriteStream('./src/pages/index.njk');
//   const layout = `sd`;
//   file.write(layout.trim());
//   file.end();
// });

// const FIRESTORE_EMULATOR_HOST = 'localhost:8080';

//----------------- DB connection ---------------------
mongoose.connect('mongodb://xeontem:slipknot@ds147842.mlab.com:47842/rs-calendar', { useUnifiedTopology: true, useNewUrlParser: true });
mongoose.connection.on('connected', function () {
    console.log('Mongoose default connection opened with rs-calendar DB');
    Event.find({}, function (err, docs) {
      docs.map(model => {
        eventsFromDB.push(model.toObject());
      })
  });
});

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
 response.send(eventsFromDB);
});
