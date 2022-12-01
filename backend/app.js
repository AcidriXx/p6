const mongoose = require('mongoose');
const express = require('express');
const path = require('path');
const userRoutes = require('./routes/user');
const saucesRoutes = require('./routes/sauces');

mongoose.connect('mongodb+srv://max:pPiumZ8heS8euIYt@cluster0.crdy7dr.mongodb.net/test',
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

app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;