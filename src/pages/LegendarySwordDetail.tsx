import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Calendar, Ghost, Sparkles, Share2, Heart,
  MapPin, BookOpen, HelpCircle, ChevronRight, Swords, Tag
} from 'lucide-react';
import { legendarySwordApi, swordApi } from '../api';
import type { LegendarySword, Sword } from '../types';
import { cn } from '@/lib/utils';
import CredibilityBadge, { CREDIBILITY_CONFIG } from '../components/legendary/CredibilityBadge';
import SourceList from '../components/legendary/SourceList';
import AcademicCitations from '../components/legendary/AcademicCitations';

export default function LegendarySwordDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [sword, setSword] = useState<LegendarySword | null>(null);
  const [relatedSwords, setRelatedSwords] = useState<Sword[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchSword = async () => {
      setLoading(true);
      try {
        const swordData = await legendarySwordApi.getLegendarySwordById(id);
        setSword(swordData);

        if (swordData.relatedSwordIds && swordData.relatedSwordIds.length > 0) {
          const relatedPromises = swordData.relatedSwordIds.map(sid =>
            swordApi.getSwordById(sid).catch(() => null)
          );
          const results = await Promise.all(relatedPromises);
          setRelatedSwords(results.filter((s): s is Sword => s !== null));
        }
      } catch (error) {
        console.error('Failed to fetch legendary sword:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSword();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-ink-200 border-t-cinnabar-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="font-song text-ink-600">正在寻觅失传名剑...</p>
        </div>
      </div>
    );
  }

  if (!sword) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-brush text-3xl text-ink-700 mb-4">名剑已湮灭于历史</h2>
          <p className="font-song text-ink-500 mb-6">此剑或许只存在于更深的传说之中</p>
          <button
            onClick={() => navigate('/legendary-swords')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-cinnabar-600 text-ink-100 font-song hover:bg-cinnabar-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            返回档案库
          </button>
        </div>
      </div>
    );
  }

  const credibilityConfig = CREDIBILITY_CONFIG[sword.credibilityLevel];

  return (
    <div className="min-h-screen pt-16">
      <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-700"
          style={{
            backgroundImage: `url(${sword.imageUrl})`,
            opacity: imageLoaded ? 1 : 0,
          }}
        />
        <img
          src={sword.imageUrl}
          alt={sword.name}
          className="hidden"
          onLoad={() => setImageLoaded(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-100 via-ink-100/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-100/80 via-transparent to-ink-100/60" />

        <div className="absolute top-4 left-4 z-10">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 bg-ink-100/90 backdrop-blur-sm text-ink-700 font-song hover:bg-ink-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            返回
          </button>
        </div>

        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <button
            onClick={() => setIsLiked(!isLiked)}
            className={cn(
              'p-3 bg-ink-100/90 backdrop-blur-sm transition-all',
              isLiked ? 'text-cinnabar-600' : 'text-ink-600 hover:text-cinnabar-600'
            )}
          >
            <Heart className={cn('w-5 h-5', isLiked && 'fill-current')} />
          </button>
          <button className="p-3 bg-ink-100/90 backdrop-blur-sm text-ink-600 hover:text-ink-800 transition-colors">
            <Share2 className="w-5 h-5" />
          </button>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto">
            <div className="animate-fade-in-up" style={{ animationDelay: '0.2s', animationFillMode: 'forwards', opacity: 0 }}>
              <div className="mb-3">
                <CredibilityBadge level={sword.credibilityLevel} size="lg" showDescription />
              </div>
              <h1 className="font-brush text-6xl md:text-8xl text-ink-900 mb-2 text-shadow-ink">
                {sword.name}
              </h1>
              <div className="flex flex-wrap items-center gap-6 text-ink-600">
                <span className="font-brush text-xl text-ink-500">「{sword.alias}」</span>
                <span className="flex items-center gap-2 font-song">
                  <Calendar className="w-4 h-4" />
                  {sword.dynasty}
                </span>
                <span className="flex items-center gap-2 font-song text-gold-600">
                  <Ghost className="w-4 h-4" />
                  神秘度 {sword.mysteryLevel}/5
                </span>
                <span className="flex items-center gap-2 font-song text-cinnabar-600">
                  <Sparkles className="w-4 h-4" />
                  人气 {sword.popularity.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-12">
            <section className="animate-fade-in-up" style={{ animationDelay: '0.3s', animationFillMode: 'forwards', opacity: 0 }}>
              <div className="flex items-center gap-3 mb-6">
                <BookOpen className="w-6 h-6 text-cinnabar-600" />
                <h2 className="font-brush text-3xl text-ink-900">名剑简介</h2>
              </div>
              <div className="scroll-container">
                <p className="font-song text-lg text-ink-700 leading-loose first-letter:text-5xl first-letter:font-brush first-letter:text-cinnabar-600 first-letter:float-left first-letter:mr-3">
                  {sword.description}
                </p>
              </div>
            </section>

            <div className="ink-divider" />

            <section className="animate-fade-in-up" style={{ animationDelay: '0.4s', animationFillMode: 'forwards', opacity: 0 }}>
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="w-6 h-6 text-bronze-600" />
                <h2 className="font-brush text-3xl text-ink-900">传说故事</h2>
              </div>
              <div className="ink-card p-6 border-l-4 border-l-cinnabar-600">
                <p className="font-song text-ink-700 leading-loose italic">
                  「{sword.legend}」
                </p>
              </div>
            </section>

            <div className="ink-divider" />

            <section className="animate-fade-in-up" style={{ animationDelay: '0.5s', animationFillMode: 'forwards', opacity: 0 }}>
              <div className="flex items-center gap-3 mb-6">
                <HelpCircle className="w-6 h-6 text-red-600" />
                <h2 className="font-brush text-3xl text-ink-900">失踪之谜</h2>
              </div>
              <div className="ink-card p-6">
                <div className="space-y-4">
                  {sword.lastSeen && (
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-ink-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-song text-sm text-ink-500">最后出现</span>
                        <p className="font-song text-ink-700">{sword.lastSeen}</p>
                      </div>
                    </div>
                  )}
                  {sword.disappearanceTheory && (
                    <div className="flex items-start gap-3">
                      <Ghost className="w-5 h-5 text-ink-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-song text-sm text-ink-500">失踪推测</span>
                        <p className="font-song text-ink-700">{sword.disappearanceTheory}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>

            <div className="ink-divider" />

            <section>
              <SourceList sources={sword.sources} />
            </section>

            <div className="ink-divider" />

            <section>
              <AcademicCitations citations={sword.citations} />
            </section>
          </div>

          <div className="space-y-8">
            <div className="ink-card p-6 animate-fade-in-up sticky top-24" style={{ animationDelay: '0.3s', animationFillMode: 'forwards', opacity: 0 }}>
              <h3 className="font-brush text-2xl text-ink-900 mb-6">可信度评估</h3>

              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-song text-sm text-ink-600">可信度评分</span>
                    <span className="font-brush text-lg text-ink-800">{sword.credibilityScore}%</span>
                  </div>
                  <div className="sword-attribute-bar h-3">
                    <div
                      className={cn('sword-attribute-bar-fill h-full', credibilityConfig.barColor)}
                      style={{ width: `${sword.credibilityScore}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-song text-sm text-ink-600">神秘度</span>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Ghost
                          key={star}
                          className={cn(
                            'w-4 h-4',
                            star <= sword.mysteryLevel
                              ? 'text-cinnabar-500 fill-cinnabar-500'
                              : 'text-ink-200'
                          )}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-song text-sm text-ink-600">史料数量</span>
                    <span className="font-brush text-lg text-gold-600">{sword.evidenceCount}</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-ink-200">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="font-brush text-3xl text-cinnabar-600">{sword.sources.length}</div>
                    <div className="font-song text-xs text-ink-500">资料来源</div>
                  </div>
                  <div>
                    <div className="font-brush text-3xl text-purple-600">{sword.citations.length}</div>
                    <div className="font-song text-xs text-ink-500">学术考据</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-ink-200">
                <h4 className="font-song text-sm text-ink-600 mb-3">考据结论分布</h4>
                <div className="space-y-2">
                  {Object.entries(
                    sword.citations.reduce<Record<string, number>>((acc, c) => {
                      acc[c.conclusion] = (acc[c.conclusion] || 0) + 1;
                      return acc;
                    }, {})
                  ).map(([conclusion, count]) => (
                    <div key={conclusion} className="flex items-center justify-between">
                      <span className="font-song text-xs text-ink-600">{conclusion}</span>
                      <span className="font-song text-xs text-ink-800">{count} 人</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {relatedSwords.length > 0 && (
              <div className="ink-card p-6 animate-fade-in-up" style={{ animationDelay: '0.4s', animationFillMode: 'forwards', opacity: 0 }}>
                <h3 className="font-brush text-xl text-ink-900 mb-4 flex items-center gap-2">
                  <Swords className="w-5 h-5 text-emerald-600" />
                  关联名剑
                </h3>
                <div className="space-y-3">
                  {relatedSwords.map((rs) => (
                    <Link
                      key={rs.id}
                      to={`/swords/${rs.id}`}
                      className="block group"
                    >
                      <div className="flex items-center gap-3 p-2 bg-ink-50 hover:bg-ink-100 transition-all duration-300">
                        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-ink-200 flex-shrink-0 group-hover:border-cinnabar-500 transition-colors">
                          <img
                            src={rs.imageUrl}
                            alt={rs.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-brush text-base text-ink-900 group-hover:text-cinnabar-700 transition-colors">
                              {rs.name}
                            </span>
                            <span className="text-[10px] text-gold-600 font-song">「{rs.alias}」</span>
                          </div>
                          <span className="text-[10px] text-ink-500 font-song">{rs.dynasty} · 传世名剑</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-ink-400 group-hover:text-cinnabar-600 transition-colors" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="ink-card p-6 animate-fade-in-up" style={{ animationDelay: '0.5s', animationFillMode: 'forwards', opacity: 0 }}>
              <h3 className="font-brush text-xl text-ink-900 mb-4 flex items-center gap-2">
                <Tag className="w-5 h-5 text-bronze-600" />
                标签
              </h3>
              <div className="flex flex-wrap gap-2">
                {sword.tags.map((tag) => (
                  <span key={tag} className="text-xs text-ink-600 font-song bg-ink-100 px-3 py-1 border border-ink-200">
                    {tag}
                  </span>
                ))}
                <span className="seal-stamp text-xs">{sword.dynasty}</span>
                <span className="bg-bronze-50 text-bronze-700 text-xs px-3 py-1 font-song border border-bronze-200">
                  失传名剑
                </span>
                <span className="bg-gold-50 text-gold-700 text-xs px-3 py-1 font-song border border-gold-200">
                  {sword.credibilityLevel}
                </span>
              </div>
            </div>

            <div className="ink-card p-6 animate-fade-in-up" style={{ animationDelay: '0.6s', animationFillMode: 'forwards', opacity: 0 }}>
              <h3 className="font-brush text-xl text-ink-900 mb-4">了解更多</h3>
              <div className="space-y-3">
                <Link
                  to="/legendary-swords"
                  className="flex items-center justify-between p-3 bg-ink-50 hover:bg-ink-100 transition-colors font-song text-sm text-ink-700"
                >
                  <span>浏览全部失传名剑</span>
                  <ArrowLeft className="w-4 h-4 rotate-180" />
                </Link>
                <Link
                  to="/swords"
                  className="flex items-center justify-between p-3 bg-ink-50 hover:bg-ink-100 transition-colors font-song text-sm text-ink-700"
                >
                  <span>查看传世名剑谱</span>
                  <ArrowLeft className="w-4 h-4 rotate-180" />
                </Link>
                <Link
                  to="/knowledge"
                  className="flex items-center justify-between p-3 bg-ink-50 hover:bg-ink-100 transition-colors font-song text-sm text-ink-700"
                >
                  <span>前往知识学院</span>
                  <ArrowLeft className="w-4 h-4 rotate-180" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
