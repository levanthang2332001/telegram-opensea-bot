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


const newUser = {
    userid: 125,
    username: "johnDic",
    name: "John Smith",
    nfts: [
      {
        collection: "Bored Ape Yacht Club",
        address: "0xBC4CA0EDA7647a8aB7C2061C19C2100000F831BD",
        chain: "Ethereum",
        targetPrice: 100000,
        currency: "ETH",
      },
      {
        collection: "ACE",
        address: "0xBC4CA0EDA7647a8aB7C2061C19C2100000F831BD",
        chain: "Ethereum",
        targetPrice: 100000,
        currency: "ETH",
      },
    ],
};

const newNfts = {
    collection: "Bored Ape Yacht Club",
    address: "0xBC4CA0EDA7647a8aB7C2061C19C2100000F83013",
    chain: "Ethereum",
    targetPrice: 100000,
    currency: "ETH",
}


bot.start(async (ctx, next) => {
    displayInlineKeyboardSelectButton(ctx); 
    
    // supabase.from('users').insert([newUser]).then(result => console.log(result))

    // const { data, error } = await supabase.from('users').select(`nfts`).eq('userid', 123)
    // data?.filter(e => console.log(e.nfts))

    // const nftArray: Json = []

    // data?.map((nft) => nftArray.push([nft.nfts as Json, newNfts]))

    // console.log(nftArray[0])


    // supabase.from('users').update({nfts: { newNfts } }).eq('userid', 123).then(result => console.log(result))
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

