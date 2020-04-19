const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const feedRoutes = require('./routes/feed');

const app = express();

// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json
//setup the images request to point to the images folder,
//the join method takes this app.js location, then awe add the subdirectory
//impages and that means when the server gets a request for images it will
//reference the correct images folder.
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Methods',
        'OPTIONS, GET, POST, PUT, PATCH, DELETE'
    );
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Content-Type, Authorization'
    );
    next();
});

app.use('/feed', feedRoutes);
//==========================
// the followoing has to be last so when next is used for errorhandling,
// we use it properly.
app.use((error, req, res, next) => {
    console.log(error);
    // this is custom value added in js code,  not by default.
    // if you don't add it when generating error, you won't have it here.
    const status = error.statusCode || 500;

    // this next one is default, always will have
    const message = error.message;
    //now return the error properly
    res.status(status).json({ message: message });
});

mongoose
    .connect(
        'mongodb+srv://metrex:UOZ0sWPla8uTocWA@rogueintel-gw40w.mongodb.net/messages?retryWrites=true&w=majority',
        { useUnifiedTopology: true, useNewUrlParser: true }
    )
    .then((result) => {
        app.listen(8080, console.log('listening on port 8080'));
    })
    .catch((err) => console.log(err));
