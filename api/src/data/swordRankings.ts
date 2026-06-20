import type { SwordRankingMetrics, RankingTrendData, RankingDimensionInfo } from '../../../shared/types.js';

export const RANKING_DIMENSIONS: RankingDimensionInfo[] = [
  {
    dimension: 'comprehensive',
    label: '综合排名',
    description: '根据四大维度加权计算的综合影响力排名',
    weight: 1.0,
    icon: 'Crown',
  },
  {
    dimension: 'historicalInfluence',
    label: '历史影响力',
    description: '基于重大历史事件、历史意义和朝代影响的评分',
    weight: 0.35,
    icon: 'Landmark',
  },
  {
    dimension: 'citationCount',
    label: '文献引用',
    description: '基于正史记载、学术论文和文学作品引用次数的评分',
    weight: 0.30,
    icon: 'BookOpen',
  },
  {
    dimension: 'heritageLength',
    label: '传承长度',
    description: '基于铸造年代、流传时间和持有者数量的评分',
    weight: 0.20,
    icon: 'Clock',
  },
  {
    dimension: 'relatedFigures',
    label: '关联人物',
    description: '基于著名持有者、关联剑客和历史人物数量的评分',
    weight: 0.15,
    icon: 'Users',
  },
];

function normalizeScore(value: number, min: number, max: number): number {
  return ((value - min) / (max - min)) * 100;
}

function calculateComprehensiveScore(metrics: {
  historicalInfluence: number;
  citationCount: number;
  heritageLength: number;
  relatedFiguresCount: number;
}): number {
  const weights = {
    historicalInfluence: 0.35,
    citationCount: 0.30,
    heritageLength: 0.20,
    relatedFigures: 0.15,
  };

  const normalizedHistorical = normalizeScore(metrics.historicalInfluence, 0, 100);
  const normalizedCitation = normalizeScore(metrics.citationCount, 0, 150);
  const normalizedHeritage = normalizeScore(metrics.heritageLength, 0, 100);
  const normalizedRelated = normalizeScore(metrics.relatedFiguresCount, 0, 60);

  return Number(
    (
      normalizedHistorical * weights.historicalInfluence +
      normalizedCitation * weights.citationCount +
      normalizedHeritage * weights.heritageLength +
      normalizedRelated * weights.relatedFigures
    ).toFixed(2)
  );
}

