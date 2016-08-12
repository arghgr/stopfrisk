var fs = require('fs');
var parse = require('csv-parse');

var err = require('../utils').err;
var db = require('../../data/db');

var DEBUG = false;

function createDbQuery(query) {
  var sortBy = query.sortBy;
  var year = query.year;
  var filters = query.filters;
  var filterQuery = [];
  Object.keys(filters).forEach(filter => {
    if (DEBUG) console.log(filter + ` = ` + JSON.stringify(filters[filter]) + ` `);
    filterQuery.push(filter + ` = ` + JSON.stringify(filters[filter]) + ` `);
  });
  var dbQuery = `SELECT DISTINCT ` + sortBy + ` AS name, ` +
    `COUNT(` + sortBy + `) AS number FROM ` + year + `stopfrisk ` +
    `WHERE ` +  filterQuery.join(`AND `) +
    `GROUP BY ` + sortBy + ` ` +
    `ORDER BY COUNT(` + sortBy + `) DESC;`;
  return dbQuery;
};

exports.getData = (req, res, next)=> {
  if (DEBUG) console.log('exports.getData');
  var connection = null;
  try {
    if (DEBUG) console.log('req.query: ', req.query);
    var dbQuery = createDbQuery(req.query);
    if (DEBUG) console.log('dbQuery: ', dbQuery);
    db.getConnection()
    .then(conn => {
      connection = conn;
      return db.queryConnection(connection, dbQuery, req.params);
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
    next(err(500), 'Error: ' + e, null);
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
