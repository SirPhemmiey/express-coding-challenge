const Joi = require('joi');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');

dotenv.config();
const { SALT_ROUND } = process.env;

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      minlength: 5,
      maxlength: 50
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true
    },
    role: {
      type: String,
      enum: ['student', 'academic', 'administrator'],
      required: true
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 5
    },
    institution: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Institution',
      required: [true, 'User must be associated with an institution']
    }
  },
  {
    toJSON: { versionKey: false }
  }
);

/**
 * A pre-hook to hash the password before it is saved to the database
 */
userSchema.pre('save', async function (next) {
  const user = this; // refers to the current document to be saved.
  const hash = await bcrypt.hash(user.password, parseInt(SALT_ROUND, 10));
  user.password = hash;
  next();
});

/**
 * An async function to validate user's password
 */
userSchema.statics.isValidPassword = async function (password) {
  const compare = await bcrypt.compare(password, this.password);
  return compare;
};

function validateUser(user) {
  const schema = {
    name: Joi.string()
      .min(5)
      .max(50)
      .required(),
    email: Joi.string()
      .email()
      .required(),
    role: Joi.string()
      .valid('student', 'academic', 'administrator')
      .required(),
    password: Joi.string().required()
  };

  return Joi.validate(user, schema);
}

userSchema.index({
  email: 'text'
});

exports.User = mongoose.model('User', userSchema);
exports.validateUser = validateUser;
