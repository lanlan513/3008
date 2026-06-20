import { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Calendar, Award, MapPin, ChevronDown, ChevronUp, Hammer, Gift, Sword as SwordIcon, Target, Eye, Crown, MoreHorizontal } from 'lucide-react';
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

const LOSS_COLORS: Record<string, string> = {
  '传承': 'text-emerald-600 bg-emerald-50 border-emerald-200',
  '遗失': 'text-ink-600 bg-ink-50 border-ink-200',
  '被夺': 'text-cinnabar-600 bg-cinnabar-50 border-cinnabar-200',
  '损毁': 'text-red-600 bg-red-50 border-red-200',
  '陪葬': 'text-bronze-600 bg-bronze-50 border-bronze-200',
  '化龙': 'text-gold-600 bg-gold-50 border-gold-200',
  '其他': 'text-ink-600 bg-ink-50 border-ink-200',
};

const STATUS_COLORS: Record<string, string> = {
  '传世': 'text-emerald-600 bg-emerald-50 border-emerald-200',
  '失踪': 'text-ink-600 bg-ink-50 border-ink-200',
  '损毁': 'text-red-600 bg-red-50 border-red-200',
  '陪葬': 'text-bronze-600 bg-bronze-50 border-bronze-200',
  '化龙': 'text-gold-600 bg-gold-50 border-gold-200',
};

interface HeritageTimelineProps {
  heritage: SwordHeritage;
}

export default function HeritageTimeline({ heritage }: HeritageTimelineProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="ink-card p-6 animate-fade-in-up" style={{ animationDelay: '0.5s', opacity: 0 }}>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h3 className="font-brush text-2xl text-ink-900 mb-2">名剑传承录</h3>
          <p className="font-song text-sm text-ink-500">从诞生至今的完整传承脉络</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className={cn(
            'px-3 py-1.5 text-sm font-song border',
            STATUS_COLORS[heritage.currentStatus] || STATUS_COLORS['失踪']
          )}>
            当前状态：{heritage.currentStatus}
          </div>
          {heritage.lastKnownLocation && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-song text-ink-600 bg-ink-50 border border-ink-200">
              <MapPin className="w-3.5 h-3.5" />
              {heritage.lastKnownLocation}
            </div>
          )}
          <div className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-song text-amber-600 bg-amber-50 border border-amber-200">
            <Hammer className="w-3.5 h-3.5" />
            铸造于 {heritage.forgingYear}
          </div>
        </div>
      </div>

      <div className="relative">
        {heritage.holders.map((holder, index) => (
          <HolderNode
            key={holder.id}
            holder={holder}
            index={index}
            total={heritage.holders.length}
            isExpanded={expandedId === holder.id}
            onToggle={() => toggleExpand(holder.id)}
            isLast={index === heritage.holders.length - 1}
          />
        ))}
      </div>
    </div>
  );
}

interface HolderNodeProps {
  holder: SwordHolder;
  index: number;
  total: number;
  isExpanded: boolean;
  onToggle: () => void;
  isLast: boolean;
}

function HolderNode({ holder, index, isExpanded, onToggle, isLast }: HolderNodeProps) {
  const AcquisitionIcon = ACQUISITION_ICONS[holder.acquisitionMethod] || ACQUISITION_ICONS['其他'];
  const acquisitionColor = ACQUISITION_COLORS[holder.acquisitionMethod] || ACQUISITION_COLORS['其他'];

  return (
    <div className="relative animate-fade-in-up" style={{ animationDelay: `${0.3 + index * 0.1}s`}>
      <div className="flex gap-4">
        <div className="relative flex flex-col items-center">
          <div className={cn(
            'w-12 h-12 rounded-full flex items-center justify-center shadow-lg z-10 bg-gradient-to-br',
            acquisitionColor
          )}>
            <AcquisitionIcon className="w-5 h-5 text-white" />
          </div>
          {!isLast && (
            <div className="w-0.5 flex-1 bg-gradient-to-b from-cinnabar-300 to-ink-200 mt-1" />
          )}
        </div>

        <div className="flex-1 pb-8">
          <div
            onClick={onToggle}
            className="ink-card p-4 hover:shadow-ink-lg transition-all duration-300 cursor-pointer group"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <Link
                    to={`/swordsmen/${holder.swordsmanId}`}
                    className="font-brush text-xl text-ink-900 group-hover:text-cinnabar-700 transition-colors"
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
                    <span className={cn(
                      'text-[10px] px-2 py-0.5 font-song border',
                      LOSS_COLORS[holder.lossMethod] || LOSS_COLORS['其他']
                    )}>
                      {holder.lossMethod}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm font-song text-ink-500 mb-2">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {holder.startYear} — {holder.endYear}
                  </span>
                  <span className="flex items-center gap-1">
                    <Target className="w-3.5 h-3.5" />
                    第 {index + 1} 任持有者
                  </span>
                </div>
                <p className="text-sm font-song text-ink-600 leading-relaxed">
                  {holder.description}
                </p>
              </div>
              <div className="flex-shrink-0">
                {isExpanded ? (
                <ChevronUp className="w-5 h-5 text-ink-400 group-hover:text-cinnabar-600 transition-colors" />
              ) : (
                <ChevronDown className="w-5 h-5 text-ink-400 group-hover:text-cinnabar-600 transition-colors" />
              )}
              </div>
            </div>

            {isExpanded && holder.majorEvents.length > 0 && (
              <div className="mt-4 pt-4 border-t border-ink-200">
              <div className="flex items-center gap-2 mb-3">
                <Award className="w-4 h-4 text-gold-600" />
                <span className="font-brush text-base text-ink-800">持剑期间大事记</span>
              </div>
              <div className="space-y-2">
                {holder.majorEvents.map((event, eventIndex) => (
                  <div
                    key={eventIndex}
                    className="flex items-start gap-2 pl-2 border-l-2 border-gold-300"
                  >
                    <span className="font-song text-sm text-ink-600">• {event}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
}
