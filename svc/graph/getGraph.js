var d3utils = require('./d3utils');
var err = require('../utils').err;

exports.getPieGraph = (req, res, next)=> {
  try {
    var id = req.params.id;
    var params = req.params;
    var data = params.data;
    d3utils.generatePieGraph(res, data, 'graph');
  } catch (e) {
    console.log(e);
    next(err(500), 'Error for id ' + id + ': ' + e, null);
  }
}
