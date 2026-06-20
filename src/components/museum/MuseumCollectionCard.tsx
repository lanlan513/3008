import { Link } from 'react-router-dom';
import { MapPin, Building2, Shield, Eye, Star, ChevronRight, Calendar, Ruler } from 'lucide-react';
import type { SwordCollection } from '@/types';
import { cn } from '@/lib/utils';

const STATUS_COLORS: Record<string, string> = {
  '完好保存': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  '部分残损': 'bg-gold-50 text-gold-700 border-gold-200',
  '严重残损': 'bg-cinnabar-50 text-cinnabar-700 border-cinnabar-200',
  '修复中': 'bg-bronze-50 text-bronze-700 border-bronze-200',
  '复制展示': 'bg-ink-50 text-ink-700 border-ink-200',
  '下落不明': 'bg-purple-50 text-purple-700 border-purple-200',
  '已损毁': 'bg-red-50 text-red-700 border-red-200',
};

interface MuseumCollectionCardProps {
  collection: SwordCollection;
  style?: React.CSSProperties;
}

export default function MuseumCollectionCard({ collection, style }: MuseumCollectionCardProps) {
  return (
    <Link
      to={`/museum/${collection.id}`}
      className="group block animate-fade-in-up"
      style={style}
    >
      <div className="ink-card overflow-hidden hover:shadow-ink-lg transition-all duration-500">
        <div className="relative aspect-[4/3] overflow-hidden bg-ink-50">
          <img
            src={collection.swordImageUrl}
            alt={collection.swordName}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-900/70 via-transparent to-transparent" />
          
          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
            <span className={cn(
              'text-xs px-2 py-1 font-song border',
              STATUS_COLORS[collection.preservationStatus] || STATUS_COLORS['复制展示']
            )}>
              {collection.preservationStatus}
            </span>
            {collection.isOnDisplay && (
              <span className="flex items-center gap-1 text-xs px-2 py-1 bg-emerald-600 text-ink-100 font-song">
                <Eye className="w-3 h-3" />
                公展中
              </span>
            )}
            {collection.isRestricted && (
              <span className="text-xs px-2 py-1 bg-cinnabar-600 text-ink-100 font-song">
                受限文物
              </span>
            )}
          </div>

          <div className="absolute top-3 right-3">
            <span className="seal-stamp text-[10px] bg-cinnabar-600/90 text-ink-100 px-2 py-1">
              {collection.dynasty}
            </span>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-brush text-xl text-ink-100 group-hover:text-gold-300 transition-colors drop-shadow-lg">
                {collection.swordName}
              </h3>
              <ChevronRight className="w-5 h-5 text-ink-300 group-hover:text-gold-300 group-hover:translate-x-1 transition-all" />
            </div>
            <p className="text-xs text-ink-300 font-song line-clamp-1">
              「{collection.swordAlias}」
            </p>
          </div>
        </div>

        <div className="p-4 space-y-3">
          <div className="flex items-start gap-2 text-xs font-song text-ink-600">
            <Building2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-gold-600" />
            <span className="line-clamp-1">{collection.currentInstitutionName}</span>
          </div>

          <div className="flex items-start gap-2 text-xs font-song text-ink-600">
            <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5 text-cinnabar-600" />
            <span className="line-clamp-1">{collection.displayLocation || collection.currentLocation}</span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-ink-100">
            <div className="flex items-center gap-1 text-[11px] text-ink-500">
              <Calendar className="w-3 h-3" />
              <span>入藏：{collection.accessionDate.slice(0, 4)}</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-ink-500">
              <Ruler className="w-3 h-3" />
              <span>{collection.length}cm</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    'w-3.5 h-3.5',
                    i < collection.authenticityLevel
                      ? 'text-gold-500 fill-gold-500'
                      : 'text-ink-200'
                  )}
                />
              ))}
              <span className="ml-1 text-[10px] text-ink-400 font-song">
                真伪鉴定
              </span>
            </div>
            <span className="text-[10px] text-ink-400 font-song">
              编{collection.accessionNumber.slice(-4)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
