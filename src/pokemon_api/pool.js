const mysql = require('mysql2')

const user = process.env.USER
const password = process.env.PASSWORD

const pool = mysql.createPool({
    host: 'localhost',
    user: user,
    password: password,
    database: 'pokemon_prototype_db'
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