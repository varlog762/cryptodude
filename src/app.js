import 'dotenv/config';
import { EventEmitter } from 'node:events';

import c from './constants/constants.js';
import WebSocketService from './services/websocket-service.js';
import TelegramBotService from './services/telegram-bot-service.js';
import PriceSubscriptionService from './services/price-subscription-service.js';
import loadAvailableTickers from './services/load-available-tickers-service.js';
import eventListenerService from './services/event-listener-service.js';

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

  eventListenerService(services);
};

startApp();

