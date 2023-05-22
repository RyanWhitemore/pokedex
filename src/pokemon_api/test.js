const mysql = require('mysql2')

const user = process.env.DBUSER
const pass = process.env.PASSWORD
const host = process.env.HOST

console.log(user, pass, host)

const con = mysql.createConnection({
    host: 'ls-6e82fdfc773a0ba8005282c0aa42b87b5b07034f.cshdk1syrqzh.us-east-1.rds.amazonaws.com',
    user: 'dbmasteruser',
    password: ';DAq._D4s$AO>Bm&F1oc!f:f$CLi&ni1',
    database: 'pokemon_prototype_db'
})

con.query('SELECT * FROM users', (err, results) => {
    if (err) {
        throw (err)
    } else {
        console.log(results)
    }
})
