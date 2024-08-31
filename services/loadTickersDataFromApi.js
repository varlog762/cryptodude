import C from '../constants/constants.js';

export const getAvailableTickers = tickerName => {
  const response = fetch(C.LOAD_TICKERS_URL);

  response.then(data => data.json());
};
