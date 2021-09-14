//importing required modules and set them up on variables
const http = require('http'),
    fs = require('fs'),
    url = require('url');

//creating server
http.createServer((request, response) => {
    let addr = request.url, //allowing to get the URL from the request
        q = url.parse(addr, true), //applying the 'url.parse' on 'addr' and set the results on variable 'q'
        filePath = ''; //declaring 'filePath', empty string

    //creating a log of recent request made to the server
    fs.appendFile('log.txt', 'URL: ' + addr + '\nTimeStamp: ' + new Date() + '\n\n', (err) => {//log the entered URL and the time that request was made into 'log.txt'
        if (err){
            console.log(err);
        } else {
            console.log('Added to log.');
        }
    });

    //checking whether the 'pathname' of 'q'  includes the word "documentation"
    if (q.pathname.includes('documentation')) { 
        filePath = (__dirname + '/documentation.html'); // if yes, it pieces together '__dirname' and "/documentation.html"
    } else {
        filePath = 'index.html';// if not, returns "index.html" instead
    }

    //using 'fs.readFile()' to get the correct file from the server
    fs.readFile(filePath, (err, data) => {
        if (err) {
            throw err;
        }

        response.writeHead(200, {'Content-Type': 'text/plain'});//adds header to the response along with HTTP status code 200 for 'OK'
        response.write(data);//writes the data content
        response.end('Hello Node!\n');// ends the response
    });

}).listen(8080);//listens for a response on Port 8080

console.log('My test server is running on Port 8080.');
