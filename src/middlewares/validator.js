
// Utils
import customResponseObject from '../utils/responses';
import statusCodes from '../utils/statusCodes';
import { nameErrors, phoneNumberErrors, smsErrors, IdError } from '../utils/messages';

/** 
 * 
 * Validate create location
 * 
**/
 exports.validateLocationDetails = (req) => {
    req.checkBody('name', 'Location name is required.').notEmpty();
    req.sanitize('name').trim();
    req.sanitize('name').escape();
    req.checkBody('maleResidents', 'Number of male residents is required.').notEmpty();
    req.checkBody('femaleResidents', 'Number of female residents is required.').notEmpty();
    req.checkBody('maleResidents', 'Number of male residents should be an integer.').not().isString();
    req.checkBody('femaleResidents', 'Number of female residents should be an integer.').not().isString();
};
