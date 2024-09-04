import eventEmitter from '../utils/event-emitter.js';
import { createMessageForWebSocket } from '../utils/utils.js';

// const watchedCurrencyPairs = [];

// eslint-disable-next-line import/prefer-default-export
export const handleSubscribeToPriceUpdate = ticker => {
  try {
    const message = createMessageForWebSocket(ticker);
    eventEmitter.emit('subscribe', message);
  } catch (error) {
    console.log(error);
  }
};
