import { swordCollections, collectionInstitutions, discoverySites } from '../data/museumCollections.js';
import type {
  SwordCollection,
  CollectionInstitution,
  DiscoverySite,
  MuseumFilterParams,
  MuseumCollectionListResponse,
  DynastyPreservationStats,
  InstitutionStats,
  MuseumOverviewStats,
  PreservationStatus,
} from '../../../shared/types.js';

const PRESERVATION_ORDER: PreservationStatus[] = ['完好保存', '部分残损', '严重残损', '修复中', '复制展示', '下落不明', '已损毁'];

const DYNASTY_ORDER = ['西周', '春秋', '战国', '秦', '汉', '三国', '晋', '南北朝', '隋', '唐', '五代', '宋', '元', '明', '清', '现代'];

export const getCollections = (params: MuseumFilterParams): MuseumCollectionListResponse => {
  const {
    page = 1,
    limit = 10,
    dynasty,
    preservationStatus,
    institutionId,
    region,
    isOnDisplay,
    keyword,
    sortBy = 'accessionDate',
    sortOrder = 'desc',
  } = params;

  let filtered = [...swordCollections];

  if (dynasty) {
    filtered = filtered.filter(s => s.dynasty === dynasty);
  }

  if (preservationStatus) {
    filtered = filtered.filter(s => s.preservationStatus === preservationStatus);
  }

  if (institutionId) {
    filtered = filtered.filter(s => s.currentInstitutionId === institutionId);
  }

  if (region) {
    const insts = collectionInstitutions.filter(i => i.region === region).map(i => i.id);
    filtered = filtered.filter(s => insts.includes(s.currentInstitutionId));
  }

  if (isOnDisplay !== undefined) {
    filtered = filtered.filter(s => s.isOnDisplay === isOnDisplay);
  }

  if (keyword) {
    const lowerKeyword = keyword.toLowerCase();
    filtered = filtered.filter(s =>
      s.swordName.toLowerCase().includes(lowerKeyword) ||
      s.swordAlias.toLowerCase().includes(lowerKeyword) ||
      s.accessionNumber.toLowerCase().includes(lowerKeyword) ||
      s.material.toLowerCase().includes(lowerKeyword) ||
      s.currentInstitutionName.toLowerCase().includes(lowerKeyword) ||
      s.tags.some(t => t.toLowerCase().includes(lowerKeyword))
    );
  }

  if (sortBy) {
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'accessionDate':
          comparison = a.accessionDate.localeCompare(b.accessionDate);
          break;
        case 'dynasty': {
          const aIdx = DYNASTY_ORDER.indexOf(a.dynasty);
          const bIdx = DYNASTY_ORDER.indexOf(b.dynasty);
          comparison = aIdx - bIdx;
          break;
        }
        case 'authenticityLevel':
          comparison = a.authenticityLevel - b.authenticityLevel;
          break;
        case 'length':
          comparison = a.length - b.length;
          break;
        case 'name':
          comparison = a.swordName.localeCompare(b.swordName, 'zh-CN');
          break;
        default:
          comparison = 0;
      }
      return sortOrder === 'desc' ? -comparison : comparison;
    });
  }

  const total = filtered.length;
  const start = (page - 1) * limit;
  const end = start + limit;
  const list = filtered.slice(start, end);

  return { list, total, page, limit };
};

export const getCollectionById = (id: string): SwordCollection | undefined => {
  return swordCollections.find(c => c.id === id);
};

export const getCollectionsBySwordId = (swordId: string): SwordCollection[] => {
  return swordCollections.filter(c => c.swordId === swordId);
};

export const getCollectionsByInstitutionId = (institutionId: string): SwordCollection[] => {
  return swordCollections.filter(c => c.currentInstitutionId === institutionId);
};

export const getAllInstitutions = (): CollectionInstitution[] => {
  return [...collectionInstitutions];
};

export const getInstitutionById = (id: string): CollectionInstitution | undefined => {
  return collectionInstitutions.find(i => i.id === id);
};

export const getInstitutionsByRegion = (region: string): CollectionInstitution[] => {
  return collectionInstitutions.filter(i => i.region === region);
};

export const getAllDiscoverySites = (): DiscoverySite[] => {
  return [...discoverySites];
};

export const getDiscoverySiteById = (id: string): DiscoverySite | undefined => {
  return discoverySites.find(s => s.id === id);
};

export const getDiscoverySitesByRegion = (region: string): DiscoverySite[] => {
  return discoverySites.filter(s => s.region === region);
};

const getEmptyStatusRecord = (): Record<PreservationStatus, number> => {
  const record: Record<string, number> = {};
  PRESERVATION_ORDER.forEach(s => { record[s] = 0; });
  return record as Record<PreservationStatus, number>;
};

