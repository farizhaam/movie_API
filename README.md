# MooVieS API

## Description

This is the server-side for MooVies-Client (React) and BingeFlix-Angular-Client. The web application will provide users with access to information about different movies, directors, and genres. Users will be able to sign up, update their personal information, and create a list of their favorite movies.
 
 ## Key Features
 
- Return a list of ALL movies to the user. 
- Return data (description, genre, director, image URL, whether it’s featured or not) about a single movie by title to the user. 
- Return data about a genre (description) by name/title (e.g., “Thriller”). 
- Return data about a director (bio, birth year, death year) by name. 
- Allow new users to register. 
- Allow users to update their user info (username, password, email, date of birth). 
- Allow users to add a movie to their list of favorites.
- Allow users to remove a movie from their list of favorites.
- Allow existing users to deregister.
 
## Tools and Dependencies 

- Node.js
- Express
- Morgan
- MongoDB
- Mongoose
- Passport
- CORS
- body-parser
- morgan
- bcrypt

## Testing Tool

The endpoints are tested using Postman
