import type { Request, Response } from 'express';
import * as swordHeritageService from '../services/swordHeritageService.js';
import type { ApiResponse } from '../../../shared/types.js';

export const getSwordHeritage = (req: Request, res: Response) => {
  const { swordId } = req.params;
  const heritage = swordHeritageService.getSwordHeritage(swordId);

  if (!heritage) {
    const response: ApiResponse<null> = {
      code: 404,
      message: '未找到该名剑的传承记录',
      data: null,
    };
    return res.status(404).json(response);
  }

  const response: ApiResponse<typeof heritage> = {
    code: 200,
    message: 'success',
    data: heritage,
  };

  res.json(response);
};

export const getSwordsmanSwordTenures = (req: Request, res: Response) => {
  const { swordsmanId } = req.params;
  const tenures = swordHeritageService.getSwordsmanSwordTenures(swordsmanId);

  const response: ApiResponse<typeof tenures> = {
    code: 200,
    message: 'success',
    data: tenures,
  };

  res.json(response);
};

export const getSwordsmanHeritages = (req: Request, res: Response) => {
  const { swordsmanId } = req.params;
  const heritages = swordHeritageService.getSwordsmanHeritages(swordsmanId);

  const response: ApiResponse<typeof heritages> = {
    code: 200,
    message: 'success',
    data: heritages,
  };

  res.json(response);
};
