import express from 'express';

// Controllers
import {
  createLocation,
  getLocation,
  getAllLocations,
  updateLocation,
  deleteLocation

} from '../controllers/locationController';


// Utils
import customResponseObject from '../utils/responses';
import { appWelcomeMessage } from '../utils/messages';
import statusCodes from '../utils/statusCodes';

const router = express.Router();

// Home page
router.get('/',(req, res) => {
    const { success } = statusCodes;
    return customResponseObject(res, appWelcomeMessage, success, null);
  });

// Create, edit, and delete Contact
router.post('/locations', createLocation);
router.get('/locations',  getAllLocations);

router.route(
  '/locations/:id'
  ).get(getLocation)
   .put(updateLocation)
   .delete(deleteLocation);

router.route('*')
  .get((req, res) => customResponseObject(res, 'Invalid route', statusCodes.notFound, null))
  .post((req, res) => customResponseObject(res, 'Invalid route', statusCodes.notFound, null))
  .put((req, res) => customResponseObject(res, 'Invalid route', statusCodes.notFound, null))
  .delete((req, res) => customResponseObject(res, 'Invalid route', statusCodes.notFound, null));

export default router;