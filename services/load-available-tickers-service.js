import axios from 'axios';

import C from '../constants/constants.js';

// eslint-disable-next-line consistent-return
export default async () => {
  try {
    const response = await axios.get(C.LOAD_TICKERS_URL);

    if (response.status !== 200) {
      throw new Error('Tickers loading failed!');
    }

    const data = response.data.Data;

    if (data) {
      return Object.values(data).map(ticker => ({
        symbol: ticker?.Symbol,
        fullName: ticker?.FullName,
      }));
    }

    throw new Error('Bad response');
  } catch (error) {
    console.log(error);
  }
};
