import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sword as SwordIcon, Calendar, Hammer, Crown, Gift, Target, Eye, Award, ChevronDown, ChevronUp, MoreHorizontal } from 'lucide-react';
import type { SwordsmanSwordTenure } from '../../types';
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

interface SwordsmanTenureListProps {
  tenures: SwordsmanSwordTenure[];
  swordsmanName: string;
}

export default function SwordsmanTenureList({ tenures, swordsmanName }: SwordsmanTenureListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (tenures.length === 0) {
    return (
      <div className="ink-card p-8 text-center animate-fade-in-up">
        <SwordIcon className="w-12 h-12 text-ink-300 mx-auto mb-4" />
        <p className="font-song text-ink-500">{swordsmanName}暂无持剑记录</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="ink-card p-6 animate-fade-in-up">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-brush text-2xl text-ink-900 mb-2">名剑传承录</h3>
            <p className="font-song text-sm text-ink-500">{swordsmanName}持剑期间的详细记录</p>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-song text-cinnabar-600 bg-cinnabar-50 border border-cinnabar-200">
            <SwordIcon className="w-3.5 h-3.5" />
            共持剑 {tenures.length} 柄
          </div>
        </div>

        <div className="relative">
          {tenures.map((tenure, index) => (
            <TenureNode
              key={tenure.swordId}
              tenure={tenure}
              index={index}
              total={tenures.length}
              isExpanded={expandedId === tenure.swordId}
              onToggle={() => toggleExpand(tenure.swordId)}
              isLast={index === tenures.length - 1}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

interface TenureNodeProps {
  tenure: SwordsmanSwordTenure;
  index: number;
  total: number;
  isExpanded: boolean;
  onToggle: () => void;
  isLast: boolean;
}

function TenureNode({ tenure, index, isExpanded, onToggle, isLast }: TenureNodeProps) {
  const AcquisitionIcon = ACQUISITION_ICONS[tenure.acquisitionMethod] || ACQUISITION_ICONS['其他'];
  const acquisitionColor = ACQUISITION_COLORS[tenure.acquisitionMethod] || ACQUISITION_COLORS['其他'];

  return (
    <div className="relative animate-fade-in-up" style={{ animationDelay: `${0.3 + index * 0.1}s` }}>
      <div className="flex gap-4">
        <div className="relative flex flex-col items-center">
          <Link
            to={`/swords/${tenure.swordId}`}
            className="flex-shrink-0"
          >
            <div className={cn(
              'w-12 h-12 rounded-full flex items-center justify-center shadow-lg z-10 bg-gradient-to-br cursor-pointer hover:scale-110 transition-transform',
              acquisitionColor
            )}>
              <AcquisitionIcon className="w-5 h-5 text-white" />
            </div>
          </Link>
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
                    to={`/swords/${tenure.swordId}`}
                    className="flex items-center gap-3 group/sword"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="w-12 h-16 overflow-hidden border border-ink-200 flex-shrink-0 group-hover/sword:border-cinnabar-400 transition-colors">
                      <img
                        src={tenure.swordImageUrl}
                        alt={tenure.swordName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-brush text-xl text-ink-900 group-hover/sword:text-cinnabar-700 transition-colors">
                        {tenure.swordName}
                      </h4>
                      <span className="text-xs text-gold-600 font-song">「{tenure.swordAlias}」</span>
                    </div>
                  </Link>
                  <span className={cn(
                    'text-[10px] px-2 py-0.5 font-song text-white bg-gradient-to-r',
                    acquisitionColor
                  )}>
                    {tenure.acquisitionMethod}而得
                  </span>
                  {tenure.lossMethod && (
                    <span className={cn(
                      'text-[10px] px-2 py-0.5 font-song border',
                      LOSS_COLORS[tenure.lossMethod] || LOSS_COLORS['其他']
                    )}>
                      {tenure.lossMethod}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm font-song text-ink-500 mb-2">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {tenure.startYear} — {tenure.endYear}
                  </span>
                  <span className="flex items-center gap-1">
                    <Target className="w-3.5 h-3.5" />
                    第 {index + 1} 柄持剑
                  </span>
                </div>
                <p className="text-sm font-song text-ink-600 leading-relaxed">
                  {tenure.description}
                </p>
              </div>
              <div className="flex-shrink-0 pt-2">
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-ink-400 group-hover:text-cinnabar-600 transition-colors" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-ink-400 group-hover:text-cinnabar-600 transition-colors" />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
