import type { Request, Response } from 'express';
import * as legendarySwordService from '../services/legendarySwordService.js';
import type { LegendarySwordFilterParams, ApiResponse } from '../../../shared/types.js';

export const getLegendarySwords = (req: Request, res: Response) => {
  const params: LegendarySwordFilterParams = {
    page: req.query.page ? parseInt(req.query.page as string) : undefined,
    limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
    dynasty: req.query.dynasty as string | undefined,
    credibilityLevel: req.query.credibilityLevel as LegendarySwordFilterParams['credibilityLevel'],
    keyword: req.query.keyword as string | undefined,
    sortBy: req.query.sortBy as LegendarySwordFilterParams['sortBy'],
    sortOrder: req.query.sortOrder as 'asc' | 'desc' | undefined,
  };

  const result = legendarySwordService.getLegendarySwords(params);

  const response: ApiResponse<typeof result> = {
    code: 200,
    message: 'success',
    data: result,
  };

  res.json(response);
};

export const getPopularLegendarySwords = (req: Request, res: Response) => {
  const limit = req.query.limit ? parseInt(req.query.limit as string) : 6;
  const swords = legendarySwordService.getPopularLegendarySwords(limit);

  const response: ApiResponse<typeof swords> = {
    code: 200,
    message: 'success',
    data: swords,
  };

  res.json(response);
};

export const getLegendarySwordById = (req: Request, res: Response) => {
  const { id } = req.params;
  const sword = legendarySwordService.getLegendarySwordById(id);

  if (!sword) {
    const response: ApiResponse<null> = {
      code: 404,
      message: '失传名剑未找到',
      data: null,
    };
    return res.status(404).json(response);
  }

  const response: ApiResponse<typeof sword> = {
    code: 200,
    message: 'success',
    data: sword,
  };

  res.json(response);
};

export const getLegendarySwordStats = (_req: Request, res: Response) => {
  const stats = legendarySwordService.getLegendarySwordStats();

  const response: ApiResponse<typeof stats> = {
    code: 200,
    message: 'success',
    data: stats,
  };

  res.json(response);
};
