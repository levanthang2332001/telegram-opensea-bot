import { Context, Markup } from "telegraf";
import { supabase } from "../../libs/supabaseClient"
import { notification } from "./notification";
import { NFTAlertWithPrice } from "../../interface";
import { displayInlineKeyboard } from "../buttons";
import { fetchUserNotifications } from "./query";


const myNotification = async (ctx: Context, userId: number) => {
    const notifications = await fetchUserNotifications<NFTAlertWithPrice[]>(userId);

    if (!notifications || notifications.length === 0) {
        await notification(ctx, "You have no notifications");
        return;
    }

    return notifications;
}

const collectionNames = (collectionNames: NFTAlertWithPrice[] | undefined) => {
    if(!collectionNames) return;
    return collectionNames.map(e => e);
}

const groupedNotifications = (notifications: NFTAlertWithPrice[]) => {
    return notifications.map(value => [{
        text: value.name,
        callback_data: value.collection_name
    }]) 
}

export { myNotification,  collectionNames, groupedNotifications}

