var d3utils = require('./d3utils');
var err = require('../utils').err;

exports.postGraph = (req, res, next)=> {
  try {
    var id = req.params.id;
    console.log('postGraph() req.body: ', req.body);
    d3utils.graphMaker(res, [12,31], 'generated/graph.svg');
  } catch (e) {
    console.log(e);
    next(err(500), 'Error for id ' + id + ': ' + e, null);
  }
}
