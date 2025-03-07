import { Message } from "node-telegram-bot-api";
import { Context, Markup } from "telegraf";
import { ChatState, NFTAlert, NFTType } from "../../interface";
import { isEvmValidation } from "../../validation/evm";
import { getDataContract } from "../../api/openseas/show-data";
import { addNftAlert } from "../../api/users/addNFTAlert";

let currentNFT: NFTAlert | null = null;

const showDataNFT = (nft: NFTType) => `*${nft.chain?.toUpperCase()}*
NFT : [${nft.name}](https://pro.opensea.io/collection/${nft.collection})\n
_Floor Price: ${nft.price.replace(/\./g, '\\.')} ${nft.currency}_`;

const receivedMessageContract = async (ctx: Context, state: ChatState, chain: string) => {
    const contract = (ctx.message as Message).text;

    if (!contract || !isEvmValidation(contract)) {
        ctx.reply('Invalid contract address');
        return;
    }

    if (state?.waitingForAddress) {
        const nft = await getDataContract(contract, chain);
        console.log("nft", nft)


        if (!nft || typeof nft === 'string') {
            ctx.reply('Contract not found');
            return;
        }

        currentNFT = {
            name: nft.name ?? '',
            collection_name: nft.collection ?? '',
            address: nft.address ?? '',
            currency: nft.currency,
            chain: nft.chain ?? null,
        };

        ctx.replyWithMarkdownV2(showDataNFT(nft as NFTType),
            Markup.inlineKeyboard([
                Markup.button.url("🔗 Go to Opensea", `https://opensea.io/assets/${contract}`),
                Markup.button.callback("🔔 Set alert", "alert"),
            ])
        );
        state.waitingForAddress = false;
    }
};

const receivedMessageAlert = async (ctx: Context, state: ChatState): Promise<void> => {
    const messageText = (ctx.message as Message).text;
    const message = parseFloat(messageText as string);

    if (isNaN(message) || message <= 0) {
        ctx.reply('Invalid alert value. Please enter a positive number.');
        return;
    }

    if (!currentNFT) return;

    console.log("currentNFT", currentNFT)

    const { address, chain, collection_name, currency } = currentNFT;

    if (!collection_name || !address || !chain || !currency) {
        ctx.reply('NFT not found');
        return;
    }

    if (ctx.from?.id) {
        addNftAlert(ctx, currentNFT, message, ctx.from.id.toString());
    }
    
    state.waitingForAlert = false;
}

export { receivedMessageContract , receivedMessageAlert }