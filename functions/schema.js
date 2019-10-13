const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const eventsSchema = new Schema({
  type: String,
  title: String,
  start: String,
  speakers: Array,
  resources: Array,
  location: String,
  id: String,
  duration: Number,
  description: String
});

const Event = mongoose.model('Event', eventsSchema);

module.exports = Event;