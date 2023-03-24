const express = require('express');
const { registerUser } = require('./routeFunctions')
const session = require('express-session')
const passport = require('passport');
const bcrypt = require('bcrypt')
const LocalStrategy = require('passport-local').Strategy
const { checkAuthenticated, getUserFromDBByUsername, getUserFromDB } = require('./helper')
const dotenv = require('dotenv').config
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()
const port = 5000
const secret = process.env.SECRET

app.use(bodyParser.urlencoded())
app.use(express.text())
app.use(cors())


app.use(session({
    secret: secret,
    cookie: {maxAge: 60 * 60 * 1000, sameSite: 'none', httpOnly: true, secure: false},
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
        user = user[0]
        if (!user) {
            return done(null, false);
        }
        done(null, user);
    });
    
})

passport.use(new LocalStrategy( async (username, password, done) => {
    getUserFromDBByUsername(username, async (user) => {
        user = user[0]
        try {
            if (!user.username) {
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

app.get('/', (req, res) => {
    res.send(false)
})

app.get('/auth', checkAuthenticated, (req, res) => {
    res.send(true)
})

app.post('/login', passport.authenticate('local', { failureRedirect: '/'}),
 (req, res) => {
    console.log(req.user)
    res.send(true)
})

app.post('/register', registerUser)




app.listen(port, () => {
    console.log(`app running on port ${port}`)
})