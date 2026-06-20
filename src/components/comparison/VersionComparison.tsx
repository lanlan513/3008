import { useState } from 'react';
import { ChevronDown, ChevronUp, Minus, Plus, ArrowRight } from 'lucide-react';
import type { SwordsmanVersion, SwordVersion } from '../../types';
import { cn } from '@/lib/utils';

const SWORDSMAN_ATTR_LABELS: Record<string, { label: string; color: string }> = {
  martialLevel: { label: '武学修为', color: 'from-cinnabar-500 to-cinnabar-700' },
  wisdom: { label: '智谋', color: 'from-gold-500 to-gold-700' },
  leadership: { label: '统帅', color: 'from-bronze-500 to-bronze-700' },
  loyalty: { label: '忠义', color: 'from-emerald-500 to-emerald-700' },
  charisma: { label: '魅力', color: 'from-ink-600 to-ink-800' },
};

const SWORD_ATTR_LABELS: Record<string, { label: string; color: string }> = {
  sharpness: { label: '锋利', color: 'from-cinnabar-500 to-cinnabar-700' },
  hardness: { label: '硬度', color: 'from-bronze-500 to-bronze-700' },
  flexibility: { label: '柔韧', color: 'from-gold-500 to-gold-700' },
  craftsmanship: { label: '工艺', color: 'from-ink-600 to-ink-800' },
};

interface VersionComparisonProps {
  versions: (SwordsmanVersion | SwordVersion)[];
  targetType: 'swordsman' | 'sword';
}

