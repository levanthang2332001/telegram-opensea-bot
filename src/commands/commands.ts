import { InlineKeyboardButton } from "node-telegram-bot-api";

// Commands for bot
const myCommands = [
    {command: '/start', description: 'Start the bot'},
    {command: '/help', description: 'Get help'}
]

// Inline Keyboard
const InlineKeyboardButtons: InlineKeyboardButton[][] = [
    [{text: 'Token Contract ', callback_data: '/token'}, {text: 'Collection NFT ', callback_data: '/collection'},{text: 'Help ', callback_data: '/help'}],
];

const InlineKeyboardButtonChains: InlineKeyboardButton[][] = [
    [{text: 'Ethereum', callback_data: '/ethereum'}, {text: 'Matic ', callback_data: '/matic'},{text: 'BSC ', callback_data: '/bsc'}],
    [{text: 'Fantom', callback_data: '/fantom'}, {text: 'Arbitrum ', callback_data: '/arbitrum'},{text: 'Avalanche ', callback_data: '/avalanche'}, {text: 'Optimism', callback_data: '/optimism'}],
];

const InlineKeyboardButtonChoose: InlineKeyboardButton[][] = [
    [{text: 'Select a network', callback_data: '/selectChain'}],
    [{text: 'My notification', callback_data: '/notification'}]
]

const selectButtons = [
    {
        text: 'Select a network',
        callback_data: 'button1',
    },
    {
        text: 'My notification',
        callback_data: '/notification',
    },
]


export type Chain = 'ethereum' | 'polygon' | 'bsc' | 'fantom' | 'arbitrum' | 'avalanche' | 'optimism';
const chain = ['ethereum', 'matic','base','arbitrum', 'avalanche', 'optimism'] ;

export { 
    myCommands,
    chain,
    selectButtons,
    InlineKeyboardButtons,
    InlineKeyboardButtonChains,
    InlineKeyboardButtonChoose
};

