import 'dotenv/config';
import TelegramBot from 'node-telegram-bot-api';

import C from './constants/constants.js';
import { getAvailableTickers } from './services/loadTickersDataFromApi.js';

const startApp = async () => {
  const tickers = await getAvailableTickers();
  console.log(tickers[100]);

  const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;

  const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });

  const commands = {
    [C.LIST]: 'Show all watched coins',
    [C.HELP]: 'Show avilable commands',
    [C.ADD]: 'Add new coin subscription ("/add NEW_COIN_NAME")',
    [C.REMOVE]: 'Remove coin subscription ("/remove COIN_NAME")',
  };

  let helpMessage = Object.entries(commands)
    .map(item => `${item[0]} - ${item[1]}`)
    .join('\n');

  bot.on('message', msg => {
    const chatId = msg.chat.id;
    const messageText = msg.text;

    switch (messageText) {
      case C.START:
        bot.sendMessage(chatId, helpMessage);
        break;
      case C.HELP:
        bot.sendMessage(chatId, helpMessage);
        break;
      case C.LIST:
        bot.sendMessage(chatId, '/list');
        break;
      case C.ADD:
        bot.sendMessage(chatId, '/add');
        break;
      case C.REMOVE:
        bot.sendMessage(chatId, '/remove');
        break;
      default:
        bot.sendMessage(chatId, helpMessage);
        break;
    }
  });
};

startApp();
