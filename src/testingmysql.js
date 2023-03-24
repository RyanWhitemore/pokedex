const mysql = require('mysql2')
const dotenv = require('dotenv').config()

const user = process.env.USER
const pass = process.env.PASSWORD

const con = mysql.createConnection({
    host: 'localhost',
    database: 'pokemon_prototype_db',
    user: user,
    password: pass
});



const getData = async (callback) => {
    
    con.query("SELECT * FROM users", (error, results) => {
        if (error) {{
            throw (error)
        }}
        return callback(results)
    })

}

let results = ''

getData((result) => {
    results = result
    console.log(results)
})
