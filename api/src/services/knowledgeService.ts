import { knowledgeArticles, knowledgeCategories } from '../data/knowledge.js';
import type { KnowledgeArticle, KnowledgeCategoryInfo, KnowledgeFilterParams } from '../../../shared/types.js';

export const getCategories = (): KnowledgeCategoryInfo[] => {
  return knowledgeCategories;
};

export const getArticles = (params: KnowledgeFilterParams = {}): KnowledgeArticle[] => {
  const { category, keyword, sortBy = 'popularity', sortOrder = 'desc' } = params;

  let filtered = [...knowledgeArticles];

  if (category) {
    filtered = filtered.filter(a => a.category === category);
  }

  if (keyword) {
    const lowerKeyword = keyword.toLowerCase();
    filtered = filtered.filter(a =>
      a.title.toLowerCase().includes(lowerKeyword) ||
      a.summary.toLowerCase().includes(lowerKeyword) ||
      a.tags.some(t => t.toLowerCase().includes(lowerKeyword)) ||
      a.content.toLowerCase().includes(lowerKeyword)
    );
  }

  if (sortBy) {
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'popularity':
          comparison = a.popularity - b.popularity;
          break;
        case 'createdAt':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        default:
          comparison = 0;
      }
      return sortOrder === 'desc' ? -comparison : comparison;
    });
  }

  return filtered;
};

export const getPopularArticles = (limit: number = 6): KnowledgeArticle[] => {
  return [...knowledgeArticles]
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, limit);
};

export const getArticleById = (id: string): KnowledgeArticle | undefined => {
  return knowledgeArticles.find(a => a.id === id);
};

export const getRelatedArticles = (id: string): KnowledgeArticle[] => {
  const article = knowledgeArticles.find(a => a.id === id);
  if (!article) return [];

  return article.relatedArticleIds
    .map(relatedId => knowledgeArticles.find(a => a.id === relatedId))
    .filter((a): a is KnowledgeArticle => a !== undefined);
};

export const getArticlesBySwordId = (swordId: string): KnowledgeArticle[] => {
  return knowledgeArticles.filter(a => a.relatedSwordIds.includes(swordId));
};

export const getArticlesBySwordsmanId = (swordsmanId: string): KnowledgeArticle[] => {
  return knowledgeArticles.filter(a => a.relatedSwordsmanIds.includes(swordsmanId));
};

export const getArticlesBySectId = (sectId: string): KnowledgeArticle[] => {
  return knowledgeArticles.filter(a => a.relatedSectIds.includes(sectId));
};
