import { swordHeritages, getSwordHeritageBySwordId } from '../data/swordHeritages.js';
import { swords } from '../data/swords.js';
import type { SwordHeritage, SwordsmanSwordTenure, SwordHolder } from '../../../shared/types.js';

export const getSwordHeritage = (swordId: string): SwordHeritage | undefined => {
  return getSwordHeritageBySwordId(swordId);
};

export const getAllSwordHeritages = (): SwordHeritage[] => {
  return swordHeritages;
};

export const getSwordsmanSwordTenures = (swordsmanId: string): SwordsmanSwordTenure[] => {
  const tenures: SwordsmanSwordTenure[] = [];

  for (const heritage of swordHeritages) {
    for (const holder of heritage.holders) {
      if (holder.swordsmanId === swordsmanId) {
        const sword = swords.find(s => s.id === heritage.swordId);
        if (sword) {
          tenures.push({
            swordId: sword.id,
            swordName: sword.name,
            swordAlias: sword.alias,
            swordImageUrl: sword.imageUrl,
            startYear: holder.startYear,
            endYear: holder.endYear,
            acquisitionMethod: holder.acquisitionMethod,
            lossMethod: holder.lossMethod,
            description: holder.description,
          });
        }
      }
    }
  }

  return tenures.sort((a, b) => a.startYear.localeCompare(b.startYear));
};

export const getSwordsmanHeritages = (swordsmanId: string): SwordHeritage[] => {
  const result: SwordHeritage[] = [];

  for (const heritage of swordHeritages) {
    const hasHolder = heritage.holders.some(h => h.swordsmanId === swordsmanId);
    if (hasHolder) {
      result.push(heritage);
    }
  }

  return result;
};
