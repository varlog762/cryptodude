import { getWatchList } from '../services/handle-subscribe-to-price-updates-service.js';

// eslint-disable-next-line import/prefer-default-export
export const showWatchedCurrencyPairs = chatId => {
  const currencyPairsList = getWatchList();

  return currencyPairsList
    .filter(t => t.chatId === chatId)
    .map(t => `${t.currencyPair} - Prices range ${t.startPrice}-${t.endPrice}`)
    .join('\n');
};
