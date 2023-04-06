const express = require('express');
const { registerUser, returnResults } = require('./routeFunctions')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const { getUnCaught,
    getCaught, sortPokemonType, 
    getUserFromDBByUsername, 
    getPokemon, updatePokemonUsers, 
    getPokemonByName, getPicUrls } = require('./helper')
const dotenv = require('dotenv').config
const cors = require('cors')
const jwt = require('jsonwebtoken')
const passport = require("passport")
require('./passportConfig')
/*-------------------------- End Imports -------------------------------------*/

/*------------------------------- Begin express config ------------------------*/
const app = express()
const port = 5000
const secret = process.env.SECRET


const corsConfig = {
    origin: "http://localhost:3000",
    credentials: true,
}

app.use(express.urlencoded())
app.use(express.text())



app.use(session({
    secret: secret,
    cookie: {maxAge: 60 * 60 * 1000, sameSite: 'lax', httpOnly: true, secure: false},
    saveUninitialized: false,
    resave: false
}));
/*---------------------------- End express config -----------------------------*/

/*----------------Begin passport initialization and config--------------------*/
app.use(passport.initialize());
app.use(passport.session());
app.use(cors(corsConfig))
app.use(cookieParser())

const jwtRequired = passport.authenticate('jwt', {session: false})

/*------------------End passport initialization and config----------------------*/

// Route to get user information from database by given username
app.get('/user/:username', (req, res) => {

    getUserFromDBByUsername(req.params.username, async (user) => {
        user = user[0]
        returnResults(res, user)
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
        returnResults(res, results)
    })
})

// Route to retrieve all data on all caught pokemon for user with given id
app.get("/caught/:id", (req, res) => {
    getCaught(req.params.id, (results) => {
        returnResults(res, results)
    })
})

// Route to retrieve all data on one pokemon by name for user with given id
app.get('/pokemon/:name/:id', (req, res) => {
    getPokemonByName(req.params.name, req.params.id, results => {
        returnResults(res, results)
    })
})

// Route to retrieve all data on all pokemon of given type for user with given id
app.get('/type/:type/:id', (req, res) => {
    
    sortPokemonType(req.params.type, req.params.id, (results) => {
      returnResults(res, results)
    })
})

// Route for failed authorization
app.get('/', (req, res) => {
    res.json({authorized: false})
})

// Route for successful authorization
app.get('/auth', jwtRequired, (req, res) => {
    console.log(req.session.jwt)
    res.json({authorized: true})
})

// Route for retrieving photo urls from database 
app.get('/picUrls/:id', (req, res) => {
    getPicUrls(req.params.id, (results) => {
       returnResults(res, results)
    })
})

// Route for logging in user using passport
app.post('/login',  passport.authenticate('local', { failureRedirect: '/'}),
 (req, res) => {
    const userReturnObject = {username: req.username}
    req.session.jwt = jwt.sign(userReturnObject,
        process.env.JWT_SECRET_KEY);
    const jwt = req.session.jwt
   return res.send(jwt)
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