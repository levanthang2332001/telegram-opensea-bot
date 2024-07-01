interface CallbackQuery {
    id: string;
    from: User;
    message: Message;
    chat_instance: string;
    data: string;
}

interface User {
    id: number;
    is_bot: boolean;
    first_name: string
    last_name?: string;
    username: string;
    language_code?: string;
}

type UserFormat  = Omit<User, "last_name" | "language_code"> 

interface Message {
    message_id: number;
    from: UserFormat;
    chat: Chat;
    date: number;
    edit_date?: number;
    text: string;
    reply_markup: ReplyMarkup;
}

interface Chat {
    id: number;
    first_name: string;
    last_name?: string;
    username: string;
    type: string;
}

interface ReplyMarkup {
    inline_keyboard: InlineKeyboardButton[][];
}

interface InlineKeyboardButton {
    text: string;
    callback_data?: string;
    // Add other fields as necessary
}

export type { CallbackQuery }
