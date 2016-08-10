var fs = require('fs');
var parse = require('csv-parse');

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

exports.getLabels = (req, res, next)=> {
  try {
    var parser = parse({ delimiter: ',' });
    var file = __dirname + '/labels/2015detailCM.csv';
    var output = {};

    var input = fs.createReadStream(file)
    .on('data', (chunk)=> {
      parser.write(chunk);
      parser.on('readable', (record)=> {
        while (record = parser.read()) {
          output[record[0]] = record[1];
        }
      });
      parser.end();
    })
    .on('end', ()=> { res.send(output); })
    .on('error', (err)=> { throw err; });
  } catch (e) {
    console.error(e);
    next(err(500), 'Error: ' + e, null);
  }
};
