import { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Calendar, Hammer, Crown, Gift, Sword as SwordIcon, Target, Eye, Award, MoreHorizontal, ChevronDown, ChevronUp } from 'lucide-react';
import type { SwordHeritage, SwordHolder } from '../../types';
import { cn } from '@/lib/utils';

const ACQUISITION_ICONS: Record<string, typeof Hammer> = {
  '铸造': Hammer,
  '继承': Crown,
  '赠与': Gift,
  '夺取': SwordIcon,
  '发现': Eye,
  '赏赐': Award,
  '其他': MoreHorizontal,
};

const ACQUISITION_COLORS: Record<string, string> = {
  '铸造': 'from-amber-500 to-amber-700',
  '继承': 'from-emerald-500 to-emerald-700',
  '赠与': 'from-pink-500 to-pink-700',
  '夺取': 'from-cinnabar-500 to-cinnabar-700',
  '发现': 'from-sky-500 to-sky-700',
  '赏赐': 'from-gold-500 to-gold-700',
  '其他': 'from-ink-500 to-ink-700',
};

const STATUS_COLORS: Record<string, string> = {
  '传世': 'text-emerald-600 bg-emerald-50 border-emerald-200',
  '失踪': 'text-ink-600 bg-ink-50 border-ink-200',
  '损毁': 'text-red-600 bg-red-50 border-red-200',
  '陪葬': 'text-bronze-600 bg-bronze-50 border-bronze-200',
  '化龙': 'text-gold-600 bg-gold-50 border-gold-200',
};

interface SwordHeritageChainProps {
  heritages: SwordHeritage[];
  currentSwordsmanId: string;
  currentSwordsmanName: string;
}

