var mInstrument = require('../models/instrument');
var mTransaction = require('../models/transaction');
var parser = require('../helper/parser');
var mongoose = require('mongoose');
var fs = require('fs');


var transactions = new Array();
var instruments = {};

function readLines(input) {
  var remaining = '';
  input.on('data', function(data) {
    remaining += data;
    var index = remaining.indexOf('\n');
    while (index > -1) {
      var line = remaining.substring(0, index);
      remaining = remaining.substring(index + 1);
      extract(line);
      index = remaining.indexOf('\n');
    }
  });

  input.on('end', function() {
    var values = Object.keys(instruments).map(function(v) { return instruments[v]; });
    console.log("Inserting "+values.length+" transactions...");
    console.log("Inserting "+transactions.length+" transactions...");
    mInstrument.collection.insert(values,onInstrumentInsert);
    mTransaction.collection.insert(transactions,onTransactionInsert);
  });
}

function onInstrumentInsert(err,document){
  if (err){
    console.log(err);
    console.log("Failed while inserting instruments");
  }else{
    console.log("instruments inserted successfully");
  }
}

function onTransactionInsert(err,document){
  if (err){
    console.log(err);
    console.log("Failed while inserting transactions");
  }else{
    console.log("transactions inserted successfully");
  }
}

function extract(line){
  var transaction = parser.transaction(line);
  var name = parser.instrument_name(line);
  transactions.push(transaction);
  updateInstrument(transaction,name);
}

function updateInstrument(t,name){
  if (instruments[t.instrument_id]){
    instruments[t.instrument_id].position = instruments[t.instrument_id].position + (t.action == 2 ? -(t.quantity) : t.quantity);
  }else{
    var instrument = {
      id: t.instrument_id,
      name: name,
      position: (t.action == 2 ? -(t.quantity) : t.quantity)
    };
    instruments[t.instrument_id] = instrument;
  }
}

exports.import_data_from_filllist = () => {
  var input = fs.createReadStream('./data/fill.txt');
  readLines(input); 
}