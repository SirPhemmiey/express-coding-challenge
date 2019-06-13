const Joi = require('joi');
const mongoose = require('mongoose');

const institutionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'An institution name is required'],
      minlength: 5,
      maxlength: 100
    },
    url: {
      type: String,
      required: [true, 'Url is required']
    },
    emailDomain: {
      type: String,
      required: [true, 'An email domain is required'],
      lowercase: true
    },
    books: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book'
      }
    ]
  },
  {
    toJSON: { versionKey: false }
  }
);

function autopopulate(next) {
  this.populate('books');
  next();
}

function validateInstitution(institution) {
  const schema = {
    name: Joi.string()
      .min(5)
      .max(100)
      .required(),
    url: Joi.string()
      .uri({ scheme: [/http/, /https/] })
      .required(),
    emailDomain: Joi.string().required()
  };

  return Joi.validate(institution, schema);
}
institutionSchema.pre('find', autopopulate);
institutionSchema.pre('findOne', autopopulate);
exports.Institution = mongoose.model('Institution', institutionSchema);
exports.validateInstitution = validateInstitution;
