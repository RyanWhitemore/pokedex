const mysql = require('mysql2');

const user = process.env.USER;
const pass = process.env.PASSWORD

const con = mysql.createConnection({
    host: 'localhost',
    database: 'pokemon_prototype_db',
    user: user,
    password: pass
});


const getPokemon = (userID, callback) => {
    const results = con.query(`
        SELECT pokemon_users.is_caught,
            pokemon.pokemon_id,
            pokemon.pokemon_name,
            pokemon.region,
            pokemon.type 
        FROM pokemon_users
        INNER JOIN pokemon On pokemon_users.pokemon_id = pokemon.pokemon_id 
        where user_id = ?
        `, userID, (error, results) => {
        if (error) {
            throw (error)
        } else {
            return callback(results)
        }
    })

}

const updatePokemonUsers = (userID, pokemonID, callback) => {
    const results = con.query(`
    UPDATE pokemon_users
    SET is_caught = 
    CASE WHEN (SELECT * FROM 
            (SELECT is_caught 
            FROM pokemon_users 
            WHERE user_id = ${con.escape(userID)} and pokemon_id = ${con.escape(pokemonID)}) as x) = 1 THEN 0
         WHEN (SELECT * FROM 
            (SELECT is_caught 
            FROM pokemon_users 
            WHERE user_id = ${con.escape(userID)} AND pokemon_id = ${con.escape(pokemonID)}) as x) = 0 THEN 1
    END
    WHERE user_id = ${con.escape(userID)} and pokemon_id = ${con.escape(pokemonID)}
        `)
    callback(results)
}

const checkAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next()
    }
    console.log(req.isAuthenticated())
    res.redirect('/')
};

const getUserFromDB = (id, callback) => {
    const results = con.query('SELECT * FROM users WHERE user_id = ?', [id], (error, results) => {
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
    getUserFromDBByUsername,
    getPokemon,
    updatePokemonUsers
}