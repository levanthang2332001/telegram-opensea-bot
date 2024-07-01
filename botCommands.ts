import { InlineKeyboardButton } from "node-telegram-bot-api";

// Commands for bot
const myCommands = [
    {command: '/start', description: 'Start the bot'},
    {command: '/help', description: 'Get help'}
]

// Inline Keyboard
const InlineKeyboardButtons: InlineKeyboardButton[][] = [
    [{text: 'Address', callback_data: '/address'}, {text: 'Collection ', callback_data: '/collection'},{text: 'Help ', callback_data: '/help'}],
];

const InlineKeyboardButtonChains: InlineKeyboardButton[][] = [
    [{text: 'Ethereum', callback_data: '/ethereum'}, {text: 'Matic ', callback_data: '/matic'},{text: 'BSC ', callback_data: '/bsc'}],
    [{text: 'Fantom', callback_data: '/fantom'}, {text: 'Arbitrum ', callback_data: '/arbitrum'},{text: 'Avalanche ', callback_data: '/avalanche'}, {text: 'Optimism', callback_data: '/optimism'}],
];

const InlineKeyboardButtonChoose: InlineKeyboardButton[][] = [
    [{text: 'Choose network', callback_data: '/network'}],
    [{text: 'My notification', callback_data: '/notification'}]
]

const opts = {
    description: 'Choose address or collection',
    reply_markup: {
        inline_keyboard: InlineKeyboardButtons
    }
};

const optsChain = {
    description: 'Choose chain',
    reply_markup: {
        inline_keyboard: InlineKeyboardButtonChains
    }

};

const optsChoose = {
    description: 'Choose',
    reply_markup: {
        inline_keyboard: InlineKeyboardButtonChoose
    }
};

export type Chain = '/ethereum' | '/matic' | '/bsc' | '/fantom' | '/arbitrum' | '/avalanche' | '/optimism';
const chain = ['/ethereum', '/matic', '/bsc', '/fantom', '/arbitrum', '/avalanche', '/optimism'] ;

export { myCommands, opts, optsChain, chain,optsChoose};

