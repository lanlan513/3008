import { Request, Response } from 'express';
import { mapService } from '../services/mapService';
import type { MapFilterParams } from '../../../shared/types';

function parseFilterParams(req: Request): MapFilterParams {
  const query = req.query;
  const types: MapFilterParams['types'] = [];
  const dynasties: MapFilterParams['dynasties'] = [];
  const regions: MapFilterParams['regions'] = [];

  if (typeof query.types === 'string' && query.types.length > 0) {
    types.push(...query.types.split(',').map((t) => t.trim() as MapFilterParams['types'][number]));
  }
  if (typeof query.dynasties === 'string' && query.dynasties.length > 0) {
    dynasties.push(...query.dynasties.split(',').map((d) => d.trim()));
  }
  if (typeof query.regions === 'string' && query.regions.length > 0) {
    regions.push(...query.regions.split(',').map((r) => r.trim()));
  }

  const minImportance = query.minImportance ? Number(query.minImportance) : undefined;

  return { types, dynasties, regions, minImportance };
}

export const mapController = {
  getAllLocations: (_req: Request, res: Response) => {
    try {
      const locations = mapService.getAllLocations();
      res.json({ code: 200, message: 'success', data: locations });
    } catch (error) {
      console.error('Error getting locations:', error);
      res.status(500).json({ code: 500, message: 'Internal server error', data: null });
    }
  },

  getFilteredLocations: (req: Request, res: Response) => {
    try {
      const params = parseFilterParams(req);
      const locations = mapService.getFilteredLocations(params);
      res.json({ code: 200, message: 'success', data: locations });
    } catch (error) {
      console.error('Error filtering locations:', error);
      res.status(500).json({ code: 500, message: 'Internal server error', data: null });
    }
  },

  getLocationById: (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const location = mapService.getLocationById(id);
      if (!location) {
        res.status(404).json({ code: 404, message: 'Location not found', data: null });
        return;
      }
      res.json({ code: 200, message: 'success', data: location });
    } catch (error) {
      console.error('Error getting location:', error);
      res.status(500).json({ code: 500, message: 'Internal server error', data: null });
    }
  },

  getLocationDetails: (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const details = mapService.getLocationDetails(id);
      if (!details) {
        res.status(404).json({ code: 404, message: 'Location not found', data: null });
        return;
      }
      res.json({ code: 200, message: 'success', data: details });
    } catch (error) {
      console.error('Error getting location details:', error);
      res.status(500).json({ code: 500, message: 'Internal server error', data: null });
    }
  },

  getAllHistoricalEvents: (_req: Request, res: Response) => {
    try {
      const events = mapService.getAllHistoricalEvents();
      res.json({ code: 200, message: 'success', data: events });
    } catch (error) {
      console.error('Error getting historical events:', error);
      res.status(500).json({ code: 500, message: 'Internal server error', data: null });
    }
  },

  getHistoricalEventById: (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const event = mapService.getHistoricalEventById(id);
      if (!event) {
        res.status(404).json({ code: 404, message: 'Event not found', data: null });
        return;
      }
      res.json({ code: 200, message: 'success', data: event });
    } catch (error) {
      console.error('Error getting historical event:', error);
      res.status(500).json({ code: 500, message: 'Internal server error', data: null });
    }
  },

  getRegionStats: (_req: Request, res: Response) => {
    try {
      const stats = mapService.getRegionStats();
      res.json({ code: 200, message: 'success', data: stats });
    } catch (error) {
      console.error('Error getting region stats:', error);
      res.status(500).json({ code: 500, message: 'Internal server error', data: null });
    }
  },

  getDynastyGeoStats: (_req: Request, res: Response) => {
    try {
      const stats = mapService.getDynastyGeoStats();
      res.json({ code: 200, message: 'success', data: stats });
    } catch (error) {
      console.error('Error getting dynasty geo stats:', error);
      res.status(500).json({ code: 500, message: 'Internal server error', data: null });
    }
  },

  getAllRegions: (_req: Request, res: Response) => {
    try {
      const regions = mapService.getAllRegions();
      res.json({ code: 200, message: 'success', data: regions });
    } catch (error) {
      console.error('Error getting regions:', error);
      res.status(500).json({ code: 500, message: 'Internal server error', data: null });
    }
  },
};
