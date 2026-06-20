import { Router } from 'express';
import * as comparisonController from '../controllers/comparisonController.js';

const router = Router();

router.get('/works', comparisonController.getAllWuxiaWorks);
router.get('/works/popular', comparisonController.getPopularWorks);
router.get('/works/:id', comparisonController.getWuxiaWorkById);

router.get('/libraries', comparisonController.getAllComparisonLibraries);
router.get('/libraries/:id', comparisonController.getComparisonLibraryById);
router.get('/swordsman/:swordsmanId', comparisonController.getSwordsmanComparison);
router.get('/sword/:swordId', comparisonController.getSwordComparison);

export default router;
