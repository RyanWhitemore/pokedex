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

const dropViews = (userID) => {

    con.query(`DROP VIEW IF EXISTS ${userID + "scarlet"}`)
    con.query(`DROP VIEW IF EXISTS ${userID + "violet"}`)
    con.query(`DROP VIEW IF EXISTS ${userID + 'all'}`)
}

const sortVersion = (userID, version, callback) => {
    if (version === "all") {
        return getPokemon(userID, version, callback)
    }
    dropViews(userID)
    con.query(`
        CREATE VIEW ${userID + version}
        AS
        SELECT pu.is_caught,
            p.pokemon_id,
            p.pokemon_name,
            p.region,
            p.type
        FROM pokemon_users as pu
        INNER JOIN pokemon as p ON pu.pokemon_id = p.pokemon_id
        WHERE pu.user_id = ? AND version in ('all', ?);
    `, [userID, version])
    con.query(`
        SELECT * FROM ${userID + version}
    `, [userID, version], (error, results) => {
        if (error) {
            console.log(error)
        } else {
            return callback(results)
        }
    })
}

// Query that returns data on all pokemon for user with given id
const getPokemon = (userID, version, callback) => {
    

    dropViews(userID)

    con.query(`
    CREATE VIEW ${userID + version} AS
    SELECT pokemon_users.is_caught,
        pokemon.pokemon_id,
        pokemon.pokemon_name,
        pokemon.region,
        pokemon.type 
    FROM pokemon_users
    INNER JOIN pokemon On pokemon_users.pokemon_id = pokemon.pokemon_id 
    where user_id = ?
    `, userID, (error) => {
    })
    
    con.query(`
        SELECT * FROM ${userID + version}
        `, (error, results) => {
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

// Query to return all urls for pokemon pictures
const getPicUrls = async (id, callback) => {
    con.query('SELECT image FROM pokemon_images WHERE pokemon_id = ?', id, (err, results) => {
        if (err) {
            throw(err)
        }
        return callback(results)
    })
}

// Query to update value of profile_pic in database
const updateProfilePic = (userID, url) => {
    con.query(`
        UPDATE users
        SET profile_pic = ?
        WHERE user_id = ? 
    `, [url, userID])
}

// Query to get profile picture url from database
const getProfilePic = (userID, callback) => {
    const results = con.query(`
        SELECT profile_pic
        FROM users
        WHERE user_id = ?
    `, userID, (err, results) => {
        if (err) {
            throw(err)
        } else 
        return callback(results)
    })
}

// Query to update version in users table
const updateVersion = (version, userID) => {
    con.query(`
        UPDATE users
        SET version = ?
        WHERE user_id = ?
    `, [version, userID])
}

// Query to return version from user table with given userID
const getVersion = (userID, callback) => {
    con.query(`
        SELECT version
        FROM users
        WHERE user_id = ?
    `, userID, (error, results) => {
        if (error) {
            console.log(error)
        } else {
            return callback(results)
        }
    })
}


module.exports = {
    getUserFromDB,
    getUserFromDBByUsername,
    getPokemon,
    updatePokemonUsers,
    getPokemonByName,
    getPicUrls,
    updateProfilePic,
    getProfilePic,
    sortVersion,
    updateVersion,
    getVersion
}