export const getDynastyPreservationStats = (): DynastyPreservationStats[] => {
  const byDynasty: Record<string, SwordCollection[]> = {};

  swordCollections.forEach(c => {
    if (!byDynasty[c.dynasty]) byDynasty[c.dynasty] = [];
    byDynasty[c.dynasty].push(c);
  });

  const result: DynastyPreservationStats[] = [];

  DYNASTY_ORDER.forEach(dynasty => {
    const list = byDynasty[dynasty];
    if (!list || list.length === 0) return;

    const byStatus = getEmptyStatusRecord();
    let displayedCount = 0;
    let avgAuth = 0;

    list.forEach(c => {
      byStatus[c.preservationStatus]++;
      if (c.isOnDisplay) displayedCount++;
      avgAuth += c.authenticityLevel;
    });

    const intactCount = byStatus['完好保存'];
    result.push({
      dynasty,
      totalCount: list.length,
      byStatus,
      intactRate: Math.round((intactCount / list.length) * 100),
      displayedCount,
      avgAuthenticity: Math.round((avgAuth / list.length) * 10) / 10,
    });
  });

  return result;
};

export const getInstitutionStats = (): InstitutionStats[] => {
  return collectionInstitutions.map(inst => {
    const collections = getCollectionsByInstitutionId(inst.id);

    const byDynasty: Record<string, number> = {};
    const byStatus = getEmptyStatusRecord();
    let displayedCount = 0;
    let avgAuth = 0;

    collections.forEach(c => {
      byDynasty[c.dynasty] = (byDynasty[c.dynasty] || 0) + 1;
      byStatus[c.preservationStatus]++;
      if (c.isOnDisplay) displayedCount++;
      avgAuth += c.authenticityLevel;
    });

    return {
      institution: inst,
      collectionCount: collections.length,
      byDynasty,
      byStatus,
      displayedCount,
      avgAuthenticity: collections.length > 0 ? Math.round((avgAuth / collections.length) * 10) / 10 : 0,
    };
  }).filter(s => s.collectionCount > 0).sort((a, b) => b.collectionCount - a.collectionCount);
};

export const getOverviewStats = (): MuseumOverviewStats => {
  const totalCollections = swordCollections.length;
  const totalInstitutions = collectionInstitutions.length;
  const totalDiscoverySites = discoverySites.length;
  const totalProvenanceRecords = swordCollections.reduce((sum, c) => sum + c.provenanceRecords.length, 0);

  const byDynasty: Record<string, number> = {};
  const byPreservationStatus = getEmptyStatusRecord();
  const byRegion: Record<string, number> = {};

  let intactCount = 0;
  let displayedCount = 0;
  let avgAuthenticity = 0;

  swordCollections.forEach(c => {
    byDynasty[c.dynasty] = (byDynasty[c.dynasty] || 0) + 1;
    byPreservationStatus[c.preservationStatus]++;

    const inst = collectionInstitutions.find(i => i.id === c.currentInstitutionId);
    if (inst) {
      byRegion[inst.region] = (byRegion[inst.region] || 0) + 1;
    }

    if (c.preservationStatus === '完好保存') intactCount++;
    if (c.isOnDisplay) displayedCount++;
    avgAuthenticity += c.authenticityLevel;
  });

  const recentlyAdded = [...swordCollections]
    .sort((a, b) => b.accessionDate.localeCompare(a.accessionDate))
    .slice(0, 5);

  return {
    totalCollections,
    totalInstitutions,
    totalDiscoverySites,
    totalProvenanceRecords,
    byDynasty,
    byPreservationStatus,
    byRegion,
    overallIntactRate: Math.round((intactCount / totalCollections) * 100),
    displayedCount,
    avgAuthenticity: Math.round((avgAuthenticity / totalCollections) * 10) / 10,
    recentlyAdded,
  };
};

export const searchCollections = (keyword: string): SwordCollection[] => {
  return getCollections({ keyword, limit: 100, page: 1 }).list;
};

export const getAvailableFilters = () => {
  const dynasties = [...new Set(swordCollections.map(c => c.dynasty))].sort((a, b) => {
    const aIdx = DYNASTY_ORDER.indexOf(a);
    const bIdx = DYNASTY_ORDER.indexOf(b);
    return (aIdx === -1 ? 999 : aIdx) - (bIdx === -1 ? 999 : bIdx);
  });

  const regions = [...new Set(collectionInstitutions.map(i => i.region))].sort();

  const preservationStatuses = PRESERVATION_ORDER.filter(s =>
    swordCollections.some(c => c.preservationStatus === s)
  );

  const institutions = [...collectionInstitutions]
    .filter(i => swordCollections.some(c => c.currentInstitutionId === i.id))
    .sort((a, b) => b.collectionCount - a.collectionCount);

  return {
    dynasties,
    regions,
    preservationStatuses,
    institutions,
  };
};
