
import { getTotalResidents, errorHandler } from '../utils/helper';
import {
  success,
  updateSuccess,
  allLocations,
  created,
  recordNotFound,
  serverError,
  noRecords
} from '../utils/messages';

import customResponseObject from '../utils/responses';
import statusCodes from '../utils/statusCodes';

import { validateLocationDetails } from '../middlewares/validator';

import { Location } from '../models/Location';

/** 
  * Create a location
  * 
  * @param {object} - location
  * 
  * @returns {object} - saved details
  **/
  exports.createLocation = (req, res) => {
    validateLocationDetails(req);

    const requestErrors = req.validationErrors();

    if (requestErrors) {
      return errorHandler(res, requestErrors);
    }
     const { name, maleResidents, femaleResidents } = req.body;
     const totalResidents = getTotalResidents(maleResidents, femaleResidents);
     Location.create({ name, maleResidents, femaleResidents, totalResidents})
        .then((response) => {
          const { 
            _id, 
            name, maleResidents, femaleResidents, totalResidents } = response;
          return customResponseObject(
            res, 
            created, 
            statusCodes.created, {
            _id, name, maleResidents, femaleResidents, totalResidents
          });
        }).catch((error) => errorHandler(res, error));
      }

/** 
  * Get a location
  * 
  * @param {object} - locationId
  * 
  * @returns {object} - location details
  **/
  exports.getLocation = (req, res) => {
    const { id } = req.params;
    Location.findById({ _id: id })
    .then((response) => {
      if(!response) {
        return customResponseObject(res, recordNotFound, statusCodes.notFound);
      }
      const { 
        _id, 
        name, maleResidents, femaleResidents, totalResidents } = response;
        return customResponseObject(
          res, 
          success, 
          statusCodes.success, { details: {
             _id, 
            name, maleResidents, femaleResidents, totalResidents } });
    })
    .catch(error => {
      errorHandler(res, error);
    });
  }

/** 
  * Get all locations
  * 
  * @param {object} - locationId
  * 
  * @returns {object} - location details
  **/
 exports.getAllLocations = (req, res) => {
  Location.find()
    .then((response) => {
      if (response.length === 0) {
        return customResponseObject(res, noRecords, statusCodes.success);
      }
      return customResponseObject(
        res, 
        allLocations, 
        statusCodes.success, { locations: response });
    })
    .catch((error) => {
      errorHandler(res, error);
    })
}


/** 
  * Update location
  * 
  * @param {object} - locationId
  * 
  * @returns {object} - location details
  **/
 exports.updateLocation = (req, res) => {

  validateLocationDetails(req);

    const requestErrors = req.validationErrors();

    if (requestErrors) {
      return errorHandler(res, requestErrors);
    }

 const { id } = req.params;
 const { name, maleResidents, femaleResidents } = req.body; 
 Location.findOneAndUpdate({ _id: id }, { 
      $set: {
        name,
        maleResidents,
        femaleResidents,
        totalResidents: getTotalResidents(maleResidents, femaleResidents)
      }
    },
    { new: true }
  )
    .then((response) => {
      if (!response) {
        return customResponseObject(res, recordNotFound, statusCodes.notFound);
      }
      const { 
          _id, 
          name, 
          maleResidents, 
          femaleResidents, 
          totalResidents } = response;
        return customResponseObject(
          res, 
          updateSuccess, 
          statusCodes.success, {
          _id, name, maleResidents, femaleResidents, totalResidents
        });
    })
    .catch(error => {
      errorHandler(res, error);
    });
}

/** 
  * Delete location
  * 
  * @param {object} - locationId
  * 
  * @returns {object} - location details
  **/
 exports.deleteLocation = (req, res) => {
  const { id } = req.params;
  Location.findOneAndDelete({ _id: id })
    .then((response) => {
      if (response) {
        return customResponseObject(res, success, statusCodes.success);
      }
      return customResponseObject(res, recordNotFound, statusCodes.notFound);
    })
    .catch(() => {
      return customResponseObject(res, serverError, statusCodes.serverError);
    });
}
