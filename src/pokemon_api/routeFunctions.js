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
    console.log(req.body)
    req.body = JSON.parse(req.body)
    console.log(req.body)
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
            res.status(201).send(`user with username ${username} created`)
            })
        }
    })
   

}


module.exports = {
    registerUser
}



