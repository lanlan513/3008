import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Clock, BarChart3, Users, Sword, GitBranch, Sparkles } from 'lucide-react';
import { comparisonApi } from '../api';
import type { ComparisonLibrary, WuxiaWork, SwordsmanVersion, SwordVersion } from '../types';
import { cn } from '@/lib/utils';
import VersionComparison from '../components/comparison/VersionComparison';
import VersionTimeline from '../components/comparison/VersionTimeline';

export default function ComparisonDetail() {
  const { targetType, id } = useParams<{ targetType: string; id: string }>();
  const navigate = useNavigate();
  const [library, setLibrary] = useState<ComparisonLibrary | null>(null);
  const [relatedWorks, setRelatedWorks] = useState<WuxiaWork[]>([]);
  const [activeTab, setActiveTab] = useState<'comparison' | 'timeline'>('comparison');
  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (!id || !targetType) return;

    const fetchComparison = async () => {
      setLoading(true);
      try {
        let libraryData: ComparisonLibrary | null = null;
        
        if (targetType === 'swordsman') {
          libraryData = await comparisonApi.getSwordsmanComparison(id);
        } else if (targetType === 'sword') {
          libraryData = await comparisonApi.getSwordComparison(id);
        }

        if (libraryData) {
          setLibrary(libraryData);
          
          const workIds = libraryData.versions.map(v => v.workId);
          const works = await Promise.all(
            workIds.map(workId => comparisonApi.getWorkById(workId).catch(() => null))
          );
          setRelatedWorks(works.filter((w): w is WuxiaWork => w !== null));
        }
      } catch (error) {
        console.error('Failed to fetch comparison:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchComparison();
  }, [id, targetType]);

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-ink-200 border-t-cinnabar-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="font-song text-ink-600">正在加载作品对照...</p>
        </div>
      </div>
    );
  }

  if (!library) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-brush text-3xl text-ink-700 mb-4">对照库未找到</h2>
          <p className="font-song text-ink-500 mb-6">该{targetType === 'swordsman' ? '人物' : '名剑'}暂未收录作品对照</p>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-cinnabar-600 text-ink-100 font-song hover:bg-cinnabar-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            返回
          </button>
        </div>
      </div>
    );
  }

  const isSwordsman = targetType === 'swordsman';
  const sortedVersions = [...library.versions].sort((a, b) => {
    const workA = relatedWorks.find(w => w.id === a.workId);
    const workB = relatedWorks.find(w => w.id === b.workId);
    if (!workA || !workB) return 0;
    return workA.year - workB.year;
  });

  return (
    <div className="min-h-screen pt-16">
      <div className="relative h-[40vh] md:h-[50vh] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-700"
          style={{
            backgroundImage: `url(${library.coverUrl})`,
            opacity: imageLoaded ? 1 : 0,
          }}
        />
        <img
          src={library.coverUrl}
          alt={library.targetName}
          className="hidden"
          onLoad={() => setImageLoaded(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-100 via-ink-100/60 to-ink-900/40" />
        
        <div className="absolute top-4 left-4 z-10">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 bg-ink-100/90 backdrop-blur-sm text-ink-700 font-song hover:bg-ink-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            返回
          </button>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto">
            <div className="animate-fade-in-up" style={{ animationDelay: '0.1s', animationFillMode: 'forwards', opacity: 0 }}>
              <div className="flex items-center gap-3 mb-4">
                <div className={cn(
                  'p-2 rounded-lg bg-ink-100/90 backdrop-blur-sm',
                  isSwordsman ? 'text-cinnabar-600' : 'text-gold-600'
                )}>
                  {isSwordsman ? (
                    <Users className="w-5 h-5" />
                  ) : (
                    <Sword className="w-5 h-5" />
                  )}
                </div>
                <span className="px-3 py-1 bg-ink-100/90 backdrop-blur-sm text-ink-700 font-song text-sm">
                  作品对照库 · {isSwordsman ? '人物' : '名剑'}
                </span>
              </div>
              <h1 className="font-brush text-5xl md:text-7xl text-ink-900 mb-3 text-shadow-ink">
                {library.targetName}
              </h1>
              <p className="font-song text-lg text-ink-700 max-w-2xl leading-relaxed">
                {library.description}
              </p>
              <div className="flex flex-wrap items-center gap-4 mt-4">
                <span className="flex items-center gap-2 text-ink-600 font-song">
                  <BookOpen className="w-4 h-4" />
                  收录作品 {library.versions.length} 部
                </span>
                <span className="flex items-center gap-2 text-ink-600 font-song">
                  <GitBranch className="w-4 h-4" />
                  版本差异 {library.versionCount} 个
                </span>
                <span className="flex items-center gap-2 text-ink-600 font-song">
                  <Sparkles className="w-4 h-4" />
                  作者 {relatedWorks.length} 位
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center gap-4 mb-8">
          <button
            onClick={() => setActiveTab('comparison')}
            className={cn(
              'flex items-center gap-2 px-6 py-3 font-song transition-all duration-300',
              activeTab === 'comparison'
                ? 'bg-cinnabar-600 text-ink-100 shadow-lg'
                : 'bg-ink-50 text-ink-600 hover:bg-ink-100 border border-ink-200'
            )}
          >
            <BarChart3 className="w-4 h-4" />
            属性差异对比
          </button>
          <button
            onClick={() => setActiveTab('timeline')}
            className={cn(
              'flex items-center gap-2 px-6 py-3 font-song transition-all duration-300',
              activeTab === 'timeline'
                ? 'bg-cinnabar-600 text-ink-100 shadow-lg'
                : 'bg-ink-50 text-ink-600 hover:bg-ink-100 border border-ink-200'
            )}
          >
            <Clock className="w-4 h-4" />
            版本时间线
          </button>
        </div>

        {activeTab === 'comparison' && (
          <div className="animate-fade-in">
            <VersionComparison
              versions={library.versions as (SwordsmanVersion | SwordVersion)[]}
              targetType={library.targetType}
            />
          </div>
        )}

        {activeTab === 'timeline' && (
          <div className="animate-fade-in">
            <VersionTimeline
              versions={library.versions as (SwordsmanVersion | SwordVersion)[]}
              works={relatedWorks}
              targetType={library.targetType}
              targetName={library.targetName}
            />
          </div>
        )}

        <div className="ink-divider my-12" />

        <section className="animate-fade-in-up" style={{ animationDelay: '0.4s', animationFillMode: 'forwards', opacity: 0 }}>
          <div className="flex items-center gap-3 mb-8">
            {isSwordsman ? (
              <Users className="w-6 h-6 text-emerald-600" />
            ) : (
              <Sword className="w-6 h-6 text-gold-600" />
            )}
            <h2 className="font-brush text-3xl text-ink-900">
              {isSwordsman ? '作者演绎对比' : '作品设计对比'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedVersions.map((version, index) => {
              const work = relatedWorks.find(w => w.id === version.workId);
              if (!work) return null;
              
              const swordsmanVersion = version as SwordsmanVersion;
              const swordVersion = version as SwordVersion;

              return (
                <div 
                  key={version.id}
                  className="ink-card p-6 hover:shadow-xl transition-all duration-300 group"
                  style={{ animationDelay: `${0.1 * (index + 1)}s`, animationFillMode: 'forwards', opacity: 0 }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-brush text-xl text-ink-900 mb-1 group-hover:text-cinnabar-700 transition-colors">
                        {work.title}
                      </h3>
                      <p className="font-song text-sm text-ink-500">{work.author} · {work.year}年</p>
                    </div>
                    <span className={cn(
                      'px-2 py-1 text-xs font-song',
                      work.type === '小说' ? 'bg-cinnabar-100 text-cinnabar-700' :
                      work.type === '影视' ? 'bg-gold-100 text-gold-700' :
                      work.type === '评书' ? 'bg-emerald-100 text-emerald-700' :
                      work.type === '戏曲' ? 'bg-bronze-100 text-bronze-700' :
                      'bg-ink-100 text-ink-700'
                    )}>
                      {work.type}
                    </span>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-song text-sm text-ink-500 mb-2">
                      {isSwordsman ? '作者演绎特色' : '版本设计特色'}
                    </h4>
                    <p className="font-song text-ink-700 leading-relaxed text-sm">
                      {version.authorInterpretation}
                    </p>
                  </div>

                  {isSwordsman && swordsmanVersion.martialArts && (
                    <div className="mb-4">
                      <h4 className="font-song text-sm text-ink-500 mb-2">武功设定</h4>
                      <div className="flex flex-wrap gap-1">
                        {swordsmanVersion.martialArts.slice(0, 4).map((ma, idx) => (
                          <span key={idx} className="px-2 py-1 bg-ink-50 text-ink-600 text-xs font-song border border-ink-200">
                            {ma.name}
                          </span>
                        ))}
                        {swordsmanVersion.martialArts.length > 4 && (
                          <span className="px-2 py-1 bg-ink-50 text-ink-500 text-xs font-song">
                            +{swordsmanVersion.martialArts.length - 4}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {!isSwordsman && swordVersion.materials && (
                    <div className="mb-4">
                      <h4 className="font-song text-sm text-ink-500 mb-2">铸剑材质</h4>
                      <div className="flex flex-wrap gap-1">
                        {swordVersion.materials.map((material, idx) => (
                          <span key={idx} className="px-2 py-1 bg-gold-50 text-gold-700 text-xs font-song border border-gold-200">
                            {material}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-4 border-t border-ink-100">
                    <div className="flex items-center gap-2 text-xs text-ink-500 font-song">
                      <span>朝代: {work.dynasty}</span>
                      <span>·</span>
                      <span>人气: {work.popularity.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
