import dotenv from 'dotenv';
import { CallbackQuery } from 'node-telegram-bot-api';
import { Telegraf } from 'telegraf';
import { ChatState, User } from './src/interface';
import { chain, Chain } from './src/commands/index';

import { 
    receivedMessageAlert,
    receivedMessageContract 

} from './src/components/messages/index';
import { 
    displayButtonClickContractAndCollection,
    displayInlineKeyboardSelectButton,
    displayInlineKeyboard,     
} from './src/components/buttons/index';
import { addUser } from './src/database/addUser';
import { supabase } from './src/libs/supabaseClient';
import { collectionNames, groupedNotifications, myNotification } from './src/components/notification';
import { messageOfNetwork, messageOfNotification, networks } from './src/types/message';

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

bot.start(async (ctx) => {
    displayInlineKeyboardSelectButton(ctx);

    myNotification(ctx, ctx.message.from.id);

    const { username, id, first_name } = ctx.message.from;

    if (!username || !id || !first_name) return;

    // Add the user to the database
    await addUser({
        user_id: Number(id),
        username,
        name: first_name
    });
});

bot.action("network", (ctx, next) => {
    deletedMessageId = (ctx.callbackQuery as CallbackQuery).message?.message_id || 0;

    ctx.deleteMessage(deletedMessageId).then(() => {
        displayInlineKeyboard(ctx, messageOfNetwork, networks);
    }).catch((err) => {
        console.error("Error deleting message:", err);
    });

    return;
});

bot.action("notification", async (ctx) => {
    const id = ctx.from?.id;
    if (!id) {
        console.error("User ID not found in notification action");
        return;
    }

    try {
        const notifications = await myNotification(ctx, id);
        if (!notifications || notifications.length === 0) {
            return; 
        }

        const collectionNames = notifications.map(item => [item.collection_name]);
        displayInlineKeyboard(ctx, messageOfNotification, collectionNames);
    } catch (error) {
        console.error("Error in notification action:", error);
    }
});

bot.on("callback_query", async (ctx) => {
    const data = (ctx.callbackQuery as CallbackQuery).data;
    const chatId = ctx.callbackQuery.message?.chat.id;
    const isChain = chain.includes(data as Chain);

    console.log("callback_query", data);

    if(!chatId) return

    selectedChain = isChain ? data as Chain : selectedChain;

    if(isChain) {
        displayButtonClickContractAndCollection(ctx, selectedChain);
    }

    switch(data) {
        case 'contract':
            ctx.reply('Enter the contract address');
            chatStates[chatId] = { waitingForAddress: true };
            break;
        case 'alert':
            ctx.reply('Enter the floor price');
            chatStates[chatId] = { waitingForAlert: true };
            break;
        case 'backSelectionChain':
            displayInlineKeyboard(ctx, messageOfNetwork, networks);
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
        receivedMessageAlert(ctx, state);
    }
});

bot.launch().then(() => {
    console.log("Bot launched");
});
  
process.on("SIGTERM", () => {
    bot.stop();
});

