const express = require('express');
const { registerUser } = require('./routeFunctions')
const session = require('express-session')
const passport = require('passport');
const bcrypt = require('bcrypt')
const LocalStrategy = require('passport-local').Strategy
const { checkAuthenticated, getUnCaught,
    getCaught, sortPokemonType, 
    getUserFromDBByUsername, getUserFromDB, 
    getPokemon, updatePokemonUsers, 
    getPokemonByName, getPicUrls } = require('./helper')
const dotenv = require('dotenv').config
const bodyParser = require('body-parser')
const cors = require('cors')
const cookieParser = require('cookie-parser')
/*-------------------------- End Imports -------------------------------------*/

/*------------------------------- Begin express config ------------------------*/
const app = express()
const port = 5000
const secret = process.env.SECRET

const corsConfig = {
    origin: true,
    Credentials: true,
}

app.use(bodyParser.urlencoded())
app.use(express.text())
app.options('*', cors(corsConfig))
app.use((req, res, next) => {
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        return res.status(200)
    }
    
    res.append('Access-Control-Allow-Origin', ['http://localhost:3000'])
    res.append("Access-Control-Allow-Credentials", [true])
    next()
})

app.use(session({
    secret: secret,
    cookie: {maxAge: 60 * 60 * 1000, sameSite: 'none', httpOnly: true, secure: true},
    saveUninitialized: false,
    resave: false
}));
/*---------------------------- End express config -----------------------------*/

/*----------------Begin passport initialization and config--------------------*/
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
    done(null, user.user_id)
})

passport.deserializeUser((id, done) => {
    user = getUserFromDB(id, async (user) => {
        if (!user) {
            return done(null, false);
        }
        return done(null, user);
    });
    
})

passport.use(new LocalStrategy( async (username, password, done) => {
    getUserFromDBByUsername(username, async (user) => {
        user = user[0]
        try {
            if (!user) {
                return done(null, false)
            }
            const passwordMatched = await bcrypt.compare(password, user.password);
            if (passwordMatched) {
                console.log('password matched')
                return done(null, user)
            } else {
                return done(null, false)
            }
        } catch(error) {
            console.log(error)
        }
        })     
    })
);

/*------------------End passport initialization and config----------------------*/

// Route to get user information from database by given username
app.get('/user/:username', (req, res) => {

    getUserFromDBByUsername(req.params.username, async (user) => {
        user = user[0]
        try {
            if (!user) {
                res.sendStatus(404, "user not found")
            } else {
                res.send({
                    user_id: user.user_id,
                    username: user.username,    
                })
            }
        }
        catch (err) {
            throw (err)
        }
    })
})

// Route to retrieve all data on all pokemon for user with given id
app.get('/home', (req, res) => {
    getPokemon(req.query.userID, (results) => {
        res.json(results)
    })
})

// Route to retrieve all data on all caught pokemon for user with given id
app.get("/uncaught/:id", (req, res) => {
    getUnCaught(req.params.id, (results) => {
        try {
            if (!results) {
                res.send({})
            } else {
                res.json(results)
            }
        }
        catch (err) {
            throw (err)
        }
    })
})

// Route to retrieve all data on all caught pokemon for user with given id
app.get("/caught/:id", (req, res) => {
    getCaught(req.params.id, (results) => {
        try {
            if (!results) {
                res.send({})
            } else {
                res.json(results)
            }
        }
        catch (err) {
            throw (err)
        }
    })
})

// Route to retrieve all data on one pokemon by name for user with given id
app.get('/pokemon/:name/:id', (req, res) => {

    getPokemonByName(req.params.name, req.params.id, (results) => {
        try {
            if (!results) {
                res.send({})
            } else {
                res.json(results)
            }
        }
        catch (err) {
            throw (err)
        }
    })
})

// Route to retrieve all data on all pokemon of given type for user with given id
app.get('/type/:type/:id', (req, res) => {
    
    sortPokemonType(req.params.type, req.params.id, async (results) => {
        try {
            if (!results) {
                res.send({})
            } else {
                res.json(results)
            }
        }
        catch (err) {
            throw(err)
        }
    })
})

// Route for failed authorization
app.get('/', (req, res) => {
    res.set({"Content-Type": "application/json"})
    res.json({authorized: false})
})

// Route for successful authorization
app.get('/auth', (req, res) => {
    res.set({"Content-Type": "application/json"})
    res.json({authorized: true})
})

// Route for retrieving photo urls from database 
app.get('/picUrls/:id', (req, res) => {
    getPicUrls(req.params.id, (results) => {
        if (!results) {
            res.send("no content")
        } else {
            res.json(results)
        }
    })
})

// Route for logging in user using passport
app.post('/login', passport.authenticate('local', { failureRedirect: '/'}),
 (req, res) => {
    req.login(req.user, err => {
        if (err) {
            throw err
        }
    })
    res.redirect('/auth')
})

// Route used to save new user info into database
app.post('/register', registerUser)

// Route to update caught status of pokemon with given id for user with given id
app.put("/pokemon", (req, res) => {
    userID = req.body.userID
    pokemonID = req.body.pokemonID
    updatePokemonUsers(userID, pokemonID, (results) => {
        res.send('success')
    })
})




app.listen(port, () => {
    console.log(`app running on port ${port}`)
})