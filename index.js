const express = require('express'),
    morgan = require('morgan');

const app = express();

let movies = [
    {
        title: 'Movie A',
        director: 'Director B',
        genre: 'Genre 1'
    },{
        title: 'Movie B',
        director: 'Director D',
        genre: 'Genre 5'
    },{
        title: 'Movie C',
        director: 'Director A',
        genre: 'Genre 2'
    },{
        title: 'Movie D',
        director: 'Director B',
        genre: 'Genre 4'
    },{
        title: 'Movie E',
        director: 'Director C',
        genre: 'Genre 2'
    },{
        title: 'Movie F',
        director: 'Director B',
        genre: 'Genre 3'
    },{
        title: 'Movie G',
        director: 'Director B',
        genre: 'Genre 1'
    },{
        title: 'Movie H',
        director: 'Director J',
        genre: 'Genre 4'
    },{
        title: 'Movie I',
        director: 'Director G',
        genre: 'Genre 5'
    },{
        title: 'Movie J',
        director: 'Director A',
        genre: 'Genre 4'
    }
];


app.use(morgan('common'));



app.get('/', (req, res) => {
    res.send('Welcome to MooVieS!');
});


app.get('/movies', (req, res) => {
    res.JSON(movies);
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