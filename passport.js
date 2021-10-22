const passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    Models = require('./models.js'),
    passportJWT = require('passport-jwt');

let Users = Models.User,
    JWTStrategy = passportJWT.Strategy,
    ExtractJWT = passportJWT.ExtractJwt;

//LocalStrategy takes a username and password from the request body
//and use Mongoose to check your database for a user with the same username
passport.use(new LocalStrategy({
    usernameField: 'Username',
    passwordField: 'Password'
    }, (username, password, callback) => {
    console.log(username + '  ' + password);
    Users.findOne({Username: username}, (error, user) => {
        if(error) {
            console.log(error);
            return callback(error);
        }

        //callback for incorrect username
        if (!user) {
            console.log('incorrect username');
            //response when the username is cannot be found
            return callback(null, false, {message: 'Incorrect username.'});
        }

        //callback for incorrect password
        // if (!user.validatePassword(password)) {
        //     console.log('incorrect password');
        //     return callback(null, false, {message: 'Incorrect password.'});
        // }

        console.log('finished');
        return callback(null, user);
    });
}));

//JWTStrategy akkiws to authenticare users based on the JWT submitted alongside their request
passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),//bearer token
    secretOrKey: 'your_jwt_secret'//signature verifies that the sender of JWT it is whoo say it is
}, (jwtPayload, callback) => {
    return Users.findById(jwtPayload._id)
    .then((user) => {
        return callback(null, user);
    })
    .catch((error) => {
        return callback(error)
    });
}));

