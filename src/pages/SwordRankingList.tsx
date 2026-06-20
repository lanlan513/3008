import { useEffect, useState, useCallback } from 'react';
import { Trophy, Filter, X, ChevronLeft, ChevronRight, Crown, Landmark, BookOpen, Clock, Users, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { swordRankingApi } from '../api';
import type { RankingDimension, RankingFilterParams, SwordRankingMetrics, RankingTrendData } from '../types';
import RankingCard from '../components/ranking/RankingCard';
import RankingTrendChart from '../components/ranking/RankingTrendChart';
import RankingOverviewStats from '../components/ranking/RankingOverviewStats';
import CalculationDetailModal from '../components/ranking/CalculationDetailModal';
import { cn } from '@/lib/utils';

const DYNASTIES = ['全部', '上古', '夏', '周', '春秋', '战国', '汉'];
const TRENDS = [
  { value: 'all', label: '全部', icon: Minus },
  { value: 'up', label: '上升', icon: TrendingUp },
  { value: 'down', label: '下降', icon: TrendingDown },
  { value: 'stable', label: '稳定', icon: Minus },
];

const DIMENSION_TABS: Array<{ dimension: RankingDimension; label: string; icon: typeof Crown; description: string }> = [
  { dimension: 'comprehensive', label: '综合排名', icon: Crown, description: '四大维度加权综合' },
  { dimension: 'historicalInfluence', label: '历史影响力', icon: Landmark, description: '重大事件与历史意义' },
  { dimension: 'citationCount', label: '文献引用', icon: BookOpen, description: '正史、学术与文学引用' },
  { dimension: 'heritageLength', label: '传承长度', icon: Clock, description: '铸造年代与流传时间' },
  { dimension: 'relatedFigures', label: '关联人物', icon: Users, description: '持有者与关联人物' },
];

export default function SwordRankingList() {
  const [rankings, setRankings] = useState<SwordRankingMetrics[]>([]);
  const [total, setTotal] = useState(0);
  const [trendData, setTrendData] = useState<RankingTrendData[]>([]);
  const [overviewStats, setOverviewStats] = useState<{
    totalSwords: number;
    avgComprehensiveScore: number;
    highestScore: number;
    lowestScore: number;
    byDynasty: Record<string, number>;
    trendingUp: number;
    trendingDown: number;
    stable: number;
    lastUpdated: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [trendLoading, setTrendLoading] = useState(true);
  const [filters, setFilters] = useState<RankingFilterParams>({
    page: 1,
    limit: 10,
    dimension: 'comprehensive',
    dynasty: undefined,
    trend: undefined,
    sortOrder: 'desc',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSwordId, setSelectedSwordId] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState('');

  const fetchRankings = useCallback(async () => {
    setLoading(true);
    try {
      const response = await swordRankingApi.getRankings(filters);
      setRankings(response.list);
      setTotal(response.total);
      setLastUpdated(response.lastUpdated);
    } catch (error) {
      console.error('Failed to fetch rankings:', error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchTrendData = useCallback(async () => {
    setTrendLoading(true);
    try {
      const data = await swordRankingApi.getTrendData();
      setTrendData(data);
    } catch (error) {
      console.error('Failed to fetch trend data:', error);
    } finally {
      setTrendLoading(false);
    }
  }, []);

  const fetchOverviewStats = useCallback(async () => {
    try {
      const stats = await swordRankingApi.getOverviewStats();
      setOverviewStats(stats);
    } catch (error) {
      console.error('Failed to fetch overview stats:', error);
    }
  }, []);

  useEffect(() => {
    fetchRankings();
  }, [fetchRankings]);

  useEffect(() => {
    fetchTrendData();
    fetchOverviewStats();
  }, [fetchTrendData, fetchOverviewStats]);

  const handleDimensionChange = (dimension: RankingDimension) => {
    setFilters(prev => ({
      ...prev,
      page: 1,
      dimension,
    }));
  };

  const handleFilterChange = (key: keyof RankingFilterParams, value: string | undefined) => {
    setFilters(prev => ({
      ...prev,
      page: 1,
      [key]: value === '全部' || value === 'all' ? undefined : value,
    }));
  };

  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setFilters({
      page: 1,
      limit: 10,
      dimension: 'comprehensive',
      dynasty: undefined,
      trend: undefined,
      sortOrder: 'desc',
    });
  };

  const totalPages = Math.ceil(total / (filters.limit || 10));
  const hasActiveFilters = filters.dynasty || filters.trend;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const currentDimension = DIMENSION_TABS.find(d => d.dimension === filters.dimension);

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="relative h-64 md:h-80 overflow-hidden mb-12">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url("https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=traditional%20chinese%20ink%20painting%20of%20ancient%20sword%20ranking%20scroll%2C%20golden%20crown%20and%20trophy%2C%20rising%20dragon%20and%20phoenix%2C%20imperial%20examination%20rankings%2C%20majestic%20and%20solemn%20atmosphere%2C%20gold%20and%20cinnabar%20tones&image_size=landscape_16_9")`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink-100/60 via-ink-100/80 to-ink-100" />

        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center">
          <div className="animate-fade-in-up">
            <div className="flex items-center gap-3 mb-3">
              <Trophy className="w-8 h-8 text-gold-500" />
              <h1 className="font-brush text-5xl md:text-6xl text-ink-900">名剑排行榜</h1>
            </div>
            <p className="font-song text-lg text-ink-600 max-w-xl ml-11">
              基于历史影响力、文献引用次数、传承长度和关联人物数量四大维度，<br />
              科学计算名剑综合影响力排名。
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {overviewStats && <RankingOverviewStats stats={overviewStats} />}

        <div className="mb-8 overflow-x-auto">
          <div className="flex gap-2 min-w-max pb-2">
            {DIMENSION_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = filters.dimension === tab.dimension;
              return (
                <button
                  key={tab.dimension}
                  onClick={() => handleDimensionChange(tab.dimension)}
                  className={cn(
                    'flex items-center gap-2 px-5 py-3 font-song transition-all border-2 whitespace-nowrap',
                    isActive
                      ? 'bg-cinnabar-600 text-ink-100 border-cinnabar-600 shadow-brush'
                      : 'bg-ink-50 text-ink-700 border-ink-200 hover:border-ink-400'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <div className="text-left">
                    <div className="font-bold">{tab.label}</div>
                    <div className={cn('text-[10px]', isActive ? 'text-ink-200' : 'text-ink-400')}>
                      {tab.description}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                'flex items-center gap-2 px-6 py-3 border-2 font-song transition-all',
                showFilters
                  ? 'bg-cinnabar-600 text-ink-100 border-cinnabar-600'
                  : 'bg-ink-50 text-ink-700 border-ink-200 hover:border-ink-400'
              )}
            >
              <Filter className="w-5 h-5" />
              筛选
            </button>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <span className="font-song text-sm text-ink-500">
              共 <span className="text-cinnabar-600 font-bold">{total}</span> 把名剑
            </span>
            {lastUpdated && (
              <span className="text-xs text-ink-400 font-song">
                更新于 {formatDate(lastUpdated)}
              </span>
            )}
          </div>
        </div>

        {showFilters && (
          <div className="ink-card p-6 mb-8 animate-ink-spread">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-brush text-xl text-ink-900">筛选条件</h3>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-cinnabar-600 font-song hover:text-cinnabar-700 transition-colors flex items-center gap-1"
                >
                  <X className="w-4 h-4" />
                  清除筛选
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-song text-sm text-ink-600 mb-2">朝代</label>
                <div className="flex flex-wrap gap-2">
                  {DYNASTIES.map((dynasty) => (
                    <button
                      key={dynasty}
                      onClick={() => handleFilterChange('dynasty', dynasty)}
                      className={cn(
                        'px-4 py-1.5 text-sm font-song transition-all',
                        (filters.dynasty === dynasty || (!filters.dynasty && dynasty === '全部'))
                          ? 'bg-cinnabar-600 text-ink-100'
                          : 'bg-ink-100 text-ink-700 hover:bg-ink-200'
                      )}
                    >
                      {dynasty}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-song text-sm text-ink-600 mb-2">排名趋势</label>
                <div className="flex flex-wrap gap-2">
                  {TRENDS.map((trend) => {
                    const Icon = trend.icon;
                    return (
                      <button
                        key={trend.value}
                        onClick={() => handleFilterChange('trend', trend.value)}
                        className={cn(
                          'px-4 py-1.5 text-sm font-song transition-all flex items-center gap-1.5',
                          (filters.trend === trend.value || (!filters.trend && trend.value === 'all'))
                            ? cn(
                                trend.value === 'up' ? 'bg-emerald-600 text-ink-100' :
                                trend.value === 'down' ? 'bg-cinnabar-600 text-ink-100' :
                                'bg-ink-600 text-ink-100'
                              )
                            : 'bg-ink-100 text-ink-700 hover:bg-ink-200'
                        )}
                      >
                        <Icon className={cn('w-4 h-4',
                          trend.value === 'up' && !filters.trend && 'text-emerald-600',
                          trend.value === 'down' && !filters.trend && 'text-cinnabar-600'
                        )} />
                        {trend.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {hasActiveFilters && (
          <div className="flex items-center gap-2 mb-6">
            <span className="text-sm text-ink-500 font-song">当前筛选：</span>
            {filters.dynasty && (
              <span className="seal-stamp text-xs">{filters.dynasty}</span>
            )}
            {filters.trend && (
              <span className={cn(
                'text-xs px-3 py-1 font-song text-ink-100',
                filters.trend === 'up' ? 'bg-emerald-600' :
                filters.trend === 'down' ? 'bg-cinnabar-600' :
                'bg-ink-600'
              )}>
                {filters.trend === 'up' ? '排名上升' :
                 filters.trend === 'down' ? '排名下降' : '排名稳定'}
              </span>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-48 bg-ink-50 animate-pulse rounded-lg" />
                ))}
              </div>
            ) : rankings.length > 0 ? (
              <>
                <div className="space-y-4">
                  {rankings.map((ranking, index) => (
                    <RankingCard
                      key={ranking.swordId}
                      ranking={ranking}
                      dimension={filters.dimension || 'comprehensive'}
                      onShowCalculation={setSelectedSwordId}
                      delay={index * 50}
                    />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-12">
                    <button
                      onClick={() => handlePageChange((filters.page || 1) - 1)}
                      disabled={(filters.page || 1) <= 1}
                      className="p-2 bg-ink-50 border border-ink-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-ink-100 transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    {[...Array(totalPages)].map((_, i) => {
                      const page = i + 1;
                      const isActive = page === filters.page;
                      const isNear = Math.abs(page - (filters.page || 1)) <= 2 || page === 1 || page === totalPages;

                      if (!isNear) {
                        if (Math.abs(page - (filters.page || 1)) === 3) {
                          return <span key={page} className="px-2 text-ink-400">...</span>;
                        }
                        return null;
                      }

                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={cn(
                            'w-10 h-10 font-song transition-all',
                            isActive
                              ? 'bg-cinnabar-600 text-ink-100 shadow-brush'
                              : 'bg-ink-50 border border-ink-200 hover:bg-ink-100'
                          )}
                        >
                          {page}
                        </button>
                      );
                    })}

                    <button
                      onClick={() => handlePageChange((filters.page || 1) + 1)}
                      disabled={(filters.page || 1) >= totalPages}
                      className="p-2 bg-ink-50 border border-ink-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-ink-100 transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20 ink-card">
                <Trophy className="w-16 h-16 text-ink-300 mx-auto mb-4" />
                <h3 className="font-brush text-2xl text-ink-600 mb-2">未找到符合条件的名剑</h3>
                <p className="font-song text-ink-500 mb-4">请尝试调整筛选条件</p>
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center gap-2 px-6 py-2 bg-cinnabar-600 text-ink-100 font-song hover:bg-cinnabar-700 transition-colors"
                >
                  清除所有筛选
                </button>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            {currentDimension && (
              <div className="ink-card p-5 mb-6 sticky top-24">
                <h3 className="font-brush text-xl text-ink-900 mb-4 flex items-center gap-2">
                  <currentDimension.icon className="w-5 h-5 text-cinnabar-600" />
                  {currentDimension.label}说明
                </h3>
                <p className="font-song text-sm text-ink-600 mb-4 leading-relaxed">
                  {currentDimension.description}
                </p>

                {filters.dimension === 'comprehensive' && (
                  <div className="space-y-3 mb-4">
                    <h4 className="font-song text-sm text-ink-700 font-bold">权重分配：</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-24 text-xs font-song text-ink-600">历史影响力</div>
                        <div className="flex-1 h-3 bg-ink-100 rounded-full overflow-hidden">
                          <div className="h-full w-[35%] bg-ink-600" />
                        </div>
                        <span className="w-10 text-xs font-song text-ink-600 text-right">35%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-24 text-xs font-song text-ink-600">文献引用</div>
                        <div className="flex-1 h-3 bg-ink-100 rounded-full overflow-hidden">
                          <div className="h-full w-[30%] bg-bronze-600" />
                        </div>
                        <span className="w-10 text-xs font-song text-ink-600 text-right">30%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-24 text-xs font-song text-ink-600">传承长度</div>
                        <div className="flex-1 h-3 bg-ink-100 rounded-full overflow-hidden">
                          <div className="h-full w-[20%] bg-emerald-600" />
                        </div>
                        <span className="w-10 text-xs font-song text-ink-600 text-right">20%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-24 text-xs font-song text-ink-600">关联人物</div>
                        <div className="flex-1 h-3 bg-ink-100 rounded-full overflow-hidden">
                          <div className="h-full w-[15%] bg-blue-600" />
                        </div>
                        <span className="w-10 text-xs font-song text-ink-600 text-right">15%</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-ink-200">
                  <p className="text-xs text-ink-400 font-song">
                    计算公式：综合评分 = (历史影响力 × 35%) + (文献引用 × 30%) + (传承长度 × 20%) + (关联人物 × 15%)
                  </p>
                </div>
              </div>
            )}

            {!trendLoading && trendData.length > 0 && (
              <div className="mt-6">
                <RankingTrendChart data={trendData} />
              </div>
            )}
          </div>
        </div>
      </div>

      <CalculationDetailModal
        swordId={selectedSwordId}
        onClose={() => setSelectedSwordId(null)}
      />
    </div>
  );
}
