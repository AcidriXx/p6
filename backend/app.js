const mongoose = require('mongoose');
const express = require('express');

const stuffRoute = require('./routes/stuff');

mongoose.connect('mongodb+srv://Max:kYlvOhkariVtWjWl@cluster0.gi5lyre.mongodb.net/?retryWrites=true&w=majority',
    { useNewUrlParser: true,
    useUnifiedTopology: true })
    .then(() => console.log('connexion a mongoDB reussi !'))
    .catch(() => console.log('connexion a mongoDB echouee !'));


const app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(express.json());

app.use('/api/stuff', stuffRoute);


module.exports = app;