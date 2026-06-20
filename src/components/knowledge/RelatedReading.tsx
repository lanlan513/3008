import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import type { KnowledgeArticle, Sword, Swordsman, Sect } from '../../types';

interface RelatedReadingProps {
  article: KnowledgeArticle;
  relatedArticles: KnowledgeArticle[];
  relatedSwords: Sword[];
  relatedSwordsmen: Swordsman[];
  relatedSects: Sect[];
}

export default function RelatedReading({
  article,
  relatedArticles,
  relatedSwords,
  relatedSwordsmen,
  relatedSects,
}: RelatedReadingProps) {
  const hasRelatedContent = relatedArticles.length > 0 || relatedSwords.length > 0 || relatedSwordsmen.length > 0 || relatedSects.length > 0;

  if (!hasRelatedContent) return null;

  return (
    <div className="space-y-6">
      {relatedArticles.length > 0 && (
        <div>
          <h3 className="font-brush text-xl text-ink-900 mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-cinnabar-600" />
            关联阅读
          </h3>
          <div className="space-y-3">
            {relatedArticles.map((related) => (
              <Link
                key={related.id}
                to={`/knowledge/${related.id}`}
                className="block group"
              >
                <div className="flex gap-3 p-3 bg-ink-50 hover:bg-ink-100 transition-all duration-300">
                  <div className="w-16 h-12 flex-shrink-0 overflow-hidden">
                    <img
                      src={related.coverUrl}
                      alt={related.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-brush text-sm text-ink-900 group-hover:text-cinnabar-700 transition-colors line-clamp-1">
                      {related.title}
                    </h4>
                    <p className="text-xs font-song text-ink-500 mt-1 line-clamp-1">
                      {related.summary}
                    </p>
                    <span className="text-[10px] font-song text-ink-400 mt-1 inline-block">
                      {related.category}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {relatedSwords.length > 0 && (
        <div>
          <h3 className="font-brush text-xl text-ink-900 mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-gold-600" />
            相关名剑
          </h3>
          <div className="flex flex-wrap gap-2">
            {relatedSwords.map((sword) => (
              <Link
                key={sword.id}
                to={`/swords/${sword.id}`}
                className="inline-flex items-center gap-2 px-3 py-2 bg-ink-50 hover:bg-cinnabar-50 transition-colors border border-ink-200 hover:border-cinnabar-200 group"
              >
                <div className="w-8 h-10 flex-shrink-0 overflow-hidden">
                  <img
                    src={sword.imageUrl}
                    alt={sword.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="font-brush text-sm text-ink-900 group-hover:text-cinnabar-700 transition-colors">
                    {sword.name}
                  </div>
                  <div className="text-[10px] font-song text-ink-400">「{sword.alias}」</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {relatedSwordsmen.length > 0 && (
        <div>
          <h3 className="font-brush text-xl text-ink-900 mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-600" />
            相关剑客
          </h3>
          <div className="flex flex-wrap gap-2">
            {relatedSwordsmen.map((swordsman) => (
              <Link
                key={swordsman.id}
                to={`/swordsmen/${swordsman.id}`}
                className="inline-flex items-center gap-2 px-3 py-2 bg-ink-50 hover:bg-emerald-50 transition-colors border border-ink-200 hover:border-emerald-200 group"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                  <img
                    src={swordsman.avatarUrl}
                    alt={swordsman.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="font-brush text-sm text-ink-900 group-hover:text-emerald-700 transition-colors">
                    {swordsman.name}
                  </div>
                  <div className="text-[10px] font-song text-ink-400">{swordsman.title}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {relatedSects.length > 0 && (
        <div>
          <h3 className="font-brush text-xl text-ink-900 mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-bronze-600" />
            相关门派
          </h3>
          <div className="flex flex-wrap gap-2">
            {relatedSects.map((sect) => (
              <Link
                key={sect.id}
                to={`/sects`}
                className="inline-flex items-center gap-2 px-3 py-2 bg-ink-50 hover:bg-bronze-50 transition-colors border border-ink-200 hover:border-bronze-200 group"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                  <img
                    src={sect.emblemUrl}
                    alt={sect.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="font-brush text-sm text-ink-900 group-hover:text-bronze-700 transition-colors">
                    {sect.name}
                  </div>
                  <div className="text-[10px] font-song text-ink-400">{sect.location}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
