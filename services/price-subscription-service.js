import {
  createMessageForWebSocket,
  createTickerWatchEntry,
} from '../utils/utils.js';

import c from '../constants/constants.js';
import events from '../constants/events.js';

class PriceSubscriptionService {
  tickerWatchList = [];

  constructor(eventEmitter, availableTickers) {
    this.eventEmitter = eventEmitter;
    this.availableTickers = availableTickers;
  }

  subscribe(chatId, tickerName, originalPrice) {
    if (!this.isTickerAvailable(tickerName)) {
      this.eventEmitter.emit(events.UNAVAILABLE_TICKER);
    }

    const ticker = createTickerWatchEntry(chatId, tickerName, originalPrice);
    this.tickerWatchList.push(ticker);

    if (this.isSubscribed(tickerName)) {
      return;
    }

    const message = createMessageForWebSocket(
      tickerName,
      c.SUBSCRIBE_TO_TICKER_PRICE_UPDATE
    );
    this.eventEmitter.emit(events.SEND_TO_WEBSOCKET, message);
  }

  unsubscribe(chatId, tickerName, originalPrice) {
    this.tickerWatchList = this.tickerWatchList.filter(
      t =>
        t.chatId !== chatId &&
        t.tickerName !== tickerName &&
        t.originalPrice !== originalPrice
    );

    if (this.isSubscribed(tickerName)) {
      this.eventEmitter.emit(events.REMOVE_TICKER_SUCCESS, tickerName);
      return;
    }

    const message = createMessageForWebSocket(
      tickerName,
      c.UNSUBSCRIBE_FROM_TICKER_PRICE_UPDATE
    );
    this.eventEmitter.emit(events.SEND_TO_WEBSOCKET, message);

    this.eventEmitter.emit(events.REMOVE_TICKER_SUCCESS, tickerName);
  }

  isTickerAvailable(tickerName) {
    return this.availableTickers.some(ticker =>
      ticker.fullName.includes(tickerName)
    );
  }

  isSubscribed(tickerName) {
    return this.tickerWatchList.some(t => t.tickerName === tickerName);
  }
}

export default PriceSubscriptionService;

// tickerName,
// currencyPair: `${tickerName}-USDT`,
// originalPrice,
// lastPrice: 0,
// priceIncreasePercent: 5,
// priceDecreasePercent: 5,
// chatId,
