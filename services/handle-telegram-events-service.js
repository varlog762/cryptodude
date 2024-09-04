import bot from './telegram-service.js';
import eventEmitter from '../utils/event-emitter.js';
import c from '../constants/constants.js';
import CommandMessages from '../constants/command-messages.js';
import { handleSubscribeToPriceUpdate } from './handle-subscribe-to-price-updates-service.js';
import getAvailableTickers from './load-available-tickers-service.js';
import { stringifyCommandMessages, isTickerAvailable } from '../utils/utils.js';

const availableTickers = await getAvailableTickers();

let chatId;

export default () => {
  bot.on('message', msg => {
    chatId = msg.chat.id;
    const splittedMessageText = msg.text.split(' ');
    const command = splittedMessageText.at(0);
    const ticker = splittedMessageText[1]
      ? splittedMessageText[1].toUpperCase()
      : '';

    const helpMessage = stringifyCommandMessages(CommandMessages);

    switch (command) {
      case c.START:
        bot.sendMessage(chatId, helpMessage);
        break;
      case c.HELP:
        bot.sendMessage(chatId, helpMessage);
        break;
      case c.LIST:
        // if (!watchedTickers.length) {
        //   bot.sendMessage(chatId, "There aren't added tickers!");
        //   break;
        // }
        // bot.sendMessage(chatId, watchedTickers.join(', '));
        break;
      case c.ADD:
        if (!ticker) {
          bot.sendMessage(chatId, 'Enter ticker name!');
          break;
        }

        if (!isTickerAvailable(ticker, availableTickers)) {
          bot.sendMessage(chatId, 'Unknown ticker! Try again.');
          break;
        }

        handleSubscribeToPriceUpdate(ticker);
        bot.sendMessage(chatId, `Ticker ${ticker} added successfully!`);
        break;
      case c.REMOVE:
        if (!ticker) {
          bot.sendMessage(chatId, 'Enter ticker name!');
          break;
        }
        // watchedTickers = watchedTickers.filter(t => t !== ticker);
        bot.sendMessage(chatId, `Ticker ${ticker} removed successfully!`);
        break;
      default:
        bot.sendMessage(chatId, 'helpMessage');
        break;
    }
  });
};

eventEmitter.on('subscribe', payload => {
  bot.sendMessage(chatId, payload);
});
