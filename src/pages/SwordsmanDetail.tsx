import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Building2,
  Flame,
  BookOpen,
  Sword as SwordIcon,
  History,
  Users,
  Share2,
  Heart,
  Star,
  Zap,
  ChevronRight,
  ScrollText,
  Network,
} from 'lucide-react';
import { swordsmanApi, comparisonApi } from '../api';
import type { SwordsmanDetail, Sword, MartialArt, LifeEvent, SwordsmanSwordTenure, SwordHeritage, ComparisonLibrary } from '../types';
import { cn } from '@/lib/utils';
import RelationshipGraph from '../components/swordsman/RelationshipGraph';
import SwordsmanTenureList from '../components/swordsman/SwordsmanTenureList';
import SwordsmanSwordGraph from '../components/swordsman/SwordsmanSwordGraph';
import SwordHeritageChain from '../components/swordsman/SwordHeritageChain';
import ComparisonEntry from '../components/comparison/ComparisonEntry';

const MARTIAL_ART_COLORS: Record<string, string> = {
  '剑法': 'from-cinnabar-500 to-cinnabar-700',
  '内功': 'from-gold-500 to-gold-700',
  '轻功': 'from-emerald-500 to-emerald-700',
  '掌法': 'from-bronze-500 to-bronze-700',
  '其他': 'from-ink-600 to-ink-800',
};

const LEVEL_STARS: Record<string, number> = {
  '入门': 1,
  '熟练': 2,
  '精通': 3,
  '出神入化': 4,
};

