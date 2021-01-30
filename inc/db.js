// get the client
const mysql = require('mysql2');
// create the connection to database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'user',
  database: 'saboroso',
  password: 'password'
});
// Return Conection Data
module.exports = connection;
