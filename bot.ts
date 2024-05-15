import TelegramBot, { Message, InlineKeyboardButton, InlineKeyboardMarkup } from 'node-telegram-bot-api';
import dotenv from 'dotenv';
dotenv.config();

if(!process.env.TELEGRAM_BOT_TOKEN) {
    console.log('Error: Telegram bot token is not provided.');
    process.exit(1);
}

const TOKEN: string = process.env.TELEGRAM_BOT_TOKEN || '';
const bot = new TelegramBot(TOKEN, {polling: true});

interface ChatState {
    waitingForAddress?: boolean;
    waitingForCollection?: boolean;
}

const chatStates: Record<number, ChatState> = {};

const myCommands = [
    {command: '/start', description: 'Start the bot'},
    {command: '/help', description: 'Get help'}
]

const InlineKeyboardButtons: InlineKeyboardButton[][] = [
    [{text: 'Address', callback_data: '/address'}, {text: 'Collection ', callback_data: '/collection'}],
];

const opts = {
    reply_markup: {
        inline_keyboard: InlineKeyboardButtons
    }
};

bot.onText(/\/start/, (msg: Message) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Welcome! Choose an option:', opts);
});

bot.onText(/\/address/, (msg: Message) => {
    const chatId = msg.chat.id;
    chatStates[chatId] = {waitingForAddress: true};
    bot.sendMessage(chatId, 'Enter your address:');
});

bot.onText(/\/collection/, (msg: Message) => {
    const chatId = msg.chat.id;
    chatStates[chatId] = {...chatStates[chatId] ,waitingForCollection: true};
    bot.sendMessage(chatId, 'Enter your collection');
});

bot.on('message', (msg: Message) => {
    const chatId = msg.chat.id;

    if(chatStates[chatId]?.waitingForAddress) {
        const address = msg.text;
        chatStates[chatId] = {waitingForAddress: false};
        bot.sendMessage(chatId, `Your address is: ${address}`);
    } else if(chatStates[chatId]?.waitingForCollection) {
        const collection = msg.text;
        chatStates[chatId] = {waitingForCollection: false};
        bot.sendMessage(chatId, `Your collection is: ${collection}`);
    
    }
}); 

bot.on('callback_query', (query) => {
    const message = query.message;
    const data = query.data;

    console.log(data)

    if(data === '/address' && message) {
        bot.sendMessage(message.chat.id, `You clicked on ${data}`);
    };

});


bot.setMyCommands(myCommands);