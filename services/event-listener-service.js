import c from '../constants/constants.js';
import events from '../constants/events.js';

const eventListenerService = services => {
  const { eventEmitter, socket, bot, priceSubscriptionService } = services;

  socket.startListeners();
  bot.startListenMessages();

  eventEmitter.on(events.SEND_TO_WEBSOCKET, message => socket.send(message));

  eventEmitter.on(events.WEBSOCKET_OPENED, () =>
    bot.sendToAll(c.WEBSOCKET_OPENED_INFO)
  );

  eventEmitter.on(events.WEBSOCKET_CLOSED, () =>
    bot.sendToAll(c.WEBSOCKET_CLOSED_INFO)
  );
};

export default eventListenerService;
