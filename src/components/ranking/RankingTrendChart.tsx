import { useMemo, useState } from 'react';
import { TrendingUp, ChevronDown, ChevronUp } from 'lucide-react';
import type { RankingTrendData } from '../../types';
import { cn } from '@/lib/utils';

interface RankingTrendChartProps {
  data: RankingTrendData[];
}

const DIMENSION_COLORS: Record<string, { bar: string; text: string; bg: string }> = {
  comprehensive: { bar: 'bg-gradient-to-t from-cinnabar-600 to-gold-500', text: 'text-cinnabar-700', bg: 'bg-cinnabar-50' },
  historicalInfluence: { bar: 'bg-gradient-to-t from-ink-600 to-ink-400', text: 'text-ink-700', bg: 'bg-ink-50' },
  citationCount: { bar: 'bg-gradient-to-t from-bronze-600 to-bronze-400', text: 'text-bronze-700', bg: 'bg-bronze-50' },
  heritageLength: { bar: 'bg-gradient-to-t from-emerald-600 to-emerald-400', text: 'text-emerald-700', bg: 'bg-emerald-50' },
  relatedFigures: { bar: 'bg-gradient-to-t from-blue-600 to-blue-400', text: 'text-blue-700', bg: 'bg-blue-50' },
};

const DIMENSION_LABELS: Record<string, string> = {
  comprehensive: '综合评分',
  historicalInfluence: '历史影响力',
  citationCount: '文献引用',
  heritageLength: '传承长度',
  relatedFigures: '关联人物',
};

