import type { Sword, Swordsman, SwordsmanDetail, Sect, ApiResponse, SwordListResponse, SwordFilterParams } from '../types';

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
