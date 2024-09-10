import { Context } from "telegraf";

const notification = async (ctx: Context, message: string, options?: {
    parse_mode?: 'Markdown' | 'HTML',
    disable_web_page_preview?: boolean,
    disable_notification?: boolean,
    reply_to_message_id?: number,
    reply_markup?: any
}) => {
    try {
        const sentMessage = await ctx.reply(message, options);
        console.log(`Notification sent successfully: ${sentMessage.message_id}`);
        return sentMessage;
    } catch (error) {
        console.error(`Error sending notification: ${error}`);
        throw error;
    }
}

export { notification }
