import { Request, Response } from 'express';
import { flightService } from '../services/flightService';
import { FlightSearchParams } from '../types/flight';

export const flightController = {
  async search(req: Request, res: Response) {
    try {
      const { from, to, date, returnDate, passengers } = req.query;

      // walidacja podstawowa
      if (!from || !to || !date) {
        return res.status(400).json({ 
          error: 'Missing required parameters: from, to, date' 
        });
      }

      const params: FlightSearchParams = {
        from: from as string,
        to: to as string,
        date: date as string,
        passengers: passengers ? parseInt(passengers as string) : 1
      };

      if (returnDate) {
        params.returnDate = returnDate as string;
      }

      const flights = await flightService.searchFlights(params);
      
      // Opóźnienie, żeby zobaczyć loading state na froncie
      // await new Promise(resolve => setTimeout(resolve, 500));

      res.json(flights);
    } catch (error: any) {
      console.error('Flight Search Controller Error:', error);
      res.status(500).json({ 
        error: 'Failed to search flights',
        details: error.message 
      });
    }
  },
};
