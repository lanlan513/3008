import { cn } from '@/lib/utils';
import type { KnowledgeCategory, KnowledgeCategoryInfo } from '../../types';

interface CategoryNavProps {
  categories: KnowledgeCategoryInfo[];
  activeCategory: KnowledgeCategory | null;
  onSelectCategory: (category: KnowledgeCategory | null) => void;
}

const CATEGORY_ICONS: Record<string, string> = {
  '剑材': '⛏',
  '锻造工艺': '🔨',
  '淬火方法': '🔥',
  '装具结构': '⚙',
  '铸剑流派': '📜',
};

export default function CategoryNav({ categories, activeCategory, onSelectCategory }: CategoryNavProps) {
  return (
    <div className="flex flex-wrap gap-3">
      <button
        onClick={() => onSelectCategory(null)}
        className={cn(
          'inline-flex items-center gap-2 px-4 py-2 font-song text-sm transition-all duration-300',
          activeCategory === null
            ? 'bg-cinnabar-600 text-ink-100 shadow-brush'
            : 'bg-ink-50 text-ink-700 hover:bg-ink-100 border border-ink-200'
        )}
      >
        <span>📚</span>
        全部
      </button>
      {categories.map((cat) => (
        <button
          key={cat.category}
          onClick={() => onSelectCategory(cat.category)}
          className={cn(
            'inline-flex items-center gap-2 px-4 py-2 font-song text-sm transition-all duration-300',
            activeCategory === cat.category
              ? 'bg-cinnabar-600 text-ink-100 shadow-brush'
              : 'bg-ink-50 text-ink-700 hover:bg-ink-100 border border-ink-200'
          )}
        >
          <span>{CATEGORY_ICONS[cat.category] || '📖'}</span>
          {cat.label}
          <span className={cn(
            'text-xs px-1.5 py-0.5',
            activeCategory === cat.category
              ? 'bg-cinnabar-500 text-ink-100'
              : 'bg-ink-100 text-ink-500'
          )}>
            {cat.count}
          </span>
        </button>
      ))}
    </div>
  );
}
