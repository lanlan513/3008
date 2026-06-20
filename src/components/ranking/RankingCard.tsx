import { Link } from 'react-router-dom';
import { TrendingUp, TrendingDown, Minus, Crown, Award, Medal, Info } from 'lucide-react';
import type { SwordRankingMetrics } from '../../types';
import { cn } from '@/lib/utils';

interface RankingCardProps {
  ranking: SwordRankingMetrics;
  dimension: string;
  onShowCalculation: (swordId: string) => void;
  delay?: number;
}

const RANK_STYLES = {
  1: { bg: 'bg-gradient-to-br from-gold-400 to-gold-600', border: 'border-gold-500', text: 'text-gold-700', icon: Crown },
  2: { bg: 'bg-gradient-to-br from-ink-300 to-ink-500', border: 'border-ink-400', text: 'text-ink-600', icon: Award },
  3: { bg: 'bg-gradient-to-br from-bronze-400 to-bronze-600', border: 'border-bronze-500', text: 'text-bronze-700', icon: Medal },
};

function getRankBadge(rank: number) {
  if (rank <= 3) {
    const style = RANK_STYLES[rank as keyof typeof RANK_STYLES];
    const Icon = style.icon;
    return (
      <div className={cn(
        'w-12 h-12 rounded-full flex items-center justify-center shadow-lg',
        style.bg
      )}>
        <Icon className="w-6 h-6 text-ink-100" />
      </div>
    );
  }
  return (
    <div className="w-12 h-12 rounded-full bg-ink-200 flex items-center justify-center border-2 border-ink-300">
      <span className="font-brush text-2xl text-ink-700">{rank}</span>
    </div>
  );
}

function getTrendIcon(trend: 'up' | 'down' | 'stable') {
  switch (trend) {
    case 'up':
      return <TrendingUp className="w-4 h-4 text-emerald-600" />;
    case 'down':
      return <TrendingDown className="w-4 h-4 text-cinnabar-600" />;
    case 'stable':
      return <Minus className="w-4 h-4 text-ink-500" />;
  }
}

function getScoreForDimension(ranking: SwordRankingMetrics, dimension: string): number {
  switch (dimension) {
    case 'historicalInfluence':
      return ranking.historicalInfluence;
    case 'citationCount':
      return ranking.citationCount;
    case 'heritageLength':
      return ranking.heritageLength;
    case 'relatedFigures':
      return ranking.relatedFiguresCount;
    case 'comprehensive':
    default:
      return ranking.comprehensiveScore;
  }
}

export default function RankingCard({ ranking, dimension, onShowCalculation, delay = 0 }: RankingCardProps) {
  const displayScore = getScoreForDimension(ranking, dimension);
  const rankStyle = ranking.rank <= 3 ? RANK_STYLES[ranking.rank as keyof typeof RANK_STYLES] : null;

  return (
    <div
      className={cn(
        'ink-card group animate-fade-in-up',
        rankStyle && cn('border-2', rankStyle.border)
      )}
      style={{ animationDelay: `${delay}ms`, opacity: 0 }}
    >
      <div className="p-4">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            {getRankBadge(ranking.rank)}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <Link
                  to={`/legendary-swords/${ranking.swordId}`}
                  className="font-brush text-xl text-ink-900 group-hover:text-cinnabar-600 transition-colors"
                >
                  {ranking.swordName}
                </Link>
                <span className="text-xs text-ink-500 font-song bg-ink-100 px-2 py-0.5">
                  {ranking.dynasty}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {getTrendIcon(ranking.trend)}
                  {ranking.rankChange !== 0 && (
                    <span className={cn(
                      'text-xs font-song',
                      ranking.trend === 'up' ? 'text-emerald-600' :
                      ranking.trend === 'down' ? 'text-cinnabar-600' : 'text-ink-500'
                    )}>
                      {ranking.rankChange > 0 ? `+${ranking.rankChange}` : ranking.rankChange}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => onShowCalculation(ranking.swordId)}
                  className="p-1.5 text-ink-400 hover:text-cinnabar-600 hover:bg-cinnabar-50 rounded transition-colors"
                  title="查看计算依据"
                >
                  <Info className="w-4 h-4" />
                </button>
              </div>
            </div>

            <p className="font-song text-xs text-ink-500 mb-3">「{ranking.swordAlias}」</p>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-song text-ink-600">综合评分</span>
                <span className="font-brush text-2xl text-cinnabar-600">{ranking.comprehensiveScore.toFixed(2)}</span>
              </div>

              <div className="h-2 bg-ink-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cinnabar-500 to-gold-500 transition-all duration-700 ease-out"
                  style={{ width: `${(ranking.comprehensiveScore / 100) * 100}%` }}
                />
              </div>

              <div className="grid grid-cols-4 gap-2 pt-2">
                <div className="text-center">
                  <div className="font-brush text-lg text-ink-900">{ranking.historicalInfluence}</div>
                  <div className="text-[10px] text-ink-500 font-song">历史影响</div>
                </div>
                <div className="text-center">
                  <div className="font-brush text-lg text-ink-900">{ranking.citationCount}</div>
                  <div className="text-[10px] text-ink-500 font-song">文献引用</div>
                </div>
                <div className="text-center">
                  <div className="font-brush text-lg text-ink-900">{ranking.heritageLength}</div>
                  <div className="text-[10px] text-ink-500 font-song">传承长度</div>
                </div>
                <div className="text-center">
                  <div className="font-brush text-lg text-ink-900">{ranking.relatedFiguresCount}</div>
                  <div className="text-[10px] text-ink-500 font-song">关联人物</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {dimension !== 'comprehensive' && (
          <div className="mt-4 pt-3 border-t border-ink-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-song text-ink-600">当前维度得分</span>
              <span className="font-brush text-xl text-bronze-600">{displayScore}</span>
            </div>
            <div className="h-1.5 bg-ink-200 rounded-full overflow-hidden mt-1">
              <div
                className="h-full bg-gradient-to-r from-bronze-500 to-bronze-600 transition-all duration-700 ease-out"
                style={{ width: `${(displayScore / (dimension === 'citationCount' ? 150 : 100)) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
