import c from '../constants/constants.js';
import events from '../constants/events.js';

const eventListenerService = services => {
  const { eventEmitter, socket, bot, priceSubscriptionService } = services;

  socket.startListeners();
  bot.startListenMessages();

  eventEmitter.on(events.SEND_TO_WEBSOCKET, message => {
    socket.send(message);
  });

  eventEmitter.on(events.WEBSOCKET_OPENED, () =>
    bot.sendToAll(c.WEBSOCKET_OPENED_INFO)
  );

  eventEmitter.on(events.WEBSOCKET_CLOSED, () =>
    bot.sendToAll(c.WEBSOCKET_CLOSED_INFO)
  );

  eventEmitter.on(events.WEBSOCKET_RECONNECT, () =>
    bot.sendToAll(c.WEBSOCKET_RECONNECT_INFO)
  );

  eventEmitter.on(events.UNAVAILABLE_TICKER, chatId =>
    bot.sendMessage(chatId, c.UNAVAILABLE_TICKER_WARNING)
  );

  eventEmitter.on(events.SUBSCRIBE_SUCCESS, tickerName => {
    priceSubscriptionService.emitSubscribeComplete(tickerName);
  });

  eventEmitter.on(events.ADD_TICKER, ticker =>
    priceSubscriptionService.subscribe(ticker)
  );

  eventEmitter.on(events.ADD_TICKER_SUCCESS, ({ chatId, tickerName }) =>
    bot.sendMessage(chatId, `Subscription to ${tickerName} completed!`)
  );

  eventEmitter.on(events.REMOVE_TICKER, ticker =>
    priceSubscriptionService.unsubscribe(ticker)
  );
};

export default eventListenerService;
