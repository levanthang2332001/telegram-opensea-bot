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

const groupedNotifications = (notifications: NFTAlertWithPrice[] | undefined) => {
    if(!notifications) return;

    const groupedNotifications = notifications.reduce<NFTAlertWithPrice[][]>((acc, curr, index) => {
        if (index % 1 === 0) {
            acc.push([curr]);
        } else {
            acc[acc.length - 1].push(curr);
        }
        return acc;
    }, []);

    return groupedNotifications
}

const collectionNames = (collectionNames: NFTAlertWithPrice[] | undefined) => {
    if(!collectionNames) return;
    return collectionNames.map(e => e);
}

export { myNotification,  collectionNames, groupedNotifications}

