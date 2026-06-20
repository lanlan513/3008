import { useMemo, useState } from 'react';
import { Shield, ChevronDown, ChevronUp } from 'lucide-react';
import type { DynastyPreservationStats, PreservationStatus } from '@/types';
import { cn } from '@/lib/utils';

const STATUS_STYLES: Record<PreservationStatus, { bg: string; text: string; bar: string }> = {
  '完好保存': { bg: 'bg-emerald-50', text: 'text-emerald-700', bar: 'bg-emerald-500' },
  '部分残损': { bg: 'bg-gold-50', text: 'text-gold-700', bar: 'bg-gold-500' },
  '严重残损': { bg: 'bg-cinnabar-50', text: 'text-cinnabar-700', bar: 'bg-cinnabar-500' },
  '修复中': { bg: 'bg-bronze-50', text: 'text-bronze-700', bar: 'bg-bronze-500' },
  '复制展示': { bg: 'bg-ink-50', text: 'text-ink-700', bar: 'bg-ink-500' },
  '下落不明': { bg: 'bg-purple-50', text: 'text-purple-700', bar: 'bg-purple-500' },
  '已损毁': { bg: 'bg-red-50', text: 'text-red-700', bar: 'bg-red-500' },
};

interface DynastyPreservationChartProps {
  stats: DynastyPreservationStats[];
}

export default function DynastyPreservationChart({ stats }: DynastyPreservationChartProps) {
  const [showDetail, setShowDetail] = useState<string | null>(null);
  const maxTotal = useMemo(() => Math.max(...stats.map(s => s.totalCount), 1), [stats]);

  const activeStatuses = useMemo(() => {
    const s = new Set<PreservationStatus>();
    stats.forEach(st => {
      (Object.keys(st.byStatus) as PreservationStatus[]).forEach(k => {
        if (st.byStatus[k] > 0) s.add(k);
      });
    });
    return Array.from(s);
  }, [stats]);

  return (
    <div className="ink-card p-6">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="w-6 h-6 text-cinnabar-600" />
        <h3 className="font-brush text-2xl text-ink-900">各朝代名剑保存情况</h3>
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        {activeStatuses.map(status => (
          <div key={status} className="flex items-center gap-2">
            <div className={cn('w-4 h-4 rounded-sm', STATUS_STYLES[status].bar)} />
            <span className={cn('text-xs font-song', STATUS_STYLES[status].text)}>{status}</span>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        {stats.map(dynastyStat => {
          const total = dynastyStat.totalCount;
          const isOpen = showDetail === dynastyStat.dynasty;
          let cumPercent = 0;

          return (
            <div key={dynastyStat.dynasty} className="animate-fade-in-up">
              <div
                className={cn(
                  'flex items-center gap-4 cursor-pointer p-3 rounded-lg transition-colors',
                  isOpen ? 'bg-ink-50' : 'hover:bg-ink-50/50'
                )}
                onClick={() => setShowDetail(isOpen ? null : dynastyStat.dynasty)}
              >
                <div className="w-14 flex-shrink-0">
                  <span className="font-brush text-lg text-ink-900">{dynastyStat.dynasty}</span>
                </div>

                <div className="flex-1 relative h-8 bg-ink-100 rounded overflow-hidden">
                  {activeStatuses.map(status => {
                    const count = dynastyStat.byStatus[status] || 0;
                    if (count === 0) return null;
                    const percent = (count / maxTotal) * 100;
                    const leftPercent = (cumPercent / maxTotal) * 100;
                    cumPercent += count;
                    return (
                      <div
                        key={status}
                        className={cn('absolute top-0 bottom-0 transition-all duration-500', STATUS_STYLES[status].bar)}
                        style={{ left: `${leftPercent}%`, width: `${percent}%` }}
                        title={`${status}: ${count}柄`}
                      />
                    );
                  })}
                </div>

                <div className="w-28 flex-shrink-0 text-right space-y-0.5">
                  <div className="flex items-center justify-end gap-1">
                    <span className="font-brush text-xl text-ink-900">{total}</span>
                    <span className="text-xs text-ink-500 font-song">柄</span>
                  </div>
                  <div className="text-[10px] text-emerald-600 font-song">
                    完好率 {dynastyStat.intactRate}%
                  </div>
                </div>

                {isOpen ? (
                  <ChevronUp className="w-5 h-5 text-ink-400 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-ink-400 flex-shrink-0" />
                )}
              </div>

              {isOpen && (
                <div className="mt-3 ml-16 grid grid-cols-2 md:grid-cols-4 gap-3 pb-2 animate-fade-in">
                  {activeStatuses.map(status => {
                    const count = dynastyStat.byStatus[status] || 0;
                    if (count === 0) return null;
                    return (
                      <div
                        key={status}
                        className={cn('p-3 rounded border', STATUS_STYLES[status].bg, STATUS_STYLES[status].text, 'border-opacity-50')}
                      >
                        <div className="flex items-baseline gap-1 mb-1">
                          <span className="font-brush text-2xl">{count}</span>
                          <span className="text-xs font-song">柄</span>
                        </div>
                        <div className="text-xs font-song opacity-80">{status}</div>
                      </div>
                    );
                  })}
                  <div className="p-3 rounded border bg-emerald-50 border-emerald-200">
                    <div className="flex items-baseline gap-1 mb-1">
                      <span className="font-brush text-2xl">{dynastyStat.displayedCount}</span>
                      <span className="text-xs font-song text-emerald-700">柄</span>
                    </div>
                    <div className="text-xs font-song text-emerald-700">公开展出</div>
                  </div>
                  <div className="p-3 rounded border bg-gold-50 border-gold-200">
                    <div className="flex items-baseline gap-1 mb-1">
                      <span className="font-brush text-2xl">{dynastyStat.avgAuthenticity}</span>
                      <span className="text-xs font-song text-gold-700">/5.0</span>
                    </div>
                    <div className="text-xs font-song text-gold-700">平均真伪度</div>
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