const rawSwordData: Omit<SwordRankingMetrics, 'comprehensiveScore' | 'rank' | 'previousRank' | 'rankChange' | 'trend'>[] = [
  {
    swordId: 'ls-15',
    swordName: '干将剑',
    swordAlias: '雄剑',
    swordImageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=ancient%20chinese%20ganjiang%20male%20sword%2C%20black%20iron%20blade%20with%20dragon%20pattern%2C%20master%20swordsmith%20legend%2C%20spring%20and%20autumn%20period%2C%20dramatic%20aura%2C%20ink%20wash%20painting&image_size=portrait_4_3',
    dynasty: '春秋',
    historicalInfluence: 95,
    historicalInfluenceDetail: { majorEvents: 5, historicalSignificance: 48, dynastyInfluence: 42 },
    citationCount: 128,
    citationCountDetail: { historicalRecords: 45, academicPapers: 38, literaryWorks: 45 },
    heritageLength: 92,
    heritageLengthDetail: { forgingYear: '公元前514年', lastKnownYear: '公元300年', yearsInCirculation: 814, holderCount: 12 },
    relatedFiguresCount: 45,
    relatedFiguresDetail: { famousHolders: 8, relatedSwordsmen: 22, historicalFigures: 15 },
    lastUpdated: '2024-06-15T00:00:00Z',
  },
  {
    swordId: 'ls-16',
    swordName: '莫邪剑',
    swordAlias: '雌剑',
    swordImageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=ancient%20chinese%20moye%20female%20sword%2C%20flowing%20water%20wave%20blade%2C%20graceful%20and%20ethereal%2C%20female%20swordsmith%20sacrifice%2C%20spring%20and%20autumn%20period%2C%20ink%20wash%20painting&image_size=portrait_4_3',
    dynasty: '春秋',
    historicalInfluence: 92,
    historicalInfluenceDetail: { majorEvents: 4, historicalSignificance: 46, dynastyInfluence: 42 },
    citationCount: 118,
    citationCountDetail: { historicalRecords: 42, academicPapers: 32, literaryWorks: 44 },
    heritageLength: 88,
    heritageLengthDetail: { forgingYear: '公元前514年', lastKnownYear: '公元280年', yearsInCirculation: 794, holderCount: 10 },
    relatedFiguresCount: 42,
    relatedFiguresDetail: { famousHolders: 7, relatedSwordsmen: 20, historicalFigures: 15 },
    lastUpdated: '2024-06-15T00:00:00Z',
  },
  {
    swordId: 'ls-13',
    swordName: '轩辕剑',
    swordAlias: '圣道之剑',
    swordImageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=divine%20chinese%20xuanyuan%20sword%2C%20golden%20blade%20with%20constellations%20and%20mountains%20carvings%2C%20sacred%20aura%2C%20yellow%20emperor%20mythology%2C%20ink%20wash%20painting&image_size=portrait_4_3',
    dynasty: '上古',
    historicalInfluence: 98,
    historicalInfluenceDetail: { majorEvents: 8, historicalSignificance: 50, dynastyInfluence: 40 },
    citationCount: 95,
    citationCountDetail: { historicalRecords: 25, academicPapers: 30, literaryWorks: 40 },
    heritageLength: 85,
    heritageLengthDetail: { forgingYear: '公元前2697年', lastKnownYear: '公元前1600年', yearsInCirculation: 1097, holderCount: 8 },
    relatedFiguresCount: 52,
    relatedFiguresDetail: { famousHolders: 12, relatedSwordsmen: 25, historicalFigures: 15 },
    lastUpdated: '2024-06-15T00:00:00Z',
  },
  {
    swordId: 'ls-4',
    swordName: '属镂剑',
    swordAlias: '赐死之剑',
    swordImageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=ancient%20cursed%20chinese%20sword%20shulou%2C%20dark%20blade%20with%20tear%20like%20patterns%2C%20blood%20stains%2C%20tragic%20aura%2C%20ink%20wash%20painting%20style&image_size=portrait_4_3',
    dynasty: '春秋',
    historicalInfluence: 88,
    historicalInfluenceDetail: { majorEvents: 6, historicalSignificance: 44, dynastyInfluence: 38 },
    citationCount: 105,
    citationCountDetail: { historicalRecords: 48, academicPapers: 32, literaryWorks: 25 },
    heritageLength: 78,
    heritageLengthDetail: { forgingYear: '公元前496年', lastKnownYear: '公元前473年', yearsInCirculation: 23, holderCount: 5 },
    relatedFiguresCount: 38,
    relatedFiguresDetail: { famousHolders: 6, relatedSwordsmen: 18, historicalFigures: 14 },
    lastUpdated: '2024-06-15T00:00:00Z',
  },
  {
    swordId: 'ls-14',
    swordName: '赤霄剑',
    swordAlias: '帝道之剑',
    swordImageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=chinese%20imperial%20red%20chixiao%20sword%2C%20blood%20red%20blade%2C%20white%20snake%20legend%2C%20han%20dynasty%20founder%20liu%20bang%2C%20imperial%20aura%2C%20ink%20wash%20painting&image_size=portrait_4_3',
    dynasty: '汉',
    historicalInfluence: 90,
    historicalInfluenceDetail: { majorEvents: 7, historicalSignificance: 45, dynastyInfluence: 38 },
    citationCount: 92,
    citationCountDetail: { historicalRecords: 40, academicPapers: 28, literaryWorks: 24 },
    heritageLength: 75,
    heritageLengthDetail: { forgingYear: '公元前210年', lastKnownYear: '公元295年', yearsInCirculation: 505, holderCount: 8 },
    relatedFiguresCount: 35,
    relatedFiguresDetail: { famousHolders: 5, relatedSwordsmen: 15, historicalFigures: 15 },
    lastUpdated: '2024-06-15T00:00:00Z',
  },
  {
    swordId: 'ls-17',
    swordName: '七星龙渊剑',
    swordAlias: '诚信之剑',
    swordImageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=ancient%20chinese%20qixing%20longyuan%20sword%2C%20blade%20with%20big%20dipper%20star%20pattern%20and%20dragon%20abyss%20design%2C%20deep%20blue%20waters%2C%20noble%20and%20honorable%2C%20ink%20wash%20painting&image_size=portrait_4_3',
    dynasty: '春秋',
    historicalInfluence: 85,
    historicalInfluenceDetail: { majorEvents: 5, historicalSignificance: 42, dynastyInfluence: 38 },
    citationCount: 88,
    citationCountDetail: { historicalRecords: 38, academicPapers: 25, literaryWorks: 25 },
    heritageLength: 82,
    heritageLengthDetail: { forgingYear: '公元前516年', lastKnownYear: '公元前484年', yearsInCirculation: 32, holderCount: 6 },
    relatedFiguresCount: 36,
    relatedFiguresDetail: { famousHolders: 7, relatedSwordsmen: 18, historicalFigures: 11 },
    lastUpdated: '2024-06-15T00:00:00Z',
  },
  {
    swordId: 'ls-1',
    swordName: '昆吾剑',
    swordAlias: '切玉之剑',
    swordImageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=ancient%20chinese%20mythical%20sword%20kunwu%2C%20red%20crimson%20blade%2C%20cutting%20jade%2C%20glowing%20at%20night%2C%20mysterious%20aura%2C%20ink%20wash%20painting%20style&image_size=portrait_4_3',
    dynasty: '周',
    historicalInfluence: 82,
    historicalInfluenceDetail: { majorEvents: 4, historicalSignificance: 40, dynastyInfluence: 38 },
    citationCount: 72,
    citationCountDetail: { historicalRecords: 28, academicPapers: 22, literaryWorks: 22 },
    heritageLength: 80,
    heritageLengthDetail: { forgingYear: '公元前950年', lastKnownYear: '公元前900年', yearsInCirculation: 50, holderCount: 4 },
    relatedFiguresCount: 28,
    relatedFiguresDetail: { famousHolders: 4, relatedSwordsmen: 14, historicalFigures: 10 },
    lastUpdated: '2024-06-15T00:00:00Z',
  },
  {
    swordId: 'ls-11',
    swordName: '惊鲵剑',
    swordAlias: '龙渊之剑',
    swordImageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=ancient%20chinese%20dragon%20frightening%20sword%20jingni%2C%20aquatic%20blue%20blade%2C%20dragon%20pattern%2C%20water%20splashing%2C%20yue%20kingdom%2C%20ink%20wash%20painting&image_size=portrait_4_3',
    dynasty: '春秋',
    historicalInfluence: 78,
    historicalInfluenceDetail: { majorEvents: 3, historicalSignificance: 38, dynastyInfluence: 37 },
    citationCount: 68,
    citationCountDetail: { historicalRecords: 22, academicPapers: 24, literaryWorks: 22 },
    heritageLength: 75,
    heritageLengthDetail: { forgingYear: '公元前510年', lastKnownYear: '公元前473年', yearsInCirculation: 37, holderCount: 5 },
    relatedFiguresCount: 30,
    relatedFiguresDetail: { famousHolders: 5, relatedSwordsmen: 15, historicalFigures: 10 },
    lastUpdated: '2024-06-15T00:00:00Z',
  },
  {
    swordId: 'ls-12',
    swordName: '九歌剑',
    swordAlias: '楚辞之剑',
    swordImageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=ancient%20chinese%20poetic%20sword%20jiuge%2C%20chu%20culture%20decorations%2C%20singing%20and%20chanting%20aura%2C%20miluo%20river%2C%20qu%20yuan%20poet%20sword%2C%20ink%20wash%20painting&image_size=portrait_4_3',
    dynasty: '战国',
    historicalInfluence: 75,
    historicalInfluenceDetail: { majorEvents: 4, historicalSignificance: 36, dynastyInfluence: 35 },
    citationCount: 78,
    citationCountDetail: { historicalRecords: 18, academicPapers: 30, literaryWorks: 30 },
    heritageLength: 68,
    heritageLengthDetail: { forgingYear: '公元前310年', lastKnownYear: '公元前278年', yearsInCirculation: 32, holderCount: 4 },
    relatedFiguresCount: 25,
    relatedFiguresDetail: { famousHolders: 3, relatedSwordsmen: 12, historicalFigures: 10 },
    lastUpdated: '2024-06-15T00:00:00Z',
  },
  {
    swordId: 'ls-3',
    swordName: '腾空剑',
    swordAlias: '飞天之剑',
    swordImageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=flying%20chinese%20mythical%20sword%20tengkong%2C%20crystal%20transparent%20blade%2C%20floating%20in%20sky%2C%20divine%20light%2C%20clouds%20and%20mist%2C%20ink%20wash%20style&image_size=portrait_4_3',
    dynasty: '上古',
    historicalInfluence: 80,
    historicalInfluenceDetail: { majorEvents: 5, historicalSignificance: 38, dynastyInfluence: 37 },
    citationCount: 65,
    citationCountDetail: { historicalRecords: 15, academicPapers: 25, literaryWorks: 25 },
    heritageLength: 78,
    heritageLengthDetail: { forgingYear: '公元前2697年', lastKnownYear: '公元前2070年', yearsInCirculation: 627, holderCount: 5 },
    relatedFiguresCount: 28,
    relatedFiguresDetail: { famousHolders: 4, relatedSwordsmen: 14, historicalFigures: 10 },
    lastUpdated: '2024-06-15T00:00:00Z',
  },
  {
    swordId: 'ls-7',
    swordName: '长虹剑',
    swordAlias: '贯日之剑',
    swordImageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=ancient%20chinese%20rainbow%20sword%20changhong%2C%20white%20rainbow%20piercing%20sun%2C%20dramatic%20sky%2C%20assassin%20blade%2C%20warring%20states%20period%2C%20ink%20wash%20painting&image_size=portrait_4_3',
    dynasty: '战国',
    historicalInfluence: 72,
    historicalInfluenceDetail: { majorEvents: 4, historicalSignificance: 35, dynastyInfluence: 33 },
    citationCount: 60,
    citationCountDetail: { historicalRecords: 18, academicPapers: 20, literaryWorks: 22 },
    heritageLength: 70,
    heritageLengthDetail: { forgingYear: '公元前240年', lastKnownYear: '公元前210年', yearsInCirculation: 30, holderCount: 4 },
    relatedFiguresCount: 32,
    relatedFiguresDetail: { famousHolders: 5, relatedSwordsmen: 18, historicalFigures: 9 },
    lastUpdated: '2024-06-15T00:00:00Z',
  },
  {
    swordId: 'ls-6',
    swordName: '照胆剑',
    swordAlias: '照心之剑',
    swordImageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=ancient%20chinese%20mirror%20sword%20zhaodan%2C%20reflective%20mirror%20like%20blade%2C%20golden%20glow%2C%20truth%20revealing%2C%20xia%20dynasty%2C%20ink%20wash%20painting&image_size=portrait_4_3',
    dynasty: '夏',
    historicalInfluence: 70,
    historicalInfluenceDetail: { majorEvents: 3, historicalSignificance: 35, dynastyInfluence: 32 },
    citationCount: 58,
    citationCountDetail: { historicalRecords: 20, academicPapers: 18, literaryWorks: 20 },
    heritageLength: 72,
    heritageLengthDetail: { forgingYear: '公元前2070年', lastKnownYear: '公元前1600年', yearsInCirculation: 470, holderCount: 6 },
    relatedFiguresCount: 24,
    relatedFiguresDetail: { famousHolders: 4, relatedSwordsmen: 10, historicalFigures: 10 },
    lastUpdated: '2024-06-15T00:00:00Z',
  },
  {
    swordId: 'ls-10',
    swordName: '断水剑',
    swordAlias: '截流之剑',
    swordImageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=ancient%20chinese%20water%20cutting%20sword%20duanshui%2C%20extremely%20sharp%20blade%2C%20splitting%20waterfall%2C%20water%20spray%2C%20spring%20and%20autumn%20period%2C%20ink%20wash%20painting&image_size=portrait_4_3',
    dynasty: '春秋',
    historicalInfluence: 68,
    historicalInfluenceDetail: { majorEvents: 2, historicalSignificance: 34, dynastyInfluence: 32 },
    citationCount: 56,
    citationCountDetail: { historicalRecords: 18, academicPapers: 18, literaryWorks: 20 },
    heritageLength: 70,
    heritageLengthDetail: { forgingYear: '公元前520年', lastKnownYear: '公元前473年', yearsInCirculation: 47, holderCount: 5 },
    relatedFiguresCount: 22,
    relatedFiguresDetail: { famousHolders: 3, relatedSwordsmen: 10, historicalFigures: 9 },
    lastUpdated: '2024-06-15T00:00:00Z',
  },
  {
    swordId: 'ls-8',
    swordName: '淑士剑',
    swordAlias: '文人之剑',
    swordImageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=elegant%20scholar%20chinese%20sword%20shushi%2C%20refined%20and%20graceful%2C%20ancient%20inscriptions%2C%20literary%20aura%2C%20zhou%20dynasty%2C%20ink%20wash%20painting&image_size=portrait_4_3',
    dynasty: '周',
    historicalInfluence: 65,
    historicalInfluenceDetail: { majorEvents: 3, historicalSignificance: 32, dynastyInfluence: 30 },
    citationCount: 52,
    citationCountDetail: { historicalRecords: 16, academicPapers: 18, literaryWorks: 18 },
    heritageLength: 68,
    heritageLengthDetail: { forgingYear: '公元前1100年', lastKnownYear: '公元前771年', yearsInCirculation: 329, holderCount: 6 },
    relatedFiguresCount: 20,
    relatedFiguresDetail: { famousHolders: 3, relatedSwordsmen: 8, historicalFigures: 9 },
    lastUpdated: '2024-06-15T00:00:00Z',
  },
  {
    swordId: 'ls-9',
    swordName: '掩日剑',
    swordAlias: '噬日之剑',
    swordImageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=dark%20ominous%20chinese%20sword%20yanri%2C%20eclipse%20sun%20swallowing%20blade%2C%20dark%20clouds%2C%20chiyou%20demon%20king%20weapon%2C%20eerie%20red%20glow%2C%20ink%20wash%20painting&image_size=portrait_4_3',
    dynasty: '上古',
    historicalInfluence: 68,
    historicalInfluenceDetail: { majorEvents: 3, historicalSignificance: 35, dynastyInfluence: 30 },
    citationCount: 48,
    citationCountDetail: { historicalRecords: 10, academicPapers: 18, literaryWorks: 20 },
    heritageLength: 65,
    heritageLengthDetail: { forgingYear: '公元前2697年', lastKnownYear: '公元前2600年', yearsInCirculation: 97, holderCount: 3 },
    relatedFiguresCount: 22,
    relatedFiguresDetail: { famousHolders: 3, relatedSwordsmen: 10, historicalFigures: 9 },
    lastUpdated: '2024-06-15T00:00:00Z',
  },
  {
    swordId: 'ls-2',
    swordName: '画影剑',
    swordAlias: '无形之剑',
    swordImageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=mysterious%20invisible%20chinese%20sword%20only%20shadow%20visible%2C%20ethereal%20blade%2C%20sunset%20light%2C%20mountain%20silhouette%2C%20ink%20wash%20painting%2C%20ghostly%20atmosphere&image_size=portrait_4_3',
    dynasty: '上古',
    historicalInfluence: 62,
    historicalInfluenceDetail: { majorEvents: 2, historicalSignificance: 32, dynastyInfluence: 28 },
    citationCount: 45,
    citationCountDetail: { historicalRecords: 8, academicPapers: 18, literaryWorks: 19 },
    heritageLength: 60,
    heritageLengthDetail: { forgingYear: '公元前2697年', lastKnownYear: '公元前2600年', yearsInCirculation: 97, holderCount: 3 },
    relatedFiguresCount: 20,
    relatedFiguresDetail: { famousHolders: 3, relatedSwordsmen: 8, historicalFigures: 9 },
    lastUpdated: '2024-06-15T00:00:00Z',
  },
  {
    swordId: 'ls-5',
    swordName: '定光剑',
    swordAlias: '佛光之剑',
    swordImageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=buddhist%20divine%20sword%20dingguang%2C%20golden%20buddha%20light%2C%20sanskrit%20inscriptions%2C%20serene%20and%20holy%2C%20bodhi%20leaves%2C%20ink%20wash%20painting&image_size=portrait_4_3',
    dynasty: '上古',
    historicalInfluence: 58,
    historicalInfluenceDetail: { majorEvents: 3, historicalSignificance: 28, dynastyInfluence: 27 },
    citationCount: 42,
    citationCountDetail: { historicalRecords: 10, academicPapers: 15, literaryWorks: 17 },
    heritageLength: 55,
    heritageLengthDetail: { forgingYear: '公元前500年', lastKnownYear: '公元650年', yearsInCirculation: 1150, holderCount: 5 },
    relatedFiguresCount: 18,
    relatedFiguresDetail: { famousHolders: 3, relatedSwordsmen: 7, historicalFigures: 8 },
    lastUpdated: '2024-06-15T00:00:00Z',
  },
];

