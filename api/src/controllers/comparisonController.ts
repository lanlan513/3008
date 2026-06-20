import type { Request, Response } from 'express';
import * as comparisonService from '../services/comparisonService.js';
import type { ApiResponse } from '../../../shared/types.js';

export const getAllComparisonLibraries = (req: Request, res: Response) => {
  const libraries = comparisonService.getAllComparisonLibraries();
  
  const response: ApiResponse<typeof libraries> = {
    code: 200,
    message: 'success',
    data: libraries,
  };
  
  res.json(response);
};

export const getComparisonLibraryById = (req: Request, res: Response) => {
  const { id } = req.params;
  const library = comparisonService.getComparisonLibraryById(id);
  
  if (!library) {
    const response: ApiResponse<null> = {
      code: 404,
      message: '对照库未找到',
      data: null,
    };
    return res.status(404).json(response);
  }
  
  const response: ApiResponse<typeof library> = {
    code: 200,
    message: 'success',
    data: library,
  };
  
  res.json(response);
};

export const getSwordsmanComparison = (req: Request, res: Response) => {
  const { swordsmanId } = req.params;
  const library = comparisonService.getSwordsmanComparison(swordsmanId);
  
  if (!library) {
    const response: ApiResponse<null> = {
      code: 404,
      message: '该剑客暂无对照资料',
      data: null,
    };
    return res.status(404).json(response);
  }
  
  const response: ApiResponse<typeof library> = {
    code: 200,
    message: 'success',
    data: library,
  };
  
  res.json(response);
};

export const getSwordComparison = (req: Request, res: Response) => {
  const { swordId } = req.params;
  const library = comparisonService.getSwordComparison(swordId);
  
  if (!library) {
    const response: ApiResponse<null> = {
      code: 404,
      message: '该名剑暂无对照资料',
      data: null,
    };
    return res.status(404).json(response);
  }
  
  const response: ApiResponse<typeof library> = {
    code: 200,
    message: 'success',
    data: library,
  };
  
  res.json(response);
};

export const getAllWuxiaWorks = (req: Request, res: Response) => {
  const works = comparisonService.getAllWuxiaWorks();
  
  const response: ApiResponse<typeof works> = {
    code: 200,
    message: 'success',
    data: works,
  };
  
  res.json(response);
};

export const getWuxiaWorkById = (req: Request, res: Response) => {
  const { id } = req.params;
  const work = comparisonService.getWuxiaWorkById(id);
  
  if (!work) {
    const response: ApiResponse<null> = {
      code: 404,
      message: '作品未找到',
      data: null,
    };
    return res.status(404).json(response);
  }
  
  const response: ApiResponse<typeof work> = {
    code: 200,
    message: 'success',
    data: work,
  };
  
  res.json(response);
};

export const getPopularWorks = (req: Request, res: Response) => {
  const limit = req.query.limit ? parseInt(req.query.limit as string) : 6;
  const works = comparisonService.getPopularWorks(limit);
  
  const response: ApiResponse<typeof works> = {
    code: 200,
    message: 'success',
    data: works,
  };
  
  res.json(response);
};
