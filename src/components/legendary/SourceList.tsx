import { BookOpen, Star, Quote, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import type { SourceReference } from '../../types';
import { cn } from '@/lib/utils';

const SOURCE_TYPE_CONFIG: Record<SourceReference['type'], { label: string; color: string; bgColor: string }> = {
  '正史': { label: '正史', color: 'text-emerald-700', bgColor: 'bg-emerald-50 border-emerald-200' },
  '野史': { label: '野史', color: 'text-orange-700', bgColor: 'bg-orange-50 border-orange-200' },
  '笔记': { label: '笔记', color: 'text-blue-700', bgColor: 'bg-blue-50 border-blue-200' },
  '诗词': { label: '诗词', color: 'text-purple-700', bgColor: 'bg-purple-50 border-purple-200' },
  '戏曲': { label: '戏曲', color: 'text-pink-700', bgColor: 'bg-pink-50 border-pink-200' },
  '考古': { label: '考古', color: 'text-amber-700', bgColor: 'bg-amber-50 border-amber-200' },
  '口述': { label: '口述', color: 'text-ink-600', bgColor: 'bg-ink-50 border-ink-200' },
  '残卷': { label: '残卷', color: 'text-red-700', bgColor: 'bg-red-50 border-red-200' },
};

interface SourceListProps {
  sources: SourceReference[];
}

export default function SourceList({ sources }: SourceListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  const grouped = sources.reduce<Record<string, SourceReference[]>>((acc, source) => {
    if (!acc[source.type]) acc[source.type] = [];
    acc[source.type].push(source);
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-6">
        <BookOpen className="w-6 h-6 text-blue-600" />
        <h2 className="font-brush text-3xl text-ink-900">资料来源</h2>
        <span className="text-sm text-ink-500 font-song">共 {sources.length} 条</span>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {Object.entries(grouped).map(([type, items]) => {
          const config = SOURCE_TYPE_CONFIG[type as SourceReference['type']];
          return (
            <span key={type} className={cn('text-xs px-3 py-1 border font-song', config.bgColor, config.color)}>
              {config.label} ({items.length})
            </span>
          );
        })}
      </div>

      <div className="space-y-3">
        {sources.map((source) => {
          const config = SOURCE_TYPE_CONFIG[source.type];
          const isExpanded = expandedId === source.id;

          return (
            <div
              key={source.id}
              className={cn(
                'ink-card overflow-hidden transition-all',
                isExpanded && 'shadow-ink-hover'
              )}
            >
              <button
                onClick={() => toggleExpand(source.id)}
                className="w-full p-4 flex items-start gap-3 text-left"
              >
                <span className={cn('text-[10px] px-2 py-0.5 border font-song flex-shrink-0 mt-0.5', config.bgColor, config.color)}>
                  {config.label}
                </span>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-brush text-lg text-ink-900 truncate">{source.title}</h4>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-ink-500 font-song">
                    {source.author && <span>{source.author}</span>}
                    {source.dynasty && <span>{source.dynasty}</span>}
                    <div className="flex items-center gap-0.5">
                      <Star className="w-3 h-3 text-gold-500 fill-gold-500" />
                      <span className="text-gold-600">可信度 {source.reliability}/5</span>
                    </div>
                  </div>
                </div>

                {isExpanded ? (
                  <ChevronUp className="w-4 h-4 text-ink-400 flex-shrink-0 mt-1" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-ink-400 flex-shrink-0 mt-1" />
                )}
              </button>

              {isExpanded && (
                <div className="px-4 pb-4 animate-fade-in-up">
                  <div className="pl-[calc(2.5rem+0.75rem)] space-y-3">
                    <p className="font-song text-sm text-ink-700 leading-relaxed">
                      {source.description}
                    </p>

                    {source.excerpt && (
                      <div className="p-3 bg-ink-100 border-l-4 border-l-gold-500">
                        <div className="flex items-center gap-1 mb-1">
                          <Quote className="w-3 h-3 text-gold-600" />
                          <span className="text-[10px] text-gold-600 font-song">原文摘录</span>
                        </div>
                        <p className="font-song text-sm text-ink-700 italic leading-relaxed">
                          「{source.excerpt}」
                        </p>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-ink-400 font-song">可信度评估</span>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={cn(
                              'w-3 h-3',
                              star <= source.reliability
                                ? 'text-gold-500 fill-gold-500'
                                : 'text-ink-200'
                            )}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
