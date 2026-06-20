import comparisonLibraries from '../data/comparisonLibraries.js';
import { wuxiaWorks } from '../data/wuxiaWorks.js';
import type { ComparisonLibrary, WuxiaWork } from '../../../shared/types.js';

export const getAllComparisonLibraries = (): ComparisonLibrary[] => {
  return comparisonLibraries;
};

export const getComparisonLibraryById = (id: string): ComparisonLibrary | undefined => {
  return comparisonLibraries.find(cl => cl.id === id);
};

export const getComparisonLibraryByTarget = (targetType: string, targetId: string): ComparisonLibrary | undefined => {
  return comparisonLibraries.find(cl => cl.targetType === targetType && cl.targetId === targetId);
};

export const getSwordsmanComparison = (swordsmanId: string): ComparisonLibrary | undefined => {
  return getComparisonLibraryByTarget('swordsman', swordsmanId);
};

export const getSwordComparison = (swordId: string): ComparisonLibrary | undefined => {
  return getComparisonLibraryByTarget('sword', swordId);
};

export const getAllWuxiaWorks = (): WuxiaWork[] => {
  return [...wuxiaWorks].sort((a, b) => b.popularity - a.popularity);
};

export const getWuxiaWorkById = (id: string): WuxiaWork | undefined => {
  return wuxiaWorks.find(w => w.id === id);
};

export const getPopularWorks = (limit: number = 6): WuxiaWork[] => {
  return getAllWuxiaWorks().slice(0, limit);
};
