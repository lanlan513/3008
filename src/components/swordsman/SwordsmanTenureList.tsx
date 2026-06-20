import { Link } from 'react-router-dom';
import { Sword as SwordIcon, Calendar, Hammer, Crown, Gift, Target, Eye, Award, MoreHorizontal, ChevronRight } from 'lucide-react';
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
  if (tenures.length === 0) {
    return (
      <div className="ink-card p-8 text-center animate-fade-in-up">
        <SwordIcon className="w-12 h-12 text-ink-300 mx-auto mb-4" />
        <p className="font-song text-ink-500">暂无持剑记录</p>
      </div>
    );
  }

  return (
    <div className="ink-card p-6 animate-fade-in-up" style={{ animationDelay: '0.7s', opacity: 0 }}>
      <div className="mb-6">
        <h3 className="font-brush text-2xl text-ink-900 mb-2">持剑年表</h3>
        <p className="font-song text-sm text-ink-500">
          {swordsmanName}一生曾持有 {tenures.length} 柄名剑
        </p>
      </div>

      <div className="relative">
        {tenures.map((tenure, index) => (
          <TenureItem key={`${tenure.swordId}-${index}`} tenure={tenure} index={index} isLast={index === tenures.length - 1} />
        ))}
      </div>
    </div>
  );
}

interface TenureItemProps {
  tenure: SwordsmanSwordTenure;
  index: number;
  isLast: boolean;
}

function TenureItem({ tenure, index, isLast }: TenureItemProps) {
  const AcquisitionIcon = ACQUISITION_ICONS[tenure.acquisitionMethod] || ACQUISITION_ICONS['其他'];
  const acquisitionColor = ACQUISITION_COLORS[tenure.acquisitionMethod] || ACQUISITION_COLORS['其他'];

  return (
    <div className="relative animate-fade-in-up" style={{ animationDelay: `${0.3 + index * 0.1}s` }}>
      <div className="flex gap-4">
        <div className="relative flex flex-col items-center">
          <div className={cn(
            'w-10 h-10 rounded-full flex items-center justify-center shadow-lg z-10 bg-gradient-to-br',
            acquisitionColor
          )}>
            <AcquisitionIcon className="w-4 h-4 text-white" />
          </div>
          {!isLast && (
            <div className="w-0.5 flex-1 bg-gradient-to-b from-gold-300 to-ink-200 mt-1" />
          )}
        </div>

        <div className="flex-1 pb-6">
          <Link to={`/swords/${tenure.swordId}`} className="block group">
            <div className="ink-card p-4 hover:shadow-ink-lg transition-all duration-300">
              <div className="flex gap-4">
                <div className="w-20 h-24 flex-shrink-0 overflow-hidden border border-ink-200">
                  <img
                    src={tenure.swordImageUrl}
                    alt={tenure.swordName}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <h4 className="font-brush text-xl text-ink-900 group-hover:text-cinnabar-700 transition-colors">
                      {tenure.swordName}
                    </h4>
                    <span className="text-xs text-gold-600 font-song">「{tenure.swordAlias}」</span>
                    <ChevronRight className="w-4 h-4 text-ink-400 group-hover:text-cinnabar-600 transition-colors ml-auto" />
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs font-song text-ink-500 mb-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {tenure.startYear} — {tenure.endYear}
                    </span>
                    <span className={cn(
                      'px-2 py-0.5 text-white bg-gradient-to-r',
                      acquisitionColor
                    )}>
                      {tenure.acquisitionMethod}
                    </span>
                    {tenure.lossMethod && (
                      <span className={cn(
                        'px-2 py-0.5 border',
                        LOSS_COLORS[tenure.lossMethod] || LOSS_COLORS['其他']
                      )}>
                        {tenure.lossMethod}
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-song text-ink-600 leading-relaxed line-clamp-2">
                    {tenure.description}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
