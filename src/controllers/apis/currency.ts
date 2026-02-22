import { HTTP_REQUEST_METHOD } from '../../enums/httpRequest';
import httpRequest from './httpRequest';

const BASE_URL = 'https://www.instarem.com/api/v1/public';

export const fetchAllCurrency = async (source_currency: string) => {
  try {
    const response = await httpRequest(
      BASE_URL,
      '/currency/pair',
      {
        source_currency,
      },
      HTTP_REQUEST_METHOD.GET
    );

    if (response.success) {
      return response.data;
    }

    return {
      [source_currency]: [],
    };
  } catch (err) {
    console.error('Error fetching all currency:', err);
    throw err;
  }
};

export const fetchLiveExchangeRate = async (source_currency: string, destination_currency: string) => {
  try {
    const response = await httpRequest(
      BASE_URL,
      '/daily-rates',
      {
        source_currency,
        destination_currency,
      },
      HTTP_REQUEST_METHOD.GET
    );

    if (response.success) {
      // Commented this piece of code as API is giving empty response
      // return response.data;
      return {
        current_rate: {
          rate: Math.random() * 150,
        },
      };
    }

    return {
      current_rate: {
        rate: 0,
      },
    };
  } catch (err) {
    console.error('Error fetching live exchange rate:', err);
    throw err;
  }
};
