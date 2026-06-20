import { Router } from 'express';
import * as legendarySwordController from '../controllers/legendarySwordController.js';

const router = Router();

router.get('/', legendarySwordController.getLegendarySwords);
router.get('/popular', legendarySwordController.getPopularLegendarySwords);
router.get('/stats', legendarySwordController.getLegendarySwordStats);
router.get('/:id', legendarySwordController.getLegendarySwordById);

export default router;
