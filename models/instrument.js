var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var InstrumentSchema = new Schema({
  id: {type: Number, required: true, unique: true},
  position: Number,
  name: {type: String, required: true},
  created_at: Date,
  updated_at: Date
});


var Instrument = mongoose.model('Instrument',InstrumentSchema);
module.exports = Instrument;