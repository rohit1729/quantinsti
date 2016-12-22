var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TransactionSchema = new Schema({
  instrument_id: {type: Number, required: true},
  action: {type: Number, min: 1, max: 2, required: true},
  quantity: {type: Number, min: 0, required: true},
  created_at: Date,
  updated_at: Date
});

var Transaction = mongoose.model('Transaction',TransactionSchema);
module.exports = Transaction;