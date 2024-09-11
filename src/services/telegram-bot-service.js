import TelegramBot from 'node-telegram-bot-api';

import c from '../constants/constants.js';
import events from '../constants/events.js';
import commandMessages from '../constants/command-messages.js';
import { stringifyCommandMessages, createEmitPayload } from '../utils/utils.js';

class TelegramBotService {
  bot = null;

  chatsList = new Set();

  helpMessage = stringifyCommandMessages(commandMessages);

  constructor(token, eventEmitter) {
    this.token = token;
    this.eventEmitter = eventEmitter;
  }

  start() {
    this.bot = new TelegramBot(this.token, { polling: true });
  }

  startListenMessages() {
    this.bot.on('message', msg => {
      const chatId = msg.chat.id;
      this.chatsList.add(chatId);

      const splittedMessageText = msg.text.split(' ');
      const command = splittedMessageText[0];

      const tickerName = splittedMessageText[1]
        ? splittedMessageText[1].toUpperCase()
        : '';

      const originalPrice = splittedMessageText[2]
        ? parseFloat(splittedMessageText[2].replace(',', '.'))
        : null;

      this.commandHandler(chatId, command, tickerName, originalPrice);
    });
  }

  commandHandler(chatId, command, tickerName, originalPrice) {
    if (command === c.START || command === c.HELP) {
      this.bot.sendMessage(chatId, this.helpMessage);
      return;
    }

    if (command === c.LIST) {
      this.eventEmitter.emit(events.SHOW_SUBSCRIPTIONS, chatId);
      return;
    }

    if (command === c.ADD || command === c.REMOVE) {
      if (!this.validateTickerData(chatId, tickerName, originalPrice)) return;

      const ticker = createEmitPayload(chatId, tickerName, originalPrice);

      const event =
        command === c.ADD
          ? events.ADD_SUBSCRIPTION
          : events.REMOVE_SUBSCRIPTION;

      this.eventEmitter.emit(event, ticker);

      return;
    }

    this.bot.sendMessage(chatId, this.helpMessage);
  }

  validateTickerData(chatId, tickerName, originalPrice) {
    return (
      this.isTickerName(chatId, tickerName) &&
      this.isOriginalPrice(chatId, originalPrice)
    );
  }

  isTickerName(chatId, tickerName) {
    if (!tickerName) {
      this.bot.sendMessage(chatId, c.ENTER_TICKER_NAME_WARNING);
      return false;
    }
    return true;
  }

  isOriginalPrice(chatId, originalPrice) {
    if (!originalPrice || !Number.isFinite(originalPrice)) {
      this.bot.sendMessage(chatId, c.INVALID_PRICE_WARNING);
      return false;
    }
    return true;
  }

  sendToAll(message) {
    this.chatsList.forEach(chatId => this.bot.sendMessage(chatId, message));
  }

  sendMessage(chatId, message) {
    this.bot.sendMessage(chatId, message);
  }
}

export default TelegramBotService;
