import { Router } from 'express';
import * as knowledgeController from '../controllers/knowledgeController.js';

const router = Router();

router.get('/categories', knowledgeController.getCategories);
router.get('/popular', knowledgeController.getPopularArticles);
router.get('/by-sword/:swordId', knowledgeController.getArticlesBySwordId);
router.get('/by-swordsman/:swordsmanId', knowledgeController.getArticlesBySwordsmanId);
router.get('/:id/related', knowledgeController.getRelatedArticles);
router.get('/:id', knowledgeController.getArticleById);
router.get('/', knowledgeController.getArticles);

export default router;
