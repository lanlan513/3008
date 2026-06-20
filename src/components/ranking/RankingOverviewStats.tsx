import { Crown, TrendingUp, TrendingDown, Minus, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RankingOverviewStatsProps {
  stats: {
    totalSwords: number;
    avgComprehensiveScore: number;
    highestScore: number;
    lowestScore: number;
    byDynasty: Record<string, number>;
    trendingUp: number;
    trendingDown: number;
    stable: number;
    lastUpdated: string;
  };
}

export default function RankingOverviewStats({ stats }: RankingOverviewStatsProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div className="ink-card p-5 animate-fade-in-up">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cinnabar-500 to-gold-500 flex items-center justify-center">
            <Crown className="w-6 h-6 text-ink-100" />
          </div>
          <div>
            <p className="text-xs text-ink-500 font-song">收录名剑</p>
            <p className="font-brush text-3xl text-ink-900">{stats.totalSwords}</p>
          </div>
        </div>
        <div className="text-xs text-ink-400 font-song">
          数据更新：{formatDate(stats.lastUpdated)}
        </div>
      </div>

      <div className="ink-card p-5 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-ink-100" />
          </div>
          <div>
            <p className="text-xs text-ink-500 font-song">平均综合评分</p>
            <p className="font-brush text-3xl text-gold-600">{stats.avgComprehensiveScore.toFixed(2)}</p>
          </div>
        </div>
        <div className="flex items-center justify-between text-xs font-song">
          <span className="text-ink-400">最高：<span className="text-cinnabar-600">{stats.highestScore}</span></span>
          <span className="text-ink-400">最低：<span className="text-ink-600">{stats.lowestScore}</span></span>
        </div>
      </div>

      <div className="ink-card p-5 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-ink-100" />
          </div>
          <div>
            <p className="text-xs text-ink-500 font-song">排名上升</p>
            <p className="font-brush text-3xl text-emerald-600">{stats.trendingUp}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {[...Array(Math.min(stats.trendingUp, 5))].map((_, i) => (
            <TrendingUp key={i} className="w-4 h-4 text-emerald-500" />
          ))}
        </div>
      </div>

      <div className="ink-card p-5 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-ink-400 to-ink-600 flex items-center justify-center">
            <Minus className="w-6 h-6 text-ink-100" />
          </div>
          <div>
            <p className="text-xs text-ink-500 font-song">排名稳定</p>
            <p className="font-brush text-3xl text-ink-600">{stats.stable}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-xs text-cinnabar-600 font-song">
            <TrendingDown className="w-3 h-3" />
            {stats.trendingDown} 下降
          </span>
        </div>
      </div>

      <div className="ink-card p-5 md:col-span-2 lg:col-span-4 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
        <h4 className="font-brush text-lg text-ink-900 mb-3">各朝代分布</h4>
        <div className="flex flex-wrap gap-2">
          {Object.entries(stats.byDynasty).map(([dynasty, count]) => (
            <div
              key={dynasty}
              className={cn(
                'px-4 py-2 rounded flex items-center gap-2',
                count >= 5 ? 'bg-cinnabar-50 text-cinnabar-700' :
                count >= 3 ? 'bg-gold-50 text-gold-700' :
                'bg-ink-50 text-ink-700'
              )}
            >
              <span className="font-song text-sm">{dynasty}</span>
              <span className="font-brush text-lg">{count}</span>
              <span className="text-xs opacity-60">柄</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
