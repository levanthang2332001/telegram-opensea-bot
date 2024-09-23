import { Context, Markup } from "telegraf";
import { NFTAlertWithPrice } from "../../interface";
import { message } from "telegraf/filters";


const displayInlineKeyboardSelectButton = (ctx: Context) => {
    const username = ctx.from?.username;
    return ctx.reply(`Welcome @${username}! This is OPENSEA ALERT! 👋👋

    ✅ Opensea alert will keep you updated on the latest and most relevant NFT drops. \n
    ✅ Stay tuned for exclusive alerts and don't miss out on any opportunity!
    
    That's all you need to know to get started. ⬇️`, {
        parse_mode: "HTML",
        ...Markup.inlineKeyboard([
            Markup.button.callback("🌐 Select a network", "network"),
            Markup.button.callback("🔔 My notification", "notification"),
        ]),
    });
}

export type INotification = {
    text: string;
    callback_data: string;
}

const displayInlineKeyboard = <T extends string[][] | INotification[]>(ctx: Context, message: string, buttons: T) => {
    const keyboard = Array.isArray(buttons)
        ? buttons.map(row => 
            Array.isArray(row)
                ? row.map((btn: string) => Markup.button.callback(`${btn}`, `network/${btn.toLowerCase()}`))
                : [Markup.button.callback(`${row.text}`, row.callback_data)]
          )
        : Object.entries(buttons).map(([key, value]) => 
            [Markup.button.callback(`${key}: ${value}`, `${key.toLowerCase()}_${value}`)]
          );

    return ctx.reply(message, {
        parse_mode: "HTML",
        ...Markup.inlineKeyboard(keyboard),
    });
}

const displayButtonClickNft = (ctx: Context, nft: string, message: string) => {
    const keyboard = [
        [Markup.button.callback("Disable", "")],
        [Markup.button.callback("Edit", "")]
    ];

    return ctx.reply(message, {
        parse_mode: "HTML",
        ...Markup.inlineKeyboard(keyboard),
    });

}

const displayButtonClickContract = (ctx: Context, chain: string) => {
    const keyboard = [
        [Markup.button.callback("📜 Contract", "contract")],
        [Markup.button.callback("← Back", "backSelectionChain")]
    ];

    return ctx.reply(`You selected <b>${chain}</b>`, {
        parse_mode: "HTML",
        ...Markup.inlineKeyboard(keyboard),
    });
}

export { 
    displayInlineKeyboardSelectButton, 
    displayInlineKeyboard, 
    displayButtonClickContract,
};