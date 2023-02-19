const mysql = require('mysql')

const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    port: 3312,
    user: 'root',
    password: '',
    database: 'nodemysql2',
})

module.exports = pool