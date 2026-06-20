import { GraduationCap, BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import type { AcademicCitation, CitationConclusion } from '../../types';
import { cn } from '@/lib/utils';

const CONCLUSION_CONFIG: Record<CitationConclusion, { label: string; color: string; bgColor: string; icon: string }> = {
  '确有其剑': { label: '确有其剑', color: 'text-emerald-700', bgColor: 'bg-emerald-50 border-emerald-300', icon: '✓' },
  '可能存在': { label: '可能存在', color: 'text-blue-700', bgColor: 'bg-blue-50 border-blue-300', icon: '?' },
  '疑为虚构': { label: '疑为虚构', color: 'text-yellow-700', bgColor: 'bg-yellow-50 border-yellow-300', icon: '△' },
  '纯属传说': { label: '纯属传说', color: 'text-red-700', bgColor: 'bg-red-50 border-red-300', icon: '✗' },
  '待考': { label: '待考', color: 'text-ink-600', bgColor: 'bg-ink-50 border-ink-300', icon: '○' },
};

interface AcademicCitationsProps {
  citations: AcademicCitation[];
}

export default function AcademicCitations({ citations }: AcademicCitationsProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  const conclusionCounts = citations.reduce<Record<string, number>>((acc, c) => {
    acc[c.conclusion] = (acc[c.conclusion] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-6">
        <GraduationCap className="w-6 h-6 text-purple-600" />
        <h2 className="font-brush text-3xl text-ink-900">学术考据</h2>
        <span className="text-sm text-ink-500 font-song">共 {citations.length} 条</span>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {Object.entries(conclusionCounts).map(([conclusion, count]) => {
          const config = CONCLUSION_CONFIG[conclusion as CitationConclusion];
          return (
            <span key={conclusion} className={cn('text-xs px-3 py-1 border font-song', config.bgColor, config.color)}>
              {config.icon} {config.label} ({count})
            </span>
          );
        })}
      </div>

      <div className="space-y-4">
        {citations.map((citation, index) => {
          const config = CONCLUSION_CONFIG[citation.conclusion];
          const isExpanded = expandedId === citation.id;

          return (
            <div
              key={citation.id}
              className={cn(
                'ink-card overflow-hidden transition-all',
                isExpanded && 'shadow-ink-hover'
              )}
            >
              <button
                onClick={() => toggleExpand(citation.id)}
                className="w-full p-5 flex items-start gap-4 text-left"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-ink-100 flex items-center justify-center">
                  <span className="font-brush text-sm text-ink-700">{index + 1}</span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-brush text-lg text-ink-900">{citation.researcher}</span>
                    <span className="text-xs text-ink-400 font-song">{citation.year}</span>
                  </div>

                  <span className={cn('inline-flex items-center gap-1 text-[10px] px-2 py-0.5 border font-song', config.bgColor, config.color)}>
                    {config.icon} {config.label}
                  </span>

                  {!isExpanded && (
                    <p className="mt-2 font-song text-sm text-ink-600 line-clamp-2 leading-relaxed">
                      {citation.content}
                    </p>
                  )}
                </div>

                {isExpanded ? (
                  <ChevronUp className="w-4 h-4 text-ink-400 flex-shrink-0 mt-1" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-ink-400 flex-shrink-0 mt-1" />
                )}
              </button>

              {isExpanded && (
                <div className="px-5 pb-5 pl-[3.5rem] animate-fade-in-up">
                  <div className="scroll-container p-4 mb-4">
                    <p className="font-song text-sm text-ink-700 leading-loose">
                      {citation.content}
                    </p>
                  </div>

                  {citation.references.length > 0 && (
                    <div className="p-3 bg-ink-50 border border-ink-200">
                      <div className="flex items-center gap-2 mb-2">
                        <BookOpen className="w-4 h-4 text-ink-500" />
                        <span className="text-xs text-ink-500 font-song">参考书目</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {citation.references.map((ref, i) => (
                          <span
                            key={i}
                            className="text-[10px] text-ink-600 font-song bg-ink-100 px-2 py-0.5 border border-ink-200"
                          >
                            {ref}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
