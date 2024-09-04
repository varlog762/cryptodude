import 'dotenv/config';
import { EventEmitter } from 'node:events';
import TelegramBot from 'node-telegram-bot-api';

import C from './constants/constants.js';
import GetAvailableTickers from './services/load-tickers-data-from-api.js';
import { stringifyCommandMessages, isTickerAvailable } from './utils/utils.js';
import CommandMessages from './constants/command-messages.js';
import { subscribeToTickerUpdates } from './services/create-websocket-connection.js';

const { TELEGRAM_TOKEN } = process.env;

const emitter = new EventEmitter();

const addTelegramEventsListener = (bot, availableTickers) => {
  bot.on('message', msg => {
    const chatId = msg.chat.id;
    const splitedMessageText = msg.text.split(' ');
    const command = splitedMessageText.at(0);
    const ticker = splitedMessageText[1]
      ? splitedMessageText[1].toUpperCase()
      : '';

    const helpMessage = stringifyCommandMessages(CommandMessages);

    switch (command) {
      case C.START:
        bot.sendMessage(chatId, helpMessage);
        break;
      case C.HELP:
        bot.sendMessage(chatId, helpMessage);
        break;
      case C.LIST:
        // if (!watchedTickers.length) {
        //   bot.sendMessage(chatId, "There aren't added tickers!");
        //   break;
        // }
        // bot.sendMessage(chatId, watchedTickers.join(', '));
        break;
      case C.ADD:
        if (!ticker) {
          bot.sendMessage(chatId, 'Enter ticker name!');
          break;
        }

        if (!isTickerAvailable(ticker, availableTickers)) {
          bot.sendMessage(chatId, 'Unknown ticker! Try again.');
          break;
        }

        // if (watchedTickers.includes(ticker)) {
        //   bot.sendMessage(chatId, 'Ticker alraedy added!');
        //   break;
        // }

        subscribeToTickerUpdates(ticker);
        bot.sendMessage(chatId, `Ticker ${ticker} added successfully!`);
        break;
      case C.REMOVE:
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

const startApp = async () => {
  const availableTickers = await GetAvailableTickers();
  const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });
  addTelegramEventsListener(bot, availableTickers);

  emitter.on('hello', () => bot.sendMessage('Hello!'));
};

startApp();
