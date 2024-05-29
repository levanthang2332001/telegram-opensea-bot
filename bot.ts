import TelegramBot, { Message } from 'node-telegram-bot-api';
import { isEvmValidation } from './src/validation/evm';
import { GetCollectionFromAddress, GetBestListingsByCollection } from './src/api/opensea';
import { ChatState } from './src/interface';
import { myCommands, opts, optsChain, chain, Chain } from './botCommands';
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

let messageToDelete: number | undefined;

// Default chain: Ethereum
let chains: Chain = '/ethereum';

const setChatStateAndSendMessage = (chatId: number, message: string, state: ChatState, chain: Chain) => {

    chatStates[chatId] = state;
    bot.sendMessage(chatId, message);
};

const getDataCollection = async (chatId: number, nft: string, state: ChatState, chain: Chain) => {
    chatStates[chatId] = state;
    try {
        const bestListings = await GetBestListingsByCollection(nft);
        console.log(bestListings)
        bot.sendMessage(chatId, `Collection: ${bestListings.listings[0].price.current.value}`);
    } catch (error) {
        bot.sendMessage(chatId, `Error: ${error}`);
    }
};

const convertToEth = (price: number) => {
    return price / Math.pow(10, 18);
}

const getDataAddress = async (chatId: number, address: string, state: ChatState , chain: Chain) => {
    chatStates[chatId] = state;

    try {
        const nft = await GetCollectionFromAddress(address, chain);

        if (!nft.collection) {
            bot.sendMessage(chatId, `No collection found for this address: ${address}`, opts);
            return;
        }
        
        const collection = await GetBestListingsByCollection(nft.collection);
        if (!collection.listings || collection.listings.length === 0) {
            bot.sendMessage(chatId, `No listings found for this collection: ${nft.collection}`, opts);
            return;
        }
        
        const price = convertToEth(Number(collection.listings[0].price.current.value)) + collection.listings[0].price.current.currency;
        bot.sendMessage(chatId, `Floor now : ${price}`, optsChain);

    } catch (error) {
        console.error(`Error getting data for address ${address}:`, error);
        bot.sendMessage(chatId, `Error: ${error}`);
    }
};


bot.onText(/\/start/, async (msg: Message) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Welcome! Choose an option:', optsChain);
    
});

bot.on('message', (msg: Message) => {
    const chatId = msg.chat.id;
    const state = chatStates[chatId];
    const message: string = msg.text || '';

    if(state?.waitingForAddress && message) {
        if(!isEvmValidation(message)) {
            bot.sendMessage(chatId, 'Invalid address. Please enter a valid address:');
        } else {
            getDataAddress(chatId, message, {waitingForAddress: false}, chains);
        }
    } else if(state?.waitingForCollection && message) {
        getDataCollection(chatId, message, {waitingForCollection: false}, chains);
    }

});

bot.on('callback_query', (query) => {
    const { message, data } = query;

    const isChains = chain.includes(data as string);

    if(message && message.chat.id) {
        const chatId = message.chat.id;

        if(isChains) {  
            chains = data as Chain;
            messageToDelete = message.message_id;
            bot.sendMessage(chatId, `You clicked on ${chains} Chain. Now choose an option:`, opts)
        }
        
        switch (data) {
            case '/address':
                messageToDelete = message.message_id;
                setChatStateAndSendMessage(chatId, '📍Enter your address:', {waitingForAddress: true}, chains);
                break;
            case '/collection':
                messageToDelete = message.message_id;
                setChatStateAndSendMessage(chatId, '📕Enter your collection:', {waitingForCollection: true}, chains);
                break;
        }
    }

    if(messageToDelete) {
        bot.deleteMessage(message?.chat.id || 0, messageToDelete);
    }

});

bot.setMyCommands(myCommands);