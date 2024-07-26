import { InlineKeyboardButton } from "node-telegram-bot-api";


export const createInlineKeyboardOptions = (buttons: InlineKeyboardButton[][]) => {
    if (!Array.isArray(buttons)) {
        throw new Error('Invalid buttons: Expected an array.');
    }

    buttons.forEach(button => {
        if (!('text' in button) || !('callback_data' in button)) {
            throw new Error('Invalid button format: Missing "text" or "callback_data" property.');
        }
    });
    
    return {
        reply_markup: {
            inline_keyboard: buttons
        }
    }
}