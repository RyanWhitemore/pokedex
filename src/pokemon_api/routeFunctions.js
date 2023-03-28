const mysql = require('mysql2')
const dotenv = require('dotenv').config()
const bcrypt = require('bcrypt')

const user = process.env.USER
const pass = process.env.PASSWORD
const saltRounds = parseInt(process.env.SALTROUNDS)

const con = mysql.createConnection({
    host: 'localhost',
    database: 'pokemon_prototype_db',
    user: user,
    password: pass
})

const registerUser = async (req, res) => {
    const { username, password } = req.body
    con.query('SELECT username FROM users WHERE username = ?', [username], async (err, results) => {
        if (err) {
            throw(err)
        }
        if (results.length > 0) {
            return res.status(400).send('username taken')
        } else {
            const salt = await bcrypt.genSalt(saltRounds)
            const hash = await bcrypt.hash(password, salt)
            con.query(`INSERT INTO users (username, password) VALUES (?, ?)`, [username, hash], (err, results) => {
                if (err) {
                    throw err
                }
            con.query("SELECT user_id FROM users WHERE username = ?", [username], (err, results) => {
                if (err) {
                    throw(err)
                } else {
                    con.query("INSERT INTO pokemon_users (user_id, pokemon_id) SELECT ?, pokemon_id FROM pokemon", [parseInt(results[0].user_id)], (err, results) => {
                        if (err) {
                            throw (err)
                        }
                    })
                }
            })
            res.status(201).send(`user with username ${username} created`)
            })
        }
    })
}


module.exports = {
    registerUser
}



