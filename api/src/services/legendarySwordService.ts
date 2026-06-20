import { legendarySwords } from '../data/legendarySwords.js';
import type { LegendarySword, LegendarySwordFilterParams, LegendarySwordListResponse } from '../../../shared/types.js';

export const getLegendarySwords = (params: LegendarySwordFilterParams): LegendarySwordListResponse => {
  const { page = 1, limit = 10, dynasty, credibilityLevel, keyword, sortBy = 'popularity', sortOrder = 'desc' } = params;

  let filtered = [...legendarySwords];

  if (dynasty) {
    filtered = filtered.filter(s => s.dynasty === dynasty);
  }

  if (credibilityLevel) {
    filtered = filtered.filter(s => s.credibilityLevel === credibilityLevel);
  }

  if (keyword) {
    const lowerKeyword = keyword.toLowerCase();
    filtered = filtered.filter(s =>
      s.name.toLowerCase().includes(lowerKeyword) ||
      s.alias.toLowerCase().includes(lowerKeyword) ||
      s.description.toLowerCase().includes(lowerKeyword) ||
      s.tags.some(t => t.toLowerCase().includes(lowerKeyword))
    );
  }

  if (sortBy) {
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'popularity':
          comparison = a.popularity - b.popularity;
          break;
        case 'credibilityScore':
          comparison = a.credibilityScore - b.credibilityScore;
          break;
        case 'mysteryLevel':
          comparison = a.mysteryLevel - b.mysteryLevel;
          break;
        case 'name':
          comparison = a.name.localeCompare(b.name, 'zh-CN');
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

export const getPopularLegendarySwords = (limit: number = 6): LegendarySword[] => {
  return [...legendarySwords]
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, limit);
};

export const getLegendarySwordById = (id: string): LegendarySword | undefined => {
  return legendarySwords.find(s => s.id === id);
};

export const getLegendarySwordsByCredibility = (level: string): LegendarySword[] => {
  return legendarySwords.filter(s => s.credibilityLevel === level);
};

export const getLegendarySwordStats = () => {
  const total = legendarySwords.length;
  const byCredibility: Record<string, number> = {};
  const byDynasty: Record<string, number> = {};
  let avgCredibility = 0;
  let avgMystery = 0;

  legendarySwords.forEach(s => {
    byCredibility[s.credibilityLevel] = (byCredibility[s.credibilityLevel] || 0) + 1;
    byDynasty[s.dynasty] = (byDynasty[s.dynasty] || 0) + 1;
    avgCredibility += s.credibilityScore;
    avgMystery += s.mysteryLevel;
  });

  return {
    total,
    byCredibility,
    byDynasty,
    avgCredibility: Math.round(avgCredibility / total),
    avgMystery: Math.round(avgMystery / total),
  };
};
