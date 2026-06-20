import type { Request, Response } from 'express';
import * as knowledgeService from '../services/knowledgeService.js';
import type { KnowledgeFilterParams, ApiResponse } from '../../../shared/types.js';

export const getCategories = (_req: Request, res: Response) => {
  const categories = knowledgeService.getCategories();

  const response: ApiResponse<typeof categories> = {
    code: 200,
    message: 'success',
    data: categories,
  };

  res.json(response);
};

export const getArticles = (req: Request, res: Response) => {
  const params: KnowledgeFilterParams = {
    category: req.query.category as KnowledgeFilterParams['category'],
    keyword: req.query.keyword as string | undefined,
    sortBy: req.query.sortBy as KnowledgeFilterParams['sortBy'],
    sortOrder: req.query.sortOrder as 'asc' | 'desc' | undefined,
  };

  const articles = knowledgeService.getArticles(params);

  const response: ApiResponse<typeof articles> = {
    code: 200,
    message: 'success',
    data: articles,
  };

  res.json(response);
};

export const getPopularArticles = (req: Request, res: Response) => {
  const limit = req.query.limit ? parseInt(req.query.limit as string) : 6;
  const articles = knowledgeService.getPopularArticles(limit);

  const response: ApiResponse<typeof articles> = {
    code: 200,
    message: 'success',
    data: articles,
  };

  res.json(response);
};

export const getArticleById = (req: Request, res: Response) => {
  const { id } = req.params;
  const article = knowledgeService.getArticleById(id);

  if (!article) {
    const response: ApiResponse<null> = {
      code: 404,
      message: '知识文章未找到',
      data: null,
    };
    return res.status(404).json(response);
  }

  const response: ApiResponse<typeof article> = {
    code: 200,
    message: 'success',
    data: article,
  };

  res.json(response);
};

export const getRelatedArticles = (req: Request, res: Response) => {
  const { id } = req.params;
  const articles = knowledgeService.getRelatedArticles(id);

  const response: ApiResponse<typeof articles> = {
    code: 200,
    message: 'success',
    data: articles,
  };

  res.json(response);
};

export const getArticlesBySwordId = (req: Request, res: Response) => {
  const { swordId } = req.params;
  const articles = knowledgeService.getArticlesBySwordId(swordId);

  const response: ApiResponse<typeof articles> = {
    code: 200,
    message: 'success',
    data: articles,
  };

  res.json(response);
};

export const getArticlesBySwordsmanId = (req: Request, res: Response) => {
  const { swordsmanId } = req.params;
  const articles = knowledgeService.getArticlesBySwordsmanId(swordsmanId);

  const response: ApiResponse<typeof articles> = {
    code: 200,
    message: 'success',
    data: articles,
  };

  res.json(response);
};
