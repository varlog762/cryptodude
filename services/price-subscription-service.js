import {
  createMessageForWebSocket,
  createTickerWatchEntry,
} from '../utils/utils.js';

import c from '../constants/constants.js';
import events from '../constants/events.js';

class PriceSubscriptionService {
  tickerWatchList = [];

  subscriptionsRegistry = new Map();

  constructor(eventEmitter, availableTickers) {
    this.eventEmitter = eventEmitter;
    this.availableTickers = availableTickers;
  }

  subscribe(tickerProp) {
    const { chatId, tickerName, originalPrice } = tickerProp;

    if (!this.isTickerAvailable(tickerName)) {
      this.eventEmitter.emit(events.UNAVAILABLE_TICKER, chatId);
      return;
    }

    const ticker = createTickerWatchEntry(chatId, tickerName, originalPrice);

    if (this.isSubscribed(tickerName)) {
      this.tickerWatchList.push(ticker);
      console.log(this.tickerWatchList);

      const payload = {
        chatId,
        tickerName,
      };
      this.eventEmitter.emit(events.ADD_SUBSCRIPTION_SUCCESS, payload);

      return;
    }

    this.tickerWatchList.push(ticker);
    console.log(this.tickerWatchList);
    this.subscriptionsRegistry.set(tickerName, chatId);

    const message = createMessageForWebSocket(
      tickerName,
      c.SUBSCRIBE_TO_TICKER_PRICE_UPDATE
    );

    this.eventEmitter.emit(events.SEND_TO_WEBSOCKET, message);
  }

  unsubscribe(tickerProp) {
    const { chatId, tickerName, originalPrice } = tickerProp;

    this.tickerWatchList = this.tickerWatchList.filter(
      t =>
        t.chatId !== chatId ||
        t.tickerName !== tickerName ||
        t.originalPrice !== originalPrice
    );
    console.log(this.tickerWatchList);

    const payload = {
      chatId,
      tickerName,
    };

    this.eventEmitter.emit(events.REMOVE_SUBSCRIPTION_SUCCESS, payload);

    if (this.isSubscribed(tickerName)) {
      return;
    }

    const message = createMessageForWebSocket(
      tickerName,
      c.UNSUBSCRIBE_FROM_TICKER_PRICE_UPDATE
    );
    this.eventEmitter.emit(events.SEND_TO_WEBSOCKET, message);
  }

  isTickerAvailable(tickerName) {
    return this.availableTickers.some(ticker =>
      ticker.fullName.includes(tickerName)
    );
  }

  isSubscribed(tickerName) {
    console.log(this.tickerWatchList.some(t => t.tickerName === tickerName));
    return this.tickerWatchList.some(t => t.tickerName === tickerName);
  }

  notifySubscriptionSuccess(tickerName) {
    const chatId = this.subscriptionsRegistry.get(tickerName);
    this.subscriptionsRegistry.delete(tickerName);

    const payload = {
      chatId,
      tickerName,
    };

    this.eventEmitter.emit(events.ADD_SUBSCRIPTION_SUCCESS, payload);
  }

  showSubscriptions(chatId) {
    const message = this.tickerWatchList
      .filter(t => t.chatId === chatId)
      .map(
        t =>
          `${t.currencyPair}: original price ${t.originalPrice}, last price ${t.lastPrice}`
      )
      .join('\n');

    const payload = {
      chatId,
      message,
    };

    this.eventEmitter.emit(events.SHOW_SUBSCRIPTIONS_SUCCESS, payload);
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
