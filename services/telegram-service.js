import 'dotenv/config';
import TelegramBot from 'node-telegram-bot-api';

const { TELEGRAM_TOKEN } = process.env;

export default new TelegramBot(TELEGRAM_TOKEN, { polling: true });
