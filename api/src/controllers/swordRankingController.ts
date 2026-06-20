import type { Request, Response } from 'express';
import * as swordRankingService from '../services/swordRankingService.js';
import type { RankingFilterParams, ApiResponse } from '../../../shared/types.js';

export const getRankingDimensions = (_req: Request, res: Response) => {
  const dimensions = swordRankingService.getRankingDimensions();

  const response: ApiResponse<typeof dimensions> = {
    code: 200,
    message: 'success',
    data: dimensions,
  };

  res.json(response);
};

export const getSwordRankings = (req: Request, res: Response) => {
  const params: RankingFilterParams = {
    page: req.query.page ? parseInt(req.query.page as string) : undefined,
    limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
    dimension: req.query.dimension as RankingFilterParams['dimension'],
    dynasty: req.query.dynasty as string | undefined,
    trend: req.query.trend as RankingFilterParams['trend'],
    sortOrder: req.query.sortOrder as 'asc' | 'desc' | undefined,
  };

  const result = swordRankingService.getSwordRankings(params);

  const response: ApiResponse<typeof result> = {
    code: 200,
    message: 'success',
    data: result,
  };

  res.json(response);
};

export const getRankingTrendData = (_req: Request, res: Response) => {
  const data = swordRankingService.getRankingTrendData();

  const response: ApiResponse<typeof data> = {
    code: 200,
    message: 'success',
    data: data,
  };

  res.json(response);
};

export const getSwordRankingById = (req: Request, res: Response) => {
  const { id } = req.params;
  const ranking = swordRankingService.getSwordRankingById(id);

  if (!ranking) {
    const response: ApiResponse<null> = {
      code: 404,
      message: '名剑排行数据未找到',
      data: null,
    };
    return res.status(404).json(response);
  }

  const response: ApiResponse<typeof ranking> = {
    code: 200,
    message: 'success',
    data: ranking,
  };

  res.json(response);
};

export const getRankingCalculationDetail = (req: Request, res: Response) => {
  const { id } = req.params;
  const detail = swordRankingService.getRankingCalculationDetail(id);

  if (!detail) {
    const response: ApiResponse<null> = {
      code: 404,
      message: '计算详情未找到',
      data: null,
    };
    return res.status(404).json(response);
  }

  const response: ApiResponse<typeof detail> = {
    code: 200,
    message: 'success',
    data: detail,
  };

  res.json(response);
};

export const getTopRankings = (req: Request, res: Response) => {
  const dimension = req.query.dimension as string || 'comprehensive';
  const limit = req.query.limit ? parseInt(req.query.limit as string) : 3;

  const rankings = swordRankingService.getTopRankings(dimension, limit);

  const response: ApiResponse<typeof rankings> = {
    code: 200,
    message: 'success',
    data: rankings,
  };

  res.json(response);
};

export const getRankingOverviewStats = (_req: Request, res: Response) => {
  const stats = swordRankingService.getRankingOverviewStats();

  const response: ApiResponse<typeof stats> = {
    code: 200,
    message: 'success',
    data: stats,
  };

  res.json(response);
};
