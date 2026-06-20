import { swordRankings, rankingTrendData, RANKING_DIMENSIONS, getSwordRankingCalculationDetail } from '../data/swordRankings.js';
import type { SwordRankingMetrics, RankingTrendData, RankingFilterParams, RankingCalculationDetail, RankingDimensionInfo } from '../../../shared/types.js';

function sortRankings(rankings: SwordRankingMetrics[], dimension: string, order: 'asc' | 'desc' = 'desc'): SwordRankingMetrics[] {
  const sorted = [...rankings].sort((a, b) => {
    let aVal: number;
    let bVal: number;

    switch (dimension) {
      case 'historicalInfluence':
        aVal = a.historicalInfluence;
        bVal = b.historicalInfluence;
        break;
      case 'citationCount':
        aVal = a.citationCount;
        bVal = b.citationCount;
        break;
      case 'heritageLength':
        aVal = a.heritageLength;
        bVal = b.heritageLength;
        break;
      case 'relatedFigures':
        aVal = a.relatedFiguresCount;
        bVal = b.relatedFiguresCount;
        break;
      case 'comprehensive':
      default:
        aVal = a.comprehensiveScore;
        bVal = b.comprehensiveScore;
        break;
    }

    return order === 'desc' ? bVal - aVal : aVal - bVal;
  });

  return sorted.map((item, index) => ({
    ...item,
    rank: index + 1,
  }));
}

export function getRankingDimensions(): RankingDimensionInfo[] {
  return RANKING_DIMENSIONS;
}

export function getSwordRankings(params: RankingFilterParams = {}): {
  list: SwordRankingMetrics[];
  total: number;
  dimension: string;
  lastUpdated: string;
} {
  const {
    page = 1,
    limit = 10,
    dimension = 'comprehensive',
    dynasty,
    trend,
    sortOrder = 'desc',
  } = params;

  let filtered = [...swordRankings];

  if (dynasty) {
    filtered = filtered.filter(s => s.dynasty === dynasty);
  }

  if (trend) {
    filtered = filtered.filter(s => s.trend === trend);
  }

  const sorted = sortRankings(filtered, dimension, sortOrder);

  const total = sorted.length;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const list = sorted.slice(startIndex, endIndex);

  const lastUpdated = sorted.length > 0 ? sorted[0].lastUpdated : new Date().toISOString();

  return {
    list,
    total,
    dimension,
    lastUpdated,
  };
}

export function getRankingTrendData(): RankingTrendData[] {
  return rankingTrendData;
}

export function getSwordRankingById(swordId: string): SwordRankingMetrics | undefined {
  return swordRankings.find(s => s.swordId === swordId);
}

export function getRankingCalculationDetail(swordId: string): RankingCalculationDetail | null {
  return getSwordRankingCalculationDetail(swordId);
}

export function getTopRankings(dimension: string = 'comprehensive', limit: number = 3): SwordRankingMetrics[] {
  const sorted = sortRankings(swordRankings, dimension, 'desc');
  return sorted.slice(0, limit);
}

export function getRankingOverviewStats(): {
  totalSwords: number;
  avgComprehensiveScore: number;
  highestScore: number;
  lowestScore: number;
  byDynasty: Record<string, number>;
  trendingUp: number;
  trendingDown: number;
  stable: number;
  lastUpdated: string;
} {
  const totalSwords = swordRankings.length;
  const scores = swordRankings.map(s => s.comprehensiveScore);
  const avgComprehensiveScore = Number((scores.reduce((a, b) => a + b, 0) / totalSwords).toFixed(2));
  const highestScore = Math.max(...scores);
  const lowestScore = Math.min(...scores);

  const byDynasty: Record<string, number> = {};
  swordRankings.forEach(s => {
    byDynasty[s.dynasty] = (byDynasty[s.dynasty] || 0) + 1;
  });

  const trendingUp = swordRankings.filter(s => s.trend === 'up').length;
  const trendingDown = swordRankings.filter(s => s.trend === 'down').length;
  const stable = swordRankings.filter(s => s.trend === 'stable').length;

  const lastUpdated = swordRankings[0]?.lastUpdated || new Date().toISOString();

  return {
    totalSwords,
    avgComprehensiveScore,
    highestScore,
    lowestScore,
    byDynasty,
    trendingUp,
    trendingDown,
    stable,
    lastUpdated,
  };
}
