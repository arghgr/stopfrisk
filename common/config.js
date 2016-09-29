require('dotenv').load(); // Load .env for development vars

module.exports = {
  isProduction: process.env.IS_PRODUCTION,
  mysql: {
    connectionLimit: 10,
    host: process.env.MYSQL_HOST,
    database: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    multipleStatements: true
  }
};