export default function SwordHeritageChain({
  heritages,
  currentSwordsmanId,
  currentSwordsmanName,
}: SwordHeritageChainProps) {
  const [expandedSword, setExpandedSword] = useState<string | null>(null);

  if (heritages.length === 0) {
    return (
      <div className="ink-card p-8 text-center animate-fade-in-up">
        <SwordIcon className="w-12 h-12 text-ink-300 mx-auto mb-4" />
        <p className="font-song text-ink-500">暂无传承记录</p>
      </div>
    );
  }

  const toggleExpand = (swordId: string) => {
    setExpandedSword(expandedSword === swordId ? null : swordId);
  };

  return (
    <div className="space-y-6">
      {heritages.map((heritage, index) => {
        const isExpanded = expandedSword === heritage.swordId;
        const currentHolderIndex = heritage.holders.findIndex(
          h => h.swordsmanId === currentSwordsmanId
        );

        return (
          <div
            key={heritage.swordId}
            className="ink-card p-6 animate-fade-in-up"
            style={{ animationDelay: `${0.3 + index * 0.1}s`, opacity: 0 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Link
                  to={`/swords/${heritage.swordId}`}
                  className="font-brush text-xl text-ink-900 hover:text-cinnabar-700 transition-colors"
                >
                  {heritage.swordName}
                </Link>
                <span className={cn(
                  'text-xs px-2 py-0.5 font-song border',
                  STATUS_COLORS[heritage.currentStatus] || STATUS_COLORS['失踪']
                )}>
                  {heritage.currentStatus}
                </span>
                <span className="text-xs font-song text-amber-600 bg-amber-50 px-2 py-0.5 border border-amber-200">
                  铸于{heritage.forgingYear}
                </span>
              </div>
              <button
                onClick={() => toggleExpand(heritage.swordId)}
                className="flex items-center gap-1 text-sm font-song text-ink-500 hover:text-cinnabar-600 transition-colors"
              >
                {isExpanded ? '收起' : '展开'}完整传承
                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>

            <div className="flex items-center gap-2 mb-4 text-sm font-song text-ink-500">
              <span>共 {heritage.holders.length} 任持有者</span>
              {currentHolderIndex >= 0 && (
                <span className="text-cinnabar-600">
                  · {currentSwordsmanName}为第 {currentHolderIndex + 1} 任
                </span>
              )}
            </div>

            <div className="overflow-x-auto pb-2">
              <div className="flex items-center gap-0 min-w-max">
                {heritage.holders.map((holder, hIndex) => {
                  const isCurrentHolder = holder.swordsmanId === currentSwordsmanId;
                  const AcquisitionIcon = ACQUISITION_ICONS[holder.acquisitionMethod] || ACQUISITION_ICONS['其他'];
                  const acquisitionColor = ACQUISITION_COLORS[holder.acquisitionMethod] || ACQUISITION_COLORS['其他'];

                  return (
                    <div key={holder.id} className="flex items-center">
                      <Link
                        to={`/swordsmen/${holder.swordsmanId}`}
                        className={cn(
                          'flex flex-col items-center p-3 min-w-[100px] transition-all duration-300 group',
                          isCurrentHolder
                            ? 'bg-cinnabar-50 border-2 border-cinnabar-400 scale-105 shadow-ink'
                            : 'bg-ink-50 hover:bg-ink-100 border border-ink-200',
                          isExpanded ? '' : ''
                        )}
                      >
                        <div className={cn(
                          'w-10 h-10 rounded-full flex items-center justify-center mb-2 bg-gradient-to-br',
                          acquisitionColor,
                          isCurrentHolder ? 'ring-2 ring-cinnabar-400 ring-offset-2' : ''
                        )}>
                          <AcquisitionIcon className="w-4 h-4 text-white" />
                        </div>
                        <span className={cn(
                          'font-brush text-sm text-center leading-tight',
                          isCurrentHolder ? 'text-cinnabar-700' : 'text-ink-900 group-hover:text-cinnabar-700'
                        )}>
                          {holder.swordsmanName}
                        </span>
                        <span className={cn(
                          'text-[10px] font-song mt-0.5',
                          isCurrentHolder ? 'text-cinnabar-600' : 'text-ink-500'
                        )}>
                          第{hIndex + 1}任
                        </span>
                        <span className="text-[9px] font-song text-ink-400 mt-0.5">
                          {holder.startYear}
                        </span>
                      </Link>

                      {hIndex < heritage.holders.length - 1 && (
                        <div className="flex flex-col items-center px-1">
                          <div className={cn(
                            'text-[9px] font-song px-1.5 py-0.5 whitespace-nowrap',
                            'bg-ink-50 border border-ink-200 text-ink-500'
                          )}>
                            {heritage.holders[hIndex].lossMethod || '传承'}
                          </div>
                          <div className="w-8 h-0.5 bg-gradient-to-r from-ink-300 to-ink-200" />
                          <div className="w-0 h-0 border-l-[5px] border-l-ink-300 border-t-[3px] border-t-transparent border-b-[3px] border-b-transparent" />
                        </div>
                      )}
                    </div>
                  );
                })}

                {heritage.currentStatus === '传世' ? (
                  <div className="flex flex-col items-center p-3 min-w-[80px] bg-emerald-50 border border-emerald-200 ml-1">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center mb-2 bg-emerald-500">
                      <Crown className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-[10px] font-song text-emerald-600">传世至今</span>
                  </div>
                ) : heritage.currentStatus === '化龙' ? (
                  <div className="flex flex-col items-center p-3 min-w-[80px] bg-gold-50 border border-gold-200 ml-1">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center mb-2 bg-gold-500">
                      <SwordIcon className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-[10px] font-song text-gold-600">化龙而去</span>
                  </div>
                ) : heritage.currentStatus === '损毁' ? (
                  <div className="flex flex-col items-center p-3 min-w-[80px] bg-red-50 border border-red-200 ml-1">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center mb-2 bg-red-500">
                      <SwordIcon className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-[10px] font-song text-red-600">已损毁</span>
                  </div>
                ) : heritage.currentStatus === '陪葬' ? (
                  <div className="flex flex-col items-center p-3 min-w-[80px] bg-bronze-50 border border-bronze-200 ml-1">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center mb-2 bg-bronze-500">
                      <Crown className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-[10px] font-song text-bronze-600">陪葬入土</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center p-3 min-w-[80px] bg-ink-50 border border-ink-200 ml-1">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center mb-2 bg-ink-400">
                      <Eye className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-[10px] font-song text-ink-500">下落不明</span>
                  </div>
                )}
              </div>
            </div>

            {isExpanded && (
              <div className="mt-6 pt-4 border-t border-ink-200 space-y-4">
                {heritage.holders.map((holder, hIndex) => {
                  const isCurrentHolder = holder.swordsmanId === currentSwordsmanId;
                  const AcquisitionIcon = ACQUISITION_ICONS[holder.acquisitionMethod] || ACQUISITION_ICONS['其他'];
                  const acquisitionColor = ACQUISITION_COLORS[holder.acquisitionMethod] || ACQUISITION_COLORS['其他'];

                  return (
                    <div
                      key={holder.id}
                      className={cn(
                        'relative flex gap-4',
                        isCurrentHolder && 'bg-cinnabar-50/50 p-3 -m-3'
                      )}
                    >
                      <div className="relative flex flex-col items-center">
                        <div className={cn(
                          'w-8 h-8 rounded-full flex items-center justify-center z-10 bg-gradient-to-br',
                          acquisitionColor,
                          isCurrentHolder && 'ring-2 ring-cinnabar-400 ring-offset-2'
                        )}>
                          <AcquisitionIcon className="w-3.5 h-3.5 text-white" />
                        </div>
                        {hIndex < heritage.holders.length - 1 && (
                          <div className="w-0.5 flex-1 bg-gradient-to-b from-ink-300 to-ink-200 mt-1" />
                        )}
                      </div>

                      <div className="flex-1 pb-4">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <Link
                            to={`/swordsmen/${holder.swordsmanId}`}
                            className={cn(
                              'font-brush text-lg hover:text-cinnabar-700 transition-colors',
                              isCurrentHolder ? 'text-cinnabar-700' : 'text-ink-900'
                            )}
                            onClick={(e) => e.stopPropagation()}
                          >
                            {holder.swordsmanName}
                          </Link>
                          <span className={cn(
                            'text-[10px] px-2 py-0.5 font-song text-white bg-gradient-to-r',
                            acquisitionColor
                          )}>
                            {holder.acquisitionMethod}而得
                          </span>
                          {holder.lossMethod && (
                            <span className="text-[10px] px-2 py-0.5 font-song text-ink-500 border border-ink-200 bg-ink-50">
                              {holder.lossMethod}
                            </span>
                          )}
                          {isCurrentHolder && (
                            <span className="text-[10px] px-2 py-0.5 font-song text-cinnabar-600 border border-cinnabar-200 bg-cinnabar-50">
                              当前剑客
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-xs font-song text-ink-500 mb-1.5">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {holder.startYear} — {holder.endYear}
                          </span>
                          <span className="flex items-center gap-1">
                            <Target className="w-3 h-3" />
                            第 {hIndex + 1} 任
                          </span>
                        </div>
                        <p className="text-sm font-song text-ink-600 leading-relaxed">
                          {holder.description}
                        </p>
                        {holder.majorEvents.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {holder.majorEvents.map((event, eIdx) => (
                              <span key={eIdx} className="text-[10px] font-song text-gold-600 bg-gold-50 px-2 py-0.5 border border-gold-200">
                                {event}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {heritage.lastKnownLocation && (
                  <div className="flex items-center gap-2 text-sm font-song text-ink-500 pt-2 border-t border-ink-200">
                    <Eye className="w-4 h-4" />
                    最后已知下落：{heritage.lastKnownLocation}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
