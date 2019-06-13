/**
 * The default index route handler.
 * Responds to a request with body content to demonstrate the app is running as expected.
 */
const express = require('express');
const passport = require('passport');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const create = require('../controller/users');
const { addInstitution, getInstitutions } = require('../controller/institutions');
const { addBook, getBooks } = require('../controller/books');
const code = require('../constants/codes');
const message = require('../constants/messages');
/**
 * Require passport middleware here
 */
require('../middlewares/passport');

dotenv.config();

const router = express.Router();

router.post('/institution/add', addInstitution);

router.get('/institution/get', getInstitutions);

router.post('/books/add', addBook);

router.get('/books/get', passport.authenticate('jwt', { session: false }), getBooks);

router.post('/users/signin', async (req, res, next) => {
  passport.authenticate('signin', (err, user, info) => {
    try {
      if (err || !user) {
        return res.status(code.NOT_FOUND).json(info);
      }
      req.login(user, { session: false }, async (error) => {
        if (error) return next(error);
        const body = { _id: user._id, email: user.email };
        const token = jwt.sign({ user: body }, process.env.JWT_SECRET, { expiresIn: '24h' });
        return res.json({
          status: message.SUCCESS,
          data: {
            token
          }
        });
      });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
});

router.post('/users/create', create);

module.exports = router;
