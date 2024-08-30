import 'dotenv/config';
import TelegramBot from 'node-telegram-bot-api';

import C from './constants/constants.js';

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;

const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });

const commands = {
  [C.LIST]: 'Show all watched coins',
  [C.ADD]: 'Add new coin subscription ("/add NEW_COIN_NAME")',
  [C.REMOVE]: 'Remove coin subscription ("/remove COIN_NAME")',
};

bot.on('message', msg => {
  const chatId = msg.chat.id;
  const messageText = msg.text;

  switch (messageText) {
    case C.START:
      bot.sendMessage(chatId, 'Ща продам твою крипту, парень!');
      break;
    case C.LIST:
      bot.sendMessage(chatId, 'Ща продам твою крипту, парень!');
      break;

    default:
      const message = Object.entries(commands);
      break;
  }
});
