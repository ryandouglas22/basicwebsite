const express = require("express");
const mongoose = require('mongoose');
const bodyparser = require("body-parser");
const passport = require("passport")

//bring all routes
const auth = require("./routes/api/auth");
const profile = require("./routes/api/profile")
const play = require("./routes/api/play")

const app = express();

//middleware for bodyparser
app.use(bodyparser.urlencoded({extended: false}));
app.use(bodyparser.json());

//mongoDB config
const db = require('./setup/databaseurl').mongoURL;

//Attempt to connect to database
mongoose.connect(db, {useNewUrlParser: true})
     .then(() => console.log("Connected to database"))
     .catch(err => console.log(err));

//passport middleware
app.use(passport.initialize());

//config for jwt strat
require("./strats/jsonwt")(passport);

//sets main page
app.use('/', express.static('./routes/public'));

//sets view engine
app.set('views', './routes/public/views')
app.set('view engine', 'pug')

//main page route
// app.get('/', (req, res) => {

// });

//routes
app.use("/api/auth", auth);
app.use("/api/profile", profile);
app.use("/api/play", play);

app.get('/login', (req, res) => res.redirect("/api/auth/login"));

//listen for connections
const port = 8080;
app.listen(port, () => console.log(`Server is running on port ${port}`));