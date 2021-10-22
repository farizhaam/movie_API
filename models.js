//requiring mongoose
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


//creating movieSchema
let movieSchema = mongoose.Schema({
    Title: {type: String, required: true},
    Description: {type: String, required: true},
    Genre: {
        Name: String,
        Description: String
    },
    Director: {
        Name: String,
        Bio: String
    },
    Actors: [String],
    ImagePath: String,
    Featured: Boolean
});

//creating genreSchema
let genreSchema = mongoose.Schema({
    Name: {type: String, required: true},
    Description: {type: String, required: true}
});

//creating directorSchema
let directorSchema = mongoose.Schema({
    Name: {type: String, required: true},
    Bio: {type: String, required: true},
    Birthdate: {type: Date, required: true},
    Death: String
});

//creating userSchema
let userSchema = mongoose.Schema({
    Name: String,
    Username: {type: String, required: true},
    Password: {type: String, required: true},
    Email: {type: String, required: true},
    Birthday: Date,
    FavoriteMovies: [{type: mongoose.Schema.Types.ObjectId, ref: 'Movie'}]
});

//adding hashPassword function for hashing submitted password
userSchema.statics.hashPassword = (password) => {
    return bcrypt.hashSync(password, 10);
};

//adding validatePassword for comparing submitted hashed password with the hashed password in database
/*!!! DO NOT USE ARROW FUNCTION FOR DEFINING INSTANCE METHODS, e.g: validatePassword !!!*/
userSchema.methods.validatePassword = function(password) {
    return bcrypt.compareSync(password, this.Password);
};

let Movie = mongoose.model('Movie', movieSchema);
let Genre = mongoose.model('Genre', genreSchema);
let Director = mongoose.model('Director', directorSchema);
let User = mongoose.model('User', userSchema);

//exports models
module.exports.Movie = Movie;
module.exports.Genre = Genre;
module.exports.Director = Director;
module.exports.User = User;