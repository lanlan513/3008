import type { CredibilityLevel } from '../../types';
import { cn } from '@/lib/utils';

const CREDIBILITY_CONFIG: Record<CredibilityLevel, { label: string; color: string; bgColor: string; borderColor: string; icon: string; description: string; gradientClass: string; barColor: string }> = {
  '正史确证': {
    label: '正史确证',
    color: 'text-emerald-100',
    bgColor: 'bg-emerald-600',
    borderColor: 'border-emerald-700',
    icon: '●●●●●',
    description: '见于正史记载，有确凿证据',
    gradientClass: 'from-emerald-600 to-emerald-700',
    barColor: 'bg-gradient-to-r from-emerald-500 to-emerald-700',
  },
  '多源互证': {
    label: '多源互证',
    color: 'text-blue-100',
    bgColor: 'bg-blue-600',
    borderColor: 'border-blue-700',
    icon: '●●●●○',
    description: '多个独立来源互相印证',
    gradientClass: 'from-blue-600 to-blue-700',
    barColor: 'bg-gradient-to-r from-blue-500 to-blue-700',
  },
  '孤证存疑': {
    label: '孤证存疑',
    color: 'text-yellow-100',
    bgColor: 'bg-yellow-600',
    borderColor: 'border-yellow-700',
    icon: '●●●○○',
    description: '仅有一个来源记载，可信度存疑',
    gradientClass: 'from-yellow-600 to-yellow-700',
    barColor: 'bg-gradient-to-r from-yellow-500 to-yellow-700',
  },
  '野史传闻': {
    label: '野史传闻',
    color: 'text-orange-100',
    bgColor: 'bg-orange-600',
    borderColor: 'border-orange-700',
    icon: '●●○○○',
    description: '仅见于野史笔记，缺乏旁证',
    gradientClass: 'from-orange-600 to-orange-700',
    barColor: 'bg-gradient-to-r from-orange-500 to-orange-700',
  },
  '民间传说': {
    label: '民间传说',
    color: 'text-red-100',
    bgColor: 'bg-red-600',
    borderColor: 'border-red-700',
    icon: '●○○○○',
    description: '仅存在于口头传说，无文字记载',
    gradientClass: 'from-red-600 to-red-700',
    barColor: 'bg-gradient-to-r from-red-500 to-red-700',
  },
};

interface CredibilityBadgeProps {
  level: CredibilityLevel;
  showDescription?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function CredibilityBadge({ level, showDescription = false, size = 'sm' }: CredibilityBadgeProps) {
  const config = CREDIBILITY_CONFIG[level];

  return (
    <div className="inline-flex flex-col gap-1">
      <span
        className={cn(
          'inline-flex items-center gap-1 font-song font-bold border',
          config.bgColor,
          config.color,
          config.borderColor,
          size === 'sm' && 'text-[10px] px-2 py-0.5',
          size === 'md' && 'text-xs px-3 py-1',
          size === 'lg' && 'text-sm px-4 py-1.5',
        )}
        style={{ clipPath: 'polygon(3% 10%, 97% 0%, 100% 85%, 5% 100%)' }}
      >
        <span className="opacity-70 text-[0.6em]">{config.icon}</span>
        {config.label}
      </span>
      {showDescription && (
        <span className="text-[10px] text-ink-500 font-song">{config.description}</span>
      )}
    </div>
  );
}

export { CREDIBILITY_CONFIG };
