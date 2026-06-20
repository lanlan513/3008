import { Router } from 'express';
import * as museumController from '../controllers/museumController.js';

const router = Router();

router.get('/collections', museumController.getCollections);
router.get('/collections/filters', museumController.getAvailableFilters);
router.get('/collections/overview-stats', museumController.getOverviewStats);
router.get('/collections/dynasty-stats', museumController.getDynastyPreservationStats);
router.get('/collections/institution-stats', museumController.getInstitutionStats);
router.get('/collections/:id', museumController.getCollectionById);
router.get('/collections/by-sword/:swordId', museumController.getCollectionsBySwordId);
router.get('/collections/by-institution/:institutionId', museumController.getCollectionsByInstitutionId);

router.get('/institutions', museumController.getAllInstitutions);
router.get('/institutions/:id', museumController.getInstitutionById);

router.get('/discovery-sites', museumController.getAllDiscoverySites);
router.get('/discovery-sites/:id', museumController.getDiscoverySiteById);

export default router;
