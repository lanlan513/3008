import { BookOpen, ArrowRight, Users, Sword } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface ComparisonEntryProps {
  targetId: string;
  targetName: string;
  targetType: 'swordsman' | 'sword';
  hasComparison: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export default function ComparisonEntry({ targetId, targetName, targetType, hasComparison, className, style }: ComparisonEntryProps) {
  if (!hasComparison) return null;

  return (
    <div className={cn('ink-card p-6 animate-fade-in-up', className)} style={style}>
      <div className="flex items-center gap-3 mb-4">
        <div className={cn(
          'p-3 rounded-lg bg-gradient-to-br',
          targetType === 'swordsman'
            ? 'from-cinnabar-100 to-cinnabar-200'
            : 'from-gold-100 to-gold-200'
        )}>
          {targetType === 'swordsman' ? (
            <Users className="w-6 h-6 text-cinnabar-600" />
          ) : (
            <Sword className="w-6 h-6 text-gold-600" />
          )}
        </div>
        <div>
          <h3 className="font-brush text-xl text-ink-900">作品对照库</h3>
          <p className="text-xs font-song text-ink-500">查看不同作品中的形象演绎</p>
        </div>
      </div>

      <p className="font-song text-sm text-ink-600 mb-4 leading-relaxed">
        「{targetName}」在不同武侠作品中的形象各异。点击查看不同作者对这一{targetType === 'swordsman' ? '人物' : '名剑'}的精彩演绎，对比版本差异，感受创作魅力。
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        <span className="inline-flex items-center gap-1 px-3 py-1 bg-ink-50 text-ink-600 text-xs font-song border border-ink-200">
          <BookOpen className="w-3 h-3" />
          多版本对比
        </span>
        <span className="inline-flex items-center gap-1 px-3 py-1 bg-ink-50 text-ink-600 text-xs font-song border border-ink-200">
          属性差异展示
        </span>
        <span className="inline-flex items-center gap-1 px-3 py-1 bg-ink-50 text-ink-600 text-xs font-song border border-ink-200">
          版本时间线
        </span>
      </div>

      <Link
        to={`/comparison/${targetType}/${targetId}`}
        className="flex items-center justify-between w-full px-4 py-3 bg-gradient-to-r from-cinnabar-500 to-gold-500 text-ink-100 font-song hover:from-cinnabar-600 hover:to-gold-600 transition-all duration-300 group"
      >
        <span>查看「{targetName}」的作品对照</span>
        <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  );
}
