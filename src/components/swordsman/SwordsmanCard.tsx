import { Calendar, MapPin, Sword, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Swordsman } from '../../types';

interface SwordsmanCardProps {
  swordsman: Swordsman;
  delay?: number;
}

export default function SwordsmanCard({ swordsman, delay = 0 }: SwordsmanCardProps) {
  return (
    <Link
      to={`/swordsmen/${swordsman.id}`}
      className="ink-card p-4 flex gap-4 animate-fade-in-up hover:shadow-ink-lg transition-all duration-300 group"
      style={{ animationDelay: `${delay}ms`, opacity: 0 }}
    >
      <div className="relative flex-shrink-0">
        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-ink-200 shadow-ink group-hover:border-gold-500 transition-colors duration-300">
          <img
            src={swordsman.avatarUrl}
            alt={swordsman.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
        </div>
        <div className="absolute -bottom-1 -right-1 bg-cinnabar-600 text-ink-100 text-xs px-2 py-0.5 font-brush transform rotate-[-8deg]">
          {swordsman.dynasty}
        </div>
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-brush text-xl text-ink-900 group-hover:text-cinnabar-700 transition-colors">
            {swordsman.name}
          </h4>
          <span className="text-gold-600 text-xs font-song">「{swordsman.title}」</span>
        </div>
        
        <div className="flex items-center gap-3 text-xs text-ink-500 font-song mb-2">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {swordsman.dynasty}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {swordsman.sect}
          </span>
          {swordsman.swords.length > 0 && (
            <span className="flex items-center gap-1">
              <Sword className="w-3 h-3" />
              {swordsman.swords.length}柄名剑
            </span>
          )}
        </div>
        
        <p className="font-song text-sm text-ink-600 line-clamp-2 leading-relaxed mb-2">
          {swordsman.biography}
        </p>
        
        <div className="flex items-center gap-1 text-cinnabar-600 text-xs font-song opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span>查看详情</span>
          <ArrowRight className="w-3 h-3" />
        </div>
      </div>
    </Link>
  );
}
