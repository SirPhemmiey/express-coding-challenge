const Joi = require('joi');
const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  {
    isbn: {
      type: String,
      required: [true, 'ISBN is required'],
      unique: true
    },
    title: {
      type: String,
      required: [true, 'Title is required']
    },
    author: {
      type: String,
      required: [true, 'Author is required']
    },
    institution: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Institution',
      required: [true, 'Book must be associated with an institution']
    }
  },
  {
    toJSON: { versionKey: false }
  }
);

function validateBook(book) {
  const schema = {
    isbn: Joi.string().required(),
    title: Joi.string().required(),
    author: Joi.string().required(),
    institution: Joi.string().required()
  };

  return Joi.validate(book, schema);
}

bookSchema.index({
  isbn: 'text',
  title: 'text'
});

exports.Book = mongoose.model('Book', bookSchema);
exports.validateBook = validateBook;