export default function RankingTrendChart({ data }: RankingTrendChartProps) {
  const [expandedDynasty, setExpandedDynasty] = useState<string | null>(null);
  const [selectedDimension, setSelectedDimension] = useState<string>('comprehensive');

  const maxScore = useMemo(() => {
    const scores = data.flatMap(d => [
      d.avgComprehensiveScore,
      d.avgHistoricalInfluence,
      d.avgCitationCount,
      d.avgHeritageLength,
      d.avgRelatedFigures,
    ]);
    return Math.max(...scores, 100);
  }, [data]);

  const getScoreForDimension = (item: RankingTrendData, dimension: string): number => {
    switch (dimension) {
      case 'historicalInfluence':
        return item.avgHistoricalInfluence;
      case 'citationCount':
        return item.avgCitationCount;
      case 'heritageLength':
        return item.avgHeritageLength;
      case 'relatedFigures':
        return item.avgRelatedFigures;
      case 'comprehensive':
      default:
        return item.avgComprehensiveScore;
    }
  };

  const color = DIMENSION_COLORS[selectedDimension];

  return (
    <div className="ink-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <TrendingUp className="w-6 h-6 text-cinnabar-600" />
          <h3 className="font-brush text-2xl text-ink-900">各朝代名剑评分趋势</h3>
        </div>

        <div className="flex gap-2">
          {Object.entries(DIMENSION_LABELS).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setSelectedDimension(key)}
              className={cn(
                'px-3 py-1 text-xs font-song transition-all',
                selectedDimension === key
                  ? cn(color.bg, color.text, 'font-bold')
                  : 'bg-ink-100 text-ink-500 hover:bg-ink-200'
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <div className="h-64 relative">
          <div className="absolute left-0 top-0 bottom-8 w-8 flex flex-col justify-between text-[10px] text-ink-400 font-song">
            <span>{maxScore.toFixed(0)}</span>
            <span>{(maxScore * 0.75).toFixed(0)}</span>
            <span>{(maxScore * 0.5).toFixed(0)}</span>
            <span>{(maxScore * 0.25).toFixed(0)}</span>
            <span>0</span>
          </div>

          <div className="ml-10 h-full flex items-end justify-around gap-2 pb-8 border-b border-l border-ink-200">
            {data.map((item, index) => {
              const score = getScoreForDimension(item, selectedDimension);
              const heightPercent = (score / maxScore) * 100;
              const isExpanded = expandedDynasty === item.dynasty;

              return (
                <div
                  key={item.dynasty}
                  className="flex-1 flex flex-col items-center gap-2"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div
                    className={cn(
                      'w-full max-w-16 rounded-t transition-all duration-500 cursor-pointer',
                      color.bar
                    )}
                    style={{ height: `${heightPercent}%` }}
                    onClick={() => setExpandedDynasty(isExpanded ? null : item.dynasty)}
                    title={`${item.dynasty}: ${score.toFixed(2)}分`}
                  />
                  <span className="font-brush text-sm text-ink-700">{item.dynasty}</span>
                </div>
              );
            })}
          </div>

          <div className="absolute bottom-0 left-10 right-0 flex justify-around">
            {data.map(item => (
              <div key={item.dynasty} className="text-[10px] text-ink-400 font-song">
                {item.swordCount}柄
              </div>
            ))}
          </div>
        </div>
        <p className="text-xs text-ink-400 font-song text-center mt-2">
          注：柱高表示该朝代名剑的平均评分，数字表示该朝代入选名剑数量
        </p>
      </div>

      <div className="space-y-2">
        {data.map((item) => {
          const isExpanded = expandedDynasty === item.dynasty;
          const comprehensiveScore = getScoreForDimension(item, selectedDimension);

          return (
            <div key={item.dynasty} className="animate-fade-in-up">
              <div
                className={cn(
                  'flex items-center gap-4 cursor-pointer p-3 rounded-lg transition-colors',
                  isExpanded ? 'bg-ink-50' : 'hover:bg-ink-50/50'
                )}
                onClick={() => setExpandedDynasty(isExpanded ? null : item.dynasty)}
              >
                <div className="w-14 flex-shrink-0">
                  <span className="font-brush text-lg text-ink-900">{item.dynasty}</span>
                </div>

                <div className="flex-1 relative h-6 bg-ink-100 rounded overflow-hidden">
                  <div
                    className={cn('absolute top-0 bottom-0 left-0 transition-all duration-500', color.bar)}
                    style={{ width: `${(comprehensiveScore / maxScore) * 100}%` }}
                  />
                </div>

                <div className="w-24 flex-shrink-0 text-right">
                  <span className="font-brush text-xl text-ink-900">{comprehensiveScore.toFixed(2)}</span>
                  <span className="text-xs text-ink-500 font-song ml-1">分</span>
                </div>

                <div className="w-16 flex-shrink-0 text-right text-xs text-ink-500 font-song">
                  {item.swordCount}柄
                </div>

                {isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-ink-400 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-ink-400 flex-shrink-0" />
                )}
              </div>

              {isExpanded && (
                <div className="mt-3 ml-18 grid grid-cols-2 md:grid-cols-5 gap-3 pb-2 animate-fade-in">
                  <div className="p-3 rounded border bg-cinnabar-50 border-cinnabar-200">
                    <div className="flex items-baseline gap-1 mb-1">
                      <span className="font-brush text-2xl text-cinnabar-700">{item.avgComprehensiveScore.toFixed(1)}</span>
                      <span className="text-xs font-song text-cinnabar-600">分</span>
                    </div>
                    <div className="text-xs font-song text-cinnabar-700">综合评分</div>
                  </div>
                  <div className="p-3 rounded border bg-ink-50 border-ink-200">
                    <div className="flex items-baseline gap-1 mb-1">
                      <span className="font-brush text-2xl text-ink-700">{item.avgHistoricalInfluence.toFixed(1)}</span>
                      <span className="text-xs font-song text-ink-600">分</span>
                    </div>
                    <div className="text-xs font-song text-ink-700">历史影响力</div>
                  </div>
                  <div className="p-3 rounded border bg-bronze-50 border-bronze-200">
                    <div className="flex items-baseline gap-1 mb-1">
                      <span className="font-brush text-2xl text-bronze-700">{item.avgCitationCount.toFixed(1)}</span>
                      <span className="text-xs font-song text-bronze-600">次</span>
                    </div>
                    <div className="text-xs font-song text-bronze-700">文献引用</div>
                  </div>
                  <div className="p-3 rounded border bg-emerald-50 border-emerald-200">
                    <div className="flex items-baseline gap-1 mb-1">
                      <span className="font-brush text-2xl text-emerald-700">{item.avgHeritageLength.toFixed(1)}</span>
                      <span className="text-xs font-song text-emerald-600">分</span>
                    </div>
                    <div className="text-xs font-song text-emerald-700">传承长度</div>
                  </div>
                  <div className="p-3 rounded border bg-blue-50 border-blue-200">
                    <div className="flex items-baseline gap-1 mb-1">
                      <span className="font-brush text-2xl text-blue-700">{item.avgRelatedFigures.toFixed(1)}</span>
                      <span className="text-xs font-song text-blue-600">人</span>
                    </div>
                    <div className="text-xs font-song text-blue-700">关联人物</div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
