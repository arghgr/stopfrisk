var err = require('../utils').err;
var db = require('../../data/db');
var d3utils = require('../graph/d3utils');

exports.getData = (req, res, next)=> {
  var connection = null;
  try {
    var id = req.params.id;
    var params = req.params;
    var query = 'SELECT DISTINCT race AS name, COUNT(race) AS number FROM 2015stopfrisk ' +
      'WHERE detailCM = ' + id + ' ' +
      'GROUP BY race ' +
      'ORDER BY COUNT(race) DESC;';
    console.log('query: ', query);
    db.getConnection()
    .then(conn => {
      connection = conn;
      return db.queryConnection(connection, query, params);
    })
    .then(result => {
      if (connection) connection.release();
      d3utils.generatePieGraph(res, result, 'graph');
    })
    .catch(error => { throw error; });
  } catch (e) {
    console.log(e);
    next(err(500), 'Error for id ' + id + ': ' + e, null);
  }
}
