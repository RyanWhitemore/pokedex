const passport = require('passport')
const JwtStrategy = require("passport-jwt").Strategy
const {getUserFromDB, getUserFromDBByUsername} = require('./helper')
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt')

const jwtStrategy = new JwtStrategy(
    {
        jwtFromRequest: (req) => req.session.jwt,
        secretOrKey: process.env.JWT_SECRET_KEY
    },
    (payload, done) => {
        return done(null, payload)
    }
)

passport.serializeUser((user, done) => {
    return done(null, user.user_id)
})

passport.deserializeUser((id, done) => {
    getUserFromDB(id, async (user) => {
        if (!user) {
            return done(null, false);
        }
        return done(null, user);
    });
    
})

passport.use(new LocalStrategy( async (username, password, done,) => {
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

passport.use(jwtStrategy);

module.exports = {passport}