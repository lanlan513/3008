import type { Sword, Swordsman, SwordsmanDetail, Sect, ApiResponse, SwordListResponse, SwordFilterParams, SwordHeritage, SwordsmanSwordTenure, MapLocation, HistoricalEvent, RegionStats, DynastyGeoStats, MapFilterParams, ComparisonLibrary, WuxiaWork, KnowledgeArticle, KnowledgeCategoryInfo, KnowledgeFilterParams, LegendarySword, LegendarySwordListResponse, LegendarySwordFilterParams } from '../types';

const API_BASE = '/api';

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${url}`, init);
  const data: ApiResponse<T> = await response.json();
  
  if (data.code !== 200) {
    throw new Error(data.message);
  }
  
  return data.data;
}

export const swordApi = {
  getSwords: (params: SwordFilterParams = {}): Promise<SwordListResponse> => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        query.append(key, String(value));
      }
    });
    const queryString = query.toString();
    return request<SwordListResponse>(`/swords${queryString ? `?${queryString}` : ''}`);
  },
  
  getPopularSwords: (limit?: number): Promise<Sword[]> => {
    const query = limit ? `?limit=${limit}` : '';
    return request<Sword[]>(`/swords/popular${query}`);
  },
  
  getSwordById: (id: string): Promise<Sword> => {
    return request<Sword>(`/swords/${id}`);
  },

  getSwordHeritage: (id: string): Promise<SwordHeritage> => {
    return request<SwordHeritage>(`/swords/${id}/heritage`);
  },
};

export const swordsmanApi = {
  getSwordsmen: (limit?: number): Promise<Swordsman[]> => {
    const query = limit ? `?limit=${limit}` : '';
    return request<Swordsman[]>(`/swordsmen${query}`);
  },
  
  getLatestSwordsmen: (limit?: number): Promise<Swordsman[]> => {
    const query = limit ? `?limit=${limit}` : '';
    return request<Swordsman[]>(`/swordsmen/latest${query}`);
  },
  
  getSwordsmanById: (id: string): Promise<Swordsman> => {
    return request<Swordsman>(`/swordsmen/${id}`);
  },
  
  getSwordsmanDetailById: (id: string): Promise<SwordsmanDetail> => {
    return request<SwordsmanDetail>(`/swordsmen/${id}/detail`);
  },
  
  getSwordsmanSwords: (id: string): Promise<Sword[]> => {
    return request<Sword[]>(`/swordsmen/${id}/swords`);
  },

  getSwordsmanSwordTenures: (id: string): Promise<SwordsmanSwordTenure[]> => {
    return request<SwordsmanSwordTenure[]>(`/swordsmen/${id}/sword-tenures`);
  },

  getSwordsmanHeritages: (id: string): Promise<SwordHeritage[]> => {
    return request<SwordHeritage[]>(`/swordsmen/${id}/heritages`);
  },
  
  getSwordsmenBySwordId: (swordId: string): Promise<Swordsman[]> => {
    return request<Swordsman[]>(`/swordsmen/by-sword/${swordId}`);
  },
  
  searchSwordsmen: (keyword: string): Promise<Swordsman[]> => {
    const query = keyword ? `?keyword=${encodeURIComponent(keyword)}` : '';
    return request<Swordsman[]>(`/swordsmen/search${query}`);
  },
};

export const sectApi = {
  getSects: (limit?: number): Promise<Sect[]> => {
    const query = limit ? `?limit=${limit}` : '';
    return request<Sect[]>(`/sects${query}`);
  },
  
  getPopularSects: (limit?: number): Promise<Sect[]> => {
    const query = limit ? `?limit=${limit}` : '';
    return request<Sect[]>(`/sects/popular${query}`);
  },
  
  getSectById: (id: string): Promise<Sect> => {
    return request<Sect>(`/sects/${id}`);
  },
};

export interface LocationDetails {
  location: MapLocation;
  relatedSects: Sect[];
  relatedSwords: Sword[];
  relatedSwordsmen: Swordsman[];
  relatedEvents: HistoricalEvent[];
}

export const mapApi = {
  getAllLocations: (): Promise<MapLocation[]> => {
    return request<MapLocation[]>('/map/locations');
  },

  getFilteredLocations: (params: MapFilterParams): Promise<MapLocation[]> => {
    const query = new URLSearchParams();
    if (params.types.length > 0) query.append('types', params.types.join(','));
    if (params.dynasties.length > 0) query.append('dynasties', params.dynasties.join(','));
    if (params.regions.length > 0) query.append('regions', params.regions.join(','));
    if (params.minImportance !== undefined) query.append('minImportance', String(params.minImportance));
    const queryString = query.toString();
    return request<MapLocation[]>(`/map/locations/filter${queryString ? `?${queryString}` : ''}`);
  },

  getLocationById: (id: string): Promise<MapLocation> => {
    return request<MapLocation>(`/map/locations/${id}`);
  },

  getLocationDetails: (id: string): Promise<LocationDetails> => {
    return request<LocationDetails>(`/map/locations/${id}/details`);
  },

  getAllRegions: (): Promise<string[]> => {
    return request<string[]>('/map/locations/regions');
  },

  getAllHistoricalEvents: (): Promise<HistoricalEvent[]> => {
    return request<HistoricalEvent[]>('/map/events');
  },

  getHistoricalEventById: (id: string): Promise<HistoricalEvent> => {
    return request<HistoricalEvent>(`/map/events/${id}`);
  },

  getRegionStats: (): Promise<RegionStats[]> => {
    return request<RegionStats[]>('/map/stats/regions');
  },

  getDynastyGeoStats: (): Promise<DynastyGeoStats[]> => {
    return request<DynastyGeoStats[]>('/map/stats/dynasties');
  },
};

export const comparisonApi = {
  getAllLibraries: (): Promise<ComparisonLibrary[]> => {
    return request<ComparisonLibrary[]>('/comparison/libraries');
  },

  getLibraryById: (id: string): Promise<ComparisonLibrary> => {
    return request<ComparisonLibrary>(`/comparison/libraries/${id}`);
  },

  getSwordsmanComparison: (swordsmanId: string): Promise<ComparisonLibrary> => {
    return request<ComparisonLibrary>(`/comparison/swordsman/${swordsmanId}`);
  },

  getSwordComparison: (swordId: string): Promise<ComparisonLibrary> => {
    return request<ComparisonLibrary>(`/comparison/sword/${swordId}`);
  },

  getAllWorks: (): Promise<WuxiaWork[]> => {
    return request<WuxiaWork[]>('/comparison/works');
  },

  getPopularWorks: (limit?: number): Promise<WuxiaWork[]> => {
    const query = limit ? `?limit=${limit}` : '';
    return request<WuxiaWork[]>(`/comparison/works/popular${query}`);
  },

  getWorkById: (id: string): Promise<WuxiaWork> => {
    return request<WuxiaWork>(`/comparison/works/${id}`);
  },
};

export const knowledgeApi = {
  getCategories: (): Promise<KnowledgeCategoryInfo[]> => {
    return request<KnowledgeCategoryInfo[]>('/knowledge/categories');
  },

  getArticles: (params: KnowledgeFilterParams = {}): Promise<KnowledgeArticle[]> => {
    const query = new URLSearchParams();
    if (params.category) query.append('category', params.category);
    if (params.keyword) query.append('keyword', encodeURIComponent(params.keyword));
    if (params.sortBy) query.append('sortBy', params.sortBy);
    if (params.sortOrder) query.append('sortOrder', params.sortOrder);
    const queryString = query.toString();
    return request<KnowledgeArticle[]>(`/knowledge${queryString ? `?${queryString}` : ''}`);
  },

  getPopularArticles: (limit?: number): Promise<KnowledgeArticle[]> => {
    const query = limit ? `?limit=${limit}` : '';
    return request<KnowledgeArticle[]>(`/knowledge/popular${query}`);
  },

  getArticleById: (id: string): Promise<KnowledgeArticle> => {
    return request<KnowledgeArticle>(`/knowledge/${id}`);
  },

  getRelatedArticles: (id: string): Promise<KnowledgeArticle[]> => {
    return request<KnowledgeArticle[]>(`/knowledge/${id}/related`);
  },

  getArticlesBySwordId: (swordId: string): Promise<KnowledgeArticle[]> => {
    return request<KnowledgeArticle[]>(`/knowledge/by-sword/${swordId}`);
  },

  getArticlesBySwordsmanId: (swordsmanId: string): Promise<KnowledgeArticle[]> => {
    return request<KnowledgeArticle[]>(`/knowledge/by-swordsman/${swordsmanId}`);
  },
};

export const legendarySwordApi = {
  getLegendarySwords: (params: LegendarySwordFilterParams = {}): Promise<LegendarySwordListResponse> => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        query.append(key, String(value));
      }
    });
    const queryString = query.toString();
    return request<LegendarySwordListResponse>(`/legendary-swords${queryString ? `?${queryString}` : ''}`);
  },

  getPopularLegendarySwords: (limit?: number): Promise<LegendarySword[]> => {
    const query = limit ? `?limit=${limit}` : '';
    return request<LegendarySword[]>(`/legendary-swords/popular${query}`);
  },

  getLegendarySwordById: (id: string): Promise<LegendarySword> => {
    return request<LegendarySword>(`/legendary-swords/${id}`);
  },

  getLegendarySwordStats: (): Promise<{
    total: number;
    byCredibility: Record<string, number>;
    byDynasty: Record<string, number>;
    avgCredibility: number;
    avgMystery: number;
  }> => {
    return request('/legendary-swords/stats');
  },
};
