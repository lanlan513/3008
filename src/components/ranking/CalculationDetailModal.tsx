import { useState, useEffect } from 'react';
import { X, Calculator, BookOpen, Info } from 'lucide-react';
import type { RankingCalculationDetail } from '../../types';
import { swordRankingApi } from '../../api';
import { cn } from '@/lib/utils';

interface CalculationDetailModalProps {
  swordId: string | null;
  onClose: () => void;
}

const DIMENSION_LABELS: Record<string, string> = {
  historicalInfluence: '历史影响力',
  citationCount: '文献引用',
  heritageLength: '传承长度',
  relatedFigures: '关联人物',
};

const DIMENSION_COLORS: Record<string, { bar: string; text: string; bg: string }> = {
  historicalInfluence: { bar: 'bg-gradient-to-r from-ink-600 to-ink-400', text: 'text-ink-700', bg: 'bg-ink-50' },
  citationCount: { bar: 'bg-gradient-to-r from-bronze-600 to-bronze-400', text: 'text-bronze-700', bg: 'bg-bronze-50' },
  heritageLength: { bar: 'bg-gradient-to-r from-emerald-600 to-emerald-400', text: 'text-emerald-700', bg: 'bg-emerald-50' },
  relatedFigures: { bar: 'bg-gradient-to-r from-blue-600 to-blue-400', text: 'text-blue-700', bg: 'bg-blue-50' },
};

export default function CalculationDetailModal({ swordId, onClose }: CalculationDetailModalProps) {
  const [detail, setDetail] = useState<RankingCalculationDetail | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (swordId) {
      setLoading(true);
      swordRankingApi.getCalculationDetail(swordId)
        .then(data => setDetail(data))
        .catch(error => console.error('Failed to fetch calculation detail:', error))
        .finally(() => setLoading(false));
    } else {
      setDetail(null);
    }
  }, [swordId]);

  if (!swordId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-ink-900/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-ink-100 rounded-lg shadow-2xl animate-fade-in-up">
        <div className="sticky top-0 z-10 bg-ink-100 border-b border-ink-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Calculator className="w-6 h-6 text-cinnabar-600" />
            <h2 className="font-brush text-2xl text-ink-900">
              {detail ? `${detail.swordName} - 评分计算依据` : '评分计算依据'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-ink-400 hover:text-ink-600 hover:bg-ink-200 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-3 border-cinnabar-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : detail ? (
            <div className="space-y-6">
              <div className="ink-card p-6 bg-gradient-to-br from-cinnabar-50 to-gold-50">
                <div className="flex items-center gap-2 mb-4">
                  <Info className="w-5 h-5 text-cinnabar-600" />
                  <h3 className="font-brush text-xl text-ink-900">计算公式</h3>
                </div>
                <p className="font-song text-ink-700 bg-ink-100/80 p-4 rounded-lg border border-ink-200">
                  {detail.calculationFormula}
                </p>
                <div className="mt-4 grid grid-cols-4 gap-3">
                  <div className="text-center p-2 bg-ink-50 rounded">
                    <div className="font-brush text-xl text-ink-900">35%</div>
                    <div className="text-xs text-ink-500 font-song">历史影响</div>
                  </div>
                  <div className="text-center p-2 bg-ink-50 rounded">
                    <div className="font-brush text-xl text-ink-900">30%</div>
                    <div className="text-xs text-ink-500 font-song">文献引用</div>
                  </div>
                  <div className="text-center p-2 bg-ink-50 rounded">
                    <div className="font-brush text-xl text-ink-900">20%</div>
                    <div className="text-xs text-ink-500 font-song">传承长度</div>
                  </div>
                  <div className="text-center p-2 bg-ink-50 rounded">
                    <div className="font-brush text-xl text-ink-900">15%</div>
                    <div className="text-xs text-ink-500 font-song">关联人物</div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-brush text-xl text-ink-900 flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-bronze-600" />
                  各维度评分详情
                </h3>

                {detail.dimensions.map((dim, index) => {
                  const color = DIMENSION_COLORS[dim.dimension];
                  return (
                    <div key={dim.dimension} className="ink-card p-5 animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className={cn('font-brush text-lg', color.text)}>
                            {DIMENSION_LABELS[dim.dimension]}
                          </h4>
                          <p className="text-xs text-ink-500 font-song mt-1">权重：{(dim.weight * 100).toFixed(0)}%</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-baseline gap-1">
                            <span className="font-brush text-2xl text-ink-900">{dim.score}</span>
                            <span className="text-xs text-ink-500 font-song">原始分</span>
                          </div>
                          <div className="flex items-baseline gap-1 text-ink-500">
                            <span className="font-song text-sm">→ {dim.normalizedScore}</span>
                            <span className="text-xs">归一化</span>
                            <span className="font-song text-sm">× {dim.weight} =</span>
                            <span className="font-brush text-lg text-cinnabar-600 ml-1">{dim.weightedScore.toFixed(4)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="relative h-8 bg-ink-100 rounded-full overflow-hidden mb-3">
                        <div
                          className={cn('absolute top-0 bottom-0 left-0 transition-all duration-700', color.bar)}
                          style={{ width: `${dim.normalizedScore}%` }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-xs font-song text-ink-900 mix-blend-multiply">
                            归一化得分：{dim.normalizedScore.toFixed(2)} / 100
                          </span>
                        </div>
                      </div>

                      <p className="text-sm text-ink-600 font-song leading-relaxed">
                        {dim.description}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="ink-card p-6 bg-gradient-to-br from-gold-50 to-cinnabar-50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-brush text-xl text-ink-900">综合评分计算</h3>
                  <div className="text-right">
                    <div className="text-xs text-ink-500 font-song mb-1">加权总分</div>
                    <div className="font-brush text-3xl text-cinnabar-600">{detail.totalWeightedScore.toFixed(4)}</div>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2 mb-4">
                  {detail.dimensions.map((dim, index) => (
                    <div key={dim.dimension} className="flex items-center">
                      {index > 0 && <span className="text-ink-400 mx-2">+</span>}
                      <div className={cn('px-3 py-1 rounded text-sm font-song font-bold', DIMENSION_COLORS[dim.dimension].bg, DIMENSION_COLORS[dim.dimension].text)}>
                        {dim.weightedScore.toFixed(4)}
                      </div>
                    </div>
                  ))}
                  <span className="text-ink-600 mx-2">=</span>
                  <div className="px-4 py-2 bg-cinnabar-600 text-ink-100 rounded font-brush text-xl">
                    {detail.finalScore.toFixed(2)}
                  </div>
                </div>

                <div className="text-center">
                  <div className="relative h-12 bg-ink-200 rounded-full overflow-hidden">
                    <div
                      className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-cinnabar-600 via-gold-500 to-cinnabar-600 transition-all duration-1000"
                      style={{ width: `${detail.finalScore}%` }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="font-brush text-3xl text-ink-900 mix-blend-multiply">
                        最终得分：{detail.finalScore.toFixed(2)} / 100
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="ink-card p-5">
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen className="w-5 h-5 text-ink-600" />
                  <h3 className="font-brush text-xl text-ink-900">数据来源</h3>
                </div>
                <ul className="space-y-2">
                  {detail.dataSources.map((source, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-ink-400 mt-2 flex-shrink-0" />
                      <span className="font-song text-sm text-ink-600">{source}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="font-song text-ink-500">未找到计算详情</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
