var id_reg = /48=[0-9]+/
var quantity_reg = /32=[0-9]+/
var action_reg = /54=[0-9]+/
var name_reg = /55=[A-Z]+/
exports.transaction = (line) => {
  var id = parseInt(id_reg.exec(line)[0].substring(3));
  var quantity = parseInt(quantity_reg.exec(line)[0].substring(3));
  var action = parseInt(action_reg.exec(line)[0].substring(3));
  var transaction = {
    instrument_id: id,
    quantity: quantity,
    action: action
  };
  return transaction;
}

exports.instrument_name = (line) => {
  var name = name_reg.exec(line)[0].substring(3);
  return name;
}