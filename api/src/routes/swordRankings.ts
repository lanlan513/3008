import express from 'express';
import * as swordRankingController from '../controllers/swordRankingController.js';

const router = express.Router();

router.get('/dimensions', swordRankingController.getRankingDimensions);
router.get('/', swordRankingController.getSwordRankings);
router.get('/trend', swordRankingController.getRankingTrendData);
router.get('/overview-stats', swordRankingController.getRankingOverviewStats);
router.get('/top', swordRankingController.getTopRankings);
router.get('/:id', swordRankingController.getSwordRankingById);
router.get('/:id/calculation-detail', swordRankingController.getRankingCalculationDetail);

export default router;
