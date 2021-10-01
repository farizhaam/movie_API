//importing required modules
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const uuid = require('uuid');

//importing models from models.js
const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Genres = Models.Genre;
const Directors = Models.Director;
const Users = Models.User;

mongoose.connect('mongodb://localhost:27017/MooVieS_DB', {useNewUrlParser: true, useUnifiedTopology: true});

//calling express
const app = express();

//activating body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//including passport for authentication
let auth = require('./auth')(app);
const passport = require('passport');
require('./passport');

//activating morgan
app.use(morgan('common'));


//Welcome page
app.get('/', (req, res) => {
    res.send('Welcome to MooVieS!');
});

// Gets the list of data about ALL movies
app.get('/movies', passport.authenticate('jwt', {session:false}), (req, res) => {
    Movies.find()
    .then((movies) => {
        res.status(201).json(movies);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

//Gets the data about a single movie by title
app.get('/movies/:Title', passport.authenticate('jwt', {session:false}), (req, res) => {
    Movies.findOne({Title: req.params.Title})
        .then((movie) => {
            res.json(movie);
        })
        .catch((err) => {//error callback
            console.error(err);
            res.status(500).send('Error: ' + err);
    });
});

//Gets a list of all genres
app.get('/genres', passport.authenticate('jwt', {session:false}), (req, res) => {
    Genres.find()
    .then((genres) => {
        res.status(201).json(genres);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

//Gets the description of a movie genre
app.get('/genres/:Name', passport.authenticate('jwt', {session:false}), (req, res) => {
    Genres.findOne({Name: req.params.Name})
        .then((genre) => {
            res.json(genre);
        })
        .catch((err) => {//error callback
            console.error(err);
            res.status(500).send('Error: ' + err);
    });
});

//Gets a list of all movie directors
app.get('/directors', passport.authenticate('jwt', {session:false}), (req, res) => {
    Directors.find()
    .then((directors) => {
        res.status(201).json(directors);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

//Gets the data of a movie director
app.get('/directors/:Name', passport.authenticate('jwt', {session:false}), (req, res) => {
    Directors.findOne({Name: req.params.Name})
        .then((director) => {
            res.json(director);
        })
        .catch((err) => {//error callback
            console.error(err);
            res.status(500).send('Error: ' + err);
    });
});

//Gets the list of all users
app.get('/users', passport.authenticate('jwt', {session:false}), (req, res) => {
    Users.find()
    .then((users) => {
        res.status(201).json(users);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});


//Allow new users to register
app.post('/users', passport.authenticate('jwt', {session:false}), (req,res) => {
    Users.findOne({Username: req.body.Username})
    .then((user) => {
        if (user) {
            //response when the user is already existed
            return res.status(400).send(req.body.Username + ' already exists');
        } else {
            Users
            .create({
                Name: req.body.Name,
                Username : req.body.Username,
                Password: req.body.Password,
                Email: req.body.Email,
                Birthday: req.body.Birthday
            })//response back to client letting them know that it has been completed
            .then((user) => {res.status(201).json(user)})
            .catch((error) => {//catch any problem that is encountered
                console.error(error);
                //response back to client letting them know that there is an error
                res.status(500).send('Error: ' + error);
            })
        }
    })
    .catch((error) => {//catch any problem that is encountered
        console.error(error);
        //response back to client letting them know that there is an error
        res.status(500).send('Error: ' + error);
    });
});

// Get a user by username
app.get('/users/:Username', passport.authenticate('jwt', {session:false}), (req, res) => {
    Users.findOne({Username: req.params.Username})
        .then((user) => {
            res.json(user);
        })
        .catch((err) => {//error callback
            console.error(err);
            res.status(500).send('Error: ' + err);
    });
});

//Update the user's info of a user by username
app.put('/users/:Username', passport.authenticate('jwt', {session:false}), (req, res) => {
    Users.findOneAndUpdate({Username: req.params.Username}, { $set://$set specifies the fields to be updated
        {
            Username: req.body.Username,
            Password: req.body.Password,
            Email: req.body.Email,
            Birthday: req.body.Birthday
        }},
        {new: true }, // This line makes sure that the updated document is returned
        (err, updatedUser) => {//error callback
        if(err) {
            console.error(err);
            res.status(500).send('Error: ' + err);
        } else {
            res.json(updatedUser);
        }
    });
});

//Allows users to add a movie to favorite list
app.post('/users/:Username/movies/:MovieID', passport.authenticate('jwt', {session:false}), (req,res) => {
    Users.findOneAndUpdate({Username: req.params.Username}, {
        $push: {FavoriteMovies: req.params.MovieID}//$push adds a new movie ID to the FavoriteMovies array
    },
    { new: true }, // This line makes sure that the updated document is returned
    (err, updatedUser) => {//error callback
        if (err) {
            console.error(err);
            res.status(500).send('Error: ' + err);
        } else {
            res.json(updatedUser);
        }
    });
});

//Allows users removes movies from favorite list
app.delete('/users/:Username/movies/:MovieID', passport.authenticate('jwt', {session:false}), (req,res) => {
    Users.findOneAndUpdate({Username: req.params.Username}, {
        $pull: {FavoriteMovies: req.params.MovieID}//$pull removes movies by MovieID from FavoriteMovies array
    },
    { new: true }, // This line makes sure that the updated document is returned
    (err, updatedUser) => {//error callback
        if (err) {
            console.error(err);
            res.status(500).send('Error: ' + err);
        } else {
            res.json(updatedUser);
        }
    });
});

//Allows existing users to de-register
app.delete('/users/:Username', passport.authenticate('jwt', {session:false}), (req,res) => {
    Users.findOneAndRemove({Username: req.params.Username})//deleting the records that matches with the condition
    .then((user) => {
        if (!user) {
            res.status(400).send(req.params.Username + ' was not found');//reponse back to client if the user is not existed
        } else {
            res.status(200).send(req.params.Username + ' was deleted.');//reponse back to client if the user is succesfully deleted
        }
    })
    .catch((err) => {//error callback
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
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