import { Context, Markup } from "telegraf";

const displayInlineKeyboardSelectButton = (ctx: Context) => {
    const username = ctx.from?.username;
    return ctx.reply(`*Welcome @${username} ! This is OPENSEA ALERT! 👋👋

    ✅ Opensea alert will keep you updated on the latest and most relevant NFT drops.\n
    ✅ Stay tuned for exclusive alerts and don't miss out on any opportunity!\n
    That's all you need to know to get started. ⬇️`, {
        parse_mode: "HTML",
        ...Markup.inlineKeyboard([
            Markup.button.callback("🌐 Select a network", "network"),
            Markup.button.callback("🔔 My notification", "notification"),
        ]),
    });
}

const displayInlineKeyboardSelectNetwork = (ctx: Context) => {
    return ctx.reply("<b>Choose a network</b>", {
        parse_mode: "HTML",
        ...Markup.inlineKeyboard([
            [
                Markup.button.callback("🌐 Ethereum", "ethereum"),
                Markup.button.callback("🌐 Bsc", "bsc"),
                Markup.button.callback("🌐 Polygon", "polygon"),
            ],
            [
                Markup.button.callback("🌐 Avalanche", "avalanche"),
                Markup.button.callback("🌐 Fantom", "fantom"),
                Markup.button.callback("🌐 Optimism", "optimism"),
            ],
            [
                Markup.button.callback("🌐 Arbitrum", "arbitrum"),
            ],
            [
                Markup.button.callback("← Back", "backSelectNetwork"),
            ]
        ]
        ),
    });
}

const displayButtonClickContractAndCollection = (ctx: Context, chain: string) => {
    return ctx.reply(`You selected on <b>${chain}</b> \n<b>Click on the contract or collection</b>`, {
        parse_mode: "HTML",
        ...Markup.inlineKeyboard([
            [
                Markup.button.callback("📜 Contract", "contract"),
                // Markup.button.callback("🖼️ Collection", "collection"),
            ],
            [
                Markup.button.callback("← Back", "backSelectionChain"),
            ]
        ]
        ),
    });
}

export { 
    displayInlineKeyboardSelectButton, 
    displayInlineKeyboardSelectNetwork, 
    displayButtonClickContractAndCollection,
};