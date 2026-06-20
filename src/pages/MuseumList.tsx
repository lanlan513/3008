import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Filter, Grid3X3, ListFilter, X, ChevronLeft, ChevronRight,
  Building2, Shield, Calendar, MapPin
} from 'lucide-react';
import { museumApi } from '@/api';
import type {
  SwordCollection,
  MuseumOverviewStats,
  DynastyPreservationStats,
  MuseumFilterParams,
  CollectionInstitution,
} from '@/types';
import { cn } from '@/lib/utils';
import MuseumCollectionCard from '@/components/museum/MuseumCollectionCard';
import OverviewStatsCard from '@/components/museum/OverviewStatsCard';
import DynastyPreservationChart from '@/components/museum/DynastyPreservationChart';

export default function MuseumList() {
  const navigate = useNavigate();
  const [collections, setCollections] = useState<SwordCollection[]>([]);
  const [total, setTotal] = useState(0);
  const [overviewStats, setOverviewStats] = useState<MuseumOverviewStats | null>(null);
  const [dynastyStats, setDynastyStats] = useState<DynastyPreservationStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'chart'>('grid');

  const [page, setPage] = useState(1);
  const [limit] = useState(8);
  const [keyword, setKeyword] = useState('');
  const [filters, setFilters] = useState<MuseumFilterParams>({});
  const [showFilters, setShowFilters] = useState(false);
  const [availableFilters, setAvailableFilters] = useState<{
    dynasties: string[];
    regions: string[];
    preservationStatuses: string[];
    institutions: CollectionInstitution[];
  } | null>(null);

  const totalPages = Math.ceil(total / limit);

  useEffect(() => {
    const fetchInitial = async () => {
      setLoading(true);
      try {
        const [overviewData, dynastyData, filtersData] = await Promise.all([
          museumApi.getOverviewStats(),
          museumApi.getDynastyPreservationStats(),
          museumApi.getAvailableFilters(),
        ]);
        setOverviewStats(overviewData);
        setDynastyStats(dynastyData);
        setAvailableFilters(filtersData);
      } catch (error) {
        console.error('Failed to fetch museum data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchInitial();
  }, []);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const params: MuseumFilterParams = {
          ...filters,
          page,
          limit,
          keyword: keyword || undefined,
        };
        const res = await museumApi.getCollections(params);
        setCollections(res.list);
        setTotal(res.total);
      } catch (error) {
        console.error('Failed to fetch collections:', error);
      }
    };
    fetchCollections();
  }, [page, limit, keyword, filters]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  const updateFilter = (key: keyof MuseumFilterParams, value: any) => {
    setFilters(prev => {
      const next = { ...prev };
      if (value === undefined || value === '' || value === null) {
        delete next[key];
      } else {
        (next as any)[key] = value;
      }
      return next;
    });
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({});
    setKeyword('');
    setPage(1);
  };

  const filterCount = Object.keys(filters).filter(k => filters[k as keyof MuseumFilterParams] !== undefined).length;

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="relative h-[40vh] md:h-[45vh] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=ancient%20chinese%20museum%20hall%20interior%2C%20sword%20exhibition%20room%20with%20glass%20display%20cases%2C%20traditional%20palace%20architecture%2C%20soft%20spotlight%20lighting%2C%20bronze%20swords%20on%20velvet%20cushions%2C%20ink%20wash%20painting%20style&image_size=landscape_16_9)',
            filter: 'brightness(0.45) saturate(0.8)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-ink-900/30 to-ink-100" />

        <div className="relative h-full container mx-auto px-4 flex flex-col justify-end pb-10">
          <div className="animate-fade-in-up" style={{ animationFillMode: 'forwards', opacity: 0 }}>
            <div className="flex items-center gap-3 mb-4">
              <span className="seal-stamp bg-cinnabar-600/90 text-ink-100 text-sm px-3 py-1.5">
                名剑收藏馆
              </span>
              <span className="seal-stamp bg-ink-900/70 text-ink-100 text-sm px-3 py-1.5">
                Sword Museum
              </span>
            </div>
            <h1 className="font-brush text-5xl md:text-7xl text-ink-100 mb-3 text-shadow-ink">
              名剑收藏馆
            </h1>
            <p className="font-song text-lg md:text-xl text-ink-200 max-w-2xl leading-relaxed">
              模拟博物馆藏品管理模式，记录天下名剑的现存状态、收藏机构、发现地点与流转历史。
              以严谨的文物档案体例，为每一柄名剑建立完整的来源追踪系统。
            </p>
            {overviewStats && (
              <div className="flex flex-wrap gap-6 mt-6 text-ink-200">
                <div className="flex items-center gap-2">
                  <span className="font-brush text-3xl text-gold-400">{overviewStats.totalCollections}</span>
                  <span className="text-sm font-song">馆藏名剑</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-brush text-3xl text-gold-400">{overviewStats.totalInstitutions}</span>
                  <span className="text-sm font-song">收藏机构</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-brush text-3xl text-emerald-400">{overviewStats.overallIntactRate}%</span>
                  <span className="text-sm font-song">整体完好率</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-10">
        {loading && !overviewStats ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-ink-200 border-t-cinnabar-600 rounded-full animate-spin mb-4" />
            <p className="font-song text-ink-600">正在整理藏品档案...</p>
          </div>
        ) : (
          <div className="space-y-10">
            {overviewStats && <OverviewStatsCard stats={overviewStats} />}

            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex bg-ink-50 border border-ink-200 rounded overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={cn(
                      'px-4 py-2 flex items-center gap-2 font-song text-sm transition-colors',
                      viewMode === 'grid'
                        ? 'bg-cinnabar-600 text-ink-100'
                        : 'text-ink-600 hover:bg-ink-100'
                    )}
                  >
                    <Grid3X3 className="w-4 h-4" />
                    藏品列表
                  </button>
                  <button
                    onClick={() => setViewMode('chart')}
                    className={cn(
                      'px-4 py-2 flex items-center gap-2 font-song text-sm transition-colors',
                      viewMode === 'chart'
                        ? 'bg-cinnabar-600 text-ink-100'
                        : 'text-ink-600 hover:bg-ink-100'
                    )}
                  >
                    <ListFilter className="w-4 h-4" />
                    保存统计
                  </button>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto md:items-center">
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="搜索藏品名称、编号、材质..."
                    className="w-full md:w-80 pl-10 pr-4 py-2.5 border border-ink-200 bg-ink-50 font-song text-sm text-ink-800 placeholder:text-ink-400 focus:outline-none focus:border-cinnabar-500 focus:bg-ink-100 transition-all"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
                </form>

                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={cn(
                    'px-4 py-2.5 flex items-center gap-2 border font-song text-sm transition-all relative',
                    showFilters
                      ? 'bg-cinnabar-600 border-cinnabar-600 text-ink-100'
                      : 'bg-ink-50 border-ink-200 text-ink-600 hover:bg-ink-100'
                  )}
                >
                  <Filter className="w-4 h-4" />
                  筛选
                  {filterCount > 0 && (
                    <span className={cn(
                      'absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold',
                      showFilters ? 'bg-ink-100 text-cinnabar-600' : 'bg-cinnabar-600 text-ink-100'
                    )}>
                      {filterCount}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {showFilters && availableFilters && (
              <div className="ink-card p-6 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-song text-ink-700 mb-2">
                      <Calendar className="w-4 h-4 text-cinnabar-600" />
                      所属朝代
                    </label>
                    <select
                      value={filters.dynasty || ''}
                      onChange={(e) => updateFilter('dynasty', e.target.value || undefined)}
                      className="w-full px-3 py-2 border border-ink-200 bg-ink-50 font-song text-sm focus:outline-none focus:border-cinnabar-500"
                    >
                      <option value="">全部朝代</option>
                      {availableFilters.dynasties.map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-song text-ink-700 mb-2">
                      <Shield className="w-4 h-4 text-cinnabar-600" />
                      保存状态
                    </label>
                    <select
                      value={filters.preservationStatus || ''}
                      onChange={(e) => updateFilter('preservationStatus', (e.target.value as any) || undefined)}
                      className="w-full px-3 py-2 border border-ink-200 bg-ink-50 font-song text-sm focus:outline-none focus:border-cinnabar-500"
                    >
                      <option value="">全部状态</option>
                      {availableFilters.preservationStatuses.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-song text-ink-700 mb-2">
                      <Building2 className="w-4 h-4 text-cinnabar-600" />
                      收藏机构
                    </label>
                    <select
                      value={filters.institutionId || ''}
                      onChange={(e) => updateFilter('institutionId', e.target.value || undefined)}
                      className="w-full px-3 py-2 border border-ink-200 bg-ink-50 font-song text-sm focus:outline-none focus:border-cinnabar-500"
                    >
                      <option value="">全部机构</option>
                      {availableFilters.institutions.map(inst => (
                        <option key={inst.id} value={inst.id}>{inst.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-song text-ink-700 mb-2">
                      <MapPin className="w-4 h-4 text-cinnabar-600" />
                      所在地区
                    </label>
                    <select
                      value={filters.region || ''}
                      onChange={(e) => updateFilter('region', e.target.value || undefined)}
                      className="w-full px-3 py-2 border border-ink-200 bg-ink-50 font-song text-sm focus:outline-none focus:border-cinnabar-500"
                    >
                      <option value="">全部地区</option>
                      {availableFilters.regions.map(r => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-6 pt-4 border-t border-ink-100">
                  <p className="text-xs font-song text-ink-500">
                    {filterCount > 0 ? `已启用 ${filterCount} 项筛选条件` : '未启用筛选条件'}
                  </p>
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-song text-cinnabar-600 hover:text-cinnabar-700 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    清除所有筛选
                  </button>
                </div>
              </div>
            )}

            {viewMode === 'chart' ? (
              dynastyStats.length > 0 && <DynastyPreservationChart stats={dynastyStats} />
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <p className="font-song text-ink-600">
                    共找到 <span className="font-brush text-2xl text-cinnabar-600 mx-1">{total}</span> 件藏品
                  </p>
                </div>

                {collections.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {collections.map((col, idx) => (
                      <MuseumCollectionCard
                        key={col.id}
                        collection={col}
                        style={{ animationDelay: `${idx * 0.05}s` }}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20">
                    <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-ink-100 flex items-center justify-center">
                      <Search className="w-10 h-10 text-ink-300" />
                    </div>
                    <h3 className="font-brush text-2xl text-ink-700 mb-2">未找到相关藏品</h3>
                    <p className="font-song text-ink-500 mb-6">尝试调整搜索关键词或筛选条件</p>
                    <button
                      onClick={clearFilters}
                      className="px-5 py-2 bg-cinnabar-600 text-ink-100 font-song hover:bg-cinnabar-700 transition-colors"
                    >
                      清除筛选条件
                    </button>
                  </div>
                )}

                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-10">
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="p-2 border border-ink-200 text-ink-600 hover:bg-ink-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={cn(
                          'w-10 h-10 font-brush transition-all',
                          page === p
                            ? 'bg-cinnabar-600 text-ink-100 shadow-lg'
                            : 'border border-ink-200 text-ink-700 hover:bg-ink-50'
                        )}
                      >
                        {p}
                      </button>
                    ))}

                    <button
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="p-2 border border-ink-200 text-ink-600 hover:bg-ink-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