export default function VersionComparison({ versions, targetType }: VersionComparisonProps) {
  const [selectedVersions, setSelectedVersions] = useState<string[]>(
    versions.length >= 2 ? [versions[0].id, versions[1].id] : versions.map(v => v.id)
  );
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    attributes: true,
    description: true,
    martialArts: true,
    notableEvents: true,
  });

  const toggleVersion = (versionId: string) => {
    if (selectedVersions.includes(versionId)) {
      if (selectedVersions.length > 1) {
        setSelectedVersions(selectedVersions.filter(id => id !== versionId));
      }
    } else {
      if (selectedVersions.length < 4) {
        setSelectedVersions([...selectedVersions, versionId]);
      }
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section],
    });
  };

  const selectedVersionData = versions.filter(v => selectedVersions.includes(v.id));

  const getAttributeDifference = (attrKey: string, values: number[]) => {
    const max = Math.max(...values);
    const min = Math.min(...values);
    return max - min;
  };

  const attrLabels = targetType === 'swordsman' ? SWORDSMAN_ATTR_LABELS : SWORD_ATTR_LABELS;
  const attrKeys = Object.keys(attrLabels);

  const SectionHeader = ({ title, section }: { title: string; section: string }) => (
    <button
      onClick={() => toggleSection(section)}
      className="flex items-center justify-between w-full p-4 bg-ink-50 hover:bg-ink-100 transition-colors"
    >
      <h3 className="font-brush text-xl text-ink-900">{title}</h3>
      {expandedSections[section] ? (
        <ChevronUp className="w-5 h-5 text-ink-500" />
      ) : (
        <ChevronDown className="w-5 h-5 text-ink-500" />
      )}
    </button>
  );

  const DiffIndicator = ({ diff }: { diff: number }) => {
    if (diff === 0) return null;
    return (
      <span className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 text-xs font-song rounded',
        diff > 0 ? 'bg-cinnabar-100 text-cinnabar-700' : 'bg-emerald-100 text-emerald-700'
      )}>
        {diff > 0 ? <Plus className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
        {Math.abs(diff)}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="ink-card p-6">
        <h3 className="font-brush text-xl text-ink-900 mb-4">选择对比版本</h3>
        <p className="font-song text-sm text-ink-500 mb-4">最多可选择4个版本进行对比</p>
        <div className="flex flex-wrap gap-3">
          {versions.map((version) => (
            <button
              key={version.id}
              onClick={() => toggleVersion(version.id)}
              className={cn(
                'px-4 py-2 border-2 transition-all duration-200',
                selectedVersions.includes(version.id)
                  ? 'border-cinnabar-600 bg-cinnabar-50 text-cinnabar-700'
                  : 'border-ink-200 bg-ink-50 text-ink-600 hover:border-ink-400'
              )}
            >
              <span className="font-brush">{version.workTitle}</span>
              <span className="text-xs font-song ml-2 opacity-70">
                {version.workAuthor} · {version.workYear}年
              </span>
            </button>
          ))}
        </div>
      </div>

      {selectedVersionData.length >= 2 && (
        <>
          <div className="ink-card overflow-hidden">
            <SectionHeader title="属性差异对比" section="attributes" />
            {expandedSections.attributes && (
              <div className="p-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-ink-200">
                        <th className="text-left py-3 px-4 font-song text-sm text-ink-500 w-32">属性</th>
                        {selectedVersionData.map((version) => (
                          <th key={version.id} className="text-center py-3 px-4 font-song text-sm text-ink-700 min-w-[140px]">
                            <div className="font-brush text-lg">{version.workTitle}</div>
                            <div className="text-xs text-ink-400">{version.workAuthor}</div>
                          </th>
                        ))}
                        <th className="text-center py-3 px-4 font-song text-sm text-ink-500 w-24">差异</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attrKeys.map((attrKey) => {
                        const values = selectedVersionData.map(v => {
                          if (targetType === 'swordsman') {
                            return (v as SwordsmanVersion).attributes?.[attrKey as keyof typeof SWORDSMAN_ATTR_LABELS] || 0;
                          }
                          return (v as SwordVersion).attributes[attrKey as keyof typeof SWORD_ATTR_LABELS] || 0;
                        });
                        const diff = getAttributeDifference(attrKey, values);

                        return (
                          <tr key={attrKey} className="border-b border-ink-100 hover:bg-ink-50">
                            <td className="py-4 px-4">
                              <span className={cn(
                                'inline-block px-3 py-1 text-xs font-song text-ink-100 bg-gradient-to-r',
                                attrLabels[attrKey].color
                              )}>
                                {attrLabels[attrKey].label}
                              </span>
                            </td>
                            {values.map((value, idx) => (
                              <td key={idx} className="py-4 px-4 text-center">
                                <div className="font-brush text-2xl text-ink-800">{value}</div>
                                <div className="mt-2 h-2 bg-ink-100 rounded-full overflow-hidden">
                                  <div
                                    className={cn('h-full bg-gradient-to-r', attrLabels[attrKey].color)}
                                    style={{ width: `${value}%` }}
                                  />
                                </div>
                              </td>
                            ))}
                            <td className="py-4 px-4 text-center">
                              <DiffIndicator diff={diff} />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          <div className="ink-card overflow-hidden">
            <SectionHeader title="形象描述对比" section="description" />
            {expandedSections.description && (
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {selectedVersionData.map((version) => (
                    <div key={version.id} className="space-y-4">
                      <div className="flex items-center gap-3 pb-3 border-b border-ink-200">
                        {'avatarUrl' in version && version.avatarUrl && (
                          <img
                            src={version.avatarUrl}
                            alt={version.name}
                            className="w-16 h-16 rounded-full object-cover border-2 border-cinnabar-200"
                          />
                        )}
                        {'imageUrl' in version && version.imageUrl && (
                          <img
                            src={version.imageUrl}
                            alt={version.name}
                            className="w-16 h-20 object-cover border-2 border-cinnabar-200"
                          />
                        )}
                        <div>
                          <h4 className="font-brush text-xl text-ink-900">{version.workTitle}</h4>
                          <p className="text-xs font-song text-ink-500">
                            {version.workAuthor} · {version.workYear}年 · {version.workType}
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <p className="font-song text-sm text-ink-700 leading-relaxed">
                          {version.description}
                        </p>
                        
                        {targetType === 'swordsman' && (version as SwordsmanVersion).personality && (
                          <div>
                            <span className="font-song text-xs text-ink-500">性格特点：</span>
                            <p className="font-song text-sm text-cinnabar-700 mt-1">
                              {(version as SwordsmanVersion).personality}
                            </p>
                          </div>
                        )}
                        
                        {targetType === 'swordsman' && (version as SwordsmanVersion).appearance && (
                          <div>
                            <span className="font-song text-xs text-ink-500">外貌描写：</span>
                            <p className="font-song text-sm text-ink-700 mt-1">
                              {(version as SwordsmanVersion).appearance}
                            </p>
                          </div>
                        )}

                        {(version as SwordVersion).history && (
                          <div>
                            <span className="font-song text-xs text-ink-500">历史渊源：</span>
                            <p className="font-song text-sm text-ink-700 mt-1">
                              {(version as SwordVersion).history}
                            </p>
                          </div>
                        )}

                        {(version as SwordVersion).legend && (
                          <div>
                            <span className="font-song text-xs text-ink-500">传奇故事：</span>
                            <p className="font-song text-sm text-gold-700 mt-1 italic">
                              「{(version as SwordVersion).legend}」
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {targetType === 'swordsman' && (
            <div className="ink-card overflow-hidden">
              <SectionHeader title="武学修为对比" section="martialArts" />
              {expandedSections.martialArts && (
                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {selectedVersionData.map((version) => {
                      const sv = version as SwordsmanVersion;
                      return (
                        <div key={version.id}>
                          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-ink-200">
                            <h4 className="font-brush text-xl text-ink-900">{version.workTitle}</h4>
                            <span className="text-xs font-song text-ink-400">{sv.martialArts.length}项武学</span>
                          </div>
                          <div className="space-y-3">
                            {sv.martialArts.map((ma, idx) => (
                              <div key={`${ma.name}-${idx}`} className="p-3 bg-ink-50">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="font-brush text-base text-ink-900">{ma.name}</span>
                                  <span className={cn(
                                    'text-xs px-2 py-0.5 font-song text-ink-100 bg-gradient-to-r',
                                    {
                                      'from-cinnabar-500 to-cinnabar-700': ma.type === '剑法',
                                      'from-gold-500 to-gold-700': ma.type === '内功',
                                      'from-emerald-500 to-emerald-700': ma.type === '轻功',
                                      'from-bronze-500 to-bronze-700': ma.type === '掌法',
                                      'from-ink-600 to-ink-800': ma.type === '其他',
                                    }[ma.type] || 'from-ink-600 to-ink-800'
                                  )}>
                                    {ma.type}
                                  </span>
                                </div>
                                <p className="text-xs font-song text-ink-600">境界：{ma.level}</p>
                                <p className="text-xs font-song text-ink-500 mt-1">{ma.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="ink-card overflow-hidden">
            <SectionHeader title="重要事件对比" section="notableEvents" />
            {expandedSections.notableEvents && (
              <div className="p-6">
                <div className="space-y-6">
                  {selectedVersionData.map((version) => (
                    <div key={version.id}>
                      <div className="flex items-center gap-2 mb-4">
                        <h4 className="font-brush text-xl text-ink-900">{version.workTitle}</h4>
                        <span className="text-xs font-song text-ink-400">
                          {version.notableEvents.length}项事件
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {version.notableEvents.map((event, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-2 px-3 py-2 bg-ink-50 border border-ink-200"
                          >
                            <span className="w-6 h-6 rounded-full bg-cinnabar-100 text-cinnabar-700 flex items-center justify-center text-xs font-song">
                              {idx + 1}
                            </span>
                            <span className="font-song text-sm text-ink-700">{event}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-ink-200">
                  <h4 className="font-brush text-lg text-ink-900 mb-4">事件交集分析</h4>
                  <div className="space-y-3">
                    {(() => {
                      const allEvents = selectedVersionData.flatMap(v => v.notableEvents);
                      const eventCounts: Record<string, number> = {};
                      allEvents.forEach(event => {
                        eventCounts[event] = (eventCounts[event] || 0) + 1;
                      });
                      
                      const commonEvents = Object.entries(eventCounts)
                        .filter(([_, count]) => count >= 2)
                        .sort((a, b) => b[1] - a[1]);

                      if (commonEvents.length === 0) {
                        return (
                          <p className="font-song text-sm text-ink-500">各版本间无共同事件</p>
                        );
                      }

                      return commonEvents.map(([event, count]) => (
                        <div key={event} className="flex items-center gap-3">
                          <div className="flex-1">
                            <span className="font-song text-sm text-ink-700">{event}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {[...Array(selectedVersionData.length)].map((_, i) => (
                              <div
                                key={i}
                                className={cn(
                                  'w-3 h-3 rounded-full',
                                  i < count ? 'bg-cinnabar-500' : 'bg-ink-200'
                                )}
                              />
                            ))}
                            <span className="text-xs font-song text-ink-500 ml-2">
                              {count}/{selectedVersionData.length} 版本共有
                            </span>
                          </div>
                        </div>
                      ));
                    })()}
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {selectedVersionData.length < 2 && (
        <div className="ink-card p-8 text-center">
          <ArrowRight className="w-12 h-12 text-ink-300 mx-auto mb-4" />
          <p className="font-song text-ink-500">请至少选择2个版本进行对比</p>
        </div>
      )}
    </div>
  );
}
