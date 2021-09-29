//importing required modules
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const uuid = require('uuid');

//importing models from models.js
const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect('mongodb://localhost:27017/MooVieS_DB', {useNewUrlParser: true, useUnifiedTopology: true});

//calling express
const app = express();

//activating body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//activating morgan
app.use(morgan('common'));


//Welcome page
app.get('/', (req, res) => {
    res.send('Welcome to MooVieS!');
});

// Gets the list of data about ALL movies
app.get('/movies', (req, res) => {
    res.json(movies);
});

//Gets the data about a single movie by title
app.get('/movies/:title', (req, res) => {
    res.json(movies.find((movie) => {
        return movie.title === req.params.title
    }));
});

//Gets a list of all genres
app.get('/genres', (req, res) => {
    res.send('Successful GET request returning data on all movie genres');
});

//Gets the data of a single movie genre
app.get('/genres/:name', (req, res) => {
    res.send('Successful GET request returning data on a single movie genre by name');
});

//Gets a list of all movie directors
app.get('/directors', (req, res) => {
    res.send('Successful GET request returning data on all movie directors');
});

//Gets the data of a single movie director
app.get('/directors/:name', (req, res) => {
    res.send('Successful GET request returning data on a single movie director by name');
});

//Gets the list of all users
app.get('/users', (req, res) => {
    res.json(users);
});

//Adds data for a new user to the list of users
app.post('/users', (req,res) => {
    let newUser = req.body;

    if (!newUser.name) {
        const message = 'Missing name in request body';
        res.status(400).send(message);
    } else {
        newUser.id = uuid.v4();
        users.push(newUser);
        res.status(201).send(newUser);
    }
});

//Update the user info (username) of a user by name
app.put('/users/:name/:username', (req, res) => {
    let user = users.find((user) => { return user.name === req.params.name });

    if (user) {
        user.username = req.params.username;
        res.status(201).send('User ' + req.params.name + ' has changed the username into ' + 
        req.params.username);
    } else {
        res.status(404).send('User with the name ' + req.params.name + ' was not found.');
    }
});

//Allows users to add a movie to favorite list
app.post('/users/:name/movies/:movie_id', (req,res) => {
    res.send('Successful POST request adding a movie to favorite list');
});

//Allows users to add a movie to favorite list
app.delete('/users/:name/movies/:movie_id', (req,res) => {
    res.send('Successful DELETE request removing a movie from favorite list');
});

//Allows existing users to de-register
app.delete('/users', (req,res) => {
    res.send('Successful DELETE request deleting selected user data');
});

//exposing files in 'public' folder
app.use(express.static('public'));

//adding error-handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke :(');
})

app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
});