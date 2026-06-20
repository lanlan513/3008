export interface Sword {
  id: string;
  name: string;
  alias: string;
  dynasty: string;
  owner: string;
  sect: string;
  description: string;
  history: string;
  legend: string;
  imageUrl: string;
  attributes: {
    sharpness: number;
    hardness: number;
    flexibility: number;
    craftsmanship: number;
  };
  popularity: number;
  createdAt: string;
}

export interface Swordsman {
  id: string;
  name: string;
  title: string;
  dynasty: string;
  sect: string;
  biography: string;
  avatarUrl: string;
  swords: string[];
  createdAt: string;
}

export interface MartialArt {
  name: string;
  type: '剑法' | '内功' | '轻功' | '掌法' | '其他';
  level: '入门' | '熟练' | '精通' | '出神入化';
  description: string;
}

export interface LifeEvent {
  id: string;
  year: string;
  title: string;
  description: string;
  relatedSwords?: string[];
  relatedSwordsmen?: string[];
}

export interface Relationship {
  swordsmanId: string;
  swordsmanName: string;
  type: '师父' | '弟子' | '同门' | '夫妻' | '父子' | '兄弟' | '朋友' | '仇敌' | '知己' | '其他';
  description: string;
}

export interface SwordsmanDetail extends Swordsman {
  birthYear?: string;
  deathYear?: string;
  birthplace?: string;
  martialArts: MartialArt[];
  events: LifeEvent[];
  relationships: Relationship[];
}

export interface Sect {
  id: string;
  name: string;
  location: string;
  foundingDynasty: string;
  description: string;
  emblemUrl: string;
  skills: string[];
  notableSwords: string[];
  popularity: number;
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface SwordListResponse {
  list: Sword[];
  total: number;
  page: number;
  limit: number;
}

export interface SwordFilterParams {
  page?: number;
  limit?: number;
  dynasty?: string;
  sect?: string;
  keyword?: string;
  sortBy?: 'popularity' | 'dynasty' | 'name';
  sortOrder?: 'asc' | 'desc';
}
