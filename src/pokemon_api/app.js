const express = require('express');
const { registerUser, returnResults, sort } = require('./routeFunctions')
const session = require('express-session')
const { getUserFromDBByUsername, updatePokemonUsers, 
    getPokemonByName, getPicUrls,
    getProfilePic, updateProfilePic,
    updateVersion,
    sortVersion, getVersion} = require('./helper')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const passport = require("passport")
const AWS = require('aws-sdk')
const fs = require('fs')
require('./passportConfig')


/*-------------------------- End Imports -------------------------------------*/

/*------------------------------AWS Config-------------------------------------*/
AWS.config.update({
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    region: process.env.REGION,
    signatureVersion: process.env.SIGNATURE_VERSION
})


/*------------------------------- Begin express config ------------------------*/
const app = express()
const port = 5000
const secret = process.env.SECRET


const corsConfig = {
    origin: "http://localhost:3000",
    credentials: true,
}

app.use(express.urlencoded({limit: "50mb"}))
app.use(express.text({limit: "50mb"}))
app.use(express.json({limit: "50mb"}))



app.use(session({
    secret: secret,
    cookie: {maxAge: 60 * 60 * 1000, sameSite: 'lax', httpOnly: true, secure: true},
    saveUninitialized: false,
    resave: false
}));

/*---------------------------- End express config -----------------------------*/

/*----------------Begin passport initialization and config--------------------*/
app.use(passport.initialize());
app.use(passport.session());
app.use(cors(corsConfig))

const jwtRequired = passport.authenticate('jwt', {session: true})

/*------------------End passport initialization and config----------------------*/


app.get('/sort', sort)

// Route to get user information from database by given username
app.get('/user/:username', (req, res) => {
    getUserFromDBByUsername(req.params.username, async (user) => {
        user = user[0]
        returnResults(res, user)
    })
})

// Route to get profile pic url from database for user with given id
app.get("/profilePic/:userID", (req, res) => {
    getProfilePic(req.params.userID, (results) => {
        returnResults(res, results)
    })
})

// Route to update profile picture
app.put("/profilePic", async (req, res) => {
    const s3 = new AWS.S3();
    const userID = req.body.userID;

    // image comes as base64 use buffer to translate before upload
    const buffer = Buffer.from(req.body.file.replace(
        /^data:image\/\w+;base64,/, ""),'base64')

    /*  Get current profile picture url from database 
    then delete picture from s3 bucket*/
    getProfilePic(userID, (results) => {
        if (!results[0].profile_pic) {
            return
        }
        const key = results[0].profile_pic.match(/\.com\/(.*)/)[1]
        const delParams = {Bucket: process.env.BUCKET, Key: key}
        s3.deleteObject(delParams, (err, data) => {
            if (err) {
                console.log(err)
            } else {
                return
            }
        })
    })

    const upParams = {
        Bucket: "pokedexpictures",
        Key: `profilePictures/${userID}${Date.now()}.png`,
        Body: buffer
    };

    const { Location } = await s3.upload(upParams).promise()

    updateProfilePic(userID, Location)
    res.json({Location: Location})
})

// Route to retrieve all data on one pokemon by name for user with given id
app.get('/pokemon/:name/:id', (req, res) => {
    getPokemonByName(req.params.name, req.params.id, results => {
        returnResults(res, results)
    })
})

// Route to create a view with only pokemon from saved version
app.get('/version/sort/:userID/:version', (req, res) => {
    sortVersion(req.params.userID, req.params.version, (results) => {
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

// Route to retrieve the version for user with given id
app.get('/version/:userID', (req, res) => {
    getVersion(req.params.userID, (results) => {
        returnResults(res, results)
    })
})

// Route for logging in user using passport
app.post('/login',  passport.authenticate('local', { failureRedirect: '/api'}),
 (req, res) => {
    const userReturnObject = {username: req.username}
    req.session.jwt = jwt.sign(userReturnObject,
        process.env.JWT_SECRET_KEY);
    const jwtToken = req.session.jwt
   res.send({authorized: true})
   return;
})

// Route used to save new user info into database
app.post('/register', registerUser)

// Route to update caught status of pokemon with given id for user with given id
app.put("/pokemon", (req, res) => {
    const userID = req.body.userID
    const pokemonID = req.body.pokemonID
    updatePokemonUsers(userID, pokemonID, (results) => {
        res.send('success')
    })
})

// Route to add version to database for under user with given id
app.put("/version/:userID/:version", (req, res) => {
    updateVersion(req.params.version, req.params.userID)
    res.status(200).send()
})


app.listen(port, () => {
    console.log(`app running on port ${port}`)
})
