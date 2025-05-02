const mysql = require('mysql2/promise');

const db = mysql.createPool({
  host: '192.168.0.105',
  user: 'root',
  password: '123Ferri!',
  database: 'kamusarab',
  waitForConnections: true,
  connectionLimit: 100,
  queueLimit: 0,
});

module.exports = db;