export default function SwordsmanDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [swordsman, setSwordsman] = useState<SwordsmanDetail | null>(null);
  const [swords, setSwords] = useState<Sword[]>([]);
  const [swordTenures, setSwordTenures] = useState<SwordsmanSwordTenure[]>([]);
  const [heritages, setHeritages] = useState<SwordHeritage[]>([]);
  const [comparison, setComparison] = useState<ComparisonLibrary | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchSwordsmanDetail = async () => {
      setLoading(true);
      try {
        const [detailData, swordsData, tenuresData, heritagesData, comparisonData] = await Promise.all([
          swordsmanApi.getSwordsmanDetailById(id),
          swordsmanApi.getSwordsmanSwords(id),
          swordsmanApi.getSwordsmanSwordTenures(id),
          swordsmanApi.getSwordsmanHeritages(id),
          comparisonApi.getSwordsmanComparison(id).catch(() => null),
        ]);
        setSwordsman(detailData);
        setSwords(swordsData);
        setSwordTenures(tenuresData);
        setHeritages(heritagesData);
        setComparison(comparisonData);
      } catch (error) {
        console.error('Failed to fetch swordsman detail:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSwordsmanDetail();
  }, [id]);

  const renderMartialArtCard = (martialArt: MartialArt, index: number) => {
    const stars = LEVEL_STARS[martialArt.level] || 0;
    const colorClass = MARTIAL_ART_COLORS[martialArt.type] || MARTIAL_ART_COLORS['其他'];

    return (
      <div
        key={`${martialArt.name}-${index}`}
        className="ink-card p-4 animate-fade-in-up hover:shadow-ink-lg transition-all duration-300"
        style={{ animationDelay: `${0.3 + index * 0.1}s`, opacity: 0 }}
      >
        <div className="flex items-start justify-between mb-3">
          <div>
            <h4 className="font-brush text-lg text-ink-900">{martialArt.name}</h4>
            <span className={cn(
              'inline-block mt-1 text-xs px-2 py-0.5 text-ink-100 font-song bg-gradient-to-r',
              colorClass
            )}>
              {martialArt.type}
            </span>
          </div>
          <div className="flex gap-0.5">
            {[...Array(4)].map((_, i) => (
              <Star
                key={i}
                className={cn(
                  'w-4 h-4 transition-all duration-300',
                  i < stars ? 'text-gold-500 fill-gold-500' : 'text-ink-200'
                )}
              />
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-song text-ink-500">境界：</span>
          <span className="text-sm font-brush text-cinnabar-700">{martialArt.level}</span>
        </div>
        <p className="text-sm font-song text-ink-600 leading-relaxed">
          {martialArt.description}
        </p>
      </div>
    );
  };

  const renderEventTimeline = (event: LifeEvent, index: number, total: number) => (
    <div
      key={event.id}
      className="relative animate-fade-in-up"
      style={{ animationDelay: `${0.3 + index * 0.15}s`, opacity: 0 }}
    >
      <div className="flex gap-4">
        <div className="relative flex flex-col items-center">
          <div className="w-4 h-4 rounded-full bg-cinnabar-600 border-4 border-ink-100 shadow-ink z-10" />
          {index < total - 1 && (
            <div className="w-0.5 flex-1 bg-gradient-to-b from-cinnabar-400 to-ink-200" />
          )}
        </div>
        <div className="flex-1 pb-8">
          <div className="ink-card p-4 hover:shadow-ink-lg transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
              <span className="seal-stamp text-xs">{event.year}</span>
              <h4 className="font-brush text-lg text-ink-900">{event.title}</h4>
            </div>
            <p className="text-sm font-song text-ink-600 leading-relaxed mb-3">
              {event.description}
            </p>
            {event.relatedSwords && event.relatedSwords.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <span className="text-xs font-song text-ink-500">相关名剑：</span>
                {event.relatedSwords.map((swordId) => {
                  const sword = swords.find(s => s.id === swordId);
                  return sword ? (
                    <Link
                      key={swordId}
                      to={`/swords/${swordId}`}
                      className="text-xs font-song text-cinnabar-600 hover:text-cinnabar-700 underline"
                    >
                      {sword.name}
                    </Link>
                  ) : null;
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-ink-200 border-t-cinnabar-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="font-song text-ink-600">正在查询剑客资料...</p>
        </div>
      </div>
    );
  }

  if (!swordsman) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-brush text-3xl text-ink-700 mb-4">剑客未找到</h2>
          <p className="font-song text-ink-500 mb-6">此人或许已归隐江湖，不知所踪</p>
          <button
            onClick={() => navigate('/swordsmen')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-cinnabar-600 text-ink-100 font-song hover:bg-cinnabar-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            返回剑客列传
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16">
      <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-700"
          style={{
            backgroundImage: `url(${swordsman.avatarUrl})`,
            opacity: imageLoaded ? 1 : 0,
            filter: 'blur(8px) brightness(0.7)',
            transform: 'scale(1.1)',
          }}
        />
        <img
          src={swordsman.avatarUrl}
          alt={swordsman.name}
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
              <div className="flex items-end gap-6">
                <div className="relative flex-shrink-0">
                  <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-ink-100 shadow-ink-lg">
                    <img
                      src={swordsman.avatarUrl}
                      alt={swordsman.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-cinnabar-600 text-ink-100 px-3 py-1 font-brush transform rotate-[-8deg] shadow-lg">
                    {swordsman.dynasty}
                  </div>
                </div>
                <div className="flex-1">
                  <span className="seal-stamp mb-3 inline-block">{swordsman.title}</span>
                  <h1 className="font-brush text-5xl md:text-7xl text-ink-900 mb-3 text-shadow-ink">
                    {swordsman.name}
                  </h1>
                  <div className="flex flex-wrap items-center gap-6 text-ink-600">
                    {swordsman.birthYear && swordsman.deathYear && (
                      <span className="flex items-center gap-2 font-song">
                        <Calendar className="w-4 h-4" />
                        {swordsman.birthYear} - {swordsman.deathYear}
                      </span>
                    )}
                    {swordsman.birthplace && (
                      <span className="flex items-center gap-2 font-song">
                        <MapPin className="w-4 h-4" />
                        {swordsman.birthplace}
                      </span>
                    )}
                    <span className="flex items-center gap-2 font-song">
                      <Building2 className="w-4 h-4" />
                      {swordsman.sect}
                    </span>
                    <span className="flex items-center gap-2 font-song text-gold-600">
                      <SwordIcon className="w-4 h-4" />
                      佩剑 {swords.length}柄
                    </span>
                  </div>
                </div>
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
                <h2 className="font-brush text-3xl text-ink-900">生平简介</h2>
              </div>
              <div className="scroll-container">
                <p className="font-song text-lg text-ink-700 leading-loose first-letter:text-5xl first-letter:font-brush first-letter:text-cinnabar-600 first-letter:float-left first-letter:mr-3">
                  {swordsman.biography}
                </p>
              </div>
            </section>

            <div className="ink-divider" />

            <section className="animate-fade-in-up" style={{ animationDelay: '0.4s', animationFillMode: 'forwards', opacity: 0 }}>
              <div className="flex items-center gap-3 mb-6">
                <Zap className="w-6 h-6 text-gold-600" />
                <h2 className="font-brush text-3xl text-ink-900">武学修为</h2>
              </div>
              {swordsman.martialArts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {swordsman.martialArts.map((martialArt, index) =>
                    renderMartialArtCard(martialArt, index)
                  )}
                </div>
              ) : (
                <div className="ink-card p-8 text-center">
                  <Zap className="w-12 h-12 text-ink-300 mx-auto mb-4" />
                  <p className="font-song text-ink-500">暂无武学记载</p>
                </div>
              )}
            </section>

            <div className="ink-divider" />

            <section className="animate-fade-in-up" style={{ animationDelay: '0.5s', animationFillMode: 'forwards', opacity: 0 }}>
              <div className="flex items-center gap-3 mb-6">
                <History className="w-6 h-6 text-bronze-600" />
                <h2 className="font-brush text-3xl text-ink-900">生平大事记</h2>
              </div>
              {swordsman.events.length > 0 ? (
                <div className="relative">
                  {swordsman.events.map((event, index) =>
                    renderEventTimeline(event, index, swordsman.events.length)
                  )}
                </div>
              ) : (
                <div className="ink-card p-8 text-center">
                  <History className="w-12 h-12 text-ink-300 mx-auto mb-4" />
                  <p className="font-song text-ink-500">暂无相关事件记载</p>
                </div>
              )}
            </section>

            <div className="ink-divider" />

            <section>
              <div className="flex items-center gap-3 mb-6">
                <ScrollText className="w-6 h-6 text-gold-600" />
                <h2 className="font-brush text-3xl text-ink-900">名剑传承</h2>
              </div>
              <SwordsmanTenureList tenures={swordTenures} swordsmanName={swordsman.name} />
            </section>

            <div className="ink-divider" />

            {heritages.length > 0 && (
              <>
                <section>
                  <div className="flex items-center gap-3 mb-6">
                    <Network className="w-6 h-6 text-cinnabar-600" />
                    <h2 className="font-brush text-3xl text-ink-900">名剑谱系</h2>
                  </div>
                  <SwordsmanSwordGraph
                    tenures={swordTenures}
                    swordsmanName={swordsman.name}
                    swordsmanAvatarUrl={swordsman.avatarUrl}
                  />
                </section>

                <div className="ink-divider" />

                <section>
                  <div className="flex items-center gap-3 mb-6">
                    <SwordIcon className="w-6 h-6 text-gold-600" />
                    <h2 className="font-brush text-3xl text-ink-900">传承脉络</h2>
                  </div>
                  <SwordHeritageChain
                    heritages={heritages}
                    currentSwordsmanId={swordsman.id}
                    currentSwordsmanName={swordsman.name}
                  />
                </section>

                <div className="ink-divider" />
              </>
            )}

            <section className="animate-fade-in-up" style={{ animationDelay: '0.6s', animationFillMode: 'forwards', opacity: 0 }}>
              <div className="flex items-center gap-3 mb-6">
                <Users className="w-6 h-6 text-emerald-600" />
                <h2 className="font-brush text-3xl text-ink-900">人物关系网络</h2>
              </div>
              <RelationshipGraph
                currentSwordsmanId={swordsman.id}
                currentSwordsmanName={swordsman.name}
                relationships={swordsman.relationships}
                avatarUrl={swordsman.avatarUrl}
              />
            </section>
          </div>

          <div className="space-y-8">
            {comparison && (
              <ComparisonEntry
                targetId={id!}
                targetName={swordsman?.name || ''}
                targetType="swordsman"
                hasComparison={!!comparison}
                style={{ animationDelay: '0.25s', animationFillMode: 'forwards', opacity: 0 }}
              />
            )}

            <div className="ink-card p-6 animate-fade-in-up" style={{ animationDelay: '0.3s', animationFillMode: 'forwards', opacity: 0 }}>
              <h3 className="font-brush text-2xl text-ink-900 mb-6 flex items-center gap-2">
                <SwordIcon className="w-5 h-5 text-cinnabar-600" />
                佩剑名剑
              </h3>

              {swords.length > 0 ? (
                <div className="space-y-4">
                  {swords.map((sword) => (
                    <Link
                      key={sword.id}
                      to={`/swords/${sword.id}`}
                      className="block group"
                    >
                      <div className="flex gap-4 p-3 bg-ink-50 hover:bg-ink-100 transition-all duration-300 group-hover:shadow-ink">
                        <div className="w-16 h-20 flex-shrink-0 overflow-hidden border border-ink-200">
                          <img
                            src={sword.imageUrl}
                            alt={sword.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-brush text-lg text-ink-900 group-hover:text-cinnabar-700 transition-colors">
                              {sword.name}
                            </h4>
                            <ChevronRight className="w-4 h-4 text-ink-400 group-hover:text-cinnabar-600 transition-colors" />
                          </div>
                          <span className="text-xs text-gold-600 font-song">「{sword.alias}」</span>
                          <p className="text-xs font-song text-ink-500 mt-1 line-clamp-2">
                            {sword.description}
                          </p>
                          <div className="flex items-center gap-3 mt-2">
                            <span className="flex items-center gap-1 text-[10px] text-ink-400">
                              <Flame className="w-3 h-3" />
                              {(sword.popularity / 100).toFixed(0)}人气
                            </span>
                            <span className="text-[10px] text-ink-400 font-song">
                              {sword.dynasty}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <SwordIcon className="w-12 h-12 text-ink-300 mx-auto mb-3" />
                  <p className="font-song text-ink-500 text-sm">暂无佩剑记载</p>
                </div>
              )}
            </div>

            <div className="ink-card p-6 animate-fade-in-up" style={{ animationDelay: '0.4s', animationFillMode: 'forwards', opacity: 0 }}>
              <h3 className="font-brush text-xl text-ink-900 mb-4">相关标签</h3>
              <div className="flex flex-wrap gap-2">
                <span className="seal-stamp text-xs">{swordsman.dynasty}</span>
                <span className="bg-bronze-50 text-bronze-700 text-xs px-3 py-1 font-song border border-bronze-200">
                  {swordsman.sect}
                </span>
                <span className="bg-gold-50 text-gold-700 text-xs px-3 py-1 font-song border border-gold-200">
                  {swordsman.title}
                </span>
                <span className="bg-ink-50 text-ink-700 text-xs px-3 py-1 font-song border border-ink-200">
                  剑客
                </span>
                {swordsman.martialArts.map((ma) => (
                  <span
                    key={ma.name}
                    className="bg-cinnabar-50 text-cinnabar-700 text-xs px-3 py-1 font-song border border-cinnabar-200"
                  >
                    {ma.name}
                  </span>
                ))}
              </div>
            </div>

            <div className="ink-card p-6 animate-fade-in-up" style={{ animationDelay: '0.5s', animationFillMode: 'forwards', opacity: 0 }}>
              <h3 className="font-brush text-xl text-ink-900 mb-4">了解更多</h3>
              <div className="space-y-3">
                <Link
                  to="/swordsmen"
                  className="flex items-center justify-between p-3 bg-ink-50 hover:bg-ink-100 transition-colors font-song text-sm text-ink-700"
                >
                  <span>浏览全部剑客</span>
                  <ArrowLeft className="w-4 h-4 rotate-180" />
                </Link>
                <Link
                  to="/swords"
                  className="flex items-center justify-between p-3 bg-ink-50 hover:bg-ink-100 transition-colors font-song text-sm text-ink-700"
                >
                  <span>查看名剑谱</span>
                  <ArrowLeft className="w-4 h-4 rotate-180" />
                </Link>
                <Link
                  to="/sects"
                  className="flex items-center justify-between p-3 bg-ink-50 hover:bg-ink-100 transition-colors font-song text-sm text-ink-700"
                >
                  <span>探访武林门派</span>
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
