const express = require('express');
const { registerUser } = require('./routeFunctions')
const session = require('express-session')
const passport = require('passport');
const bcrypt = require('bcrypt')
const LocalStrategy = require('passport-local').Strategy
const { checkAuthenticated, getUserFromDBByUsername, getUserFromDB, getPokemon, updatePokemonUsers } = require('./helper')
const dotenv = require('dotenv').config
const bodyParser = require('body-parser')
const cors = require('cors')
const cookieParser = require('cookie-parser')

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

app.use(cookieParser(secret))

app.use(session({
    secret: secret,
    cookie: {maxAge: 60 * 60 * 1000, sameSite: 'none', httpOnly: true, secure: true},
    saveUninitialized: false,
    resave: false
}));

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


app.put("/pokemon", (req, res) => {
    userID = req.body.userID
    pokemonID = req.body.pokemonID
    updatePokemonUsers(userID, pokemonID, (results) => {
        res.send('success')
    })
})

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

app.get('/home', (req, res) => {
    console.log(req.query.userID)
    getPokemon(req.query.userID, (results) => {
        res.json(results)
    })
})

app.get('/', (req, res) => {
    res.set({"Content-Type": "application/json"})
    res.json({authorized: false})
})

app.get('/auth', (req, res) => {
    res.set({"Content-Type": "application/json"})
    res.json({authorized: true})
})

app.post('/login', passport.authenticate('local', { failureRedirect: '/'}),
 (req, res) => {
    req.login(req.user, err => {
        if (err) {
            throw err
        }
    })
    console.log(req.user)
    res.redirect('/auth')
})

app.post('/register', registerUser)




app.listen(port, () => {
    console.log(`app running on port ${port}`)
})