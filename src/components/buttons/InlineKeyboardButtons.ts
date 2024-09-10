import { Context, Markup } from "telegraf";

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

const displayInlineKeyboard = (ctx: Context, message: string, buttons: string[][]) => {
    const keyboard = buttons.map(row => 
        row.map(btn => Markup.button.callback(`${btn}`, btn.toLowerCase()))
    );

    return ctx.reply(message, {
        parse_mode: "HTML",
        ...Markup.inlineKeyboard(keyboard),
    });
}

const displayButtonClickContractAndCollection = (ctx: Context, chain: string) => {
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
    displayButtonClickContractAndCollection,
};