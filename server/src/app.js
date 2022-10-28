const express = require('express'); //set up express middleware
const path = require('path');
const cors = require('cors'); //set up cors to allow cross origin resource sharing
const morgan = require('morgan');

const api = require('./routes/api');

const app = express();

app.use(cors({
    origin: 'http://localhost:3000' //set correctly to the address of the front end site
})); //return cors middleware
app.use(morgan('combined'));

app.use(express.json()); //json parsing middleware
app.use(express.static(path.join(__dirname, '..', 'public'))); //loads the front end via port 8000

app.use('/v1', api);

/* sets the home page to launch (front-end) */
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
    //res.status(200).sendFile(path.join( __dirname, '..', 'public', 'index.html')); //as per comment in discord
}); 
// * - matches all end points that follows the slash

module.exports = app;