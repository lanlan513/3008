import { Link } from 'react-router-dom';
import { Flame, Tag } from 'lucide-react';
import type { KnowledgeArticle } from '../../types';

interface KnowledgeCardProps {
  article: KnowledgeArticle;
  delay?: number;
}

const CATEGORY_COLORS: Record<string, string> = {
  '剑材': 'from-emerald-500 to-emerald-700',
  '锻造工艺': 'from-cinnabar-500 to-cinnabar-700',
  '淬火方法': 'from-gold-500 to-gold-700',
  '装具结构': 'from-bronze-500 to-bronze-700',
  '铸剑流派': 'from-ink-600 to-ink-800',
};

export default function KnowledgeCard({ article, delay = 0 }: KnowledgeCardProps) {
  const colorClass = CATEGORY_COLORS[article.category] || CATEGORY_COLORS['铸剑流派'];

  return (
    <Link
      to={`/knowledge/${article.id}`}
      className="ink-card group animate-fade-in-up"
      style={{ animationDelay: `${delay}ms`, opacity: 0 }}
    >
      <div className="relative aspect-[16/9] overflow-hidden">
        <img
          src={article.coverUrl}
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="absolute top-3 left-3">
          <span className={cn(
            'inline-block text-xs px-2 py-0.5 text-ink-100 font-song bg-gradient-to-r',
            colorClass
          )}>
            {article.category}
          </span>
        </div>

        <div className="absolute top-3 right-3 flex items-center gap-1 bg-ink-900/60 backdrop-blur-sm px-2 py-1 text-xs text-gold-400">
          <Flame className="w-3 h-3" />
          <span>{article.popularity.toLocaleString()}</span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-brush text-xl text-ink-900 group-hover:text-cinnabar-600 transition-colors mb-2 line-clamp-2">
          {article.title}
        </h3>

        <p className="font-song text-sm text-ink-600 line-clamp-2 leading-relaxed mb-3">
          {article.summary}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 flex-wrap">
            <Tag className="w-3 h-3 text-ink-400" />
            {article.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-song text-ink-500 bg-ink-50 px-1.5 py-0.5"
              >
                {tag}
              </span>
            ))}
          </div>
          {article.dynasty && (
            <span className="text-xs font-song text-ink-400">{article.dynasty}</span>
          )}
        </div>
      </div>
    </Link>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
