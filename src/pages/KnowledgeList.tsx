import { useEffect, useState } from 'react';
import { Search, BookOpen, TrendingUp } from 'lucide-react';
import { knowledgeApi } from '../api';
import type { KnowledgeArticle, KnowledgeCategoryInfo, KnowledgeCategory } from '../types';
import KnowledgeCard from '../components/knowledge/KnowledgeCard';
import CategoryNav from '../components/knowledge/CategoryNav';

export default function KnowledgeList() {
  const [categories, setCategories] = useState<KnowledgeCategoryInfo[]>([]);
  const [articles, setArticles] = useState<KnowledgeArticle[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<KnowledgeArticle[]>([]);
  const [activeCategory, setActiveCategory] = useState<KnowledgeCategory | null>(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [sortBy, setSortBy] = useState<'popularity' | 'createdAt'>('popularity');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesData, articlesData] = await Promise.all([
          knowledgeApi.getCategories(),
          knowledgeApi.getArticles(),
        ]);
        setCategories(categoriesData);
        setArticles(articlesData);
        setFilteredArticles(articlesData);
      } catch (error) {
        console.error('Failed to fetch knowledge data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    let result = [...articles];

    if (activeCategory) {
      result = result.filter(a => a.category === activeCategory);
    }

    if (searchKeyword.trim()) {
      const lowerKeyword = searchKeyword.toLowerCase();
      result = result.filter(a =>
        a.title.toLowerCase().includes(lowerKeyword) ||
        a.summary.toLowerCase().includes(lowerKeyword) ||
        a.tags.some(t => t.toLowerCase().includes(lowerKeyword))
      );
    }

    result.sort((a, b) => {
      if (sortBy === 'popularity') {
        return b.popularity - a.popularity;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    setFilteredArticles(result);
  }, [activeCategory, searchKeyword, sortBy, articles]);

  const handleCategorySelect = (category: KnowledgeCategory | null) => {
    setActiveCategory(category);
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-ink-200 border-t-cinnabar-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="font-song text-ink-600">正在查阅铸剑典籍...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16">
      <section className="relative py-20 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url("https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=ancient%20chinese%20library%20study%20room%2C%20scrolls%20and%20books%2C%20ink%20painting%20atmosphere%2C%20warm%20candlelight&image_size=landscape_16_9")`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink-100/90 via-ink-100/80 to-ink-100" />

        <div className="relative container mx-auto px-4 text-center">
          <div className="animate-fade-in-up" style={{ animationDelay: '0.2s', animationFillMode: 'forwards', opacity: 0 }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-gold-500" />
              <span className="text-gold-600 font-song text-sm tracking-widest">铸剑之道 · 学无止境</span>
              <BookOpen className="w-5 h-5 text-gold-500" />
            </div>
            <h1 className="font-brush text-5xl md:text-7xl text-ink-900 mb-4 text-shadow-ink">
              铸剑知识学院
            </h1>
            <p className="font-song text-lg text-ink-600 max-w-2xl mx-auto mb-8 leading-relaxed">
              收录剑材、锻造工艺、淬火方法、装具结构和历代铸剑流派知识，<br />
              探寻千年铸剑术的精妙与传承。
            </p>

            <div className="max-w-xl mx-auto relative">
              <input
                type="text"
                placeholder="搜索铸剑知识..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="w-full px-6 py-3 pl-12 bg-ink-100/90 backdrop-blur-sm border-2 border-ink-300 text-ink-900 font-song focus:border-cinnabar-500 focus:outline-none transition-colors"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-400" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-ink-100">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
            <CategoryNav
              categories={categories}
              activeCategory={activeCategory}
              onSelectCategory={handleCategorySelect}
            />

            <div className="flex items-center gap-2">
              <span className="font-song text-sm text-ink-500">排序：</span>
              <button
                onClick={() => setSortBy('popularity')}
                className={cn(
                  'inline-flex items-center gap-1 px-3 py-1.5 text-sm font-song transition-all',
                  sortBy === 'popularity'
                    ? 'bg-cinnabar-600 text-ink-100'
                    : 'bg-ink-50 text-ink-700 border border-ink-200 hover:bg-ink-100'
                )}
              >
                <TrendingUp className="w-3 h-3" />
                人气
              </button>
              <button
                onClick={() => setSortBy('createdAt')}
                className={cn(
                  'inline-flex items-center gap-1 px-3 py-1.5 text-sm font-song transition-all',
                  sortBy === 'createdAt'
                    ? 'bg-cinnabar-600 text-ink-100'
                    : 'bg-ink-50 text-ink-700 border border-ink-200 hover:bg-ink-100'
                )}
              >
                <BookOpen className="w-3 h-3" />
                最新
              </button>
            </div>
          </div>

          {filteredArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((article, index) => (
                <KnowledgeCard key={article.id} article={article} delay={index * 80} />
              ))}
            </div>
          ) : (
            <div className="ink-card p-12 text-center">
              <BookOpen className="w-16 h-16 text-ink-300 mx-auto mb-4" />
              <h3 className="font-brush text-2xl text-ink-700 mb-2">未找到相关知识</h3>
              <p className="font-song text-ink-500">请尝试更换分类或搜索关键词</p>
            </div>
          )}

          <div className="mt-8 text-center font-song text-sm text-ink-400">
            共收录 {filteredArticles.length} 篇知识文章
          </div>
        </div>
      </section>
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
