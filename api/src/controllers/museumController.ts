import type { Request, Response } from 'express';
import * as museumService from '../services/museumService.js';
import type {
  MuseumFilterParams,
  ApiResponse,
  SwordCollection,
} from '../../../shared/types.js';

export const getCollections = (req: Request, res: Response) => {
  const params: MuseumFilterParams = {
    page: req.query.page ? parseInt(req.query.page as string) : undefined,
    limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
    dynasty: req.query.dynasty as string | undefined,
    preservationStatus: req.query.preservationStatus as MuseumFilterParams['preservationStatus'],
    institutionId: req.query.institutionId as string | undefined,
    region: req.query.region as string | undefined,
    isOnDisplay: req.query.isOnDisplay !== undefined ? req.query.isOnDisplay === 'true' : undefined,
    keyword: req.query.keyword as string | undefined,
    sortBy: req.query.sortBy as MuseumFilterParams['sortBy'],
    sortOrder: req.query.sortOrder as 'asc' | 'desc' | undefined,
  };

  const result = museumService.getCollections(params);

  const response: ApiResponse<typeof result> = {
    code: 200,
    message: 'success',
    data: result,
  };

  res.json(response);
};

export const getCollectionById = (req: Request, res: Response) => {
  const { id } = req.params;
  const collection = museumService.getCollectionById(id);

  if (!collection) {
    const response: ApiResponse<null> = {
      code: 404,
      message: '藏品档案未找到',
      data: null,
    };
    return res.status(404).json(response);
  }

  const response: ApiResponse<typeof collection> = {
    code: 200,
    message: 'success',
    data: collection,
  };

  res.json(response);
};

export const getCollectionsBySwordId = (req: Request, res: Response) => {
  const { swordId } = req.params;
  const collections = museumService.getCollectionsBySwordId(swordId);

  const response: ApiResponse<SwordCollection[]> = {
    code: 200,
    message: 'success',
    data: collections,
  };

  res.json(response);
};

export const getCollectionsByInstitutionId = (req: Request, res: Response) => {
  const { institutionId } = req.params;
  const collections = museumService.getCollectionsByInstitutionId(institutionId);

  const response: ApiResponse<SwordCollection[]> = {
    code: 200,
    message: 'success',
    data: collections,
  };

  res.json(response);
};

export const getAllInstitutions = (_req: Request, res: Response) => {
  const institutions = museumService.getAllInstitutions();

  const response: ApiResponse<typeof institutions> = {
    code: 200,
    message: 'success',
    data: institutions,
  };

  res.json(response);
};

export const getInstitutionById = (req: Request, res: Response) => {
  const { id } = req.params;
  const institution = museumService.getInstitutionById(id);

  if (!institution) {
    const response: ApiResponse<null> = {
      code: 404,
      message: '收藏机构未找到',
      data: null,
    };
    return res.status(404).json(response);
  }

  const response: ApiResponse<typeof institution> = {
    code: 200,
    message: 'success',
    data: institution,
  };

  res.json(response);
};

export const getAllDiscoverySites = (_req: Request, res: Response) => {
  const sites = museumService.getAllDiscoverySites();

  const response: ApiResponse<typeof sites> = {
    code: 200,
    message: 'success',
    data: sites,
  };

  res.json(response);
};

export const getDiscoverySiteById = (req: Request, res: Response) => {
  const { id } = req.params;
  const site = museumService.getDiscoverySiteById(id);

  if (!site) {
    const response: ApiResponse<null> = {
      code: 404,
      message: '发现地点未找到',
      data: null,
    };
    return res.status(404).json(response);
  }

  const response: ApiResponse<typeof site> = {
    code: 200,
    message: 'success',
    data: site,
  };

  res.json(response);
};

export const getDynastyPreservationStats = (_req: Request, res: Response) => {
  const stats = museumService.getDynastyPreservationStats();

  const response: ApiResponse<typeof stats> = {
    code: 200,
    message: 'success',
    data: stats,
  };

  res.json(response);
};

export const getInstitutionStats = (_req: Request, res: Response) => {
  const stats = museumService.getInstitutionStats();

  const response: ApiResponse<typeof stats> = {
    code: 200,
    message: 'success',
    data: stats,
  };

  res.json(response);
};

export const getOverviewStats = (_req: Request, res: Response) => {
  const stats = museumService.getOverviewStats();

  const response: ApiResponse<typeof stats> = {
    code: 200,
    message: 'success',
    data: stats,
  };

  res.json(response);
};

export const getAvailableFilters = (_req: Request, res: Response) => {
  const filters = museumService.getAvailableFilters();

  const response: ApiResponse<typeof filters> = {
    code: 200,
    message: 'success',
    data: filters,
  };

  res.json(response);
};
