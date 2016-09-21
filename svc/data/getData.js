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
  var labelQuery = `SELECT * FROM ` + year + `labels_value WHERE field_name = '` + sortBy + `';`;
  return { dbQuery: dbQuery, labelQuery: labelQuery };
};

exports.getData = (req, res, next)=> {
  if (DEBUG) console.log('exports.getData');
  var connection = null;
  var dbResult = null;
  var labelResult = null;
  try {
    if (DEBUG) console.log('req.query: ', req.query);
    var queries = createDbQuery(req.query);
    var dbQuery = queries.dbQuery;
    var labelQuery = queries.labelQuery;
    if (DEBUG) console.log('dbQuery: ', dbQuery);
    if (DEBUG) console.log('labelQuery: ', labelQuery);
    db.getConnection()
    .then(conn => {
      connection = conn;
      return db.queryConnection(connection, dbQuery, req.params);
    })
    .then(result1 => {
      dbResult = result1;
      if (DEBUG) console.log('result1: ', result1);
      return db.queryConnection(connection, labelQuery, req.params);
    })
    .then(result2 => {
      labelResult = result2.reduce((map, obj) => {
        map[obj.value] = obj.label.toString();
        return map;
      }, {});
      if (DEBUG) console.log('labelResult: ', labelResult);
      dbResult.forEach(result => {
        result.value = result.name;
        if (labelResult[result.name] !== undefined) result.name = labelResult[result.name];
      });
      if (DEBUG) console.log('dbResult: ', dbResult);

      res.send(dbResult);
    })
    .catch(error => { throw error; });
  } catch (e) {
    console.error(e);
    next(err(500), 'Error: ' + e, null);
  } finally {
    if (connection) connection.release();
  }
}

exports.getFilterOptions = (req, res, next)=> {
  var connection = null;
  try {
    if (DEBUG) console.log('getFilterOptions req.query: ', req.query);
    var dbQuery = 'SELECT DISTINCT ' + req.query.filter +
    ' FROM ' + req.query.year + 'stopfrisk;';
    db.getConnection()
    .then(conn => {
      connection = conn;
      return db.queryConnection(connection, dbQuery, req.params);
    })
    .then(result => {
      if (connection) connection.release();
      res.send(result.map(r => r[req.query.filter]));
    })
    .catch(error => { throw error; });
  } catch (e) {
    console.error(e);
    next(err(500), 'Error: ' + e, null);
  } finally {
    if (connection) connection.release();
  }
};

exports.getSortOptions = (req, res, next)=> {
  var connection = null;
  try {
    var dbQuery = 'SHOW COLUMNS FROM 2015stopfrisk;';
    db.getConnection()
    .then(conn => {
      connection = conn;
      return db.queryConnection(connection, dbQuery, req.params);
    })
    .then(result => {
      if (connection) connection.release();
      res.send(result.map(r => r['Field']));
    })
    .catch(error => { throw error; });
  } catch (e) {
    console.error(e);
    next(err(500), 'Error: ' + e, null);
  } finally {
    if (connection) connection.release();
  }
};
