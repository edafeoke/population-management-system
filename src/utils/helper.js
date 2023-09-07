import statusCodes from './statusCodes';
import customResponseObject from './responses';
import { duplicateError } from './messages';

const mongoDuplicateKeyCode = 11000;

export const getTotalResidents = (maleResidents, femaleResidents) => {
  return maleResidents + femaleResidents;
};

export const errorHandler = (res, error) => {
  if (error && error.code === mongoDuplicateKeyCode) {
    return customResponseObject(res, duplicateError, statusCodes.duplicate);
  }
  const errors = error.map(err => err.msg);
  return customResponseObject(res, errors, statusCodes.badRequest);
}
