var express = require('express');
var router = express.Router();
var Instrument = require('../models/instrument');
var Transaction = require('../models/transaction')
var parser = require('../helper/parser');
var path = require('path');
/* GET home page. */
function nocache(req, res, next) {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  next();
}

router.get(['/api/instruments'], nocache, function(req, res) {
  var limit = 0;
  if (req.query.offset){
    var limit = parseInt(req.query.offset);
    if(req.query.action == 'load'){
      limit = limit + 30;
      console.log(req.query);
    }
  }
  Instrument.find({},{'_id':0}).limit(limit).sort({name: 1}).exec(function(err, instruments) {
    if (err){
      res.status(500).send({error: 'Something broke!'});
      return;
    }
    res.status(200).send(instruments);
  });
});

router.get(['/','/instruments'],nocache, function(req, res){
  res.sendfile(path.resolve('views/index.html'));
});

router.get('/instruments/:instrument_id', nocache, function(req,res){
  res.sendfile(path.resolve('views/instrument.html'));
});

router.get('/api/instruments/:instrument_id', nocache, function(req,res){
  var instrument_id = req.params.instrument_id;
  var response = {};
  instrument_id = parseInt(instrument_id);

  if (instrument_id){
    if (instrument_id <= 0){
      res.status(422).send({error: 'Instrument not found'});
      return; 
    }

    Instrument.find({'id':instrument_id},{'_id':0}).exec(function(err,instruments){
      if (err){
        res.status(500).send({error: 'Something broke!'});
        return;
      }
      if (instruments.length == 0){
        console.log('inside');
        res.status(404).send({error: 'Instrument not found'});
        return;
      }
      response['instrument'] = instruments[0];

      Transaction.find({'instrument_id': instrument_id},{'_id':0}).exec(function(err,transactions){
        if(err){
            res.status(500).send({error:'Something broke!'});
            return;
        }
        response['transactions'] = transactions;
        res.json(response);
      });
    });

  }else{
    res.status(422).send({error: 'Instrument not found'});
  }
});

router.post('/instruments',nocache, function(req,res){
  if (req.body.transaction){
    var n_transaction = new Transaction(parser.transaction(req.body.transaction));
    Instrument.find({'id':n_transaction.instrument_id}).exec(function(err,instruments){
      if(err){
        res.send(500).send({error: 'Update failed'});
        return;
      }
      if (instruments.length == 0){
        var n_instrument = new Instrument({
          id: n_transaction.instrument_id,
          name: parser.instrument_name(req.body.transaction),
          position: n_transaction.action == 2 ? -(n_transaction.quantity) : n_transaction.quantity
        });
      }else{
        var n_instrument = instruments[0];
        n_instrument.position = n_instrument.position + (n_transaction.action == 2 ? -(n_transaction.quantity) : n_transaction.quantity);
      }
      n_instrument.save(function(err,instruments){
        if (err){
          res.status(500).send({error:'Something broke!'});
          return
        }
        n_transaction.save(function(err,transactions){
          if(err){
            res.status(500).send({error: 'Something broke!'});
            return;
          }
          res.status(200).send({message: 'Update Successful'});
          return;
        });
      });
    });
  }else{
    res.send(422).send({error: 'Update failed'})
  }
});

module.exports = router;



