import { Context, Markup } from "telegraf";
import { supabase } from "../../libs/supabaseClient"
import { notification } from "./notification";
import { NFTAlertWithPrice } from "../../interface";
import { displayInlineKeyboard } from "../buttons";
import { fetchUserNotifications } from "./query";


const myNotification = async (ctx: Context, userId: number) => {
    const data = await fetchUserNotifications<NFTAlertWithPrice[]>(userId);

    if (!data || data.length === 0) {
        await notification(ctx, "You have no notifications");
        return;
    }

    return data;
}

/* Convert data to [[]] */
const groupedNotifications = (notifications: NFTAlertWithPrice[]) => {
    return notifications.map(({ name, collection_name }) => ({
        text: name,
        callback_data: collection_name
    }));
}


export { myNotification, groupedNotifications}

