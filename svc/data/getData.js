var err = require('../utils').err;
var db = require('../../data/db');

var DEBUG = false;

exports.getData = (req, res, next)=> {
  if (DEBUG) console.log('exports.getData');
  var connection = null;
  try {
    var id = req.params.id;
    var params = req.params;
    if (DEBUG) console.log('req.params: ', req.params);
    var query = 'SELECT DISTINCT race AS name, COUNT(race) AS number FROM 2015stopfrisk ' +
      'WHERE detailCM = ' + id + ' ' +
      'GROUP BY race ' +
      'ORDER BY COUNT(race) DESC;';
    if (DEBUG) console.log('query: ', query);
    db.getConnection()
    .then(conn => {
      connection = conn;
      return db.queryConnection(connection, query, params);
    })
    .then(result => {
      if (connection) connection.release();
      if (DEBUG) console.log('result: ', result);
      res.send(result);
    })
    .catch(error => { throw error; });
  } catch (e) {
    if (connection) connection.release();
    console.error(e);
    next(err(500), 'Error for id ' + id + ': ' + e, null);
  }
}
