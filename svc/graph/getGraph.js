var d3utils = require('./d3utils');
var err = require('../utils').err;

exports.getPieGraph = (req, res, next)=> {
  try {
    d3utils.generatePieGraph(res, req.query);
  } catch (e) {
    console.error(e);
    next(err(500), 'getPieGraph error:' + e, null);
  }
}
