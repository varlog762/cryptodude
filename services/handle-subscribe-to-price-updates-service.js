// import eventEmitter from '../utils/event-emitter.js';
import { createMessageForWebSocket } from '../utils/utils.js';
import { sendToWebSocket } from './handle-websocket-events-service.js';
import c from '../constants/constants.js';

let tickersWatchList = [];

export const getWatchList = () => tickersWatchList.slice();

// TODO: Rename it
const createObject = (chatId, tickerName, startPrice, endPrice) => ({
  tickerName,
  currencyPair: `${tickerName}-USDT`,
  startPrice,
  endPrice,
  chatId,
});

export const subscribeToPriceUpdates = (
  chatId,
  tickerName,
  startPrice,
  endPrice
) => {
  try {
    const ticker = createObject(chatId, tickerName, startPrice, endPrice);
    tickersWatchList.push(ticker);
    console.dir(tickersWatchList);

    const message = createMessageForWebSocket(
      tickerName,
      c.SUBSCRIBE_TO_TICKER_PRICE_UPDATE
    );
    sendToWebSocket(message);
  } catch (error) {
    console.log(error);
  }
};

export const unsubscribeFromPriceUpdates = (chatId, tickerName) => {
  const message = createMessageForWebSocket(
    tickerName,
    c.UNSUBSCRIBE_FROM_TICKER_PRICE_UPDATE
  );
  sendToWebSocket(message);

  tickersWatchList = tickersWatchList.filter(
    t => t.chatId === chatId && t.tickerName !== tickerName
  );
};
