//importing required modules
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const uuid = require('uuid');
const {check, validationResult} = require('express-validator');


//importing models from models.js
const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Genres = Models.Genre;
const Directors = Models.Director;
const Users = Models.User;

//connecting database with connction URI
mongoose.connect(process.env.CONNECTION_URI, {useNewUrlParser: true, useUnifiedTopology: true});


//calling express
const app = express();

//activating morgan
app.use(morgan('common'));

//including CORS that allows all domain
const cors = require('cors');
app.use(cors());

//to parse express
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//including passport for authentication
let auth = require('./auth')(app);
const passport = require('passport');
require('./passport');




//Welcome page
app.get('/', (req, res) => {
    res.send('Welcome to MooVieS!');
});


/**
 * Get all movies
 * @method GET
 * @param {string} endpoint - endpoint to fetch movies. "url/movies"
 * @returns {object} - returns the movie object
  * @requires authentication JWT
 */
app.get('/movies',  passport.authenticate('jwt', {session:false}), (req, res) => {
    Movies.find()
    .then((movies) => {
        res.status(201).json(movies);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});


/**
 * Get movies by title
 * @method GET
 * @param {string} endpoint - endpoint - fetch movies by title
 * @param {string} Title - is used to get specific movie "url/movies/:title"
 * @returns {object} - returns the movie with specific title
 * @requires authentication JWT
 */
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

/**
 * Get all genres
 * @method GET
 * @param {string} endpoint - endpoint to fetch genres. "url/genres"
 * @returns {object} - returns the genre object
 * @requires authentication JWT
 */
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

/**
 * Get genre by name
 * @method GET
 * @param {string} endpoint - endpoint - fetch genre by name
 * @param {string} Name - is used to get specific genre "url/genres/:Name"
 * @returns {object} - returns a specific genre
 * @requires authentication JWT
 */
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

/**
 * Get all directors
 * @method GET
 * @param {string} endpoint - endpoint to fetch directors. "url/directors"
 * @returns {object} - returns the directors object
 *  @requires authentication JWT
 */
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

/**
 * Get director by name
 * @method GET
 * @param {string} endpoint - endpoint - fetch director by name
 * @param {string} Name - is used to get specific director "url/directors/:Name"
 * @returns {object} - returns a specific director
 */
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

/**
 * Get all users
 * @method GET
 * @param {string} endpoint - endpoint to fetch directors. "url/users"
 * @returns {object} - returns users object
 *  @requires authentication JWT
 */
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


/**
 * Add user
 * @method POST
 * @param {string} endpoint - endpoint to add user. "url/users"
 * @param {string} Username - choosen by user
 * @param {string} Password - user's password
 * @param {string} Email - user's e-mail address
 * @param {string} Birthday - user's birthday
 * @returns {object} - new user
 * @requires auth no authentication - public
 */
app.post('/users', 
    [//validation for request
        check('Username', 'Username is required').isLength({min: 5}),
        check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
        check('Password', 'Password is required').not().isEmpty(),
        check('Email', 'Email does not appeared to be valid.').isEmail()
    ], (req,res) => {
    
    //check the validation object for errors
    let errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array()});
    }

    //hashing the submitted password
    let hashedPassword = Users.hashPassword(req.body.Password);
    
    Users.findOne({Username: req.body.Username})//search to see if the username is already existed
    .then((user) => {
        if (user) {
            //response when the user is already existed
            return res.status(400).send(req.body.Username + ' already exists');
        } else {
            Users
            .create({
                Name: req.body.Name,
                Username : req.body.Username,
                Password: hashedPassword,//using hashed password for the passowrd field
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

/**
 * Get user by username
 * @method GET
 * @param {string} endpoint - endpoint - fetch user by username
 * @param {string} Username - is used to get specific user "url/users/:Username"
 * @returns {object} - returns a specific user
 * @requires authentication JWT
 */
app.get('/users/:Username',  passport.authenticate('jwt', {session:false}), (req, res) => {
    Users.findOne({Username: req.params.Username})
        .then((user) => {
            res.json(user);
        })
        .catch((err) => {//error callback
            console.error(err);
            res.status(500).send('Error: ' + err);
    });
});

/**
  * Update user by username
  * @method PUT
  * @param {string} endpoint - endpoint to add user. "url/users/:Usename"
  * @param {string} Username - required
  * @param {string} Password - user's new password
  * @param {string} Email - user's new e-mail adress
  * @param {string} Birthday - user's new birthday
  * @returns {string} - returns success/error message
  * @requires authentication JWT
  */
app.put('/users/:Username', (req, res) => {
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

//Gets the list of user's favorite movies
app.get('/users/:Username/movies', passport.authenticate('jwt', {session:false}), (req, res) => {
    Users.findOne({Username: req.params.Username})
    // let user = Users.find( (user) =>{ return user.Username === req.params.name });

    // if(user){
    //     let favmovies = Object.values(user.FavoriteMovies);
    // }
    .then((users) => {
        let favMovies = Object.values(users.FavoriteMovies);
        res.status(201).json(favMovies);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

/**
 * Add movie to favorites
 * @method POST
 * @param {string} endpoint - endpoint to add movies to favorites
 * @param {string} Title, Username - both are required
 * @returns {string} - returns success/error message
 * @requires authentication JWT
 */
app.post('/users/:Username/movies/:MovieID',(req,res) => {
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

/**
 * Delete movie from favorites
 * @method DELETE
 * @param {string} endpoint - endpoint to remove movies from favorites
 * @param {string} Title Username - both are required
 * @returns {string} - returns success/error message
 * @requires authentication JWT
 */
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

/**
  * Delete user by username
  * @method DELETE
  * @param {string} endpoint - endpoint - delete user by username
  * @param {string} Username - is used to delete specific user "url/users/:Username"
  * @returns {string} success/error message
  * @requires authentication JWT
  */
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


const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
    console.log('Listening on Port ' + port);
})