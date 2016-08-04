var d3utils = require('./d3utils');
var err = require('../utils').err;

exports.getPieGraph = (req, res, next)=> {
  try {
    var id = req.params.id;
    d3utils.generatePieGraph(res, [12,31], 'graph');
  } catch (e) {
    console.log(e);
    next(err(500), 'Error for id ' + id + ': ' + e, null);
  }
}
