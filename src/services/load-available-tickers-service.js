import axios from 'axios';

import c from '../constants/constants.js';

export default async () => {
  try {
    const response = await axios.get(c.LOAD_TICKERS_URL);

    if (response.status !== 200) {
      throw new Error(c.LOAD_TICKERS_ERROR);
    }

    const data = response?.data?.Data;

    if (!data) {
      throw new Error(c.BAD_RESPONSE_WARNING);
    }
    const tickerList = Object.values(data).map(ticker => ({
      symbol: ticker?.Symbol,
      fullName: ticker?.FullName,
    }));

    return tickerList;
  } catch (error) {
    console.error(error);
  }

  return [];
};
