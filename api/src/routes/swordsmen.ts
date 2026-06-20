import { Router } from 'express';
import * as swordsmanController from '../controllers/swordsmanController.js';
import * as swordHeritageController from '../controllers/swordHeritageController.js';

const router = Router();

router.get('/', swordsmanController.getSwordsmen);
router.get('/latest', swordsmanController.getLatestSwordsmen);
router.get('/search', swordsmanController.searchSwordsmen);
router.get('/by-sword/:swordId', swordsmanController.getSwordsmenBySwordId);
router.get('/:id/detail', swordsmanController.getSwordsmanDetailById);
router.get('/:id/swords', swordsmanController.getSwordsmanSwords);
router.get('/:id/sword-tenures', swordHeritageController.getSwordsmanSwordTenures);
router.get('/:id/heritages', swordHeritageController.getSwordsmanHeritages);
router.get('/:id', swordsmanController.getSwordsmanById);

export default router;
