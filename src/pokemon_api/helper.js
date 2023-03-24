const mysql = require('mysql2');

const user = process.env.USER;
const pass = process.env.PASSWORD

const con = mysql.createConnection({
    host: 'localhost',
    database: 'pokemon_prototype_db',
    user: user,
    password: pass
});

const checkAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect('/')
};

const getUserFromDB = (id, callback) => {
    const results = con.query('SELECT * FROM users WHERE user_id = ?', id, (error, results) => {
        if (error) {
            throw (error)
        }
        return callback(results)
    });
    return callback(results)
};

const getUserFromDBByUsername = (username, callback) => {
    con.query('SELECT * FROM users WHERE username = ?', username, (err, results) => {
        if (err) {
            throw(err)
        }
        return callback(results)
    });
};


module.exports = {
    checkAuthenticated,
    getUserFromDB,
    getUserFromDBByUsername
}