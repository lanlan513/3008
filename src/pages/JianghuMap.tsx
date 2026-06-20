import { useEffect, useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Map as MapIcon,
  Building2,
  Flame,
  Swords,
  User,
  Crosshair,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Search,
  Sword,
  Users,
  Calendar,
  Star,
  Sparkles,
  TrendingUp,
  BarChart3,
} from 'lucide-react';
import { mapApi, type LocationDetails } from '../api';
import type { MapLocation, SpatialFilterType } from '../types';
import { cn } from '@/lib/utils';

const TYPE_CONFIG: Record<SpatialFilterType, { label: string; icon: typeof Building2; color: string; bgColor: string; borderColor: string }> = {
  all: { label: '全部', icon: MapIcon, color: 'text-ink-800', bgColor: 'bg-ink-50', borderColor: 'border-ink-400' },
  sect: { label: '门派', icon: Building2, color: 'text-bronze-700', bgColor: 'bg-bronze-50', borderColor: 'border-bronze-400' },
  sword_forge: { label: '铸剑地', icon: Flame, color: 'text-gold-700', bgColor: 'bg-gold-50', borderColor: 'border-gold-400' },
  event: { label: '事件', icon: Calendar, color: 'text-cinnabar-700', bgColor: 'bg-cinnabar-50', borderColor: 'border-cinnabar-400' },
  birthplace: { label: '诞生地', icon: User, color: 'text-emerald-700', bgColor: 'bg-emerald-50', borderColor: 'border-emerald-400' },
  battlefield: { label: '战场', icon: Swords, color: 'text-red-700', bgColor: 'bg-red-50', borderColor: 'border-red-400' },
};

const DYNASTIES = ['上古', '夏商', '西周', '春秋', '战国', '秦', '秦末', '汉', '三国', '晋', '南北朝', '隋', '唐', '宋', '元', '明', '清'];

const SVG_WIDTH = 900;
const SVG_HEIGHT = 700;

