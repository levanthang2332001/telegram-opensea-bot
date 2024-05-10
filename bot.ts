import TelegramBot, { Message } from 'node-telegram-bot-api';
import dotenv from 'dotenv';
dotenv.config();

if(!process.env.TELEGRAM_BOT_TOKEN) {
    console.log('Error: Telegram bot token is not provided.');
    process.exit(1);
}

const TOKEN: string = process.env.TELEGRAM_BOT_TOKEN || '';

const bot = new TelegramBot(TOKEN, {polling: true});

bot.on('text', (msg: Message) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Xin chào');
});

bot.on('photo', (msg: Message) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'You sent a photo.');
});

bot.onText(/\/start/, (msg: Message) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'You started the bot.');
});