import { Request, Response } from 'express';
import { searchAttractions } from '../services/attractionService';
import { searchRestaurants } from '../services/restaurantService';
import { AttractionSearchParams, RestaurantSearchParams } from '../types/activity';

export const activityController = {

//    GET /api/activities/attractions/search

  async searchAttractions(req: Request, res: Response) {
    try {
      const { location, query, type, hl, gl } = req.query;

      // Walidacja wymaganego parametru
      if (!location || typeof location !== 'string') {
        return res.status(400).json({ 
          error: 'Missing or invalid parameter: location' 
        });
      }

      const params: AttractionSearchParams = {
        location: location as string,
        query: query as string | undefined,
        type: type as 'tourist_attraction' | 'museum' | 'landmark' | 'park' | undefined,
        hl: (hl as string) || 'pl',
        gl: (gl as string) || 'pl'
      };

      const results = await searchAttractions(params);

      res.json({
        data: results,
        meta: {
          count: results.length,
          params: params
        }
      });

    } catch (error) {
      console.error('Error in searchAttractions controller:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      // obsługa specyficznych błędów
      if (errorMessage.includes('API Key')) {
        return res.status(500).json({ 
          error: 'Service configuration error',
          message: 'SerpApi is not properly configured'
        });
      }
      
      if (errorMessage.includes('status: 429')) {
        return res.status(429).json({ 
          error: 'Rate limit exceeded',
          message: 'Too many requests to SerpApi. Please try again later.'
        });
      }

      res.status(500).json({ 
        error: 'Internal Server Error',
        message: errorMessage
      });
    }
  },

//  GET /api/activities/restaurants/search

  async searchRestaurants(req: Request, res: Response) {
    try {
      const { location, query, type, hl, gl } = req.query;

      // Walidacja wymaganego parametru
      if (!location || typeof location !== 'string') {
        return res.status(400).json({ 
          error: 'Missing or invalid parameter: location' 
        });
      }

      const params: RestaurantSearchParams = {
        location: location as string,
        query: query as string | undefined,
        type: type as 'restaurant' | 'cafe' | 'bar' | 'food' | undefined,
        hl: (hl as string) || 'pl',
        gl: (gl as string) || 'pl'
      };

      const results = await searchRestaurants(params);

      res.json({
        data: results,
        meta: {
          count: results.length,
          params: params
        }
      });

    } catch (error) {
      console.error('Error in searchRestaurants controller:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      if (errorMessage.includes('API Key')) {
        return res.status(500).json({ 
          error: 'Service configuration error',
          message: 'SerpApi is not properly configured'
        });
      }
      
      if (errorMessage.includes('status: 429')) {
        return res.status(429).json({ 
          error: 'Rate limit exceeded',
          message: 'Too many requests to SerpApi. Please try again later.'
        });
      }

      res.status(500).json({ 
        error: 'Internal Server Error',
        message: errorMessage
      });
    }
  }
};

