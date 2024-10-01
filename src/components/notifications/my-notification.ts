import { Context } from "telegraf";
import { notification } from "./notification";
import { NFTAlertWithPrice } from "../../interface";
import { fetchUserNotifications } from "./query";
import { displayInlineKeyboard } from "../buttons";
import { messageOfNotification } from "../../types/message";

const myNotification = async (
    ctx: Context,
    userId: number
): Promise<NFTAlertWithPrice[] | undefined> => {
    const data = await fetchUserNotifications<NFTAlertWithPrice[]>(userId);

    if (!data || data.length === 0) {
        await notification(ctx, "You have no notifications");
        return;
    }

    return data;
};

/* Convert data to [[]] */
const groupedNotifications = (notifications: NFTAlertWithPrice[]) => {
    return notifications.map(({ name, collection_name }) => ({
        text: name,
        callback_data: collection_name,
    }));
};

const handleNotificationCommand = async (ctx: Context) => {
    const id = ctx.from?.id;
    if (!id) {
        throw new Error("User ID not found in notification action");
    }

    try {
        // Fetch the user's notifications
        const dataOfNFT = await myNotification(ctx, id);

        if (!dataOfNFT || dataOfNFT.length === 0) return;

        // Group the notifications and display them
        const groupedData = groupedNotifications(dataOfNFT).flat();
        await displayInlineKeyboard(ctx, messageOfNotification, groupedData);
    } catch (error) {
        console.error(`Error in notification action:`, error);
        await ctx.reply(
            "An error occurred while fetching your notifications. Please try again later."
        );
    }
};

export { myNotification, groupedNotifications, handleNotificationCommand };
