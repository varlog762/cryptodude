import 'dotenv/config';
import { EventEmitter } from 'node:events';

import WebSocketService from './services/websocket-service.js';
import TelegramBotService from './services/telegram-bot-service.js';
import PriceSubscriptionService from './services/price-subscription-service.js';
import loadAvailableTickers from './services/load-available-tickers-service.js';
import c from './constants/constants.js';

const { TELEGRAM_TOKEN } = process.env;

const startApp = async () => {
  const availableTickers = await loadAvailableTickers();

  const eventEmitter = new EventEmitter();

  const socket = new WebSocketService(c.OKX_WS_URL, eventEmitter);
  socket.connect();

  const bot = new TelegramBotService(TELEGRAM_TOKEN, eventEmitter);
  bot.start();

  const priceSubscriptionService = new PriceSubscriptionService(
    eventEmitter,
    availableTickers
  );

  const services = { eventEmitter, socket, bot, priceSubscriptionService };
};

startApp();

// TODO: implement user notification via telegram when OKX approves subscription

// TODO: implement sending messages
// eventEmitter.on('send-to-websocket', message => {
//   socket.send(message);
// });

// TODO: implement this:
// eventEmitter.on('websocket-closed', () => {
//   telegramChatsList.forEach(chatId =>
//     bot.sendMessage(chatId, 'Connection to WebSocket closed!')
//   );
// });
