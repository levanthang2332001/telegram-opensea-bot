import dotenv, { config } from "dotenv";
import { CallbackQuery } from "node-telegram-bot-api";
import { Context, Telegraf } from "telegraf";
import { chatStates, NFTAlertWithPrice } from "./src/interface";
import { chain, Chain } from "./src/commands/index";

import {
    receivedMessageAlert,
    receivedMessageContract,
} from "./src/components/messages/index";
import {
    displayButtonClickContract,
    displayInlineKeyboardSelectButton,
    displayInlineKeyboard,
} from "./src/components/buttons/index";
import { addUser } from "./src/api/users/addUser";
import {
    groupedNotifications,
    myNotification,
} from "./src/components/notifications";
import {
    messageOfNetwork,
    messageOfNotification,
    networks,
} from "./src/types/message";
import { fetchNftWithName } from "./src/components/notifications/query";
import {
    disableAlertNft,
    showAlertNft,
} from "./src/components/messages/show-alert";

import { updateAllNFTPricesAndCheckAlerts } from "./src/components/alerts";
import { Update } from "telegraf/types";
import { disableNFTAlert } from "./src/api/users/disableNFTAlert";

dotenv.config();

if (!process.env.TELEGRAM_BOT_TOKEN) {
    throw new Error("Error: Telegram bot token is not provided.");
}

// Create a bot that uses 'polling' to fetch new updates
const TOKEN: string = process.env.TELEGRAM_BOT_TOKEN || "";
const bot = new Telegraf(TOKEN);

// Default chain is ethereum
export let selectedChain: Chain = "ethereum";

let deletedMessageId: number = 0;

// Console log all messages
// bot.use(Telegraf.log());

bot.telegram.setMyCommands([
    { command: "start", description: "Start the bot" },
    { command: "help", description: "Help" },
    { command: "notification", description: "Notification" },
]);

// Update all NFT prices and check alerts every 10 seconds
(async () => {
    setInterval(async () => {
        await updateAllNFTPricesAndCheckAlerts(
            bot as unknown as Context<Update>
        );
    }, 10000);
})();

bot.start(async (ctx) => {
    displayInlineKeyboardSelectButton(ctx);

    const { username, id, first_name } = ctx.message.from;

    if (!username || !id || !first_name) return;

    // Add the user to the database
    await addUser({
        user_id: Number(id),
        username,
        name: first_name,
    });
});

bot.action("disable", async (ctx) => {
    disableAlertNft(ctx);
});

bot.action("network", (ctx, next) => {
    deletedMessageId =
        (ctx.callbackQuery as CallbackQuery).message?.message_id || 0;

    ctx.deleteMessage(deletedMessageId)
        .then(() => {
            displayInlineKeyboard(ctx, messageOfNetwork, networks);
        })
        .catch((err) => {
            throw new Error(`Error deleting message:, ${err}`);
        });

    return;
});

bot.action("notification", async (ctx) => {
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
        displayInlineKeyboard(ctx, messageOfNotification, groupedData);
    } catch (error) {
        throw new Error(`Error in notification action:, ${error}`);
    }
});

bot.action(/^network\/(\w+)$/, (ctx) => {
    try {
        const chain = ctx.match[1];
        selectedChain = chain as Chain;
        displayButtonClickContract(ctx, selectedChain);
    } catch (error) {
        throw new Error(`Error in network action:, ${error}`);
    }
});

bot.action(/^disable_alert\/(.+)$/, (ctx) => {
    if (ctx.match && ctx.match[1]) {
        const data = ctx.match[1];
        disableNFTAlert(ctx, { collection_name: data });
    } else {
        throw new Error("No match found for disable_alert action");
    }
});

bot.on("callback_query", async (ctx) => {
    const data = (ctx.callbackQuery as CallbackQuery).data;
    const chatId = ctx.callbackQuery.message?.chat.id;
    const userId = ctx.from?.id;

    console.log("callback_query", chatId);

    if (!chatId || !data || !userId) return;

    switch (data) {
        case "contract":
            ctx.reply("Enter the contract address");
            chatStates[chatId] = { waitingForAddress: true };
            break;
        case "alert":
            ctx.reply("Enter the floor price");
            chatStates[chatId] = { waitingForAlert: true };
            break;
        case "backSelectionChain":
            displayInlineKeyboard(ctx, messageOfNetwork, networks);
            break;
        case "delete":
            ctx.reply("Your alert has been set");
            break;
        default:
            const alertNFT = await fetchNftWithName<NFTAlertWithPrice>(
                userId,
                data
            );
            if (!alertNFT) return;
            showAlertNft(ctx, alertNFT);
            break;
    }
    return;
});

bot.on("message", async (ctx) => {
    const state = chatStates[ctx.message.chat.id];

    if (state?.waitingForAddress) {
        receivedMessageContract(ctx, state, selectedChain);
    }

    if (state?.waitingForAlert) {
        // const isAlert = await isCheckStatusAlert();
        receivedMessageAlert(ctx, state);
    }
});

bot.launch().then(() => console.log("bot launch"));

process.on("SIGTERM", () => {
    bot.stop();
});
