import { Link } from 'react-router-dom';
import { Flame, Eye, Ghost } from 'lucide-react';
import type { LegendarySword } from '../../types';
import CredibilityBadge from './CredibilityBadge';

interface LegendarySwordCardProps {
  sword: LegendarySword;
  delay?: number;
}

export default function LegendarySwordCard({ sword, delay = 0 }: LegendarySwordCardProps) {
  return (
    <Link
      to={`/legendary-swords/${sword.id}`}
      className="ink-card group animate-fade-in-up"
      style={{ animationDelay: `${delay}ms`, opacity: 0 }}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={sword.imageUrl}
          alt={sword.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="absolute top-3 left-3">
          <CredibilityBadge level={sword.credibilityLevel} />
        </div>

        <div className="absolute top-3 right-3 flex items-center gap-1 bg-ink-900/60 backdrop-blur-sm px-2 py-1 text-xs text-gold-400">
          <Ghost className="w-3 h-3" />
          <span>神秘度 {sword.mysteryLevel}/5</span>
        </div>

        <div className="absolute top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-ink-900/60 backdrop-blur-sm px-2 py-1 text-xs text-cinnabar-300">
          <Flame className="w-3 h-3" />
          <span>{sword.popularity.toLocaleString()}</span>
        </div>

        <div className="absolute bottom-3 right-3 flex items-center gap-1 text-ink-100 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Eye className="w-3 h-3" />
          <span>查看考据</span>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-brush text-2xl text-ink-900 group-hover:text-cinnabar-600 transition-colors">
            {sword.name}
          </h3>
          <span className="text-xs text-ink-500 font-song bg-ink-100 px-2 py-1">
            {sword.dynasty}
          </span>
        </div>

        <p className="font-song text-xs text-ink-500 mb-1">「{sword.alias}」</p>

        <p className="font-song text-sm text-ink-600 line-clamp-2 leading-relaxed mb-3">
          {sword.description}
        </p>

        <div className="flex items-center justify-between text-xs text-ink-500 font-song mb-3">
          <span>史料 {sword.evidenceCount} 条</span>
          <span>可信度 {sword.credibilityScore}%</span>
        </div>

        <div className="flex items-center gap-1">
          <div className="flex-1 h-2 bg-ink-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-ink-600 to-ink-800 transition-all duration-700 ease-out"
              style={{ width: `${sword.credibilityScore}%` }}
            />
          </div>
          <span className="text-xs font-song text-ink-500 ml-1">{sword.credibilityScore}%</span>
        </div>

        <div className="mt-3 flex flex-wrap gap-1">
          {sword.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-[10px] text-ink-500 font-song bg-ink-100 px-2 py-0.5 border border-ink-200"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
