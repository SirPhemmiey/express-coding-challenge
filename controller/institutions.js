/**
 * This file contains every action that the institution does
 */

const { validateInstitution, Institution } = require('../models/institution');
const code = require('../constants/codes');
const message = require('../constants/messages');
const logger = require('../helpers/winston');

/**
 *
 * @description - Function to get institutions
 * @param {object} req - Request object
 * @param {object} res - Response object
 * @returns Object
 */
const getInstitutions = async (req, res) => {
  const institutions = await Institution.find({});
  return res.status(code.OK).json({
    status: message.SUCCESS,
    data: {
      institutions
    }
  });
};

/**
 *
 *
 * @param {object} req - Request object
 * @param {object} res - Response object
 * @returns Object
 */
const addInstitution = async (req, res) => {
  const { error } = validateInstitution(req.body);
  const { name, url, emailDomain } = req.body;
  if (error) {
    logger.error(error);
    return res.status(code.INVALID_INPUT_PARAMS).json({
      status: message.FAIL,
      code: code.INVALID_INPUT_PARAMS,
      message: error.details[0].message
    });
  }

  const institution = new Institution({
    name,
    url,
    emailDomain
  });

  try {
    // check if the institution already exist
    const checkinstitution = await Institution.findOne({ name });
    if (checkinstitution) {
      return res.status(code.UNPROCESSABLE_ENTITY).json({
        status: message.FAIL,
        code: code.UNPROCESSABLE_ENTITY,
        message: message.ALREADY_EXIST
      });
    }
    await institution.save();
    res.status(code.CREATED).json({
      status: message.SUCCESS,
      data: {
        message: message.SUCCESS
      }
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
  getInstitutions,
  addInstitution
};
