import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { SwordHeritage } from '../../types';

const ACQUISITION_COLORS: Record<string, string> = {
  '铸造': '#f59e0b',
  '继承': '#059669',
  '赠与': '#db2777',
  '夺取': '#dc2626',
  '发现': '#0284c7',
  '赏赐': '#ca8a04',
  '其他': '#6b7280',
};

interface SwordHolderGraphProps {
  heritage: SwordHeritage;
  swordName: string;
  swordImageUrl: string;
}

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
      const height = Math.min(520, width * 0.65);
      setDimensions({ width, height });
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  if (heritage.holders.length === 0) {
    return (
      <div className="ink-card p-8 text-center animate-fade-in-up">
        <h3 className="font-brush text-2xl text-ink-900 mb-4">持有者关系图谱</h3>
        <p className="font-song text-ink-500">暂无持有者记录</p>
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
            <filter id="holderNodeShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3" />
            </filter>
          </defs>

          <circle
            cx={centerX}
            cy={centerY}
            r={radius + 30}
            fill="url(#swordCenterGlow)"
            className="animate-pulse"
          />

          {heritage.holders.map((holder, index) => {
            const pos = getNodePosition(index, heritage.holders.length);
            const isHovered = hoveredNode === holder.id;
            const acqColor = ACQUISITION_COLORS[holder.acquisitionMethod] || ACQUISITION_COLORS['其他'];
            const shouldDim = hoveredNode && !isHovered && hoveredNode !== 'center';

            return (
              <g key={holder.id}>
                <line
                  x1={centerX}
                  y1={centerY}
                  x2={pos.x}
                  y2={pos.y}
                  stroke={acqColor}
                  strokeWidth={isHovered ? 3 : 1.5}
                  strokeDasharray={holder.acquisitionMethod === '夺取' ? '6,4' : 'none'}
                  opacity={shouldDim ? 0.15 : 0.6}
                  className="transition-all duration-300"
                />

                <text
                  x={(centerX + pos.x) / 2}
                  y={(centerY + pos.y) / 2 - 8}
                  textAnchor="middle"
                  className="text-[9px] font-song"
                  fill={acqColor}
                  opacity={shouldDim ? 0.2 : 0.9}
                >
                  {holder.acquisitionMethod}
                </text>

                <Link
                  to={`/swordsmen/${holder.swordsmanId}`}
                  onMouseEnter={() => setHoveredNode(holder.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                >
                  <g className="cursor-pointer transition-transform duration-300">
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={isHovered ? 44 : 38}
                      fill={acqColor}
                      fillOpacity={0.08}
                      stroke={acqColor}
                      strokeWidth={isHovered ? 3 : 2}
                      filter="url(#holderNodeShadow)"
                      className="transition-all duration-300"
                      opacity={shouldDim ? 0.4 : 1}
                    />
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={isHovered ? 38 : 32}
                      fill="#f5f5f4"
                      opacity={shouldDim ? 0.4 : 1}
                    />
                    <text
                      x={pos.x}
                      y={pos.y - 2}
                      textAnchor="middle"
                      className="text-sm font-brush fill-ink-900"
                      opacity={shouldDim ? 0.4 : 1}
                    >
                      {holder.swordsmanName}
                    </text>
                    <text
                      x={pos.x}
                      y={pos.y + 12}
                      textAnchor="middle"
                      className="text-[10px] font-song fill-ink-500"
                      opacity={shouldDim ? 0.3 : 0.8}
                    >
                      第{index + 1}任
                    </text>
                    <text
                      x={pos.x}
                      y={pos.y + 56}
                      textAnchor="middle"
                      className="text-[10px] font-song fill-ink-500"
                      opacity={shouldDim ? 0.3 : 0.8}
                    >
                      {holder.startYear}—{holder.endYear}
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
              r={60}
              fill="#fef2f2"
              stroke="#dc2626"
              strokeWidth={3}
              filter="url(#holderNodeShadow)"
            />
            <clipPath id="swordHolderCenterClip">
              <circle cx={centerX} cy={centerY} r={52} />
            </clipPath>
            <image
              href={swordImageUrl}
              x={centerX - 52}
              y={centerY - 52}
              width={104}
              height={104}
              clipPath="url(#swordHolderCenterClip)"
              preserveAspectRatio="xMidYMid slice"
            />
            <text
              x={centerX}
              y={centerY + 92}
              textAnchor="middle"
              className="text-lg font-brush fill-ink-900"
            >
              {swordName}
            </text>
            <text
              x={centerX}
              y={centerY + 108}
              textAnchor="middle"
              className="text-[10px] font-song fill-ink-500"
            >
              共 {heritage.holders.length} 任持有者
            </text>
          </g>
        </svg>

        {hoveredNode && hoveredNode !== 'center' && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-ink-800 text-ink-100 px-4 py-2 rounded-lg text-sm font-song max-w-md text-center z-10">
            {(() => {
              const holder = heritage.holders.find(h => h.id === hoveredNode);
              if (!holder) return '';
              return `${holder.swordsmanName} · ${holder.startYear}至${holder.endYear}持有，${holder.acquisitionMethod}而得${holder.lossMethod ? `，${holder.lossMethod}而失` : ''}。${holder.description}`;
            })()}
          </div>
        )}
      </div>

      <div className="flex flex-wrap justify-center gap-4 mt-6 pt-6 border-t border-ink-200">
        <div>
          <p className="text-xs font-song text-ink-500 mb-2">获取方式</p>
          <div className="flex flex-wrap gap-3">
            {Object.entries(ACQUISITION_COLORS).map(([method, color]) => {
              const count = heritage.holders.filter(h => h.acquisitionMethod === method).length;
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
