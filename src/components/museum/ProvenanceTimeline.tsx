import {
  Hammer, FileText, Archive, ArrowRightLeft, Wrench, Eye, Shovel,
  HelpCircle, XCircle, Copy, ChevronDown, ChevronUp
} from 'lucide-react';
import { useState } from 'react';
import type { ProvenanceRecord } from '@/types';
import { cn } from '@/lib/utils';

const EVENT_ICONS: Record<string, typeof Hammer> = {
  '铸造': Hammer,
  '首次记载': FileText,
  '入藏': Archive,
  '流转': ArrowRightLeft,
  '修复': Wrench,
  '展览': Eye,
  '出土': Shovel,
  '丢失': HelpCircle,
  '损毁': XCircle,
  '复制': Copy,
};

const EVENT_COLORS: Record<string, string> = {
  '铸造': 'bg-gradient-to-br from-gold-500 to-gold-700',
  '首次记载': 'bg-gradient-to-br from-bronze-500 to-bronze-700',
  '入藏': 'bg-gradient-to-br from-emerald-500 to-emerald-700',
  '流转': 'bg-gradient-to-br from-bronze-500 to-ink-600',
  '修复': 'bg-gradient-to-br from-cinnabar-500 to-cinnabar-700',
  '展览': 'bg-gradient-to-br from-emerald-500 to-teal-700',
  '出土': 'bg-gradient-to-br from-ink-600 to-ink-800',
  '丢失': 'bg-gradient-to-br from-red-500 to-red-700',
  '损毁': 'bg-gradient-to-br from-red-600 to-red-800',
  '复制': 'bg-gradient-to-br from-ink-400 to-ink-600',
};

const EVIDENCE_LABELS: Record<string, string> = {
  '档案记载': 'bg-blue-50 text-blue-700 border-blue-200',
  '考古证据': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  '专家鉴定': 'bg-gold-50 text-gold-700 border-gold-200',
  '口述传承': 'bg-bronze-50 text-bronze-700 border-bronze-200',
  '照片记录': 'bg-purple-50 text-purple-700 border-purple-200',
  '文献考证': 'bg-ink-50 text-ink-700 border-ink-200',
};

interface ProvenanceTimelineProps {
  records: ProvenanceRecord[];
}

export default function ProvenanceTimeline({ records }: ProvenanceTimelineProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="relative">
      {records.length === 0 ? (
        <div className="text-center py-12">
          <Archive className="w-12 h-12 text-ink-300 mx-auto mb-3" />
          <p className="font-song text-ink-500">暂无流转记录</p>
        </div>
      ) : (
        <div className="relative pl-8">
          <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-gradient-to-b from-gold-400 via-cinnabar-400 to-ink-300" />

          {records.map((record, index) => {
            const Icon = EVENT_ICONS[record.eventType] || FileText;
            const isExpanded = expandedIds.has(record.id);
            const hasDetails = record.notes || record.sourceDocument || record.person || record.location;

            return (
              <div
                key={record.id}
                className="relative mb-6 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.08}s` }}
              >
                <div className={cn(
                  'absolute -left-5 top-0 w-7 h-7 rounded-full flex items-center justify-center shadow-lg',
                  EVENT_COLORS[record.eventType] || EVENT_COLORS['首次记载']
                )}>
                  <Icon className="w-3.5 h-3.5 text-ink-100" />
                </div>

                <div className="ink-card p-4 hover:shadow-ink transition-shadow duration-300">
                  <div
                    className="cursor-pointer"
                    onClick={() => hasDetails && toggleExpand(record.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="seal-stamp text-xs">{record.year}</span>
                        <h4 className="font-brush text-lg text-ink-900">{record.eventType}</h4>
                      </div>
                      {hasDetails && (
                        isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-ink-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-ink-400" />
                        )
                      )}
                    </div>

                    <p className="font-song text-sm text-ink-700 leading-relaxed mb-3">
                      {record.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1.5">
                        <span className={cn(
                          'text-[10px] px-2 py-0.5 border font-song',
                          EVIDENCE_LABELS[record.evidence] || EVIDENCE_LABELS['档案记载']
                        )}>
                          {record.evidence}
                        </span>
                        {record.institutionName && (
                          <span className="text-[10px] px-2 py-0.5 bg-gold-50 text-gold-700 border border-gold-200 font-song">
                            {record.institutionName}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {isExpanded && hasDetails && (
                    <div className="mt-4 pt-4 border-t border-ink-100 space-y-2 animate-fade-in">
                      {record.person && (
                        <div className="flex items-start gap-2 text-xs">
                          <span className="font-song text-ink-500 w-16 flex-shrink-0">关联人物：</span>
                          <span className="font-song text-ink-700">{record.person}</span>
                        </div>
                      )}
                      {record.location && (
                        <div className="flex items-start gap-2 text-xs">
                          <span className="font-song text-ink-500 w-16 flex-shrink-0">地点：</span>
                          <span className="font-song text-ink-700">{record.location}</span>
                        </div>
                      )}
                      {record.sourceDocument && (
                        <div className="flex items-start gap-2 text-xs">
                          <span className="font-song text-ink-500 w-16 flex-shrink-0">文献来源：</span>
                          <span className="font-song text-ink-700 italic">{record.sourceDocument}</span>
                        </div>
                      )}
                      {record.notes && (
                        <div className="flex items-start gap-2 text-xs">
                          <span className="font-song text-ink-500 w-16 flex-shrink-0">备注：</span>
                          <span className="font-song text-ink-700 bg-ink-50 px-2 py-1">{record.notes}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
