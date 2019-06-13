const express = require('express');
const dotenv = require('dotenv');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const debug = require('debug')('api:server');
const { cors } = require('./helpers/cors');
const logger = require('./helpers/winston');
const morgan = require('morgan');

const app = express();
const index = require('./routes/index.js');

dotenv.config();

/**
 * MongoDB connection
 */
mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true
  })
  .then(() => debug('Connected to MongoDB...'))
  .catch(err => debug('Could not connect to MongoDB...', err));
const limiter = new rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  delayMs: 0 // disable delaying - full speed until the max limit is reached
});
app.use(compression());
// app.use(cors);
app.use(morgan('combined', { stream: logger.stream }));
app.use(limiter);
app.use(helmet());
app.use(helmet.xssFilter());
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"]
    }
  })
);

/**
 * Parse body content with express 4
 */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cookieParser());

app.use('/', index);

/**
 * Error handling
 */
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);

  switch (err.status) {
    case 400:
      res.json({ status: 'fail', message: err.message });
      break;
    default:
      res.json({ status: 'fail', message: err.toString() });
      break;
  }
});

app.listen(process.env.PORT, () => console.log(`Open http://localhost:${process.env.PORT} to see a response.`));

module.exports = app;
