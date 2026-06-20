import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft, MapPin, Building2, Shield, Calendar, Ruler, Weight,
  Star, Eye, AlertTriangle, Wrench, History, GalleryHorizontalEnd,
  BookOpen, Tag, Share2, Heart, ChevronRight, Sparkles
} from 'lucide-react';
import { museumApi, swordApi } from '@/api';
import type { SwordCollection, Sword, CollectionInstitution, DiscoverySite } from '@/types';
import { cn } from '@/lib/utils';
import ProvenanceTimeline from '@/components/museum/ProvenanceTimeline';

const STATUS_STYLES: Record<string, { bg: string; badge: string }> = {
  '完好保存': { bg: 'from-emerald-500/90 to-emerald-700/90', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  '部分残损': { bg: 'from-gold-500/90 to-gold-700/90', badge: 'bg-gold-50 text-gold-700 border-gold-200' },
  '严重残损': { bg: 'from-cinnabar-500/90 to-cinnabar-700/90', badge: 'bg-cinnabar-50 text-cinnabar-700 border-cinnabar-200' },
  '修复中': { bg: 'from-bronze-500/90 to-bronze-700/90', badge: 'bg-bronze-50 text-bronze-700 border-bronze-200' },
  '复制展示': { bg: 'from-ink-500/90 to-ink-700/90', badge: 'bg-ink-50 text-ink-700 border-ink-200' },
  '下落不明': { bg: 'from-purple-500/90 to-purple-700/90', badge: 'bg-purple-50 text-purple-700 border-purple-200' },
  '已损毁': { bg: 'from-red-500/90 to-red-700/90', badge: 'bg-red-50 text-red-700 border-red-200' },
};

export default function MuseumDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [collection, setCollection] = useState<SwordCollection | null>(null);
  const [sword, setSword] = useState<Sword | null>(null);
  const [institution, setInstitution] = useState<CollectionInstitution | null>(null);
  const [discoverySite, setDiscoverySite] = useState<DiscoverySite | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState<'provenance' | 'exhibition' | 'conservation'>('provenance');

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const collectionData = await museumApi.getCollectionById(id);
        setCollection(collectionData);

        const requests: Promise<any>[] = [];

        if (collectionData.swordId) {
          requests.push(
            swordApi.getSwordById(collectionData.swordId).catch(() => null)
          );
        } else {
          requests.push(Promise.resolve(null));
        }

        if (collectionData.currentInstitutionId) {
          requests.push(
            museumApi.getInstitutionById(collectionData.currentInstitutionId).catch(() => null)
          );
        } else {
          requests.push(Promise.resolve(null));
        }

        if (collectionData.discoverySiteId) {
          requests.push(
            museumApi.getDiscoverySiteById(collectionData.discoverySiteId).catch(() => null)
          );
        } else {
          requests.push(Promise.resolve(null));
        }

        const [swordData, instData, siteData] = await Promise.all(requests);
        setSword(swordData);
        setInstitution(instData);
        setDiscoverySite(siteData);
      } catch (error) {
        console.error('Failed to fetch museum detail:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-ink-200 border-t-cinnabar-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="font-song text-ink-600">正在调阅藏品档案...</p>
        </div>
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-brush text-3xl text-ink-700 mb-4">藏品档案未找到</h2>
          <p className="font-song text-ink-500 mb-6">此藏品档案或许尚未建档，或已被撤销</p>
          <button
            onClick={() => navigate('/museum')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-cinnabar-600 text-ink-100 font-song hover:bg-cinnabar-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            返回收藏馆
          </button>
        </div>
      </div>
    );
  }

  const statusStyle = STATUS_STYLES[collection.preservationStatus] || STATUS_STYLES['复制展示'];

  return (
    <div className="min-h-screen pt-16">
      <div className="relative h-[45vh] md:h-[55vh] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-700"
          style={{
            backgroundImage: `url(${collection.swordImageUrl})`,
            opacity: imageLoaded ? 1 : 0,
            filter: 'blur(10px) brightness(0.4)',
            transform: 'scale(1.08)',
          }}
        />
        <img
          src={collection.swordImageUrl}
          alt={collection.swordName}
          className="hidden"
          onLoad={() => setImageLoaded(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-100 via-ink-100/40 to-transparent" />

        <div className="absolute top-4 left-4 z-10">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 bg-ink-100/90 backdrop-blur-sm text-ink-700 font-song hover:bg-ink-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            返回收藏馆
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
            <div className="animate-fade-in-up" style={{ animationFillMode: 'forwards', opacity: 0 }}>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className={cn(
                  'seal-stamp px-4 py-1.5 bg-gradient-to-r text-ink-100 text-sm',
                  statusStyle.bg
                )}>
                  {collection.preservationStatus}
                </span>
                <span className="seal-stamp px-4 py-1.5 bg-cinnabar-600/90 text-ink-100 text-sm">
                  {collection.dynasty}
                </span>
                {collection.isOnDisplay && (
                  <span className="flex items-center gap-1.5 seal-stamp px-4 py-1.5 bg-emerald-600/90 text-ink-100 text-sm">
                    <Eye className="w-3.5 h-3.5" />
                    公开展出中
                  </span>
                )}
                {collection.isRestricted && (
                  <span className="flex items-center gap-1.5 seal-stamp px-4 py-1.5 bg-ink-900/80 text-ink-100 text-sm">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    限展文物
                  </span>
                )}
              </div>

              <div className="flex flex-col md:flex-row md:items-end gap-6">
                <div className="relative flex-shrink-0">
                  <div className="w-36 h-48 md:w-44 md:h-56 overflow-hidden border-4 border-ink-100 shadow-ink-lg">
                    <img
                      src={collection.swordImageUrl}
                      alt={collection.swordName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-cinnabar-600 text-ink-100 px-3 py-1 font-brush transform rotate-[-6deg] shadow-lg">
                    档案号
                  </div>
                </div>

                <div className="flex-1">
                  <h1 className="font-brush text-4xl md:text-6xl text-ink-900 mb-2 text-shadow-ink">
                    {collection.swordName}
                  </h1>
                  <p className="font-song text-lg text-ink-600 mb-4">「{collection.swordAlias}」</p>
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-ink-700">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-cinnabar-600" />
                      <span className="font-song text-sm">藏品编号：{collection.accessionNumber}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-cinnabar-600" />
                      <span className="font-song text-sm">入藏日期：{collection.accessionDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-cinnabar-600" />
                      <span className="font-song text-sm">{collection.currentInstitutionName}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            'w-4 h-4',
                            i < collection.authenticityLevel
                              ? 'text-gold-500 fill-gold-500'
                              : 'text-ink-300'
                          )}
                        />
                      ))}
                      <span className="text-xs text-ink-500 font-song ml-1">真伪鉴定</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-10">
            <section>
              <div className="flex items-center gap-3 mb-5">
                <Shield className="w-6 h-6 text-cinnabar-600" />
                <h2 className="font-brush text-3xl text-ink-900">保存状况报告</h2>
              </div>
              <div className="ink-card p-6 scroll-container">
                <p className="font-song text-lg text-ink-700 leading-loose first-letter:text-4xl first-letter:font-brush first-letter:text-cinnabar-600 first-letter:float-left first-letter:mr-3">
                  {collection.conditionReport}
                </p>
              </div>
            </section>

            <div className="ink-divider" />

            <section>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <History className="w-6 h-6 text-bronze-600" />
                  <h2 className="font-brush text-3xl text-ink-900">来源追踪 · 流转历史</h2>
                </div>
              </div>

              <div className="flex gap-2 mb-6 border-b border-ink-200">
                {[
                  { key: 'provenance' as const, label: '完整流转', icon: History },
                  { key: 'exhibition' as const, label: '展览历史', icon: Eye },
                  { key: 'conservation' as const, label: '修复记录', icon: Wrench },
                ].map(tab => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={cn(
                        'flex items-center gap-2 px-5 py-3 font-song text-sm border-b-2 -mb-px transition-all',
                        activeTab === tab.key
                          ? 'border-cinnabar-600 text-cinnabar-600'
                          : 'border-transparent text-ink-500 hover:text-ink-700'
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {activeTab === 'provenance' && (
                <ProvenanceTimeline records={collection.provenanceRecords} />
              )}

              {activeTab === 'exhibition' && (
                collection.exhibitionHistory.length > 0 ? (
                  <div className="space-y-3">
                    {collection.exhibitionHistory.map((exhibit, idx) => {
                      const [year, venue, name] = exhibit.split(/[ 年]/);
                      return (
                        <div
                          key={idx}
                          className="ink-card p-4 flex items-start gap-4 hover:shadow-ink transition-shadow animate-fade-in-up"
                          style={{ animationDelay: `${idx * 0.08}s` }}
                        >
                          <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center">
                            <Eye className="w-6 h-6 text-ink-100" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-baseline gap-3 mb-1.5">
                              <span className="seal-stamp text-xs">{year || '不详'}</span>
                              <h4 className="font-brush text-lg text-ink-900">{name || exhibit}</h4>
                            </div>
                            {venue && <p className="text-sm font-song text-ink-600">{venue}</p>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Eye className="w-12 h-12 text-ink-300 mx-auto mb-3" />
                    <p className="font-song text-ink-500">暂无公开展出记录</p>
                  </div>
                )
              )}

              {activeTab === 'conservation' && (
                collection.conservationHistory.length > 0 ? (
                  <div className="space-y-3">
                    {collection.conservationHistory.map((record, idx) => (
                      <div
                        key={idx}
                        className="ink-card p-4 flex items-start gap-4 hover:shadow-ink transition-shadow animate-fade-in-up"
                        style={{ animationDelay: `${idx * 0.08}s` }}
                      >
                        <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-bronze-400 to-bronze-600 flex items-center justify-center">
                          <Wrench className="w-6 h-6 text-ink-100" />
                        </div>
                        <div className="flex-1">
                          <p className="font-song text-ink-700 leading-relaxed">{record}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Wrench className="w-12 h-12 text-ink-300 mx-auto mb-3" />
                    <p className="font-song text-ink-500">暂无保护修复记录</p>
                  </div>
                )
              )}
            </section>

            <div className="ink-divider" />

            {collection.researchNotes && (
              <>
                <section>
                  <div className="flex items-center gap-3 mb-5">
                    <BookOpen className="w-6 h-6 text-gold-600" />
                    <h2 className="font-brush text-3xl text-ink-900">学术研究笔记</h2>
                  </div>
                  <div className="ink-card p-6 border-l-4 border-l-gold-500 scroll-container">
                    <p className="font-song text-ink-700 leading-loose italic">
                      {collection.researchNotes}
                    </p>
                  </div>
                </section>
                <div className="ink-divider" />
              </>
            )}

            {sword && (
              <section>
                <div className="ink-card p-6 bg-gradient-to-br from-cinnabar-50 to-ink-50 border-cinnabar-200">
                  <div className="flex items-start gap-4">
                    <Link
                      to={`/swords/${sword.id}`}
                      className="group flex-shrink-0 w-24 h-32 overflow-hidden border border-ink-200 shadow-md"
                    >
                      <img
                        src={sword.imageUrl}
                        alt={sword.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </Link>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-4 h-4 text-gold-600" />
                        <span className="text-xs font-song text-gold-700 bg-gold-50 px-2 py-0.5 border border-gold-200">
                          关联名剑谱档案
                        </span>
                      </div>
                      <Link to={`/swords/${sword.id}`} className="group block mb-2">
                        <h3 className="font-brush text-2xl text-ink-900 group-hover:text-cinnabar-600 transition-colors">
                          {sword.name}
                        </h3>
                        <p className="text-sm text-gold-600 font-song">「{sword.alias}」</p>
                      </Link>
                      <p className="text-sm font-song text-ink-600 line-clamp-3 mb-3">
                        {sword.description}
                      </p>
                      <Link
                        to={`/swords/${sword.id}`}
                        className="inline-flex items-center gap-1 text-sm font-song text-cinnabar-600 hover:text-cinnabar-700"
                      >
                        查看名剑谱完整档案
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </section>
            )}
          </div>

          <div className="space-y-6">
            <div className="ink-card p-6">
              <h3 className="font-brush text-2xl text-ink-900 mb-5 flex items-center gap-2">
                <Shield className="w-5 h-5 text-cinnabar-600" />
                基本信息档案
              </h3>
              <dl className="space-y-4">
                <div>
                  <dt className="text-xs font-song text-ink-500 mb-1">铸造年代</dt>
                  <dd className="font-brush text-lg text-ink-900">{collection.forgingEra}</dd>
                </div>
                <div>
                  <dt className="text-xs font-song text-ink-500 mb-1">主要材质</dt>
                  <dd className="font-song text-ink-800">{collection.material}</dd>
                </div>
                <div className="grid grid-cols-3 gap-3 pt-2 border-t border-ink-100">
                  <div>
                    <dt className="flex items-center gap-1 text-xs font-song text-ink-500 mb-1">
                      <Ruler className="w-3 h-3" />通长
                    </dt>
                    <dd className="font-brush text-xl text-ink-900">{collection.length}<span className="text-xs font-song ml-0.5">cm</span></dd>
                  </div>
                  <div>
                    <dt className="flex items-center gap-1 text-xs font-song text-ink-500 mb-1">
                      <Ruler className="w-3 h-3 rotate-90" />宽度
                    </dt>
                    <dd className="font-brush text-xl text-ink-900">{collection.width}<span className="text-xs font-song ml-0.5">cm</span></dd>
                  </div>
                  <div>
                    <dt className="flex items-center gap-1 text-xs font-song text-ink-500 mb-1">
                      <Weight className="w-3 h-3" />重量
                    </dt>
                    <dd className="font-brush text-xl text-ink-900">{collection.weight}<span className="text-xs font-song ml-0.5">g</span></dd>
                  </div>
                </div>
                <div className="pt-3 border-t border-ink-100">
                  <dt className="flex items-center gap-1 text-xs font-song text-ink-500 mb-1.5">
                    <Building2 className="w-3 h-3" />收藏机构
                  </dt>
                  <dd>
                    <p className="font-brush text-lg text-ink-900 mb-0.5">{collection.currentInstitutionName}</p>
                    <p className="text-xs font-song text-ink-600">{collection.currentLocation}</p>
                  </dd>
                </div>
                {collection.displayLocation && (
                  <div>
                    <dt className="flex items-center gap-1 text-xs font-song text-ink-500 mb-1">
                      <MapPin className="w-3 h-3" />展陈位置
                    </dt>
                    <dd className="font-song text-ink-700 text-sm">{collection.displayLocation}</dd>
                  </div>
                )}
                <div className="pt-3 border-t border-ink-100">
                  <dt className="text-xs font-song text-ink-500 mb-1">入藏方式</dt>
                  <dd>
                    <span className={cn(
                      'text-xs px-2.5 py-1 border font-song',
                      statusStyle.badge
                    )}>
                      {collection.acquisitionMethod}
                    </span>
                  </dd>
                </div>
                {collection.appraisalValue && (
                  <div>
                    <dt className="text-xs font-song text-ink-500 mb-1">鉴定等级</dt>
                    <dd className="font-song text-ink-800 text-sm">{collection.appraisalValue}</dd>
                  </div>
                )}
                {collection.insuranceValue && (
                  <div>
                    <dt className="text-xs font-song text-ink-500 mb-1">投保估值</dt>
                    <dd className="font-song text-cinnabar-700 text-sm font-bold">{collection.insuranceValue}</dd>
                  </div>
                )}
                <div>
                  <dt className="text-xs font-song text-ink-500 mb-1">最近检查</dt>
                  <dd className="font-song text-ink-700 text-sm">{collection.lastInspectionDate}</dd>
                </div>
                {collection.nextInspectionDate && (
                  <div>
                    <dt className="text-xs font-song text-ink-500 mb-1">下次检查</dt>
                    <dd className="font-song text-emerald-700 text-sm">{collection.nextInspectionDate}</dd>
                  </div>
                )}
              </dl>
            </div>

            {institution && (
              <div className="ink-card p-6">
                <h3 className="font-brush text-xl text-ink-900 mb-4 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-gold-600" />
                  收藏机构详情
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 bg-gold-50 text-gold-700 border border-gold-200 font-song">
                      {institution.type}
                    </span>
                    <span className="text-xs font-song text-ink-500">建馆于 {institution.foundingYear} 年</span>
                  </div>
                  <p className="text-sm font-song text-ink-600 leading-relaxed">
                    {institution.description}
                  </p>
                  {institution.website && (
                    <a
                      href={institution.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-song text-cinnabar-600 hover:text-cinnabar-700 underline"
                    >
                      访问机构官网 →
                    </a>
                  )}
                </div>
              </div>
            )}

            {discoverySite && (
              <div className="ink-card p-6">
                <h3 className="font-brush text-xl text-ink-900 mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-emerald-600" />
                  发现地点档案
                </h3>
                <div className="space-y-3">
                  <h4 className="font-brush text-lg text-ink-900">{discoverySite.name}</h4>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 font-song">
                      {discoverySite.discoveryMethod}
                    </span>
                    <span className="font-song text-ink-500">{discoverySite.discoveryYear} 年发现</span>
                  </div>
                  <p className="text-sm font-song text-ink-600">{discoverySite.location}</p>
                  <p className="text-xs font-song text-ink-500 leading-relaxed">
                    {discoverySite.description}
                  </p>
                  {discoverySite.excavator && (
                    <p className="text-xs font-song text-ink-500">
                      发掘单位：{discoverySite.excavator}
                    </p>
                  )}
                </div>
              </div>
            )}

            {collection.previousOwners.length > 0 && (
              <div className="ink-card p-6">
                <h3 className="font-brush text-xl text-ink-900 mb-4 flex items-center gap-2">
                  <History className="w-5 h-5 text-bronze-600" />
                  历代递藏
                </h3>
                <div className="space-y-2">
                  {collection.previousOwners.map((owner, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2"
                    >
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-bronze-50 border border-bronze-200 text-xs font-brush text-bronze-700">
                        {idx + 1}
                      </div>
                      <span className="font-song text-ink-700 text-sm">{owner}</span>
                      {idx < collection.previousOwners.length - 1 && (
                        <ChevronRight className="w-3 h-3 text-ink-300 flex-shrink-0" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {collection.tags.length > 0 && (
              <div className="ink-card p-6">
                <h3 className="font-brush text-xl text-ink-900 mb-4 flex items-center gap-2">
                  <Tag className="w-5 h-5 text-ink-600" />
                  主题标签
                </h3>
                <div className="flex flex-wrap gap-2">
                  {collection.tags.map(tag => (
                    <span
                      key={tag}
                      className="text-xs px-2.5 py-1 bg-ink-50 text-ink-700 border border-ink-200 font-song hover:bg-cinnabar-50 hover:text-cinnabar-700 hover:border-cinnabar-200 transition-colors cursor-pointer"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {collection.catalogImages.length > 0 && (
              <div className="ink-card p-6">
                <h3 className="font-brush text-xl text-ink-900 mb-4 flex items-center gap-2">
                  <GalleryHorizontalEnd className="w-5 h-5 text-ink-600" />
                  图录档案
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {collection.catalogImages.map((img, idx) => (
                    <div key={idx} className="aspect-[4/3] overflow-hidden border border-ink-200 group">
                      <img
                        src={img}
                        alt={`${collection.swordName} 图录 ${idx + 1}`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
