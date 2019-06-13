/**
 * This file contains every action on books
 */

const { validateBook, Book } = require('../models/book');
const { User } = require('../models/user');
const redis = require('async-redis');
const { Institution } = require('../models/institution');
const code = require('../constants/codes');
const message = require('../constants/messages');
const dotenv = require('dotenv');
const logger = require('../helpers/winston');

dotenv.config();

const { REDIS_PORT, REDIS_HOST } = process.env;
const client = redis.createClient(REDIS_PORT, REDIS_HOST);

/**
 *
 * @description - Function to get books
 * @param {object} req - Request object
 * @param {object} res - Response object
 * @returns Object
 */
const getBooks = async (req, res) => {
  const userId = req.user._id;
  const booksKey = 'books:all';
  try {
    const allBooks = await client.get(booksKey);
    if (allBooks) {
      return res.status(code.OK).json({
        status: message.SUCCESS,
        data: {
          books: JSON.parse(allBooks)
        }
      });
    } else {
      const result = await User.findById(userId)
        .select('-password -_id')
        .populate('institution', '-_id');
      const { books } = result.institution;
      await client.setex(booksKey, 3600, JSON.stringify(books));
      return res.status(code.OK).json({
        status: message.SUCCESS,
        data: {
          books
        }
      });
    }
  } catch (error) {
    logger.error(error);
    res.status(code.INTERNAL_SERVER_ERROR).json({
      status: message.FAIL,
      code: code.INTERNAL_SERVER_ERROR,
      message: error.message
    });
  }
};

/**
 *
 * @description - Function to add a book
 * @param {object} req - Request object
 * @param {object} res - Response object
 * @returns Object
 */
const addBook = async (req, res) => {
  const { error } = validateBook(req.body);
  const {
    isbn, title, author, institution
  } = req.body;
  if (error) {
    logger(error);
    return res.status(code.INVALID_INPUT_PARAMS).json({
      status: message.FAIL,
      message: error.details[0].message
    });
  }

  const book = new Book({
    isbn,
    title,
    author,
    institution
  });

  try {
    // check if the book ISBN already exist
    const checkBook = await Book.findOne({ isbn });
    if (checkBook) {
      return res.status(code.UNPROCESSABLE_ENTITY).json({
        status: message.FAIL,
        code: code.UNPROCESSABLE_ENTITY,
        message: message.ALREADY_EXIST
      });
    }
    const savedBook = await book.save();
    await Institution.findByIdAndUpdate(institution, {
      $push: { books: savedBook._id }
    });
    res.status(code.CREATED).json({
      status: message.SUCCESS,
      message: message.SUCCESS
    });
  } catch (error) {
    logger(error);
    res.status(code.INTERNAL_SERVER_ERROR).json({
      status: message.FAIL,
      code: code.INTERNAL_SERVER_ERROR,
      message: error.message
    });
  }
};

module.exports = {
  addBook,
  getBooks
};