export default function JianghuMap() {
  const [locations, setLocations] = useState<MapLocation[]>([]);
  const [allRegions, setAllRegions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);
  const [locationDetails, setLocationDetails] = useState<LocationDetails | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [showDetailPanel, setShowDetailPanel] = useState(true);
  const [showFilterPanel, setShowFilterPanel] = useState(true);
  const [hoveredLocation, setHoveredLocation] = useState<MapLocation | null>(null);

  const [activeTypes, setActiveTypes] = useState<SpatialFilterType[]>(['all']);
  const [selectedDynasties, setSelectedDynasties] = useState<string[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [minImportance, setMinImportance] = useState<number>(0);
  const [searchKeyword, setSearchKeyword] = useState('');

  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const panStart = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [locs, regions] = await Promise.all([
          mapApi.getAllLocations(),
          mapApi.getAllRegions(),
        ]);
        setLocations(locs);
        setAllRegions(regions);
      } catch (error) {
        console.error('Failed to fetch map data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    const applyFilter = async () => {
      setLoading(true);
      try {
        const params = {
          types: activeTypes,
          dynasties: selectedDynasties,
          regions: selectedRegions,
          minImportance: minImportance > 0 ? minImportance : undefined,
        };
        const data = await mapApi.getFilteredLocations(params);
        setLocations(data);
      } catch (error) {
        console.error('Filter error:', error);
      } finally {
        setLoading(false);
      }
    };
    applyFilter();
  }, [activeTypes, selectedDynasties, selectedRegions, minImportance]);

  useEffect(() => {
    if (!selectedLocation) {
      setLocationDetails(null);
      return;
    }
    const fetchDetails = async () => {
      setDetailLoading(true);
      try {
        const details = await mapApi.getLocationDetails(selectedLocation.id);
        setLocationDetails(details);
      } catch (error) {
        console.error('Failed to fetch location details:', error);
      } finally {
        setDetailLoading(false);
      }
    };
    fetchDetails();
  }, [selectedLocation]);

  const filteredLocations = locations.filter((loc) => {
    if (searchKeyword.trim() === '') return true;
    const kw = searchKeyword.toLowerCase();
    return (
      loc.name.toLowerCase().includes(kw) ||
      loc.region.toLowerCase().includes(kw) ||
      loc.description.toLowerCase().includes(kw)
    );
  });

  const toggleType = (type: SpatialFilterType) => {
    if (type === 'all') {
      setActiveTypes(['all']);
      return;
    }
    setActiveTypes((prev) => {
      const newTypes = prev.filter((t) => t !== 'all');
      if (newTypes.includes(type)) {
        const result = newTypes.filter((t) => t !== type);
        return result.length === 0 ? ['all'] : result;
      }
      return [...newTypes, type];
    });
  };

  const toggleDynasty = (dynasty: string) => {
    setSelectedDynasties((prev) =>
      prev.includes(dynasty) ? prev.filter((d) => d !== dynasty) : [...prev, dynasty]
    );
  };

  const toggleRegion = (region: string) => {
    setSelectedRegions((prev) =>
      prev.includes(region) ? prev.filter((r) => r !== region) : [...prev, region]
    );
  };

  const resetFilters = () => {
    setActiveTypes(['all']);
    setSelectedDynasties([]);
    setSelectedRegions([]);
    setMinImportance(0);
    setSearchKeyword('');
  };

  const handleLocationClick = async (location: MapLocation) => {
    setSelectedLocation(location);
    setShowDetailPanel(true);
  };

  const handleZoomIn = () => setScale((s) => Math.min(s * 1.2, 5));
  const handleZoomOut = () => setScale((s) => Math.max(s / 1.2, 0.3));
  const handleReset = () => {
    setScale(1);
    setTranslate({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as SVGElement).closest('[data-marker]')) return;
    setIsPanning(true);
    panStart.current = {
      x: e.clientX,
      y: e.clientY,
      tx: translate.x,
      ty: translate.y,
    };
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isPanning) return;
      const dx = e.clientX - panStart.current.x;
      const dy = e.clientY - panStart.current.y;
      setTranslate({
        x: panStart.current.tx + dx,
        y: panStart.current.ty + dy,
      });
    },
    [isPanning]
  );

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setScale((s) => Math.min(5, Math.max(0.3, s * delta)));
  };

  const markerSize = (importance: number) => {
    if (importance >= 95) return 18;
    if (importance >= 85) return 15;
    if (importance >= 75) return 12;
    return 10;
  };

  return (
    <div className="min-h-screen bg-ink-100 pt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-3 mb-4">
            <MapIcon className="w-8 h-8 text-cinnabar-600" />
            <h1 className="font-brush text-5xl text-ink-900">江湖地域图</h1>
          </div>
          <p className="font-song text-ink-600 max-w-2xl mx-auto">
            探寻武林门派所在，追溯名剑出世之地，重温江湖千古事。
            鼠标拖拽可移动地图，滚轮缩放，点击标记查看详情。
          </p>
        </div>

        <div className="grid grid-cols-12 gap-6">
          <div
            className={cn(
              'transition-all duration-300',
              showFilterPanel ? 'col-span-12 lg:col-span-3' : 'col-span-1'
            )}
          >
            <div className="sticky top-24">
              <button
                onClick={() => setShowFilterPanel(!showFilterPanel)}
                className="w-full mb-2 ink-card px-3 py-2 flex items-center justify-between font-song text-ink-700 hover:bg-ink-50"
              >
                {showFilterPanel ? (
                  <>
                    <span className="flex items-center gap-2">
                      <Filter className="w-4 h-4" />
                      筛选面板
                    </span>
                    <ChevronLeft className="w-4 h-4" />
                  </>
                ) : (
                  <Filter className="w-5 h-5 mx-auto" />
                )}
              </button>

              {showFilterPanel && (
                <div className="ink-card p-4 space-y-5 animate-fade-in-up">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Search className="w-4 h-4 text-ink-500" />
                      <h3 className="font-song font-bold text-ink-800">关键词搜索</h3>
                    </div>
                    <input
                      type="text"
                      value={searchKeyword}
                      onChange={(e) => setSearchKeyword(e.target.value)}
                      placeholder="输入地点、地域..."
                      className="w-full px-3 py-2 border border-ink-300 bg-ink-50 font-song text-sm focus:outline-none focus:border-cinnabar-500"
                    />
                  </div>

                  <div>
                    <h3 className="font-song font-bold text-ink-800 mb-3">地点类型</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {(Object.keys(TYPE_CONFIG) as SpatialFilterType[]).map((type) => {
                        const config = TYPE_CONFIG[type];
                        const Icon = config.icon;
                        const isActive = activeTypes.includes(type);
                        return (
                          <button
                            key={type}
                            onClick={() => toggleType(type)}
                            className={cn(
                              'flex items-center gap-2 px-3 py-2 text-sm font-song border transition-all',
                              isActive
                                ? `${config.bgColor} ${config.color} ${config.borderColor} shadow-sm`
                                : 'bg-ink-50 text-ink-500 border-ink-200 hover:border-ink-300'
                            )}
                          >
                            <Icon className="w-4 h-4" />
                            {config.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-song font-bold text-ink-800 mb-3">朝代筛选</h3>
                    <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto">
                      {DYNASTIES.map((d) => {
                        const isActive = selectedDynasties.includes(d);
                        return (
                          <button
                            key={d}
                            onClick={() => toggleDynasty(d)}
                            className={cn(
                              'px-2 py-1 text-xs font-song border transition-all',
                              isActive
                                ? 'bg-cinnabar-600 text-ink-100 border-cinnabar-600'
                                : 'bg-ink-50 text-ink-600 border-ink-200 hover:border-cinnabar-300'
                            )}
                          >
                            {d}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-song font-bold text-ink-800 mb-3">地域筛选</h3>
                    <div className="flex flex-wrap gap-1.5">
                      {allRegions.map((r) => {
                        const isActive = selectedRegions.includes(r);
                        return (
                          <button
                            key={r}
                            onClick={() => toggleRegion(r)}
                            className={cn(
                              'px-2 py-1 text-xs font-song border transition-all',
                              isActive
                                ? 'bg-bronze-500 text-ink-100 border-bronze-500'
                                : 'bg-ink-50 text-ink-600 border-ink-200 hover:border-bronze-300'
                            )}
                          >
                            {r}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-song font-bold text-ink-800 mb-3">
                      重要性阈值：{minImportance}
                    </h3>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={minImportance}
                      onChange={(e) => setMinImportance(Number(e.target.value))}
                      className="w-full accent-cinnabar-600"
                    />
                    <div className="flex justify-between text-xs text-ink-400 mt-1 font-song">
                      <span>全部</span>
                      <span>重要</span>
                      <span>传奇</span>
                    </div>
                  </div>

                  <button
                    onClick={resetFilters}
                    className="w-full py-2 border border-ink-300 font-song text-ink-600 hover:bg-ink-50 transition-colors"
                  >
                    重置筛选条件
                  </button>

                  <Link
                    to="/map/stats"
                    className="flex items-center justify-center gap-2 w-full py-2.5 bg-gradient-to-r from-gold-500 to-gold-600 text-ink-100 font-song shadow-gold hover:shadow-lg transition-all"
                  >
                    <BarChart3 className="w-4 h-4" />
                    地理统计分析
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div
            className={cn(
              'transition-all duration-300',
              showFilterPanel
                ? showDetailPanel
                  ? 'col-span-12 lg:col-span-6'
                  : 'col-span-12 lg:col-span-9'
                : showDetailPanel
                ? 'col-span-12 lg:col-span-8'
                : 'col-span-12 lg:col-span-11'
            )}
          >
            <div className="ink-card p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <span className="font-song text-ink-600">
                    共 <span className="font-brush text-2xl text-cinnabar-600">{filteredLocations.length}</span> 处地点
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleZoomOut}
                    className="p-2 border border-ink-300 bg-ink-50 hover:bg-ink-100 text-ink-700 transition-colors"
                    title="缩小"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <span className="font-song text-sm text-ink-600 w-14 text-center">
                    {Math.round(scale * 100)}%
                  </span>
                  <button
                    onClick={handleZoomIn}
                    className="p-2 border border-ink-300 bg-ink-50 hover:bg-ink-100 text-ink-700 transition-colors"
                    title="放大"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleReset}
                    className="p-2 border border-ink-300 bg-ink-50 hover:bg-ink-100 text-ink-700 transition-colors"
                    title="重置视图"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div
                className={cn(
                  'relative w-full overflow-hidden bg-gradient-to-br from-ink-50 via-ink-100 to-ink-50 border border-ink-200',
                  isPanning ? 'cursor-grabbing' : 'cursor-grab'
                )}
                style={{ aspectRatio: `${SVG_WIDTH}/${SVG_HEIGHT}` }}
              >
                {loading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-ink-100/80 z-50">
                    <div className="animate-spin w-8 h-8 border-4 border-cinnabar-500 border-t-transparent rounded-full" />
                  </div>
                )}

                <svg
                  ref={svgRef}
                  viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
                  className="w-full h-full select-none"
                  onMouseDown={handleMouseDown}
                  onWheel={handleWheel}
                >
                  <defs>
                    <radialGradient id="inkGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="rgba(196,30,58,0.4)" />
                      <stop offset="100%" stopColor="rgba(196,30,58,0)" />
                    </radialGradient>
                    <radialGradient id="bronzeGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="rgba(61,85,54,0.4)" />
                      <stop offset="100%" stopColor="rgba(61,85,54,0)" />
                    </radialGradient>
                    <radialGradient id="goldGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="rgba(185,148,35,0.5)" />
                      <stop offset="100%" stopColor="rgba(185,148,35,0)" />
                    </radialGradient>
                    <filter id="inkBlur">
                      <feGaussianBlur stdDeviation="0.5" />
                    </filter>
                    <pattern id="paperTexture" patternUnits="userSpaceOnUse" width="100" height="100">
                      <rect width="100" height="100" fill="transparent" />
                      <circle cx="20" cy="30" r="0.5" fill="rgba(140,120,90,0.08)" />
                      <circle cx="60" cy="70" r="0.4" fill="rgba(140,120,90,0.06)" />
                      <circle cx="80" cy="20" r="0.3" fill="rgba(140,120,90,0.05)" />
                    </pattern>
                  </defs>

                  <g
                    transform={`translate(${translate.x}, ${translate.y}) scale(${scale})`}
                    style={{ transformOrigin: 'center' }}
                  >
                    <rect width={SVG_WIDTH} height={SVG_HEIGHT} fill="url(#paperTexture)" />

                    <g id="jianghu-map-shape" opacity="0.25">
                      <path
                        d="M 150,280 
                           Q 200,220 280,200
                           Q 360,180 450,190
                           Q 540,170 620,200
                           Q 700,210 760,260
                           Q 800,320 810,400
                           Q 800,470 750,520
                           Q 700,570 620,580
                           Q 540,600 460,590
                           Q 380,610 300,590
                           Q 220,580 160,530
                           Q 110,480 100,400
                           Q 90,340 150,280 Z"
                        fill="none"
                        stroke="#2d3a4a"
                        strokeWidth="2.5"
                        filter="url(#inkBlur)"
                      />
                      <path
                        d="M 150,280 
                           Q 200,220 280,200
                           Q 360,180 450,190
                           Q 540,170 620,200
                           Q 700,210 760,260
                           Q 800,320 810,400
                           Q 800,470 750,520
                           Q 700,570 620,580
                           Q 540,600 460,590
                           Q 380,610 300,590
                           Q 220,580 160,530
                           Q 110,480 100,400
                           Q 90,340 150,280 Z"
                        fill="rgba(245,240,230,0.6)"
                        stroke="#1a1a1a"
                        strokeWidth="1"
                      />
                    </g>

                    <g opacity="0.15" stroke="#5c5854" strokeWidth="1" fill="none" strokeDasharray="4,3">
                      <path d="M 180,320 Q 280,260 400,300 Q 520,340 620,310 Q 700,290 760,350" />
                      <path d="M 200,400 Q 320,380 440,420 Q 560,460 680,430 Q 740,410 770,470" />
                      <path d="M 140,460 Q 260,490 380,470 Q 500,450 600,500 Q 700,530 720,510" />
                    </g>

                    <g>
                      <path
                        d="M 280,300 Q 380,280 460,310 Q 540,340 600,330"
                        fill="none"
                        stroke="#a51830"
                        strokeWidth="3"
                        opacity="0.3"
                        strokeLinecap="round"
                      />
                      <path
                        d="M 300,480 Q 420,440 520,460 Q 620,480 700,460"
                        fill="none"
                        stroke="#a51830"
                        strokeWidth="2.5"
                        opacity="0.25"
                        strokeLinecap="round"
                      />
                      <path
                        d="M 160,340 Q 260,320 360,360 Q 440,400 500,380"
                        fill="none"
                        stroke="#a51830"
                        strokeWidth="2"
                        opacity="0.2"
                        strokeLinecap="round"
                      />
                    </g>

                    <g fill="#8b8680" fontSize="11" fontFamily="serif" opacity="0.7">
                      <text x="175" y="300" fontFamily="'Ma Shan Zheng', cursive" fontSize="14">西域</text>
                      <text x="340" y="295" fontFamily="'Ma Shan Zheng', cursive" fontSize="14">陇右</text>
                      <text x="455" y="325" fontFamily="'Ma Shan Zheng', cursive" fontSize="14">关中</text>
                      <text x="530" y="350" fontFamily="'Ma Shan Zheng', cursive" fontSize="14">中原</text>
                      <text x="600" y="300" fontFamily="'Ma Shan Zheng', cursive" fontSize="14">燕赵</text>
                      <text x="300" y="455" fontFamily="'Ma Shan Zheng', cursive" fontSize="14">巴蜀</text>
                      <text x="490" y="445" fontFamily="'Ma Shan Zheng', cursive" fontSize="14">华中</text>
                      <text x="565" y="515" fontFamily="'Ma Shan Zheng', cursive" fontSize="14">荆楚</text>
                      <text x="665" y="435" fontFamily="'Ma Shan Zheng', cursive" fontSize="14">江淮</text>
                      <text x="650" y="520" fontFamily="'Ma Shan Zheng', cursive" fontSize="14">江南</text>
                    </g>

                    <g>
                      {[
                        { x: 200, y: 260, r: 8, label: '昆仑' },
                        { x: 360, y: 290, r: 6, label: '崆峒' },
                        { x: 470, y: 325, r: 7, label: '华山' },
                        { x: 535, y: 345, r: 7, label: '嵩山' },
                        { x: 500, y: 410, r: 8, label: '武当' },
                        { x: 340, y: 445, r: 7, label: '峨眉' },
                      ].map((m, i) => (
                        <g key={`mountain-${i}`} opacity="0.3">
                          <polygon
                            points={`${m.x},${m.y - m.r} ${m.x - m.r * 0.8},${m.y + m.r * 0.5} ${m.x + m.r * 0.8},${m.y + m.r * 0.5}`}
                            fill="#5c5854"
                          />
                          <polygon
                            points={`${m.x - m.r * 0.3},${m.y - m.r * 0.4} ${m.x - m.r * 0.6},${m.y + m.r * 0.2} ${m.x},${m.y + m.r * 0.1}`}
                            fill="#ffffff"
                            opacity="0.5"
                          />
                        </g>
                      ))}
                    </g>

                    <g>
                      {filteredLocations.map((location) => {
                        const typeKey = location.type;
                        const size = markerSize(location.importance);
                        const isSelected = selectedLocation?.id === location.id;
                        const isHovered = hoveredLocation?.id === location.id;
                        const displaySize = size * (isSelected || isHovered ? 1.3 : 1);

                        const getGlowId = () => {
                          switch (typeKey) {
                            case 'sect': return 'url(#bronzeGlow)';
                            case 'sword_forge': return 'url(#goldGlow)';
                            case 'battlefield':
                            case 'event': return 'url(#inkGlow)';
                            default: return 'url(#inkGlow)';
                          }
                        };

                        return (
                          <g
                            key={location.id}
                            data-marker
                            transform={`translate(${location.coord.x}, ${location.coord.y})`}
                            onClick={() => handleLocationClick(location)}
                            onMouseEnter={() => setHoveredLocation(location)}
                            onMouseLeave={() => setHoveredLocation(null)}
                            className="cursor-pointer"
                          >
                            {(isSelected || isHovered) && (
                              <>
                                <circle
                                  r={displaySize * 2}
                                  fill={getGlowId()}
                                  className="animate-float"
                                />
                                <circle
                                  r={displaySize * 1.5}
                                  fill="none"
                                  stroke={
                                    typeKey === 'sect' ? '#3d5536' :
                                    typeKey === 'sword_forge' ? '#99751d' :
                                    typeKey === 'battlefield' ? '#88172b' :
                                    typeKey === 'event' ? '#a51830' :
                                    '#065f46'
                                  }
                                  strokeWidth="1"
                                  opacity="0.6"
                                  strokeDasharray="3,2"
                                >
                                  <animate attributeName="r" from={displaySize} to={displaySize * 2} dur="1.5s" repeatCount="indefinite" />
                                  <animate attributeName="opacity" from="0.6" to="0" dur="1.5s" repeatCount="indefinite" />
                                </circle>
                              </>
                            )}

                            <circle
                              r={displaySize}
                              fill={
                                typeKey === 'sect' ? '#3d5536' :
                                typeKey === 'sword_forge' ? '#99751d' :
                                typeKey === 'battlefield' ? '#88172b' :
                                typeKey === 'event' ? '#a51830' :
                                typeKey === 'birthplace' ? '#065f46' :
                                '#5c5854'
                              }
                              stroke="#1a1a1a"
                              strokeWidth={isSelected ? 2.5 : 1}
                              className="transition-all duration-200"
                            />

                            <circle
                              r={displaySize * 0.45}
                              fill={
                                typeKey === 'sect' ? '#9bb48f' :
                                typeKey === 'sword_forge' ? '#ecd991' :
                                typeKey === 'battlefield' ? '#fbc7cc' :
                                typeKey === 'event' ? '#f7a1a8' :
                                typeKey === 'birthplace' ? '#c2d1ba' :
                                '#d4c9b0'
                              }
                            />

                            {(isSelected || isHovered) && (
                              <g transform={`translate(0, ${-displaySize - 10})`}>
                                <rect
                                  x={-(location.name.length * 7 + 10) / 2}
                                  y="-16"
                                  width={location.name.length * 7 + 10}
                                  height="22"
                                  fill="#1a1a1a"
                                  opacity="0.9"
                                  rx="2"
                                />
                                <text
                                  textAnchor="middle"
                                  y="0"
                                  fill="#f5f0e6"
                                  fontSize="12"
                                  fontFamily="'Noto Serif SC', serif"
                                >
                                  {location.name}
                                </text>
                              </g>
                            )}
                          </g>
                        );
                      })}
                    </g>

                    <g transform={`translate(${SVG_WIDTH - 110}, ${SVG_HEIGHT - 130})`}>
                      <rect
                        x="-5"
                        y="-5"
                        width="105"
                        height="125"
                        fill="rgba(245,240,230,0.9)"
                        stroke="#8b8680"
                        strokeWidth="1"
                      />
                      <text x="0" y="12" fontSize="12" fill="#1a1a1a" fontFamily="'Ma Shan Zheng', cursive">图例</text>
                      <line x1="0" y1="18" x2="95" y2="18" stroke="#b8a98a" strokeWidth="0.5" />
                      {(Object.entries(TYPE_CONFIG) as [SpatialFilterType, typeof TYPE_CONFIG[SpatialFilterType]][]).filter(([k]) => k !== 'all').map(([key, cfg], i) => (
                        <g key={key} transform={`translate(0, ${28 + i * 18})`}>
                          <circle
                            cx="6"
                            cy="-3"
                            r="6"
                            fill={
                              key === 'sect' ? '#3d5536' :
                              key === 'sword_forge' ? '#99751d' :
                              key === 'battlefield' ? '#88172b' :
                              key === 'event' ? '#a51830' :
                              '#065f46'
                            }
                          />
                          <text x="18" y="1" fontSize="10" fill="#2d3a4a" fontFamily="'Noto Serif SC', serif">
                            {cfg.label}
                          </text>
                        </g>
                      ))}
                    </g>
                  </g>
                </svg>

                {hoveredLocation && !selectedLocation && (
                  <div
                    className="absolute bottom-4 left-4 ink-card px-4 py-2 animate-fade-in-up max-w-xs"
                    style={{ animationFillMode: 'forwards' }}
                  >
                    <div className="flex items-center gap-2">
                      {(() => {
                        const Icon = TYPE_CONFIG[hoveredLocation.type].icon;
                        return <Icon className={cn('w-4 h-4', TYPE_CONFIG[hoveredLocation.type].color)} />;
                      })()}
                      <span className="font-brush text-lg text-ink-900">{hoveredLocation.name}</span>
                    </div>
                    <div className="text-xs text-ink-500 mt-1 font-song">{hoveredLocation.region}</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div
            className={cn(
              'transition-all duration-300',
              showDetailPanel ? 'col-span-12 lg:col-span-3' : 'col-span-0 hidden lg:block'
            )}
          >
            <div className="sticky top-24 space-y-2">
              <button
                onClick={() => setShowDetailPanel(!showDetailPanel)}
                className="w-full ink-card px-3 py-2 flex items-center justify-between font-song text-ink-700 hover:bg-ink-50"
              >
                {showDetailPanel ? (
                  <>
                    <span className="flex items-center gap-2">
                      <Crosshair className="w-4 h-4" />
                      地点详情
                    </span>
                    <ChevronRight className="w-4 h-4" />
                  </>
                ) : (
                  <Crosshair className="w-5 h-5 mx-auto" />
                )}
              </button>

              {showDetailPanel && (
                <div className="ink-card p-0 overflow-hidden animate-fade-in-up">
                  {!selectedLocation ? (
                    <div className="p-8 text-center">
                      <MapIcon className="w-12 h-12 mx-auto text-ink-300 mb-3" />
                      <p className="font-song text-ink-500">点击地图上的标记</p>
                      <p className="font-song text-ink-400 text-sm mt-1">查看详细信息</p>
                    </div>
                  ) : detailLoading ? (
                    <div className="p-8 flex justify-center">
                      <div className="animate-spin w-6 h-6 border-4 border-cinnabar-500 border-t-transparent rounded-full" />
                    </div>
                  ) : locationDetails ? (
                    <div>
                      <div
                        className={cn(
                          'p-4 border-b border-ink-200',
                          TYPE_CONFIG[selectedLocation.type].bgColor
                        )}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h2 className="font-brush text-2xl text-ink-900">{selectedLocation.name}</h2>
                            <div className="flex items-center gap-2 mt-1">
                              {(() => {
                                const Icon = TYPE_CONFIG[selectedLocation.type].icon;
                                return (
                                  <span className={cn(
                                    'inline-flex items-center gap-1 px-2 py-0.5 text-xs font-song border rounded',
                                    TYPE_CONFIG[selectedLocation.type].color,
                                    TYPE_CONFIG[selectedLocation.type].borderColor,
                                    TYPE_CONFIG[selectedLocation.type].bgColor
                                  )}>
                                    <Icon className="w-3 h-3" />
                                    {TYPE_CONFIG[selectedLocation.type].label}
                                  </span>
                                );
                              })()}
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-song border border-ink-300 text-ink-600 bg-ink-50 rounded">
                                <MapIcon className="w-3 h-3" />
                                {selectedLocation.region}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => setSelectedLocation(null)}
                            className="p-1 text-ink-400 hover:text-ink-700"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={cn(
                                'w-3.5 h-3.5',
                                i < Math.ceil(selectedLocation.importance / 20)
                                  ? 'text-gold-500 fill-gold-500'
                                  : 'text-ink-300'
                              )}
                            />
                          ))}
                          <span className="text-xs text-ink-500 ml-2 font-song">
                            重要度 {selectedLocation.importance}
                          </span>
                        </div>
                      </div>

                      <div className="p-4 max-h-[calc(100vh-320px)] overflow-y-auto space-y-5">
                        <div>
                          <h4 className="font-song font-bold text-ink-800 mb-2 text-sm">简介</h4>
                          <p className="font-song text-ink-600 text-sm leading-relaxed">
                            {selectedLocation.description}
                          </p>
                        </div>

                        {locationDetails.relatedSects.length > 0 && (
                          <div>
                            <h4 className="font-song font-bold text-bronze-700 mb-2 text-sm flex items-center gap-1">
                              <Building2 className="w-4 h-4" />
                              关联门派 ({locationDetails.relatedSects.length})
                            </h4>
                            <div className="space-y-2">
                              {locationDetails.relatedSects.map((sect) => (
                                <Link
                                  key={sect.id}
                                  to="/sects"
                                  className="block p-3 bg-bronze-50 border border-bronze-200 hover:border-bronze-400 transition-colors"
                                >
                                  <div className="flex items-center gap-3">
                                    <div
                                      className="w-10 h-10 rounded bg-cover bg-center border border-bronze-300 flex-shrink-0"
                                      style={{ backgroundImage: `url(${sect.emblemUrl})` }}
                                    />
                                    <div className="min-w-0">
                                      <div className="font-song font-bold text-ink-800 text-sm truncate">
                                        {sect.name}
                                      </div>
                                      <div className="text-xs text-ink-500 font-song truncate">
                                        {sect.foundingDynasty}代 · {sect.location}
                                      </div>
                                    </div>
                                  </div>
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}

                        {locationDetails.relatedSwords.length > 0 && (
                          <div>
                            <h4 className="font-song font-bold text-gold-700 mb-2 text-sm flex items-center gap-1">
                              <Sword className="w-4 h-4" />
                              名剑出世 ({locationDetails.relatedSwords.length})
                            </h4>
                            <div className="space-y-2">
                              {locationDetails.relatedSwords.map((sword) => (
                                <Link
                                  key={sword.id}
                                  to={`/swords/${sword.id}`}
                                  className="block p-3 bg-gold-50 border border-gold-200 hover:border-gold-400 transition-colors"
                                >
                                  <div className="flex items-center gap-3">
                                    <div
                                      className="w-10 h-14 rounded bg-cover bg-center border border-gold-300 flex-shrink-0"
                                      style={{ backgroundImage: `url(${sword.imageUrl})` }}
                                    />
                                    <div className="min-w-0">
                                      <div className="font-song font-bold text-ink-800 text-sm truncate">
                                        {sword.name}
                                      </div>
                                      <div className="text-xs text-gold-600 font-song truncate">
                                        {sword.alias}
                                      </div>
                                      <div className="text-xs text-ink-500 font-song mt-0.5">
                                        {sword.dynasty} · {sword.owner}
                                      </div>
                                    </div>
                                  </div>
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}

                        {locationDetails.relatedSwordsmen.length > 0 && (
                          <div>
                            <h4 className="font-song font-bold text-cinnabar-700 mb-2 text-sm flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              江湖人物 ({locationDetails.relatedSwordsmen.length})
                            </h4>
                            <div className="space-y-2">
                              {locationDetails.relatedSwordsmen.map((sm) => (
                                <Link
                                  key={sm.id}
                                  to={`/swordsmen/${sm.id}`}
                                  className="block p-3 bg-cinnabar-50 border border-cinnabar-200 hover:border-cinnabar-400 transition-colors"
                                >
                                  <div className="flex items-center gap-3">
                                    <div
                                      className="w-10 h-10 rounded-full bg-cover bg-center border border-cinnabar-300 flex-shrink-0"
                                      style={{ backgroundImage: `url(${sm.avatarUrl})` }}
                                    />
                                    <div className="min-w-0">
                                      <div className="font-song font-bold text-ink-800 text-sm truncate">
                                        {sm.name}
                                      </div>
                                      <div className="text-xs text-cinnabar-600 font-song truncate">
                                        {sm.title}
                                      </div>
                                      <div className="text-xs text-ink-500 font-song mt-0.5">
                                        {sm.dynasty} · {sm.sect}
                                      </div>
                                    </div>
                                  </div>
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}

                        {locationDetails.relatedEvents.length > 0 && (
                          <div>
                            <h4 className="font-song font-bold text-ink-800 mb-2 text-sm flex items-center gap-1">
                              <Sparkles className="w-4 h-4" />
                              历史事件 ({locationDetails.relatedEvents.length})
                            </h4>
                            <div className="space-y-3">
                              {locationDetails.relatedEvents.map((evt) => (
                                <div
                                  key={evt.id}
                                  className="p-3 bg-ink-50 border-l-4 border-cinnabar-500"
                                >
                                  <div className="flex items-start justify-between gap-2 mb-1">
                                    <h5 className="font-song font-bold text-ink-800 text-sm">
                                      {evt.title}
                                    </h5>
                                    <span className={cn(
                                      'px-2 py-0.5 text-xs font-song flex-shrink-0',
                                      evt.significance === 'legendary' ? 'bg-gold-200 text-gold-800' :
                                      evt.significance === 'major' ? 'bg-cinnabar-200 text-cinnabar-800' :
                                      evt.significance === 'notable' ? 'bg-bronze-200 text-bronze-800' :
                                      'bg-ink-200 text-ink-700'
                                    )}>
                                      {evt.significance === 'legendary' ? '传奇' :
                                       evt.significance === 'major' ? '重大' :
                                       evt.significance === 'notable' ? '显著' : '普通'}
                                    </span>
                                  </div>
                                  <div className="text-xs text-ink-500 font-song mb-2 flex items-center gap-2">
                                    <Calendar className="w-3 h-3" />
                                    {evt.year} · {evt.dynasty}
                                  </div>
                                  <p className="text-xs text-ink-600 font-song leading-relaxed">
                                    {evt.description}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {locationDetails.relatedSects.length === 0 &&
                         locationDetails.relatedSwords.length === 0 &&
                         locationDetails.relatedSwordsmen.length === 0 &&
                         locationDetails.relatedEvents.length === 0 && (
                          <div className="py-4 text-center">
                            <TrendingUp className="w-8 h-8 mx-auto text-ink-300 mb-2" />
                            <p className="text-sm text-ink-400 font-song">暂无更多相关内容</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
