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

    notifications.forEach((nft) => {
        displayInlineKeyboard(ctx, "My Notification", nft)
    });
}

export { myNotification }

