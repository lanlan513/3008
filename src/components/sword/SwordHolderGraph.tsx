import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { SwordHeritage } from '../../types';

interface SwordHolderGraphProps {
  heritage: SwordHeritage;
  swordName: string;
  swordImageUrl: string;
}

const ACQUISITION_COLORS: Record<string, string> = {
  '铸造': '#f59e0b',
  '继承': '#059669',
  '赠与': '#db2777',
  '夺取': '#dc2626',
  '发现': '#0284c7',
  '赏赐': '#ca8a04',
  '其他': '#6b7280',
};

const LOSS_COLORS: Record<string, string> = {
  '传承': '#059669',
  '遗失': '#6b7280',
  '被夺': '#dc2626',
  '损毁': '#991b1b',
  '陪葬': '#92400e',
  '化龙': '#ca8a04',
  '其他': '#6b7280',
};

export default function SwordHolderGraph({
  heritage,
  swordName,
  swordImageUrl,
}: SwordHolderGraphProps) {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState({ width: 700, height: 500 });

  useEffect(() => {
    const updateDimensions = () => {
      const width = Math.min(window.innerWidth - 80, 900);
      const height = Math.min(500, width * 0.65);
      setDimensions({ width, height });
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const holders = heritage.holders;
  const holderCount = holders.length;

  if (holderCount === 0) {
    return (
      <div className="ink-card p-8 text-center animate-fade-in-up">
        <h3 className="font-brush text-2xl text-ink-900 mb-4">持有者关系图</h3>
        <p className="font-song text-ink-500">暂无传承记录</p>
      </div>
    );
  }

  const centerX = dimensions.width / 2;
  const centerY = dimensions.height / 2;
  const radius = Math.min(dimensions.width, dimensions.height) * 0.38;

  const getNodePosition = (index: number, total: number) => {
    const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    };
  };

  const getConnectionCurve = (startX: number, startY: number, endX: number, endY: number) => {
    const midX = (startX + endX) / 2;
    const midY = (startY + endY) / 2;
    const dx = endX - startX;
    const dy = endY - startY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist === 0) return `M ${startX} ${startY} L ${endX} ${endY}`;
    const nx = -dy / dist;
    const ny = dx / dist;
    const curveOffset = dist * 0.15;
    const cx = midX + nx * curveOffset;
    const cy = midY + ny * curveOffset;
    return `M ${startX} ${startY} Q ${cx} ${cy} ${endX} ${endY}`;
  };

  return (
    <div className="ink-card p-6 animate-fade-in-up" style={{ animationDelay: '0.6s', opacity: 0 }}>
      <h3 className="font-brush text-2xl text-ink-900 mb-6 text-center">持有者关系图谱</h3>

      <div className="relative overflow-hidden">
        <svg
          width={dimensions.width}
          height={dimensions.height}
          className="mx-auto"
        >
          <defs>
            <radialGradient id="swordCenterGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#dc2626" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#dc2626" stopOpacity="0" />
            </radialGradient>
            <filter id="holderShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3" />
            </filter>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8" />
            </marker>
          </defs>

          <circle
            cx={centerX}
            cy={centerY}
            r={radius + 30}
            fill="url(#swordCenterGlow)"
            className="animate-pulse"
          />

          {holders.map((holder, index) => {
            const nextIndex = (index + 1) % holderCount;
            const pos = getNodePosition(index, holderCount);
            const nextPos = getNodePosition(nextIndex, holderCount);
            const isHovered = hoveredNode === holder.id || hoveredNode === 'center';
            const nextIsHovered = hoveredNode === holders[nextIndex].id || hoveredNode === 'center';
            const lossColor = LOSS_COLORS[holder.lossMethod || '其他'] || LOSS_COLORS['其他'];
            const shouldDim = hoveredNode && !isHovered && !nextIsHovered;

            if (index === holderCount - 1) return null;

            return (
              <path
                key={`line-${holder.id}`}
                d={getConnectionCurve(pos.x, pos.y, nextPos.x, nextPos.y)}
                stroke={lossColor}
                strokeWidth={isHovered || nextIsHovered ? 2.5 : 1.5}
                fill="none"
                opacity={shouldDim ? 0.2 : 0.7}
                markerEnd="url(#arrowhead)"
                className="transition-all duration-300"
              />
            );
          })}

          {holders.map((holder, index) => {
            const pos = getNodePosition(index, holderCount);
            const nextHolder = holders[index + 1];
            const midX = index < holderCount - 1
              ? (pos.x + getNodePosition(index + 1, holderCount).x) / 2
              : pos.x;
            const midY = index < holderCount - 1
              ? (pos.y + getNodePosition(index + 1, holderCount).y) / 2
              : pos.y;
            const isHovered = hoveredNode === holder.id;
            const acqColor = ACQUISITION_COLORS[holder.acquisitionMethod] || ACQUISITION_COLORS['其他'];
            const shouldDim = hoveredNode && !isHovered && hoveredNode !== 'center';

            return (
              <g key={holder.id}>
                {index < holderCount - 1 && (
                  <>
                    <rect
                      x={midX - 30}
                      y={midY - 10}
                      width={60}
                      height={20}
                      fill="#fef2f2"
                      stroke={LOSS_COLORS[holder.lossMethod || '其他'] || LOSS_COLORS['其他']}
                      strokeWidth={1}
                      rx={4}
                      opacity={shouldDim ? 0.3 : 0.9}
                      className="transition-opacity duration-300"
                    />
                    <text
                      x={midX}
                      y={midY + 4}
                      textAnchor="middle"
                      className="text-[9px] font-song"
                      fill={LOSS_COLORS[holder.lossMethod || '其他'] || LOSS_COLORS['其他']}
                      opacity={shouldDim ? 0.3 : 1}
                    >
                      {holder.lossMethod || '传承'}
                    </text>
                  </>
                )}

                <Link
                  to={`/swordsmen/${holder.swordsmanId}`}
                  onMouseEnter={() => setHoveredNode(holder.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                >
                  <g className="cursor-pointer transition-transform duration-300">
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={isHovered ? 40 : 34}
                      fill={acqColor}
                      fillOpacity={0.08}
                      stroke={acqColor}
                      strokeWidth={isHovered ? 3 : 2}
                      filter="url(#holderShadow)"
                      className="transition-all duration-300"
                      opacity={shouldDim ? 0.5 : 1}
                    />
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={isHovered ? 34 : 28}
                      fill="#fef2f2"
                      stroke={acqColor}
                      strokeWidth={2}
                      opacity={shouldDim ? 0.5 : 1}
                    />
                    <text
                      x={pos.x}
                      y={pos.y + 6}
                      textAnchor="middle"
                      className="text-sm font-brush"
                      fill="#1e293b"
                      opacity={shouldDim ? 0.5 : 1}
                    >
                      {holder.swordsmanName.length > 3 ? holder.swordsmanName.slice(0, 3) : holder.swordsmanName}
                    </text>
                    <text
                      x={pos.x}
                      y={pos.y + 58}
                      textAnchor="middle"
                      className="text-xs font-song fill-ink-500"
                      opacity={shouldDim ? 0.4 : 1}
                    >
                      第{index + 1}任
                    </text>
                  </g>
                </Link>
              </g>
            );
          })}

          <g
            onMouseEnter={() => setHoveredNode('center')}
            onMouseLeave={() => setHoveredNode(null)}
            className="cursor-pointer"
          >
            <circle
              cx={centerX}
              cy={centerY}
              r={55}
              fill="#fef2f2"
              stroke="#dc2626"
              strokeWidth={3}
              filter="url(#holderShadow)"
            />
            <clipPath id="swordImageClip">
              <circle cx={centerX} cy={centerY} r={48} />
            </clipPath>
            <image
              href={swordImageUrl}
              x={centerX - 48}
              y={centerY - 48}
              width={96}
              height={96}
              clipPath="url(#swordImageClip)"
              preserveAspectRatio="xMidYMid slice"
            />
            <text
              x={centerX}
              y={centerY + 85}
              textAnchor="middle"
              className="text-base font-brush fill-ink-900"
            >
              {swordName}
            </text>
          </g>
        </svg>

        {hoveredNode && hoveredNode !== 'center' && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-ink-800 text-ink-100 px-4 py-2 rounded-lg text-sm font-song max-w-md text-center z-10">
            {(() => {
              const holder = holders.find(h => h.id === hoveredNode);
              if (!holder) return '';
              const index = holders.findIndex(h => h.id === hoveredNode);
              return `${holder.swordsmanName}（第${index + 1}任）· ${holder.startYear}至${holder.endYear}持有，${holder.acquisitionMethod}而得${holder.lossMethod ? `，${holder.lossMethod}而失` : ''}`;
            })()}
          </div>
        )}
      </div>

      <div className="flex flex-wrap justify-center gap-4 mt-6 pt-6 border-t border-ink-200">
        <div>
          <p className="text-xs font-song text-ink-500 mb-2">获取方式</p>
          <div className="flex flex-wrap gap-3">
            {Object.entries(ACQUISITION_COLORS).map(([method, color]) => {
              const count = holders.filter(h => h.acquisitionMethod === method).length;
              if (count === 0) return null;
              return (
                <div key={method} className="flex items-center gap-1.5">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-xs font-song text-ink-600">
                    {method} ({count})
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="w-px bg-ink-200 hidden sm:block" />
        <div>
          <p className="text-xs font-song text-ink-500 mb-2">传承去向</p>
          <div className="flex flex-wrap gap-3">
            {Object.entries(LOSS_COLORS).map(([method, color]) => {
              const count = holders.filter(h => h.lossMethod === method).length;
              if (count === 0) return null;
              return (
                <div key={method} className="flex items-center gap-1.5">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-xs font-song text-ink-600">
                    {method} ({count})
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
