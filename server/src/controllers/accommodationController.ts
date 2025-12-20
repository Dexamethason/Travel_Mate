import { Request, Response } from 'express';
import { searchAccommodations } from '../services/accommodationService';
import { AccommodationSearchParams } from '../types/accommodation';

export const getAccommodations = async (req: Request, res: Response) => {
  try {
    const { location, checkIn, checkOut, adults, children, currency } = req.query;

    if (!location || typeof location !== 'string') {
      return res.status(400).json({ error: 'Missing or invalid parameter: location' });
    }

    if (!checkIn || typeof checkIn !== 'string') {
      return res.status(400).json({ error: 'Missing or invalid parameter: checkIn (YYYY-MM-DD)' });
    }

    if (!checkOut || typeof checkOut !== 'string') {
      return res.status(400).json({ error: 'Missing or invalid parameter: checkOut (YYYY-MM-DD)' });
    }

    const searchParams: AccommodationSearchParams = {
      location: location as string,
      checkInDate: checkIn as string,
      checkOutDate: checkOut as string,
      adults: adults ? parseInt(adults as string, 10) : 1,
      children: children ? parseInt(children as string, 10) : 0,
      currency: (currency as string) || 'USD' // TODO: Sprawdzić czy wspiera PLN
    };

    const checkInDate = new Date(searchParams.checkInDate);
    const checkOutDate = new Date(searchParams.checkOutDate);

    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
      return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD' });
    }

    if (checkInDate >= checkOutDate) {
      return res.status(400).json({ error: 'Check-in date must be before check-out date' });
    }

    // Wywołanie serwisu
    const results = await searchAccommodations(searchParams);

    res.json({
      data: results,
      meta: {
        count: results.length,
        params: searchParams
      }
    });

  } catch (error) {
    console.error('Error in getAccommodations controller:', error);
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
};

