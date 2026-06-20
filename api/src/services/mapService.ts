import type { MapLocation, HistoricalEvent, RegionStats, DynastyGeoStats, MapFilterParams } from '../../../shared/types';
import { mapLocations } from '../data/mapLocations';
import { historicalEvents } from '../data/historicalEvents';
import { sects } from '../data/sects';
import { swords } from '../data/swords';
import { swordsmen } from '../data/swordsmen';

function filterLocations(params: MapFilterParams): MapLocation[] {
  return mapLocations.filter((loc) => {
    if (params.types.length > 0 && !params.types.includes('all') && !params.types.includes(loc.type)) {
      return false;
    }
    if (params.dynasties.length > 0 && loc.dynasty && !params.dynasties.includes(loc.dynasty)) {
      return false;
    }
    if (params.regions.length > 0 && !params.regions.includes(loc.region)) {
      return false;
    }
    if (params.minImportance !== undefined && loc.importance < params.minImportance) {
      return false;
    }
    return true;
  });
}

export const mapService = {
  getAllLocations: (): MapLocation[] => {
    return mapLocations;
  },

  getFilteredLocations: (params: MapFilterParams): MapLocation[] => {
    return filterLocations(params);
  },

  getLocationById: (id: string): MapLocation | undefined => {
    return mapLocations.find((loc) => loc.id === id);
  },

  getLocationsByType: (type: MapLocation['type']): MapLocation[] => {
    return mapLocations.filter((loc) => loc.type === type);
  },

  getLocationsByRegion: (region: string): MapLocation[] => {
    return mapLocations.filter((loc) => loc.region === region);
  },

  getAllHistoricalEvents: (): HistoricalEvent[] => {
    return historicalEvents;
  },

  getHistoricalEventById: (id: string): HistoricalEvent | undefined => {
    return historicalEvents.find((evt) => evt.id === id);
  },

  getEventsByLocationId: (locationId: string): HistoricalEvent[] => {
    return historicalEvents.filter((evt) => evt.locationId === locationId);
  },

  getEventsByDynasty: (dynasty: string): HistoricalEvent[] => {
    return historicalEvents.filter((evt) => evt.dynasty === dynasty);
  },

  getEventsBySignificance: (significance: HistoricalEvent['significance']): HistoricalEvent[] => {
    return historicalEvents.filter((evt) => evt.significance === significance);
  },

  getRegionStats: (): RegionStats[] => {
    const regionMap = new Map<string, RegionStats>();

    const initRegion = (region: string): RegionStats => ({
      region,
      sectCount: 0,
      swordCount: 0,
      eventCount: 0,
      swordsmanCount: 0,
      totalScore: 0,
    });

    mapLocations.forEach((loc) => {
      if (!regionMap.has(loc.region)) {
        regionMap.set(loc.region, initRegion(loc.region));
      }
      const stats = regionMap.get(loc.region)!;
      if (loc.type === 'sect') stats.sectCount++;
      if (loc.type === 'sword_forge') stats.swordCount += loc.relatedSwordIds?.length || 0;
      if (loc.type === 'event' || loc.type === 'battlefield') stats.eventCount += loc.relatedEventIds?.length || 0;
      stats.swordsmanCount += loc.relatedSwordsmanIds?.length || 0;
      stats.totalScore += loc.importance;
      regionMap.set(loc.region, stats);
    });

    return Array.from(regionMap.values()).sort((a, b) => b.totalScore - a.totalScore);
  },

  getDynastyGeoStats: (): DynastyGeoStats[] => {
    const allDynasties = ['上古', '夏商', '西周', '春秋', '战国', '秦', '汉', '三国', '晋', '南北朝', '隋', '唐', '宋', '元', '明', '清'];
    const dynastyMap = new Map<string, DynastyGeoStats>();

    allDynasties.forEach((d) => {
      dynastyMap.set(d, {
        dynasty: d,
        regions: {},
        eventCount: 0,
        swordCount: 0,
        swordsmanCount: 0,
      });
    });

    historicalEvents.forEach((evt) => {
      if (dynastyMap.has(evt.dynasty)) {
        const stats = dynastyMap.get(evt.dynasty)!;
        stats.eventCount++;
        const loc = mapLocations.find((l) => l.id === evt.locationId);
        if (loc) {
          stats.regions[loc.region] = (stats.regions[loc.region] || 0) + 1;
        }
        stats.swordCount += evt.relatedSwordIds.length;
        stats.swordsmanCount += evt.relatedSwordsmanIds.length;
      }
    });

    return Array.from(dynastyMap.values()).filter((s) => s.eventCount > 0 || s.swordCount > 0);
  },

  getAllRegions: (): string[] => {
    return Array.from(new Set(mapLocations.map((loc) => loc.region))).sort();
  },

  getLocationDetails: (locationId: string) => {
    const location = mapService.getLocationById(locationId);
    if (!location) return null;

    const relatedSects = sects.filter((s) => location.relatedSectIds?.includes(s.id));
    const relatedSwords = swords.filter((s) => location.relatedSwordIds?.includes(s.id));
    const relatedSwordsmen = swordsmen.filter((s) => location.relatedSwordsmanIds?.includes(s.id));
    const relatedEvents = historicalEvents.filter((e) =>
      location.relatedEventIds?.includes(e.id) || e.locationId === locationId
    );

    return {
      location,
      relatedSects,
      relatedSwords,
      relatedSwordsmen,
      relatedEvents,
    };
  },
};
