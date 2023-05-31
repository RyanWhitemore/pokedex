const mysql = require('mysql2')

const user = process.env.DBUSER
const password = process.env.PASSWORD
const database = process.env.DATABASE

const pool = mysql.createPool({
    connectionLimit: 100,
    host: 'localhost',
    user: user,
    password: password,
    database: database
})

const getConnection = (callBack) => {
    pool.getConnection((err, con) => {
        if (err) {
            return callBack(err);
    } else {
        return callBack(null, con)
    }
})
}


module.exports = getConnection
