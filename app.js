import './services/handle-subscribe-to-price-updates-service.js';
import './services/handle-websocket-events-service.js';
import handleTelegramEvents from './services/handle-telegram-events-service.js';

const startApp = async () => {
  handleTelegramEvents();
};

startApp();
