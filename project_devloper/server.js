const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const passport = require('passport');

const app = express();
const users = require('./routes/api/users');
const profile = require('./routes/api/profiles');
const posts = require('./routes/api/posts');

// bodyParser middleware
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json())

// passpost middleware
app.use(passport.initialize());
require('./config/passport')(passport);


// DB config
const db = require('./config/keys').mongoURI;
// Connect to MongoDb

mongoose
.connect(db)
.then( () => console.log('mongo Db Connected') )
.catch( err => consoel.log(err) );

// User Routes 
app.use('/api/users',users)
app.use('/api/profiles',profile)
app.use('/api/posts', posts)

// Server Static assets if in production

// so you can deploy on heroku you add process.env.port
const port = process.env.PORT || 5000 

app.listen(port, () => console.log(`Server running on port ${port}`));