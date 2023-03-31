const mysql = require('mysql2');

// Initialize environment variables
const user = process.env.USER;
const pass = process.env.PASSWORD

// Create database connection
const con = mysql.createConnection({
    host: 'localhost',
    database: 'pokemon_prototype_db',
    user: user,
    password: pass
});

/* Query that return data on all pokemon that 
have not been caughtfor user with given id */
const getUnCaught = (id, callback) => {
    const results = con.query(`
        SELECT pokemon_users.is_caught,
            pokemon.pokemon_id,
            pokemon.pokemon_name,
            pokemon.region,
            pokemon.type 
        FROM pokemon_users
        INNER JOIN pokemon On pokemon_users.pokemon_id = pokemon.pokemon_id 
        where user_id = ? AND pokemon_users.is_caught = 0
        `, id, (error, results) => {
        if (error) {
            throw (error)
        } else {
            return callback(results)
        }
    })
}

// Query that returns data on all caught pokemon for user with given id
const getCaught = (id, callback) => {
    const results = con.query(`
        SELECT pokemon_users.is_caught,
            pokemon.pokemon_id,
            pokemon.pokemon_name,
            pokemon.region,
            pokemon.type 
        FROM pokemon_users
        INNER JOIN pokemon On pokemon_users.pokemon_id = pokemon.pokemon_id 
        where user_id = ? AND pokemon_users.is_caught = 1
        `, id, (error, results) => {
        if (error) {
            throw (error)
        } else {
            return callback(results)
        }
    })
}

// Query that returns data on all pokemon with type value for user with given id
const sortPokemonType = (type, userID, callback) => {
    const results = con.query(`
    SELECT pokemon_users.is_caught,
	    pokemon.pokemon_id,
        pokemon.pokemon_name,
        pokemon.region,
        pokemon.type
    FROM pokemon_users
    INNER JOIN pokemon on pokemon_users.pokemon_id = pokemon.pokemon_id
    WHERE pokemon_users.user_id = ${con.escape(parseInt(userID))} 
    AND pokemon.type LIKE ${con.escape("%" + type + "%")}
    `, (error, results) => {
        if (error) {
            throw(error)
        } else {
            return callback(results)
        }
    })
}

// Query that returns data on one pokemon by name for user with given id
const getPokemonByName = (pokemonName, userID, callback) => {
    const results = con.query(`
    SELECT pokemon_users.is_caught,
        pokemon.pokemon_id,
        pokemon.pokemon_name,
        pokemon.region,
        pokemon.type
    FROM pokemon_users
    INNER JOIN pokemon on pokemon_users.pokemon_id = pokemon.pokemon_id
    WHERE pokemon_name = '${pokemonName}' AND user_id = ${userID}`, (error, results) => {
        if (error) {
            throw(error)
        } else {
            return callback(results)
        }
    })
}

// Query that returns data on all pokemon for user with given id
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

// Query that updates is_caught column for one pokemon for user with given id
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

// Function to check if user is authenticated
const checkAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next()
    }
    console.log(req.isAuthenticated())
    res.redirect('/')
};

// Query that returns all data on user with given id
const getUserFromDB = (id, callback) => {
    const results = con.query('SELECT * FROM users WHERE user_id = ?', [id], (error, results) => {
        if (error) {
            throw (error)
        }
        return callback(results)
    });
    return callback(results)
};

// Query that returns all data on user with given username
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
    updatePokemonUsers,
    getPokemonByName,
    sortPokemonType,
    getCaught,
    getUnCaught
}