require('dotenv').config();

const path = require('node:path');

const express = require('express');
const mongoose = require('mongoose');
const app = express();

const userRoutes = require('./routes/user.js');
const hotsauceRoutes = require('./routes/sauce.js');

mongoose
  .connect(
    `mongodb+srv://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@cluster0.${process.env.DATABASE_CLUSTER}.mongodb.net/${process.env.DATABASE_NAME}?retryWrites=true&w=majority`
  )
  .then(() => console.log('Database connected'))
  .catch((error) => console.log(error));

/**
 * Opens communication with the server and URL http://localhost:4200/
 * @param { Express.Request } req
 * @param { Express.Response } res
 * @param { Express.NextFunction } next
 */


app.use(express.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, Authorization, X-RequestWith, Content, Accept, Content-Type');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
});

app.use('/api/auth', userRoutes);
app.use('/api/sauces', hotsauceRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;