import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  BookOpen,
  Flame,
  Tag,
  ChevronRight,
  Share2,
  Heart,
} from 'lucide-react';
import { knowledgeApi, swordApi, swordsmanApi, sectApi } from '../api';
import type { KnowledgeArticle, KnowledgeCategoryInfo, Sword, Swordsman, Sect } from '../types';
import { cn } from '@/lib/utils';
import RelatedReading from '../components/knowledge/RelatedReading';

const CATEGORY_COLORS: Record<string, string> = {
  '剑材': 'from-emerald-500 to-emerald-700',
  '锻造工艺': 'from-cinnabar-500 to-cinnabar-700',
  '淬火方法': 'from-gold-500 to-gold-700',
  '装具结构': 'from-bronze-500 to-bronze-700',
  '铸剑流派': 'from-ink-600 to-ink-800',
};

const CATEGORY_LABELS: Record<string, string> = {
  '剑材': '⛏ 剑材',
  '锻造工艺': '🔨 锻造工艺',
  '淬火方法': '🔥 淬火方法',
  '装具结构': '⚙ 装具结构',
  '铸剑流派': '📜 铸剑流派',
};

export default function KnowledgeDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<KnowledgeArticle | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<KnowledgeArticle[]>([]);
  const [relatedSwords, setRelatedSwords] = useState<Sword[]>([]);
  const [relatedSwordsmen, setRelatedSwordsmen] = useState<Swordsman[]>([]);
  const [relatedSects, setRelatedSects] = useState<Sect[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const articleData = await knowledgeApi.getArticleById(id);
        setArticle(articleData);

        const [relatedData, ...swordPromises] = await Promise.all([
          knowledgeApi.getRelatedArticles(id).catch(() => []),
          ...articleData.relatedSwordIds.map(swordId =>
            swordApi.getSwordById(swordId).catch(() => null)
          ),
        ]);
        setRelatedArticles(relatedData);
        setRelatedSwords(swordPromises.filter((s): s is Sword => s !== null));

        const swordsmanPromises = articleData.relatedSwordsmanIds.map(swordsmanId =>
          swordsmanApi.getSwordsmanById(swordsmanId).catch(() => null)
        );
        const swordsmanResults = await Promise.all(swordsmanPromises);
        setRelatedSwordsmen(swordsmanResults.filter((s): s is Swordsman => s !== null));

        const sectPromises = articleData.relatedSectIds.map(sectId =>
          sectApi.getSectById(sectId).catch(() => null)
        );
        const sectResults = await Promise.all(sectPromises);
        setRelatedSects(sectResults.filter((s): s is Sect => s !== null));
      } catch (error) {
        console.error('Failed to fetch knowledge article:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const renderMarkdown = (content: string) => {
    const lines = content.split('\n');
    const elements: JSX.Element[] = [];
    let currentList: string[] = [];
    let listKey = 0;

    const flushList = () => {
      if (currentList.length > 0) {
        elements.push(
          <ul key={`list-${listKey++}`} className="space-y-2 mb-6 ml-6">
            {currentList.map((item, i) => (
              <li key={i} className="font-song text-ink-700 leading-relaxed relative pl-4 before:content-['•'] before:absolute before:left-0 before:text-cinnabar-600">
                {item}
              </li>
            ))}
          </ul>
        );
        currentList = [];
      }
    };

    lines.forEach((line, index) => {
      if (line.startsWith('## ')) {
        flushList();
        elements.push(
          <h2 key={index} className="font-brush text-2xl text-ink-900 mt-10 mb-4 pb-2 border-b border-ink-200 flex items-center gap-2">
            <span className="w-1 h-6 bg-cinnabar-600 inline-block" />
            {line.replace('## ', '')}
          </h2>
        );
      } else if (line.startsWith('### ')) {
        flushList();
        elements.push(
          <h3 key={index} className="font-brush text-xl text-ink-800 mt-8 mb-3">
            {line.replace('### ', '')}
          </h3>
        );
      } else if (line.startsWith('- **')) {
        const match = line.match(/^- \*\*(.+?)\*\*[:：]?\s*(.*)/);
        if (match) {
          currentList.push(
            `<strong>${match[1]}</strong>${match[2] ? '：' + match[2] : ''}`
          );
        }
      } else if (line.startsWith('- ')) {
        currentList.push(line.replace('- ', ''));
      } else if (line.trim() === '') {
        flushList();
      } else if (/^\d+\.\s/.test(line)) {
        const match = line.match(/^(\d+)\.\s\*\*(.+?)\*\*[:：]?\s*(.*)/);
        if (match) {
          elements.push(
            <div key={index} className="flex gap-3 mb-3 ml-4">
              <span className="flex-shrink-0 w-6 h-6 bg-cinnabar-600 text-ink-100 text-xs flex items-center justify-center font-song mt-0.5">
                {match[1]}
              </span>
              <div className="font-song text-ink-700 leading-relaxed">
                <strong className="text-ink-900">{match[2]}</strong>
                {match[3] ? `：${match[3]}` : ''}
              </div>
            </div>
          );
        } else {
          const simpleMatch = line.match(/^(\d+)\.\s(.+)/);
          if (simpleMatch) {
            elements.push(
              <div key={index} className="flex gap-3 mb-2 ml-4">
                <span className="flex-shrink-0 w-6 h-6 bg-ink-200 text-ink-700 text-xs flex items-center justify-center font-song mt-0.5">
                  {simpleMatch[1]}
                </span>
                <span className="font-song text-ink-700 leading-relaxed">
                  {simpleMatch[2]}
                </span>
              </div>
            );
          }
        }
      } else {
        flushList();
        elements.push(
          <p key={index} className="font-song text-ink-700 leading-loose mb-4">
            {line}
          </p>
        );
      }
    });

    flushList();
    return elements;
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-ink-200 border-t-cinnabar-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="font-song text-ink-600">正在翻阅典籍...</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-brush text-3xl text-ink-700 mb-4">典籍未找到</h2>
          <p className="font-song text-ink-500 mb-6">此卷或许已散佚江湖</p>
          <button
            onClick={() => navigate('/knowledge')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-cinnabar-600 text-ink-100 font-song hover:bg-cinnabar-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            返回知识学院
          </button>
        </div>
      </div>
    );
  }

  const colorClass = CATEGORY_COLORS[article.category] || CATEGORY_COLORS['铸剑流派'];

  return (
    <div className="min-h-screen pt-16">
      <div className="relative h-[40vh] md:h-[50vh] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${article.coverUrl})`,
            filter: 'blur(8px) brightness(0.6)',
            transform: 'scale(1.1)',
          }}
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
              <span className={cn(
                'inline-block text-sm px-3 py-1 text-ink-100 font-song bg-gradient-to-r mb-4',
                colorClass
              )}>
                {CATEGORY_LABELS[article.category] || article.category}
              </span>
              <h1 className="font-brush text-4xl md:text-6xl text-ink-900 mb-3 text-shadow-ink">
                {article.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-ink-600">
                <span className="flex items-center gap-1 font-song text-sm">
                  <Flame className="w-4 h-4 text-gold-500" />
                  {article.popularity.toLocaleString()} 人气
                </span>
                {article.dynasty && (
                  <span className="seal-stamp text-xs">{article.dynasty}</span>
                )}
                {article.tags.slice(0, 4).map((tag) => (
                  <span
                    key={tag}
                    className="bg-ink-50/80 backdrop-blur-sm text-ink-600 text-xs px-2 py-0.5 font-song border border-ink-200/50"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <article className="ink-card p-8 animate-fade-in-up" style={{ animationDelay: '0.3s', animationFillMode: 'forwards', opacity: 0 }}>
              <div className="scroll-container">
                {renderMarkdown(article.content)}
              </div>
            </article>

            {article.tags.length > 0 && (
              <div className="mt-8 ink-card p-6 animate-fade-in-up" style={{ animationDelay: '0.4s', animationFillMode: 'forwards', opacity: 0 }}>
                <h3 className="font-brush text-xl text-ink-900 mb-4 flex items-center gap-2">
                  <Tag className="w-5 h-5 text-cinnabar-600" />
                  文章标签
                </h3>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-ink-50 text-ink-700 text-sm px-3 py-1 font-song border border-ink-200 hover:bg-cinnabar-50 hover:border-cinnabar-200 hover:text-cinnabar-700 transition-colors cursor-pointer"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-8">
            <div className="ink-card p-6 animate-fade-in-up" style={{ animationDelay: '0.3s', animationFillMode: 'forwards', opacity: 0 }}>
              <h3 className="font-brush text-xl text-ink-900 mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-cinnabar-600" />
                内容摘要
              </h3>
              <p className="font-song text-sm text-ink-600 leading-relaxed">
                {article.summary}
              </p>
            </div>

            <RelatedReading
              article={article}
              relatedArticles={relatedArticles}
              relatedSwords={relatedSwords}
              relatedSwordsmen={relatedSwordsmen}
              relatedSects={relatedSects}
            />

            <div className="ink-card p-6 animate-fade-in-up" style={{ animationDelay: '0.5s', animationFillMode: 'forwards', opacity: 0 }}>
              <h3 className="font-brush text-xl text-ink-900 mb-4">了解更多</h3>
              <div className="space-y-3">
                <Link
                  to="/knowledge"
                  className="flex items-center justify-between p-3 bg-ink-50 hover:bg-ink-100 transition-colors font-song text-sm text-ink-700"
                >
                  <span>返回知识学院</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/swords"
                  className="flex items-center justify-between p-3 bg-ink-50 hover:bg-ink-100 transition-colors font-song text-sm text-ink-700"
                >
                  <span>查看名剑谱</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/swordsmen"
                  className="flex items-center justify-between p-3 bg-ink-50 hover:bg-ink-100 transition-colors font-song text-sm text-ink-700"
                >
                  <span>寻访剑客</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
