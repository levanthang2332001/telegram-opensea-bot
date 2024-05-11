import TelegramBot, { Message, InlineKeyboardButton, InlineKeyboardMarkup } from 'node-telegram-bot-api';
import dotenv from 'dotenv';
dotenv.config();

if(!process.env.TELEGRAM_BOT_TOKEN) {
    console.log('Error: Telegram bot token is not provided.');
    process.exit(1);
}

const TOKEN: string = process.env.TELEGRAM_BOT_TOKEN || '';

const bot = new TelegramBot(TOKEN, {polling: true});

const myCommands = [
    {command: '/start', description: 'Start the bot'},
    {command: '/help', description: 'Get help'}
]

bot.on('text', (msg: Message) => {
    const chatId = msg.chat.id;
    const welcomeMessage = 'Welcome! Choose an option:';

    const InlineKeyboardButtons: InlineKeyboardButton[][] = [
        [{text: 'Google', url: 'https://www.google.com', callback_data: 'google'}],
        [{text: 'Bing', url: 'https://www.bing.com'}]
    ];

    const opts = {
        reply_markup: {
            inline_keyboard: InlineKeyboardButtons
        }
    };
    
    bot.sendMessage(chatId,welcomeMessage, opts);
});



// bot.onText(/\/start/, (msg: Message) => {
//     const chatId = msg.chat.id;
//     bot.sendMessage(chatId, 'You started the bot.');
// });


bot.setMyCommands(myCommands);