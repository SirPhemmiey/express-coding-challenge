/**
 * This file contains passport local strategy that will handle login and authentication
 */

const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const JWTStrategy = require('passport-jwt').Strategy;
const extractJWT = require('passport-jwt').ExtractJwt;
const { User } = require('../models/user');
const code = require('../constants/codes');
const bcrypt = require('bcrypt');
const message = require('../constants/messages');
const dotenv = require('dotenv');

dotenv.config();

/**
 * Middleware to handle user signup
 */
passport.use(
  'signin',
  new localStrategy(
    {
      usernameField: 'email',
      passwordField: 'password'
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });
        if (!user) {
          return done(null, false, {
            status: message.FAIL,
            code: code.INTERNAL_SERVER_ERROR,
            message: message.USER_NOT_FOUND
          });
        }
        const validate = await bcrypt.compare(password, user.password);
        if (!validate) {
          return done(null, false, {
            status: message.FAIL,
            code: code.INTERNAL_SERVER_ERROR,
            message: message.WRONG_PASSWORD
          });
        }
        return done(null, user, { message: message.SUCCESS });
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.use(
  new JWTStrategy(
    {
      secretOrKey: process.env.JWT_SECRET,
      jwtFromRequest: extractJWT.fromAuthHeaderAsBearerToken()
    },
    async (token, done) => {
      try {
        return done(null, token.user);
      } catch (error) {
        done(error);
      }
    }
  )
);
