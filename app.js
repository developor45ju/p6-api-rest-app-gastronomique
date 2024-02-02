require('dotenv').config();

const path = require('node:path');

const express = require('express');
const mongoose = require('mongoose');
const limiter = require('express-rate-limit');
const helmet = require('helmet');
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
 * Opens communication with the server
 * @param { Express.Request } req
 * @param { Express.Response } res
 * @param { Express.NextFunction } next
 */

// const originsAllowed = ['https://piquante-j7q6.onrender.com', 'http://localhost:3000']


app.use(limiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	// store: ... , // Use an external store for consistency across multiple server instances.
}));
app.use(express.json());
app.use((req, res, next) => {
  // if (originsAllowed.includes(req.headers('host'))) {
  //   res.setHeader('Access-Control-Allow-Origin', req.headers('host'));
  // }

  app.use(helmet());
  res.setHeader('Access-Control-Allow-Origin', '*');

  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, Authorization, X-RequestWith, Content, Accept, Content-Type'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS'
  );
  next();
});

app.use('/api/auth', userRoutes);
app.use('/api/sauces', hotsauceRoutes);
app.use('/images', express.static(path.join(__dirname, process.env.FOLDER_IMAGES)));

module.exports = app;