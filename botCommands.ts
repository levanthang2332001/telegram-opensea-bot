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

const opts = {
    reply_markup: {
        inline_keyboard: InlineKeyboardButtons
    }
};

type Chain = 'ethereum' | 'matic' | 'bsc' | 'fantom' | 'arbitrum' | 'avalanche' | 'optimism ' ;
const chain: Chain = 'ethereum';

export { myCommands, opts };