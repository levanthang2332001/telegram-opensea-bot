import TelegramBot, { Message, InlineKeyboardButton, InlineKeyboardMarkup } from 'node-telegram-bot-api';
import { evmValidation } from './src/validation/evm';
import { GetCollectionFromAddress } from './src/api/opensea';
import { ChatState } from './src/interface';
import { myCommands, opts } from './botCommands';
import dotenv from 'dotenv';

dotenv.config();

if(!process.env.TELEGRAM_BOT_TOKEN) {
    console.log('Error: Telegram bot token is not provided.');
    process.exit(1);
}

const chatStates: Record<number, ChatState> = {};

// Create a bot that uses 'polling' to fetch new updates
const TOKEN: string = process.env.TELEGRAM_BOT_TOKEN || '';
const bot = new TelegramBot(TOKEN, {polling: true});


const setChatStateAndSendMessage = (chatId: number, message: string, state: ChatState) => {
    chatStates[chatId] = state;
    bot.sendMessage(chatId, message);
};

bot.onText(/\/start/, (msg: Message) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Welcome! Choose an option:', opts);
});


bot.on('message', async (msg: Message) => {
    const chatId = msg.chat.id;

    const state = chatStates[chatId];
    const message: string = msg.text || '';

    if(state?.waitingForAddress) {
        if(!evmValidation(message)) {
            bot.sendMessage(chatId, 'Invalid address. Please enter a valid address:');
            return;
        }
        const data = await GetCollectionFromAddress(message, 'ethereum');
        console.log(data)

        setChatStateAndSendMessage(chatId, `Your address is: ${data}`, {waitingForAddress: false});

    } else if(state?.waitingForCollection) {
        setChatStateAndSendMessage(chatId, `Your collection is: ${message}`, {waitingForCollection: false});
    }
}); 

bot.on('callback_query', (query) => {
    const message = query.message;
    const data = query.data;

    if(data === '/address' && message) {
        const chatId = message.chat.id;
        setChatStateAndSendMessage(chatId, '📍Enter your address:', {waitingForAddress: true})
    };  

    if(data === '/collection' && message) {
        const chatId = message.chat.id;
        setChatStateAndSendMessage(chatId, '📕Enter your collection:', {waitingForCollection: true})
    }
});

bot.setMyCommands(myCommands);