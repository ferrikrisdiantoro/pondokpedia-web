const mysql = require('mysql2/promise');

const db = mysql.createPool({
  // host: '192.168.1.6',
  host: '10.64.30.51',
  user: 'root',
  password: '',
  database: 'proyekti',
  waitForConnections: true,
  connectionLimit: 100,
  queueLimit: 0,
});

module.exports = db;
