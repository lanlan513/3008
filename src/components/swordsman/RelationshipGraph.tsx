import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { Relationship } from '../../types';

interface RelationshipGraphProps {
  currentSwordsmanId: string;
  currentSwordsmanName: string;
  relationships: Relationship[];
  avatarUrl: string;
}

const RELATIONSHIP_COLORS: Record<string, string> = {
  '师父': '#d97706',
  '弟子': '#059669',
  '同门': '#0891b2',
  '夫妻': '#dc2626',
  '父子': '#7c3aed',
  '兄弟': '#ea580c',
  '朋友': '#65a30d',
  '仇敌': '#991b1b',
  '知己': '#db2777',
  '其他': '#6b7280',
};

const RELATIONSHIP_ICONS: Record<string, string> = {
  '师父': '师',
  '弟子': '徒',
  '同门': '门',
  '夫妻': '♥',
  '父子': '亲',
  '兄弟': '兄',
  '朋友': '友',
  '仇敌': '敌',
  '知己': '知',
  '其他': '•',
};

export default function RelationshipGraph({
  currentSwordsmanId,
  currentSwordsmanName,
  relationships,
  avatarUrl,
}: RelationshipGraphProps) {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState({ width: 600, height: 400 });

  useEffect(() => {
    const updateDimensions = () => {
      const width = Math.min(window.innerWidth - 80, 800);
      const height = Math.min(400, width * 0.6);
      setDimensions({ width, height });
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const centerX = dimensions.width / 2;
  const centerY = dimensions.height / 2;
  const radius = Math.min(dimensions.width, dimensions.height) * 0.35;

  const getNodePosition = (index: number, total: number) => {
    const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    };
  };

  const validRelationships = relationships;

  return (
    <div className="ink-card p-6">
      <h3 className="font-brush text-2xl text-ink-900 mb-6 text-center">人物关系网络</h3>
      
      <div className="relative overflow-hidden">
        <svg
          width={dimensions.width}
          height={dimensions.height}
          className="mx-auto"
        >
          <defs>
            <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#dc2626" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#dc2626" stopOpacity="0" />
            </radialGradient>
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3" />
            </filter>
          </defs>

          <circle
            cx={centerX}
            cy={centerY}
            r={radius + 30}
            fill="url(#centerGlow)"
            className="animate-pulse"
          />

          {validRelationships.map((rel, index) => {
            const pos = getNodePosition(index, validRelationships.length);
            const isHovered = hoveredNode === rel.swordsmanId;
            const color = RELATIONSHIP_COLORS[rel.type] || RELATIONSHIP_COLORS['其他'];

            return (
              <g key={rel.swordsmanId}>
                <line
                  x1={centerX}
                  y1={centerY}
                  x2={pos.x}
                  y2={pos.y}
                  stroke={color}
                  strokeWidth={isHovered ? 3 : 2}
                  strokeDasharray={rel.type === '仇敌' ? '5,5' : 'none'}
                  opacity={hoveredNode && !isHovered ? 0.3 : 0.7}
                  className="transition-all duration-300"
                />

                <text
                  x={(centerX + pos.x) / 2}
                  y={(centerY + pos.y) / 2 - 8}
                  textAnchor="middle"
                  className="text-[10px] font-song fill-ink-500"
                  opacity={hoveredNode && !isHovered ? 0.3 : 1}
                >
                  {rel.type}
                </text>
              </g>
            );
          })}

          <g
            onMouseEnter={() => setHoveredNode(currentSwordsmanId)}
            onMouseLeave={() => setHoveredNode(null)}
            className="cursor-pointer"
          >
            <circle
              cx={centerX}
              cy={centerY}
              r={45}
              fill="#fef2f2"
              stroke="#dc2626"
              strokeWidth={3}
              filter="url(#shadow)"
            />
            <clipPath id="centerClip">
              <circle cx={centerX} cy={centerY} r={40} />
            </clipPath>
            <image
              href={avatarUrl}
              x={centerX - 40}
              y={centerY - 40}
              width={80}
              height={80}
              clipPath="url(#centerClip)"
              preserveAspectRatio="xMidYMid slice"
            />
            <text
              x={centerX}
              y={centerY + 70}
              textAnchor="middle"
              className="text-sm font-brush fill-ink-900"
            >
              {currentSwordsmanName}
            </text>
          </g>

          {validRelationships.map((rel, index) => {
            const pos = getNodePosition(index, validRelationships.length);
            const isHovered = hoveredNode === rel.swordsmanId;
            const color = RELATIONSHIP_COLORS[rel.type] || RELATIONSHIP_COLORS['其他'];
            const icon = RELATIONSHIP_ICONS[rel.type] || RELATIONSHIP_ICONS['其他'];

            return (
              <Link
                key={rel.swordsmanId}
                to={`/swordsmen/${rel.swordsmanId}`}
                onMouseEnter={() => setHoveredNode(rel.swordsmanId)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                <g className="cursor-pointer transition-transform duration-300">
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={isHovered ? 38 : 32}
                    fill={color}
                    fillOpacity={0.1}
                    stroke={color}
                    strokeWidth={isHovered ? 3 : 2}
                    filter="url(#shadow)"
                    className="transition-all duration-300"
                    opacity={hoveredNode && !isHovered ? 0.5 : 1}
                  />
                  <text
                    x={pos.x}
                    y={pos.y + 6}
                    textAnchor="middle"
                    className="text-lg font-brush"
                    fill={color}
                    opacity={hoveredNode && !isHovered ? 0.5 : 1}
                  >
                    {icon}
                  </text>
                  <text
                    x={pos.x}
                    y={pos.y + 55}
                    textAnchor="middle"
                    className="text-xs font-song fill-ink-700"
                    opacity={hoveredNode && !isHovered ? 0.5 : 1}
                  >
                    {rel.swordsmanName}
                  </text>
                </g>
              </Link>
            );
          })}
        </svg>

        {hoveredNode && hoveredNode !== currentSwordsmanId && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-ink-800 text-ink-100 px-4 py-2 rounded-lg text-sm font-song max-w-md text-center z-10">
            {(() => {
              const rel = validRelationships.find(r => r.swordsmanId === hoveredNode);
              return rel ? rel.description : '';
            })()}
          </div>
        )}
      </div>

      <div className="flex flex-wrap justify-center gap-4 mt-6 pt-6 border-t border-ink-200">
        {Object.entries(RELATIONSHIP_COLORS).map(([type, color]) => {
          const count = validRelationships.filter(r => r.type === type).length;
          if (count === 0) return null;
          return (
            <div key={type} className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="text-xs font-song text-ink-600">
                {type} ({count})
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
