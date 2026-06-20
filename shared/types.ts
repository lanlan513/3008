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

export interface SwordHolder {
  id: string;
  swordsmanId: string;
  swordsmanName: string;
  startYear: string;
  endYear: string;
  acquisitionMethod: '铸造' | '继承' | '赠与' | '夺取' | '发现' | '赏赐' | '其他';
  lossMethod?: '传承' | '遗失' | '被夺' | '损毁' | '陪葬' | '化龙' | '其他';
  description: string;
  majorEvents: string[];
}

export interface SwordHeritage {
  swordId: string;
  swordName: string;
  forgingYear: string;
  currentStatus: '传世' | '失踪' | '损毁' | '陪葬' | '化龙';
  lastKnownLocation?: string;
  holders: SwordHolder[];
}

export interface SwordsmanSwordTenure {
  swordId: string;
  swordName: string;
  swordAlias: string;
  swordImageUrl: string;
  startYear: string;
  endYear: string;
  acquisitionMethod: SwordHolder['acquisitionMethod'];
  lossMethod?: SwordHolder['lossMethod'];
  description: string;
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

export interface GeoCoord {
  x: number;
  y: number;
}

export type LocationType = 'sect' | 'sword_forge' | 'event' | 'birthplace' | 'battlefield';

export interface MapLocation {
  id: string;
  name: string;
  type: LocationType;
  coord: GeoCoord;
  region: string;
  description: string;
  relatedSectIds?: string[];
  relatedSwordIds?: string[];
  relatedSwordsmanIds?: string[];
  relatedEventIds?: string[];
  dynasty?: string;
  importance: number;
}

export interface HistoricalEvent {
  id: string;
  title: string;
  year: string;
  dynasty: string;
  locationId: string;
  locationName: string;
  description: string;
  relatedSwordIds: string[];
  relatedSwordsmanIds: string[];
  relatedSectIds: string[];
  significance: 'minor' | 'notable' | 'major' | 'legendary';
}

export interface SwordOrigin {
  swordId: string;
  swordName: string;
  locationId: string;
  locationName: string;
  forgingMethod: string;
  forger?: string;
}

export interface RegionStats {
  region: string;
  sectCount: number;
  swordCount: number;
  eventCount: number;
  swordsmanCount: number;
  totalScore: number;
}

export interface DynastyGeoStats {
  dynasty: string;
  regions: Record<string, number>;
  eventCount: number;
  swordCount: number;
  swordsmanCount: number;
}

export type SpatialFilterType = 'all' | 'sect' | 'sword_forge' | 'event' | 'birthplace' | 'battlefield';

export interface MapFilterParams {
  types: SpatialFilterType[];
  dynasties: string[];
  regions: string[];
  minImportance?: number;
}

export interface WuxiaWork {
  id: string;
  title: string;
  author: string;
  year: number;
  type: '小说' | '影视' | '评书' | '戏曲' | '其他';
  dynasty: string;
  description: string;
  coverUrl: string;
  popularity: number;
}

export type ComparisonTargetType = 'swordsman' | 'sword';

export interface SwordsmanVersion {
  id: string;
  workId: string;
  workTitle: string;
  workAuthor: string;
  workYear: number;
  workType: WuxiaWork['type'];
  name: string;
  alias?: string;
  title?: string;
  sect?: string;
  dynasty?: string;
  birthYear?: string;
  deathYear?: string;
  description: string;
  personality?: string;
  appearance?: string;
  martialArts: MartialArt[];
  notableEvents: string[];
  relationships: Relationship[];
  avatarUrl?: string;
  authorInterpretation: string;
  attributes?: {
    martialLevel: number;
    wisdom: number;
    leadership: number;
    loyalty: number;
    charisma: number;
  };
}

export interface SwordVersion {
  id: string;
  workId: string;
  workTitle: string;
  workAuthor: string;
  workYear: number;
  workType: WuxiaWork['type'];
  name: string;
  alias?: string;
  owner?: string;
  forger?: string;
  dynasty?: string;
  description: string;
  history?: string;
  legend?: string;
  imageUrl?: string;
  materials?: string[];
  authorInterpretation: string;
  attributes: {
    sharpness: number;
    hardness: number;
    flexibility: number;
    craftsmanship: number;
  };
  notableEvents: string[];
}

export interface ComparisonLibrary {
  id: string;
  targetType: ComparisonTargetType;
  targetId: string;
  targetName: string;
  targetAvatarUrl?: string;
  coverUrl: string;
  description: string;
  versionCount: number;
  versions: (SwordsmanVersion | SwordVersion)[];
  swordsmanVersions?: SwordsmanVersion[];
  swordVersions?: SwordVersion[];
  works: WuxiaWork[];
  analysis?: string;
}

export type KnowledgeCategory = '剑材' | '锻造工艺' | '淬火方法' | '装具结构' | '铸剑流派';

export interface KnowledgeArticle {
  id: string;
  title: string;
  category: KnowledgeCategory;
  summary: string;
  content: string;
  coverUrl: string;
  tags: string[];
  relatedSwordIds: string[];
  relatedSwordsmanIds: string[];
  relatedSectIds: string[];
  relatedArticleIds: string[];
  dynasty?: string;
  popularity: number;
  createdAt: string;
}

export interface KnowledgeCategoryInfo {
  category: KnowledgeCategory;
  label: string;
  description: string;
  icon: string;
  count: number;
}

export interface KnowledgeFilterParams {
  category?: KnowledgeCategory;
  keyword?: string;
  sortBy?: 'popularity' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}