const swordsWithScores = rawSwordData.map(sword => ({
  ...sword,
  comprehensiveScore: calculateComprehensiveScore({
    historicalInfluence: sword.historicalInfluence,
    citationCount: sword.citationCount,
    heritageLength: sword.heritageLength,
    relatedFiguresCount: sword.relatedFiguresCount,
  }),
}));

const sortedSwords = [...swordsWithScores].sort((a, b) => b.comprehensiveScore - a.comprehensiveScore);

const previousRankMap: Record<string, number> = {
  'ls-15': 2, 'ls-16': 1, 'ls-13': 3, 'ls-4': 5, 'ls-14': 4,
  'ls-17': 6, 'ls-1': 8, 'ls-11': 7, 'ls-12': 10, 'ls-3': 9,
  'ls-7': 11, 'ls-6': 13, 'ls-10': 12, 'ls-8': 15, 'ls-9': 14,
  'ls-2': 16, 'ls-5': 17,
};

export const swordRankings: SwordRankingMetrics[] = sortedSwords.map((sword, index) => {
  const currentRank = index + 1;
  const previousRank = previousRankMap[sword.swordId] || currentRank;
  const rankChange = previousRank - currentRank;
  const trend = rankChange > 0 ? 'up' : rankChange < 0 ? 'down' : 'stable';
  return {
    ...sword,
    rank: currentRank,
    previousRank,
    rankChange,
    trend,
  };
});

