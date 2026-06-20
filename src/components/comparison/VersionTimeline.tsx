import { useState } from 'react';
import { Clock, Book, Film, Mic, Theater, Grid3X3, ChevronRight } from 'lucide-react';
import type { WuxiaWork, SwordsmanVersion, SwordVersion } from '../../types';
import { cn } from '@/lib/utils';

const WORK_TYPE_ICONS: Record<string, typeof Book> = {
  '小说': Book,
  '影视': Film,
  '评书': Mic,
  '戏曲': Theater,
  '其他': Grid3X3,
};

const WORK_TYPE_COLORS: Record<string, string> = {
  '小说': 'from-cinnabar-500 to-cinnabar-700',
  '影视': 'from-gold-500 to-gold-700',
  '评书': 'from-emerald-500 to-emerald-700',
  '戏曲': 'from-bronze-500 to-bronze-700',
  '其他': 'from-ink-600 to-ink-800',
};

interface VersionTimelineProps {
  works: WuxiaWork[];
  versions: (SwordsmanVersion | SwordVersion)[];
  targetType: 'swordsman' | 'sword';
  targetName: string;
}

export default function VersionTimeline({ works, versions, targetType, targetName }: VersionTimelineProps) {
  const [selectedWorkId, setSelectedWorkId] = useState<string | null>(works[0]?.id || null);

  const sortedWorks = [...works].sort((a, b) => a.year - b.year);
  const selectedWork = works.find(w => w.id === selectedWorkId);
  const selectedVersion = versions.find(v => v.workId === selectedWorkId);

  const getYearDisplay = (year: number) => {
    if (year < 0) {
      return `公元前${Math.abs(year)}年`;
    } else if (year < 100) {
      return `公元${year}年`;
    }
    return `${year}年`;
  };

  return (
    <div className="space-y-8">
      <div className="ink-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <Clock className="w-6 h-6 text-cinnabar-600" />
          <h2 className="font-brush text-3xl text-ink-900">版本时间线</h2>
        </div>

        <p className="font-song text-sm text-ink-500 mb-6">
          「{targetName}」在不同作品中的演绎演变，时间跨度
          {sortedWorks.length > 0 && (
            <span className="text-cinnabar-600 font-brush ml-1">
              {getYearDisplay(sortedWorks[0].year)} - {getYearDisplay(sortedWorks[sortedWorks.length - 1].year)}
            </span>
          )}
        </p>

        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cinnabar-200 via-cinnabar-400 to-gold-400" />
          
          <div className="space-y-4">
            {sortedWorks.map((work, index) => {
              const VersionIcon = WORK_TYPE_ICONS[work.type] || Grid3X3;
              const colorClass = WORK_TYPE_COLORS[work.type] || WORK_TYPE_COLORS['其他'];
              const version = versions.find(v => v.workId === work.id);

              return (
                <div
                  key={work.id}
                  className={cn(
                    'relative pl-20 cursor-pointer group',
                    selectedWorkId === work.id ? 'opacity-100' : 'opacity-70 hover:opacity-100'
                  )}
                  onClick={() => setSelectedWorkId(work.id)}
                >
                  <div className={cn(
                    'absolute left-5 w-6 h-6 rounded-full bg-gradient-to-r shadow-lg border-2 border-ink-100 transform transition-transform duration-200',
                    colorClass,
                    selectedWorkId === work.id ? 'scale-125' : 'group-hover:scale-110'
                  )}>
                    <VersionIcon className="w-3 h-3 text-ink-100 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                  </div>

                  <div className={cn(
                    'ink-card p-4 transition-all duration-200',
                    selectedWorkId === work.id ? 'ring-2 ring-cinnabar-500 shadow-ink-lg' : 'hover:shadow-ink'
                  )}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-brush text-xl text-ink-900">{work.title}</h4>
                          <span className={cn(
                            'text-xs px-2 py-0.5 font-song text-ink-100 bg-gradient-to-r',
                            colorClass
                          )}>
                            {work.type}
                          </span>
                          <span className="text-xs font-song text-ink-400">
                            {getYearDisplay(work.year)}
                          </span>
                        </div>
                        <p className="text-xs font-song text-ink-500 mb-2">
                          作者：{work.author} · {work.dynasty}
                        </p>
                        {version && (
                          <p className="font-song text-sm text-ink-600 line-clamp-2">
                            {version.description}
                          </p>
                        )}
                      </div>
                      <ChevronRight className={cn(
                        'w-5 h-5 flex-shrink-0 transition-transform duration-200',
                        selectedWorkId === work.id ? 'text-cinnabar-600 rotate-90' : 'text-ink-300'
                      )} />
                    </div>
                  </div>

                  {index < sortedWorks.length - 1 && (
                    <div className="absolute left-[31px] top-[52px] w-0.5 h-8 bg-ink-200" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {selectedWork && selectedVersion && (
        <div className="ink-card p-6 animate-fade-in-up">
          <div className="flex items-center gap-3 mb-6">
            <Book className="w-6 h-6 text-gold-600" />
            <h3 className="font-brush text-2xl text-ink-900">
              {selectedWork.title} · 「{targetName}」形象详解
            </h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-4">
                <div className="ink-card p-6 bg-gradient-to-br from-ink-50 to-ink-100">
                  <div className="flex items-center gap-3 mb-4">
                    {'avatarUrl' in selectedVersion && selectedVersion.avatarUrl && (
                      <img
                        src={selectedVersion.avatarUrl}
                        alt={selectedVersion.name}
                        className="w-20 h-20 rounded-full object-cover border-4 border-cinnabar-200 shadow-lg"
                      />
                    )}
                    {'imageUrl' in selectedVersion && selectedVersion.imageUrl && (
                      <img
                        src={selectedVersion.imageUrl}
                        alt={selectedVersion.name}
                        className="w-24 h-32 object-cover border-4 border-cinnabar-200 shadow-lg"
                      />
                    )}
                    <div>
                      <h4 className="font-brush text-2xl text-ink-900">{selectedVersion.name}</h4>
                      {selectedVersion.alias && (
                        <p className="text-sm font-song text-gold-600">「{selectedVersion.alias}」</p>
                      )}
                      {'title' in selectedVersion && selectedVersion.title && (
                        <p className="text-xs font-song text-ink-500 mt-1">{selectedVersion.title}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2 pt-4 border-t border-ink-200">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-song text-ink-500">作品类型</span>
                      <span className={cn(
                        'text-xs px-2 py-0.5 font-song text-ink-100 bg-gradient-to-r',
                        WORK_TYPE_COLORS[selectedWork.type]
                      )}>
                        {selectedWork.type}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-song text-ink-500">创作年代</span>
                      <span className="font-brush text-ink-700">{getYearDisplay(selectedWork.year)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-song text-ink-500">作者</span>
                      <span className="font-brush text-ink-700">{selectedWork.author}</span>
                    </div>
                    {targetType === 'swordsman' && (selectedVersion as SwordsmanVersion).sect && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-song text-ink-500">门派</span>
                        <span className="font-brush text-ink-700">{(selectedVersion as SwordsmanVersion).sect}</span>
                      </div>
                    )}
                    {(selectedVersion as SwordVersion).owner && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-song text-ink-500">持有者</span>
                        <span className="font-brush text-ink-700">{(selectedVersion as SwordVersion).owner}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="ink-card p-4">
                  <h5 className="font-brush text-lg text-ink-900 mb-3">作品简介</h5>
                  <p className="font-song text-sm text-ink-600 leading-relaxed">
                    {selectedWork.description}
                  </p>
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-ink-200">
                    <span className="text-xs font-song text-ink-500">人气指数</span>
                    <div className="flex-1 h-2 bg-ink-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cinnabar-500 to-gold-500"
                        style={{ width: `${(selectedWork.popularity / 10000) * 100}%` }}
                      />
                    </div>
                    <span className="font-brush text-cinnabar-600">
                      {(selectedWork.popularity / 100).toFixed(0)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <div className="ink-card p-6">
                <h5 className="font-brush text-xl text-ink-900 mb-4">形象描述</h5>
                <p className="font-song text-base text-ink-700 leading-loose">
                  {selectedVersion.description}
                </p>
              </div>

              {targetType === 'swordsman' && (selectedVersion as SwordsmanVersion).personality && (
                <div className="ink-card p-6 border-l-4 border-l-gold-500">
                  <h5 className="font-brush text-xl text-gold-700 mb-3">性格特点</h5>
                  <p className="font-song text-base text-ink-700 leading-loose">
                    {(selectedVersion as SwordsmanVersion).personality}
                  </p>
                </div>
              )}

              {targetType === 'swordsman' && (selectedVersion as SwordsmanVersion).appearance && (
                <div className="ink-card p-6 border-l-4 border-l-cinnabar-500">
                  <h5 className="font-brush text-xl text-cinnabar-700 mb-3">外貌描写</h5>
                  <p className="font-song text-base text-ink-700 leading-loose">
                    {(selectedVersion as SwordsmanVersion).appearance}
                  </p>
                </div>
              )}

              {(selectedVersion as SwordVersion).history && (
                <div className="ink-card p-6 border-l-4 border-l-bronze-500">
                  <h5 className="font-brush text-xl text-bronze-700 mb-3">历史渊源</h5>
                  <p className="font-song text-base text-ink-700 leading-loose">
                    {(selectedVersion as SwordVersion).history}
                  </p>
                </div>
              )}

              {(selectedVersion as SwordVersion).legend && (
                <div className="ink-card p-6 border-l-4 border-l-emerald-500">
                  <h5 className="font-brush text-xl text-emerald-700 mb-3">传奇故事</h5>
                  <p className="font-song text-base text-ink-700 leading-loose italic">
                    「{(selectedVersion as SwordVersion).legend}」
                  </p>
                </div>
              )}

              {targetType === 'swordsman' && (selectedVersion as SwordsmanVersion).martialArts.length > 0 && (
                <div className="ink-card p-6">
                  <h5 className="font-brush text-xl text-ink-900 mb-4">武学修为</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(selectedVersion as SwordsmanVersion).martialArts.map((ma, idx) => (
                      <div key={idx} className="p-4 bg-ink-50 hover:bg-ink-100 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-brush text-lg text-ink-900">{ma.name}</span>
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
                        <p className="text-xs font-song text-cinnabar-600 mb-1">境界：{ma.level}</p>
                        <p className="text-xs font-song text-ink-500">{ma.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="ink-card p-6">
                <h5 className="font-brush text-xl text-ink-900 mb-4">重要事件</h5>
                <div className="flex flex-wrap gap-3">
                  {selectedVersion.notableEvents.map((event, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cinnabar-50 to-gold-50 border border-cinnabar-200 hover:shadow-md transition-shadow"
                    >
                      <span className="w-6 h-6 rounded-full bg-gradient-to-r from-cinnabar-500 to-gold-500 text-ink-100 flex items-center justify-center text-xs font-brush">
                        {idx + 1}
                      </span>
                      <span className="font-song text-sm text-ink-700">{event}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
