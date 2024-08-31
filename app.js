import 'dotenv/config';
import TelegramBot from 'node-telegram-bot-api';

import C from './constants/constants.js';
import { getAvailableTickers } from './services/load-tickers-data-from-api.js';
import { stringifyCommandMessages, checkTicker } from './utils/utils.js';
import CommandMessages from './constants/command-messages.js';

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
let watchedTickers = [];

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
        bot.sendMessage(chatId, watchedTickers.join(', '));
        break;
      case C.ADD:
        if (!ticker) {
          bot.sendMessage(chatId, 'Enter ticker name!');
          break;
        }

        if (!checkTicker(ticker, availableTickers)) {
          bot.sendMessage(chatId, 'Unknown ticker! Try again.');
          break;
        }

        if (watchedTickers.includes(ticker)) {
          bot.sendMessage(chatId, 'Ticker alraedy added!');
          break;
        }

        watchedTickers.push(ticker);
        bot.sendMessage(chatId, `Ticker ${ticker} added successfully!`);
        break;
      case C.REMOVE:
        if (!ticker) {
          bot.sendMessage(chatId, 'Enter ticker name!');
          break;
        }
        watchedTickers = watchedTickers.filter(t => t !== ticker);
        bot.sendMessage(chatId, `Ticker ${ticker} removed successfully!`);
        break;
      default:
        bot.sendMessage(chatId, 'helpMessage');
        break;
    }
  });
};

const startApp = async () => {
  const availableTickers = await getAvailableTickers();
  const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });
  addTelegramEventsListener(bot, availableTickers);
};

startApp();
