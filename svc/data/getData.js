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
      if (DEBUG) console.log('result: ', result);
      res.send(result);
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
