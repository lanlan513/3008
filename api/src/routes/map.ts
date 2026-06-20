import { Router } from 'express';
import { mapController } from '../controllers/mapController';

const router = Router();

router.get('/locations', mapController.getAllLocations);
router.get('/locations/filter', mapController.getFilteredLocations);
router.get('/locations/regions', mapController.getAllRegions);
router.get('/locations/:id', mapController.getLocationById);
router.get('/locations/:id/details', mapController.getLocationDetails);

router.get('/events', mapController.getAllHistoricalEvents);
router.get('/events/:id', mapController.getHistoricalEventById);

router.get('/stats/regions', mapController.getRegionStats);
router.get('/stats/dynasties', mapController.getDynastyGeoStats);

export default router;
