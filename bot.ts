import dotenv from 'dotenv';
import { CallbackQuery } from 'node-telegram-bot-api';
import { Telegraf } from 'telegraf';
import { ChatState } from './src/interface';
import { chain, Chain } from './src/commands/index';
import mongoose from './src/libs/mongoose';

import { 
    receivedMessageAlert,
    receivedMessageContract 

} from './src/components/messages/index';
import { 
    displayButtonClickContractAndCollection,
    displayInlineKeyboardSelectButton,
    displayInlineKeyboardSelectNetwork,     
} from './src/components/buttons/index';
import { supabase } from './src/libs/supabaseClient';
import { Json } from './src/types/supabase';

dotenv.config();

if(!process.env.TELEGRAM_BOT_TOKEN) {
    console.log('Error: Telegram bot token is not provided.');
    process.exit(1);
}

export const chatStates: Record<number, ChatState> = {};

// Create a bot that uses 'polling' to fetch new updates
const TOKEN: string = process.env.TELEGRAM_BOT_TOKEN || '';
const bot = new Telegraf(TOKEN);

// Default chain is ethereum
export let selectedChain: Chain = 'ethereum';

let deletedMessageId: number = 0;


// Console log all messages
// bot.use(Telegraf.log());

bot.telegram.setMyCommands([
    {command: 'start', description: 'Start the bot'},
    {command: 'help', description: 'Help'},
]);


bot.start(async (ctx, next) => {
    displayInlineKeyboardSelectButton(ctx); 
    
    
});

bot.action("network", (ctx, next) => {
    deletedMessageId = (ctx.callbackQuery as CallbackQuery).message?.message_id || 0;

    ctx.deleteMessage(deletedMessageId).then(() => {
        displayInlineKeyboardSelectNetwork(ctx);
    }).catch((err) => {
        console.error("Error deleting message:", err);
    });

    return;
});

bot.on("callback_query", async (ctx) => {
    const data = (ctx.callbackQuery as CallbackQuery).data;
    const chatId = ctx.callbackQuery.message?.chat.id;
    const isChain = chain.includes(data as Chain);

    console.log(data);

    if(!chatId) return

    selectedChain = isChain ? data as Chain : selectedChain;

    if(isChain) {
        displayButtonClickContractAndCollection(ctx, selectedChain);
    }

    switch(data) {
        case 'contract':
            ctx.reply('Write the contract address');
            chatStates[chatId] = { waitingForAddress: true };
            break;
        case 'alert':
            ctx.reply('Set floor price alert');
            chatStates[chatId] = { waitingForAlert: true };
            break;
        case 'backSelectionChain':
            displayInlineKeyboardSelectNetwork(ctx);
            break;
        case 'alert':
            ctx.reply('Your alert has been set');
            break;
        default:
            break;
    }
    return;
    
});

bot.on("message", async (ctx) => {
    const state = chatStates[ctx.message.chat.id];

    if(state?.waitingForAddress) {
        receivedMessageContract(ctx, state, selectedChain);
    }

    if(state?.waitingForAlert) {
        receivedMessageAlert(ctx, state, selectedChain);
    }
});


bot.launch().then(() => {
    console.log("Bot launched");
});
  
process.on("SIGTERM", () => {
    bot.stop();
});

