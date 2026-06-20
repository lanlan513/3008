import { Building2, TrendingUp, Shield, Eye, MapPin, Archive } from 'lucide-react';
import type { MuseumOverviewStats, PreservationStatus } from '@/types';
import { cn } from '@/lib/utils';

const STATUS_COLORS: Record<PreservationStatus, string> = {
  '完好保存': 'bg-emerald-500',
  '部分残损': 'bg-gold-500',
  '严重残损': 'bg-cinnabar-500',
  '修复中': 'bg-bronze-500',
  '复制展示': 'bg-ink-500',
  '下落不明': 'bg-purple-500',
  '已损毁': 'bg-red-500',
};

interface OverviewStatsCardProps {
  stats: MuseumOverviewStats;
}

export default function OverviewStatsCard({ stats }: OverviewStatsCardProps) {
  const totalPreserved = Object.entries(stats.byPreservationStatus).reduce(
    (sum, [, count]) => sum + count,
    0
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="ink-card p-5 hover:shadow-ink transition-shadow animate-fade-in-up">
          <div className="flex items-center justify-between mb-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-lg">
              <Archive className="w-5 h-5 text-ink-100" />
            </div>
            <span className="text-xs text-gold-600 font-song bg-gold-50 px-2 py-1">馆藏总览</span>
          </div>
          <div className="flex items-baseline gap-1 mb-1">
            <span className="font-brush text-4xl text-ink-900">{stats.totalCollections}</span>
            <span className="text-sm text-ink-500 font-song">柄</span>
          </div>
          <p className="text-xs text-ink-500 font-song">馆藏名剑总数</p>
        </div>

        <div className="ink-card p-5 hover:shadow-ink transition-shadow animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
          <div className="flex items-center justify-between mb-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cinnabar-400 to-cinnabar-600 flex items-center justify-center shadow-lg">
              <Building2 className="w-5 h-5 text-ink-100" />
            </div>
            <span className="text-xs text-cinnabar-600 font-song bg-cinnabar-50 px-2 py-1">收藏机构</span>
          </div>
          <div className="flex items-baseline gap-1 mb-1">
            <span className="font-brush text-4xl text-ink-900">{stats.totalInstitutions}</span>
            <span className="text-sm text-ink-500 font-song">家</span>
          </div>
          <p className="text-xs text-ink-500 font-song">合作收藏机构数</p>
        </div>

        <div className="ink-card p-5 hover:shadow-ink transition-shadow animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center justify-between mb-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg">
              <TrendingUp className="w-5 h-5 text-ink-100" />
            </div>
            <span className="text-xs text-emerald-600 font-song bg-emerald-50 px-2 py-1">保存状况</span>
          </div>
          <div className="flex items-baseline gap-1 mb-1">
            <span className="font-brush text-4xl text-emerald-600">{stats.overallIntactRate}</span>
            <span className="text-sm text-ink-500 font-song">%</span>
          </div>
          <p className="text-xs text-ink-500 font-song">整体完好率</p>
        </div>

        <div className="ink-card p-5 hover:shadow-ink transition-shadow animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
          <div className="flex items-center justify-between mb-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-bronze-400 to-bronze-600 flex items-center justify-center shadow-lg">
              <Eye className="w-5 h-5 text-ink-100" />
            </div>
            <span className="text-xs text-bronze-600 font-song bg-bronze-50 px-2 py-1">公开展出</span>
          </div>
          <div className="flex items-baseline gap-1 mb-1">
            <span className="font-brush text-4xl text-ink-900">{stats.displayedCount}</span>
            <span className="text-sm text-ink-500 font-song">柄</span>
          </div>
          <p className="text-xs text-ink-500 font-song">
            展出比例 {stats.totalCollections > 0 ? Math.round((stats.displayedCount / stats.totalCollections) * 100) : 0}%
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="ink-card p-6 animate-fade-in-up">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-5 h-5 text-cinnabar-600" />
            <h3 className="font-brush text-xl text-ink-900">保存状态分布</h3>
          </div>
          <div className="space-y-3">
            {(Object.entries(stats.byPreservationStatus) as [PreservationStatus, number][])
              .filter(([, count]) => count > 0)
              .sort((a, b) => b[1] - a[1])
              .map(([status, count]) => {
                const percent = Math.round((count / totalPreserved) * 100);
                return (
                  <div key={status}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-song text-ink-700">{status}</span>
                      <span className="text-sm font-brush text-ink-900">{count}柄 ({percent}%)</span>
                    </div>
                    <div className="h-2.5 bg-ink-100 rounded-full overflow-hidden">
                      <div
                        className={cn('h-full rounded-full transition-all duration-1000', STATUS_COLORS[status])}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        <div className="ink-card p-6 animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
          <div className="flex items-center gap-3 mb-4">
            <MapPin className="w-5 h-5 text-emerald-600" />
            <h3 className="font-brush text-xl text-ink-900">地区分布</h3>
          </div>
          <div className="space-y-3">
            {Object.entries(stats.byRegion)
              .sort((a, b) => b[1] - a[1])
              .map(([region, count]) => {
                const percent = Math.round((count / stats.totalCollections) * 100);
                return (
                  <div key={region}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-song text-ink-700">{region}</span>
                      <span className="text-sm font-brush text-ink-900">{count}柄 ({percent}%)</span>
                    </div>
                    <div className="h-2.5 bg-ink-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-1000"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}
