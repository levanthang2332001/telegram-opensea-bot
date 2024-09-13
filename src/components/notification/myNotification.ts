import { Context, Markup } from "telegraf";
import { supabase } from "../../libs/supabaseClient"
import { notification } from "./notification";
import { NFTAlertWithPrice } from "../../interface";
import { displayInlineKeyboard } from "../buttons";

const fetchUserNotifications = async <T>(userId: number): Promise<T | null> => {
    const { data, error } = await supabase
        .from('nfts')
        .select('*')
        .eq('user_id', userId)
        .eq('is_alert', true);
    
    if (error) {
        console.error('Error fetching notifications:', error);
        return null;
    }
    return data as T;
}

const myNotification = async (ctx: Context, userId: number) => {
    const notifications = await fetchUserNotifications<NFTAlertWithPrice[]>(userId);

    if (!notifications || notifications.length === 0) {
        await notification(ctx, "You have no notifications");
        return;
    }

   /* const groupedNotifications = notifications.reduce<NFTAlertWithPrice[][]>((acc, curr, index) => {
        if (index % 3 === 0) {
            acc.push([curr]);
        } else {
            acc[acc.length - 1].push(curr);
        }
        return acc;
    }, []);

    */

    return notifications;
}

const groupedNotifications = (notifications: NFTAlertWithPrice[] | undefined) => {
    if(!notifications) return;

    const groupedNotifications = notifications.reduce<NFTAlertWithPrice[][]>((acc, curr, index) => {
        if (index % 3 === 0) {
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

