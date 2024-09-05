import bot from './telegram-service.js';
import c from '../constants/constants.js';
import commandMessages from '../constants/command-messages.js';
import {
  subscribeToPriceUpdates,
  unsubscribeFromPriceUpdates,
} from './handle-subscribe-to-price-updates-service.js';
import getAvailableTickers from './load-available-tickers-service.js';
import { stringifyCommandMessages, isTickerAvailable } from '../utils/utils.js';
import { showWatchedCurrencyPairs } from '../utils/telegram-events-handlers.js';

const availableTickers = await getAvailableTickers();

export default () => {
  bot.on('message', msg => {
    const chatId = msg.chat.id;
    const splittedMessageText = msg.text.split(' ');
    const command = splittedMessageText.at(0);
    const tickerName = splittedMessageText[1]
      ? splittedMessageText[1].toUpperCase()
      : '';
    const startPrice = splittedMessageText[2]
      ? parseFloat(splittedMessageText[2].replace(',', '.'))
      : null;
    const endPrice = splittedMessageText[3]
      ? parseFloat(splittedMessageText[3].replace(',', '.'))
      : null;

    const helpMessage = stringifyCommandMessages(commandMessages);

    if (command === c.START || command === c.HELP) {
      bot.sendMessage(chatId, helpMessage);
      return;
    }

    if (command === c.LIST) {
      bot.sendMessage(chatId, showWatchedCurrencyPairs(chatId));
      return;
    }

    if (command === c.ADD) {
      if (!tickerName) {
        bot.sendMessage(chatId, 'Enter ticker name!');
        return;
      }

      if (!isTickerAvailable(tickerName, availableTickers)) {
        bot.sendMessage(chatId, 'Unknown ticker! Try again.');
        return;
      }

      if (
        !startPrice ||
        !endPrice ||
        typeof startPrice !== 'number' ||
        typeof endPrice !== 'number'
      ) {
        bot.sendMessage(chatId, 'Incorrect prices! Try again.');
        return;
      }

      subscribeToPriceUpdates(chatId, tickerName, startPrice, endPrice);
      bot.sendMessage(chatId, `Ticker ${tickerName} added successfully!`);
      return;
    }

    if (command === c.REMOVE) {
      if (!tickerName) {
        bot.sendMessage(chatId, 'Enter ticker name!');
        return;
      }
      unsubscribeFromPriceUpdates(chatId, tickerName);
      bot.sendMessage(chatId, `Ticker ${tickerName} removed successfully!`);
      return;
    }

    bot.sendMessage(chatId, helpMessage);
  });
};
