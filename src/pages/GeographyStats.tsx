import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart3,
  PieChart,
  TrendingUp,
  Map as MapIcon,
  Building2,
  Sword,
  Users,
  Calendar,
  ArrowLeft,
  ChevronRight,
  Trophy,
  Flame,
  Target,
  Sparkles,
} from 'lucide-react';
import { mapApi } from '../api';
import type { RegionStats, DynastyGeoStats, MapLocation, HistoricalEvent } from '../types';
import { cn } from '@/lib/utils';

export default function GeographyStats() {
  const [regionStats, setRegionStats] = useState<RegionStats[]>([]);
  const [dynastyStats, setDynastyStats] = useState<DynastyGeoStats[]>([]);
  const [locations, setLocations] = useState<MapLocation[]>([]);
  const [events, setEvents] = useState<HistoricalEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'region' | 'dynasty' | 'overview'>('overview');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [regions, dynasties, locs, evts] = await Promise.all([
          mapApi.getRegionStats(),
          mapApi.getDynastyGeoStats(),
          mapApi.getAllLocations(),
          mapApi.getAllHistoricalEvents(),
        ]);
        setRegionStats(regions);
        setDynastyStats(dynasties);
        setLocations(locs);
        setEvents(evts);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalSects = regionStats.reduce((s, r) => s + r.sectCount, 0);
  const totalSwords = regionStats.reduce((s, r) => s + r.swordCount, 0);
  const totalEvents = regionStats.reduce((s, r) => s + r.eventCount, 0);
  const totalSwordsmen = regionStats.reduce((s, r) => s + r.swordsmanCount, 0);
  const totalScore = regionStats.reduce((s, r) => s + r.totalScore, 0);

  const maxRegionScore = Math.max(...regionStats.map((r) => r.totalScore), 1);
  const maxRegionSects = Math.max(...regionStats.map((r) => r.sectCount), 1);
  const maxRegionSwords = Math.max(...regionStats.map((r) => r.swordCount), 1);
  const maxRegionEvents = Math.max(...regionStats.map((r) => r.eventCount), 1);

  const maxDynastyEvents = Math.max(...dynastyStats.map((d) => d.eventCount), 1);

  const getRegionRankColor = (index: number) => {
    if (index === 0) return 'from-gold-400 to-gold-600';
    if (index === 1) return 'from-ink-400 to-ink-600';
    if (index === 2) return 'from-bronze-400 to-bronze-600';
    return 'from-ink-200 to-ink-300';
  };

  const getRegionRankBadge = (index: number) => {
    if (index === 0) return { icon: Trophy, color: 'text-gold-600', label: '榜首' };
    if (index === 1) return { icon: Sparkles, color: 'text-ink-600', label: '次席' };
    if (index === 2) return { icon: Flame, color: 'text-bronze-600', label: '三甲' };
    return null;
  };

  const getDynastyEvents = (dynasty: string) =>
    events.filter((e) => e.dynasty === dynasty);

  const overviewCards = [
    {
      icon: MapIcon,
      label: '覆盖地域',
      value: regionStats.length,
      suffix: '个',
      color: 'text-cinnabar-600',
      bgColor: 'from-cinnabar-50 to-cinnabar-100',
      borderColor: 'border-cinnabar-200',
    },
    {
      icon: Building2,
      label: '武林门派',
      value: totalSects,
      suffix: '派',
      color: 'text-bronze-600',
      bgColor: 'from-bronze-50 to-bronze-100',
      borderColor: 'border-bronze-200',
    },
    {
      icon: Sword,
      label: '名剑出世',
      value: totalSwords,
      suffix: '柄',
      color: 'text-gold-600',
      bgColor: 'from-gold-50 to-gold-100',
      borderColor: 'border-gold-200',
    },
    {
      icon: Calendar,
      label: '历史事件',
      value: totalEvents,
      suffix: '件',
      color: 'text-ink-700',
      bgColor: 'from-ink-50 to-ink-100',
      borderColor: 'border-ink-200',
    },
    {
      icon: Users,
      label: '江湖人物',
      value: totalSwordsmen,
      suffix: '人',
      color: 'text-emerald-700',
      bgColor: 'from-emerald-50 to-emerald-100',
      borderColor: 'border-emerald-200',
    },
    {
      icon: Target,
      label: '综合热度',
      value: totalScore,
      suffix: '点',
      color: 'text-red-700',
      bgColor: 'from-red-50 to-red-100',
      borderColor: 'border-red-200',
    },
  ];

  return (
    <div className="min-h-screen bg-ink-100 pt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link
            to="/map"
            className="inline-flex items-center gap-2 text-ink-600 hover:text-cinnabar-600 font-song mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            返回江湖地图
          </Link>

          <div className="text-center mb-2">
            <div className="inline-flex items-center gap-3 mb-4">
              <BarChart3 className="w-8 h-8 text-gold-600" />
              <h1 className="font-brush text-5xl text-ink-900">江湖地理统计</h1>
            </div>
            <p className="font-song text-ink-600 max-w-2xl mx-auto">
              纵观千年江湖风云，解析武林地理脉络。名剑出自何地？门派兴于何方？一朝多少事，尽付图表中。
            </p>
          </div>
        </div>

        <div className="flex justify-center mb-8">
          <div className="inline-flex border border-ink-300 bg-ink-50">
            {(['overview', 'region', 'dynasty'] as const).map((tab) => {
              const isActive = activeTab === tab;
              const icons = {
                overview: PieChart,
                region: MapIcon,
                dynasty: Calendar,
              };
              const labels = {
                overview: '总览',
                region: '地域分析',
                dynasty: '朝代分析',
              };
              const Icon = icons[tab];
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    'flex items-center gap-2 px-6 py-3 font-song transition-all',
                    isActive
                      ? 'bg-gradient-to-b from-cinnabar-600 to-cinnabar-700 text-ink-100 shadow-brush'
                      : 'text-ink-600 hover:bg-ink-100'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {labels[tab]}
                </button>
              );
            })}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin w-10 h-10 border-4 border-cinnabar-500 border-t-transparent rounded-full" />
          </div>
        ) : (
          <>
            {activeTab === 'overview' && (
              <div className="space-y-8 animate-fade-in-up">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {overviewCards.map((card, index) => {
                    const Icon = card.icon;
                    return (
                      <div
                        key={card.label}
                        className={cn(
                          'ink-card p-4 bg-gradient-to-br border',
                          card.bgColor,
                          card.borderColor
                        )}
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        <div className={cn('w-10 h-10 rounded-full flex items-center justify-center mb-3', card.color)}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="font-song text-xs text-ink-500 mb-1">{card.label}</div>
                        <div className="flex items-baseline gap-1">
                          <span className={cn('font-brush text-3xl', card.color)}>{card.value}</span>
                          <span className="text-xs text-ink-500 font-song">{card.suffix}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="ink-card p-6">
                    <h3 className="font-brush text-2xl text-ink-900 mb-6 flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-gold-500" />
                      地域综合排行榜
                    </h3>
                    <div className="space-y-3">
                      {regionStats.slice(0, 5).map((region, index) => {
                        const rankBadge = getRegionRankBadge(index);
                        const percentage = (region.totalScore / maxRegionScore) * 100;
                        return (
                          <div key={region.region} className="group">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-3">
                                <div
                                  className={cn(
                                    'w-8 h-8 rounded-full bg-gradient-to-br flex items-center justify-center text-white font-brush text-sm',
                                    getRegionRankColor(index)
                                  )}
                                >
                                  {index + 1}
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-song font-bold text-ink-800">{region.region}</span>
                                    {rankBadge && (
                                      <span className={cn(
                                        'inline-flex items-center gap-1 text-xs',
                                        rankBadge.color
                                      )}>
                                        <rankBadge.icon className="w-3 h-3" />
                                        {rankBadge.label}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-brush text-xl text-cinnabar-600">{region.totalScore}</div>
                                <div className="text-xs text-ink-500 font-song">热度值</div>
                              </div>
                            </div>
                            <div className="h-3 bg-ink-100 rounded-full overflow-hidden">
                              <div
                                className={cn(
                                  'h-full bg-gradient-to-r rounded-full transition-all duration-700',
                                  getRegionRankColor(index)
                                )}
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <div className="flex justify-between mt-1 text-xs text-ink-400 font-song">
                              <span>门派 {region.sectCount} · 名剑 {region.swordCount}</span>
                              <span>事件 {region.eventCount} · 人物 {region.swordsmanCount}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="ink-card p-6">
                    <h3 className="font-brush text-2xl text-ink-900 mb-6 flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-cinnabar-500" />
                      朝代事件分布
                    </h3>
                    <div className="space-y-4">
                      {dynastyStats
                        .filter((d) => d.eventCount > 0)
                        .sort((a, b) => b.eventCount - a.eventCount)
                        .slice(0, 6)
                        .map((dynasty, index) => {
                          const percentage = (dynasty.eventCount / maxDynastyEvents) * 100;
                          const dynastyEvents = getDynastyEvents(dynasty.dynasty);
                          const topEvent = dynastyEvents.sort(
                            (a, b) =>
                              (b.significance === 'legendary' ? 4 : b.significance === 'major' ? 3 : b.significance === 'notable' ? 2 : 1) -
                              (a.significance === 'legendary' ? 4 : a.significance === 'major' ? 3 : a.significance === 'notable' ? 2 : 1)
                          )[0];
                          return (
                            <div key={dynasty.dynasty}>
                              <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-2">
                                  <span className="w-6 h-6 rounded bg-ink-800 text-ink-100 flex items-center justify-center text-xs font-brush">
                                    {index + 1}
                                  </span>
                                  <span className="font-song font-bold text-ink-800">{dynasty.dynasty}朝</span>
                                </div>
                                <div className="flex items-center gap-4 text-xs font-song text-ink-500">
                                  <span>名剑 {dynasty.swordCount}</span>
                                  <span>人物 {dynasty.swordsmanCount}</span>
                                  <span className="text-cinnabar-600 font-bold">
                                    {dynasty.eventCount} 事件
                                  </span>
                                </div>
                              </div>
                              <div className="h-4 bg-ink-100 overflow-hidden relative">
                                <div
                                  className="h-full bg-gradient-to-r from-cinnabar-400 to-cinnabar-600 transition-all duration-700"
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                              {topEvent && (
                                <div className="mt-2 p-2 bg-ink-50 border-l-2 border-cinnabar-400 text-xs font-song">
                                  <span className="text-cinnabar-700 font-bold">代表事件：</span>
                                  <span className="text-ink-700">{topEvent.title}</span>
                                </div>
                              )}
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </div>

                <div className="ink-card p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-brush text-2xl text-ink-900 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-gold-500" />
                      传奇事件一览
                    </h3>
                    <Link
                      to="/map"
                      className="inline-flex items-center gap-1 text-cinnabar-600 font-song hover:text-cinnabar-700 text-sm"
                    >
                      在地图上查看
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {events
                      .filter((e) => e.significance === 'legendary')
                      .map((event, index) => (
                        <div
                          key={event.id}
                          className="p-4 bg-gradient-to-br from-gold-50 to-cinnabar-50 border border-gold-200 hover:shadow-lg transition-all"
                          style={{ animationDelay: `${index * 0.1}s` }}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-brush text-xl text-ink-900">{event.title}</h4>
                            <span className="px-2 py-0.5 text-xs bg-gold-500 text-ink-100 font-song">
                              传奇
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-ink-500 font-song mb-3">
                            <Calendar className="w-3 h-3" />
                            {event.year} · {event.dynasty}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-ink-500 font-song mb-3">
                            <MapIcon className="w-3 h-3" />
                            {event.locationName}
                          </div>
                          <p className="text-sm text-ink-600 font-song leading-relaxed line-clamp-3">
                            {event.description}
                          </p>
                          {(event.relatedSwordIds.length > 0 || event.relatedSwordsmanIds.length > 0) && (
                            <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-ink-200">
                              {event.relatedSwordIds.length > 0 && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gold-100 text-gold-700 text-xs font-song">
                                  <Sword className="w-3 h-3" />
                                  {event.relatedSwordIds.length} 柄名剑
                                </span>
                              )}
                              {event.relatedSwordsmanIds.length > 0 && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-cinnabar-100 text-cinnabar-700 text-xs font-song">
                                  <Users className="w-3 h-3" />
                                  {event.relatedSwordsmanIds.length} 位豪杰
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'region' && (
              <div className="space-y-6 animate-fade-in-up">
                <div className="ink-card p-6">
                  <h3 className="font-brush text-2xl text-ink-900 mb-6 flex items-center gap-2">
                    <MapIcon className="w-6 h-6 text-bronze-600" />
                    各地域详细数据对比
                  </h3>

                  <div className="overflow-x-auto">
                    <table className="w-full font-song">
                      <thead>
                        <tr className="border-b-2 border-ink-300">
                          <th className="text-left py-3 px-4 text-ink-700">排名</th>
                          <th className="text-left py-3 px-4 text-ink-700">地域</th>
                          <th className="text-center py-3 px-4 text-ink-700">门派</th>
                          <th className="text-center py-3 px-4 text-ink-700">名剑</th>
                          <th className="text-center py-3 px-4 text-ink-700">事件</th>
                          <th className="text-center py-3 px-4 text-ink-700">人物</th>
                          <th className="text-right py-3 px-4 text-ink-700">综合热度</th>
                        </tr>
                      </thead>
                      <tbody>
                        {regionStats.map((region, index) => (
                          <tr
                            key={region.region}
                            className="border-b border-ink-200 hover:bg-ink-50 transition-colors"
                          >
                            <td className="py-3 px-4">
                              <span
                                className={cn(
                                  'inline-flex w-7 h-7 items-center justify-center rounded-full text-sm font-brush',
                                  index < 3
                                    ? `bg-gradient-to-br ${getRegionRankColor(index)} text-white`
                                    : 'bg-ink-200 text-ink-600'
                                )}
                              >
                                {index + 1}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <span className="font-bold text-ink-800 text-lg">{region.region}</span>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <div className="inline-flex flex-col items-center">
                                <span className="font-brush text-xl text-bronze-700">{region.sectCount}</span>
                                <div className="w-16 h-1.5 bg-ink-100 mt-1">
                                  <div
                                    className="h-full bg-bronze-500"
                                    style={{ width: `${(region.sectCount / maxRegionSects) * 100}%` }}
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <div className="inline-flex flex-col items-center">
                                <span className="font-brush text-xl text-gold-700">{region.swordCount}</span>
                                <div className="w-16 h-1.5 bg-ink-100 mt-1">
                                  <div
                                    className="h-full bg-gold-500"
                                    style={{ width: `${(region.swordCount / maxRegionSwords) * 100}%` }}
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <div className="inline-flex flex-col items-center">
                                <span className="font-brush text-xl text-cinnabar-700">{region.eventCount}</span>
                                <div className="w-16 h-1.5 bg-ink-100 mt-1">
                                  <div
                                    className="h-full bg-cinnabar-500"
                                    style={{ width: `${(region.eventCount / maxRegionEvents) * 100}%` }}
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <span className="font-brush text-xl text-emerald-700">{region.swordsmanCount}</span>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <span className="font-brush text-2xl text-cinnabar-600">{region.totalScore}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {regionStats.map((region, idx) => (
                    <div
                      key={region.region}
                      className="ink-card p-5"
                      style={{ animationDelay: `${idx * 0.05}s` }}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="font-brush text-2xl text-ink-900">{region.region}</h4>
                          <p className="text-xs text-ink-500 font-song mt-1">
                            综合热度：
                            <span className="font-brush text-lg text-cinnabar-600 ml-1">
                              {region.totalScore}
                            </span>
                          </p>
                        </div>
                        <Link
                          to={`/map?region=${encodeURIComponent(region.region)}`}
                          className="inline-flex items-center gap-1 text-sm text-bronze-600 font-song hover:text-bronze-700"
                        >
                          <MapIcon className="w-3 h-3" />
                          查看地图
                        </Link>
                      </div>

                      <div className="grid grid-cols-4 gap-2 mb-4">
                        <div className="p-3 bg-bronze-50 border border-bronze-200 text-center">
                          <Building2 className="w-4 h-4 mx-auto text-bronze-600 mb-1" />
                          <div className="font-brush text-xl text-bronze-700">{region.sectCount}</div>
                          <div className="text-xs text-ink-500 font-song">门派</div>
                        </div>
                        <div className="p-3 bg-gold-50 border border-gold-200 text-center">
                          <Sword className="w-4 h-4 mx-auto text-gold-600 mb-1" />
                          <div className="font-brush text-xl text-gold-700">{region.swordCount}</div>
                          <div className="text-xs text-ink-500 font-song">名剑</div>
                        </div>
                        <div className="p-3 bg-cinnabar-50 border border-cinnabar-200 text-center">
                          <Calendar className="w-4 h-4 mx-auto text-cinnabar-600 mb-1" />
                          <div className="font-brush text-xl text-cinnabar-700">{region.eventCount}</div>
                          <div className="text-xs text-ink-500 font-song">事件</div>
                        </div>
                        <div className="p-3 bg-emerald-50 border border-emerald-200 text-center">
                          <Users className="w-4 h-4 mx-auto text-emerald-600 mb-1" />
                          <div className="font-brush text-xl text-emerald-700">{region.swordsmanCount}</div>
                          <div className="text-xs text-ink-500 font-song">人物</div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {region.sectCount > 0 && (
                          <div>
                            <div className="flex justify-between text-xs font-song mb-1">
                              <span className="text-bronze-700">门派占比</span>
                              <span className="text-ink-500">
                                {maxRegionSects > 0 ? Math.round((region.sectCount / maxRegionSects) * 100) : 0}%
                              </span>
                            </div>
                            <div className="h-2 bg-ink-100 overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-bronze-400 to-bronze-600"
                                style={{
                                  width: `${maxRegionSects > 0 ? (region.sectCount / maxRegionSects) * 100 : 0}%`,
                                }}
                              />
                            </div>
                          </div>
                        )}
                        {region.swordCount > 0 && (
                          <div>
                            <div className="flex justify-between text-xs font-song mb-1">
                              <span className="text-gold-700">名剑占比</span>
                              <span className="text-ink-500">
                                {maxRegionSwords > 0 ? Math.round((region.swordCount / maxRegionSwords) * 100) : 0}%
                              </span>
                            </div>
                            <div className="h-2 bg-ink-100 overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-gold-400 to-gold-600"
                                style={{
                                  width: `${maxRegionSwords > 0 ? (region.swordCount / maxRegionSwords) * 100 : 0}%`,
                                }}
                              />
                            </div>
                          </div>
                        )}
                        {region.eventCount > 0 && (
                          <div>
                            <div className="flex justify-between text-xs font-song mb-1">
                              <span className="text-cinnabar-700">事件占比</span>
                              <span className="text-ink-500">
                                {maxRegionEvents > 0 ? Math.round((region.eventCount / maxRegionEvents) * 100) : 0}%
                              </span>
                            </div>
                            <div className="h-2 bg-ink-100 overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-cinnabar-400 to-cinnabar-600"
                                style={{
                                  width: `${maxRegionEvents > 0 ? (region.eventCount / maxRegionEvents) * 100 : 0}%`,
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="mt-4 pt-4 border-t border-ink-200">
                        <div className="flex flex-wrap gap-1.5">
                          {locations
                            .filter((l) => l.region === region.region)
                            .slice(0, 5)
                            .map((loc) => (
                              <span
                                key={loc.id}
                                className="inline-block px-2 py-1 bg-ink-50 border border-ink-200 text-xs font-song text-ink-600"
                              >
                                {loc.name}
                              </span>
                            ))}
                          {locations.filter((l) => l.region === region.region).length > 5 && (
                            <span className="inline-block px-2 py-1 text-xs font-song text-ink-400">
                              +{locations.filter((l) => l.region === region.region).length - 5} 更多
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'dynasty' && (
              <div className="space-y-6 animate-fade-in-up">
                <div className="ink-card p-6">
                  <h3 className="font-brush text-2xl text-ink-900 mb-6 flex items-center gap-2">
                    <Calendar className="w-6 h-6 text-cinnabar-600" />
                    朝代地理分布分析
                  </h3>
                  <div className="space-y-6">
                    {dynastyStats
                      .filter((d) => d.eventCount > 0 || d.swordCount > 0)
                      .sort((a, b) => b.eventCount + b.swordCount - (a.eventCount + a.swordCount))
                      .map((dynasty, idx) => {
                        const dynastyEvents = getDynastyEvents(dynasty.dynasty);
                        const topRegions = Object.entries(dynasty.regions)
                          .sort((a, b) => b[1] - a[1])
                          .slice(0, 3);
                        const totalRegionEvents = Object.values(dynasty.regions).reduce((s, n) => s + n, 0);
                        return (
                          <div
                            key={dynasty.dynasty}
                            className="p-5 bg-gradient-to-r from-ink-50 via-ink-100/50 to-ink-50 border border-ink-200 hover:border-cinnabar-300 transition-all"
                            style={{ animationDelay: `${idx * 0.05}s` }}
                          >
                            <div className="flex flex-col md:flex-row md:items-start gap-6">
                              <div className="flex-shrink-0 md:w-32 text-center md:text-left">
                                <div className="inline-block md:block px-6 py-2 bg-gradient-to-b from-ink-800 to-ink-900 text-ink-100">
                                  <span className="font-brush text-3xl">{dynasty.dynasty}</span>
                                </div>
                                <p className="text-xs text-ink-500 font-song mt-2 hidden md:block">朝代</p>
                              </div>

                              <div className="flex-1 grid grid-cols-3 gap-4">
                                <div className="text-center p-3 bg-white border border-ink-200">
                                  <Calendar className="w-5 h-5 mx-auto text-cinnabar-600 mb-2" />
                                  <div className="font-brush text-2xl text-cinnabar-700">{dynasty.eventCount}</div>
                                  <div className="text-xs text-ink-500 font-song">重大事件</div>
                                </div>
                                <div className="text-center p-3 bg-white border border-ink-200">
                                  <Sword className="w-5 h-5 mx-auto text-gold-600 mb-2" />
                                  <div className="font-brush text-2xl text-gold-700">{dynasty.swordCount}</div>
                                  <div className="text-xs text-ink-500 font-song">名剑出世</div>
                                </div>
                                <div className="text-center p-3 bg-white border border-ink-200">
                                  <Users className="w-5 h-5 mx-auto text-emerald-600 mb-2" />
                                  <div className="font-brush text-2xl text-emerald-700">{dynasty.swordsmanCount}</div>
                                  <div className="text-xs text-ink-500 font-song">传奇人物</div>
                                </div>
                              </div>
                            </div>

                            {topRegions.length > 0 && (
                              <div className="mt-5 pt-4 border-t border-ink-200">
                                <div className="flex items-center gap-2 mb-3">
                                  <MapIcon className="w-4 h-4 text-ink-500" />
                                  <span className="text-sm text-ink-600 font-song">地域分布</span>
                                </div>
                                <div className="flex flex-wrap gap-2 mb-4">
                                  {topRegions.map(([region, count]) => (
                                    <div
                                      key={region}
                                      className="px-3 py-2 bg-cinnabar-50 border border-cinnabar-200 flex items-center gap-2"
                                    >
                                      <span className="font-song font-bold text-ink-800">{region}</span>
                                      <span className="px-1.5 py-0.5 bg-cinnabar-600 text-ink-100 text-xs font-brush">
                                        {count}
                                      </span>
                                      <span className="text-xs text-ink-500 font-song">
                                        ({totalRegionEvents > 0 ? Math.round((count / totalRegionEvents) * 100) : 0}%)
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {dynastyEvents.length > 0 && (
                              <div className="mt-2">
                                <div className="flex items-center gap-2 mb-3">
                                  <TrendingUp className="w-4 h-4 text-ink-500" />
                                  <span className="text-sm text-ink-600 font-song">本朝大事记</span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  {dynastyEvents.slice(0, 4).map((evt) => (
                                    <div
                                      key={evt.id}
                                      className="p-3 bg-white border border-ink-200 border-l-4 border-l-cinnabar-500"
                                    >
                                      <div className="flex items-start justify-between mb-1">
                                        <h5 className="font-song font-bold text-ink-800 text-sm">
                                          {evt.title}
                                        </h5>
                                        <span
                                          className={cn(
                                            'px-1.5 py-0.5 text-xs font-song flex-shrink-0 ml-2',
                                            evt.significance === 'legendary'
                                              ? 'bg-gold-500 text-ink-100'
                                              : evt.significance === 'major'
                                              ? 'bg-cinnabar-500 text-ink-100'
                                              : evt.significance === 'notable'
                                              ? 'bg-bronze-500 text-ink-100'
                                              : 'bg-ink-300 text-ink-700'
                                          )}
                                        >
                                          {evt.significance === 'legendary'
                                            ? '传奇'
                                            : evt.significance === 'major'
                                            ? '重大'
                                            : evt.significance === 'notable'
                                            ? '显著'
                                            : '普通'}
                                        </span>
                                      </div>
                                      <div className="text-xs text-ink-500 font-song mb-2">
                                        {evt.year} · {evt.locationName}
                                      </div>
                                      <p className="text-xs text-ink-600 font-song line-clamp-2 leading-relaxed">
                                        {evt.description}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