const DYNASTY_ORDER = ['上古', '夏', '周', '春秋', '战国', '汉'];

function computeDynastyStats(): RankingTrendData[] {
  const dynastyMap: Record<string, {
    scores: number[];
    historical: number[];
    citation: number[];
    heritage: number[];
    related: number[];
  }> = {};

  swordRankings.forEach(sword => {
    if (!dynastyMap[sword.dynasty]) {
      dynastyMap[sword.dynasty] = {
        scores: [], historical: [], citation: [], heritage: [], related: [],
      };
    }
    dynastyMap[sword.dynasty].scores.push(sword.comprehensiveScore);
    dynastyMap[sword.dynasty].historical.push(sword.historicalInfluence);
    dynastyMap[sword.dynasty].citation.push(sword.citationCount);
    dynastyMap[sword.dynasty].heritage.push(sword.heritageLength);
    dynastyMap[sword.dynasty].related.push(sword.relatedFiguresCount);
  });

  const avg = (arr: number[]) => Number((arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(2));

  return DYNASTY_ORDER
    .filter(dynasty => dynastyMap[dynasty])
    .map(dynasty => {
      const data = dynastyMap[dynasty];
      return {
        year: dynasty,
        dynasty,
        avgComprehensiveScore: avg(data.scores),
        avgHistoricalInfluence: avg(data.historical),
        avgCitationCount: avg(data.citation),
        avgHeritageLength: avg(data.heritage),
        avgRelatedFigures: avg(data.related),
        swordCount: data.scores.length,
      };
    });
}

export const rankingTrendData: RankingTrendData[] = computeDynastyStats();

export function getSwordRankingCalculationDetail(swordId: string) {
  const sword = swordRankings.find(s => s.swordId === swordId);
  if (!sword) return null;

  const weights = {
    historicalInfluence: 0.35,
    citationCount: 0.30,
    heritageLength: 0.20,
    relatedFigures: 0.15,
  };

  const normalizedHistorical = normalizeScore(sword.historicalInfluence, 0, 100);
  const normalizedCitation = normalizeScore(sword.citationCount, 0, 150);
  const normalizedHeritage = normalizeScore(sword.heritageLength, 0, 100);
  const normalizedRelated = normalizeScore(sword.relatedFiguresCount, 0, 60);

  const dimensions = [
    {
      dimension: 'historicalInfluence' as const,
      score: sword.historicalInfluence,
      normalizedScore: Number(normalizedHistorical.toFixed(2)),
      weight: weights.historicalInfluence,
      weightedScore: Number((normalizedHistorical * weights.historicalInfluence).toFixed(4)),
      description: `基于重大历史事件(${sword.historicalInfluenceDetail.majorEvents}件)、历史意义(${sword.historicalInfluenceDetail.historicalSignificance}分)和朝代影响(${sword.historicalInfluenceDetail.dynastyInfluence}分)综合评估`,
    },
    {
      dimension: 'citationCount' as const,
      score: sword.citationCount,
      normalizedScore: Number(normalizedCitation.toFixed(2)),
      weight: weights.citationCount,
      weightedScore: Number((normalizedCitation * weights.citationCount).toFixed(4)),
      description: `基于正史记载(${sword.citationCountDetail.historicalRecords}条)、学术论文(${sword.citationCountDetail.academicPapers}篇)和文学作品(${sword.citationCountDetail.literaryWorks}部)引用次数统计`,
    },
    {
      dimension: 'heritageLength' as const,
      score: sword.heritageLength,
      normalizedScore: Number(normalizedHeritage.toFixed(2)),
      weight: weights.heritageLength,
      weightedScore: Number((normalizedHeritage * weights.heritageLength).toFixed(4)),
      description: `基于铸造年代(${sword.heritageLengthDetail.forgingYear})、最后记载(${sword.heritageLengthDetail.lastKnownYear})、流传时间(${sword.heritageLengthDetail.yearsInCirculation}年)和持有者数量(${sword.heritageLengthDetail.holderCount}人)综合评估`,
    },
    {
      dimension: 'relatedFigures' as const,
      score: sword.relatedFiguresCount,
      normalizedScore: Number(normalizedRelated.toFixed(2)),
      weight: weights.relatedFigures,
      weightedScore: Number((normalizedRelated * weights.relatedFigures).toFixed(4)),
      description: `基于著名持有者(${sword.relatedFiguresDetail.famousHolders}人)、关联剑客(${sword.relatedFiguresDetail.relatedSwordsmen}人)和历史人物(${sword.relatedFiguresDetail.historicalFigures}人)数量统计`,
    },
  ];

  const totalWeightedScore = dimensions.reduce((sum, d) => sum + d.weightedScore, 0);
  const finalScore = Number(totalWeightedScore.toFixed(2));

  return {
    swordId: sword.swordId,
    swordName: sword.swordName,
    dimensions,
    totalWeightedScore: Number(totalWeightedScore.toFixed(4)),
    finalScore,
    calculationFormula: '综合评分 = (历史影响力 × 35%) + (文献引用 × 30%) + (传承长度 × 20%) + (关联人物 × 15%)',
    dataSources: [
      '《史记》《汉书》等正史记载',
      '《越绝书》《吴越春秋》等古文献',
      '中国冶金史、兵器史学术研究',
      '中国神话传说词典等民俗研究',
      '考古出土文物及鉴定报告',
    ],
  };
}
