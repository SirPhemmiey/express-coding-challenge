/**
 * This file contains every action that the user does
 */
const { validateUser, User } = require('../models/user');
const { Institution } = require('../models/institution');
const code = require('../constants/codes');
const message = require('../constants/messages');
const logger = require('../helpers/winston');

const create = async (req, res) => {
  const { error } = validateUser(req.body);
  const {
    name, email, role, password
  } = req.body;
  if (error) {
    logger.error(error);
    return res.status(code.INVALID_INPUT_PARAMS).json({
      status: message.FAIL,
      code: code.INVALID_INPUT_PARAMS,
      message: error.details[0].message
    });
  }
  try {
    /**
     * Check if the user exist
     */
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(code.UNPROCESSABLE_ENTITY).json({
        status: message.FAIL,
        code: code.UNPROCESSABLE_ENTITY,
        message: message.ALREADY_EXIST
      });
    } else {
      /**
       * Check if the email domain exist
       */
      const emailDomain = email.substring(email.lastIndexOf('@') + 1);
      const foundEmailDomain = await Institution.findOne({ emailDomain });
      if (foundEmailDomain) {
        const user = new User({
          name,
          email,
          role,
          password,
          institution: foundEmailDomain._id
        });
        await user.save();
        res.status(code.CREATED).json({
          status: message.SUCCESS,
          data: {
            message: message.SUCCESS
          }
        });
      } else {
        return res.status(code.INTERNAL_SERVER_ERROR).json({
          status: message.FAIL,
          code: code.INTERNAL_SERVER_ERROR,
          message: message.DOMAIN_DOES_NOT_EXIST
        });
      }
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

module.exports = create;
