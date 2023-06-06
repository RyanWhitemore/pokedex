const mysql = require('mysql2')
const dotenv = require('dotenv').config()
const bcrypt = require('bcrypt')
const getConnection = require('./pool.js')

const user = process.env.USER
const pass = process.env.PASSWORD
const saltRounds = parseInt(process.env.SALTROUNDS)



const registerUser = async (req, res) => {
    const { username, password } = req.body

    getConnection((err, con) => {
        con.query('SELECT username FROM users WHERE username = ?', [username], async (err, results) => {
            if (err) {
                throw(err)
            }
            if (results.length > 0) {
                return res.status(200).send(false)
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
        con.release()
    })
    
}

const returnResults = (res, results) => {
    try {
        if (!results) {
            return res.send(false)
        } else {
            return res.json(results)
        }
    }
    catch (err) {
        res.sendStatus(500)
        throw (err);

    }
}

const sort = (req, res, next) => {

    const {area, type, caught, userID, version} = req.query
    
    getConnection((err, con) => {
        con.query(`
            CREATE OR REPLACE VIEW ${userID + version} AS
            SELECT pokemon_users.is_caught,
                pokemon.pokemon_id,
                pokemon.pokemon_name,
                pokemon.region,
                pokemon.type 
            FROM pokemon_users
            INNER JOIN pokemon On pokemon_users.pokemon_id = pokemon.pokemon_id 
            where user_id = ${con.escape(userID)}
        `)
        

        if ((area === "all") && (type === 'all') && (caught === 'all')) {
            let query = `
                SELECT *
                FROM ${userID + version}
            `
            con.query(query, (err, results) => {
                if (err) {
                    console.log(err)
                } else {
                    returnResults(res, results)
                }
            })
        
        } else {
        let query = `
            SELECT * 
            FROM ${userID + version}
            WHERE 1=1
        `

        if (area !== 'all') {
            query = query + `
                AND region LIKE ${con.escape("%" + area + "%")}
            `
        }
        if (type !== 'all') {
            query = query + `
                AND type LIKE ${con.escape("%" + type + "%")}
            `
        }
        if (caught !== 'all') {
            query = query + `
                AND is_caught = ${con.escape(caught)}
            `
        }


        con.query(query, (err, results) => {
            if (err) {
                console.log("whoops")
            } else {
                returnResults(res, results)
            }
            
        })
    }
        con.release()
    })
    
}


module.exports = {
    registerUser,
    returnResults,
    sort
}



