import { swordsmen } from '../data/swordsmen.js';
import { swordsmenDetail } from '../data/swordsmenDetail.js';
import { swords } from '../data/swords.js';
import type { Swordsman, SwordsmanDetail, Sword } from '../../../shared/types.js';

export const getSwordsmen = (limit?: number): Swordsman[] => {
  let result = [...swordsmen].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  
  if (limit) {
    result = result.slice(0, limit);
  }
  
  return result;
};

export const getLatestSwordsmen = (limit: number = 4): Swordsman[] => {
  return getSwordsmen(limit);
};

export const getSwordsmanById = (id: string): Swordsman | undefined => {
  return swordsmen.find(s => s.id === id);
};

export const getSwordsmanDetailById = (id: string): SwordsmanDetail | undefined => {
  return swordsmenDetail.find(s => s.id === id);
};

export const getSwordsmanSwords = (swordsmanId: string): Sword[] => {
  const swordsman = swordsmenDetail.find(s => s.id === swordsmanId);
  if (!swordsman) return [];
  return swords.filter(s => swordsman.swords.includes(s.id));
};

export const getSwordsByOwnerName = (ownerName: string): Sword[] => {
  return swords.filter(s => s.owner === ownerName);
};

export const getSwordsmenBySwordId = (swordId: string): Swordsman[] => {
  return swordsmen.filter(s => s.swords.includes(swordId));
};

export const searchSwordsmen = (keyword: string): Swordsman[] => {
  if (!keyword) return [];
  const lowerKeyword = keyword.toLowerCase();
  return swordsmen.filter(s => 
    s.name.toLowerCase().includes(lowerKeyword) ||
    s.title.toLowerCase().includes(lowerKeyword) ||
    s.sect.toLowerCase().includes(lowerKeyword) ||
    s.dynasty.toLowerCase().includes(lowerKeyword) ||
    s.biography.toLowerCase().includes(lowerKeyword)
  );
};
