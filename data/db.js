var mysql = require('mysql');
var config = require('../common/config');

var pool = mysql.createPool(config.mysql);

exports.getConnection = (connection)=> {
  return new Promise((resolve, reject)=> {
    pool.getConnection((err, connection) => err ? reject(err) : resolve(connection));
  });
}

exports.queryConnection = (connection, query, params)=> {
  return new Promise((resolve, reject)=> {
    connection.query(query, params, (err, result)=> {
      err ? reject(err) : resolve(JSON.parse(JSON.stringify(result)));
    });
  });
}

// exports.beginTransaction = (connection)=> {
//   return new Promise((resolve, reject)=>
//     connection.beginTransaction((err)=> err ? reject(err) : resolve(connection))
//   );
// }
//
// exports.commitTransaction = (connection)=> {
//   return new Promise((resolve, reject)=>
//     connection.commit((err)=> err ? reject(err) : resolve())
//   );
// }
//
// exports.rollback = (connection)=> {
//   return new Promise((resolve, reject)=>
//     connection.rollback((err)=> (err) ? reject(err) : resolve())
//   );
// }
