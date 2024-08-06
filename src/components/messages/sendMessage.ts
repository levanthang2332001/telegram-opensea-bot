import {  Message } from "node-telegram-bot-api";
import { Context, Markup } from "telegraf";
import { ChatState, NFTType } from "../../interface";
import { isEvmValidation } from "../../validation/evm";
import { getDataContract, getPriceCollection } from "../../api/getDataCollection";


const showDataNFT = (nft: NFTType) => {
    return `*${(nft.chain)?.toUpperCase()}*
NFT: [${nft.name}](https://pro.opensea.io/collection/${nft.collection})\n
_Floor Price: ${nft.price.replace(/\./g, '\\.')} ${nft.currency}_`
}

const receivedMessageContract = async (ctx: Context, state: ChatState, chain: string) => {
    const contract = (ctx.message as Message).text;

    const checkEvm = isEvmValidation(contract as string);

    if(!checkEvm) {
        ctx.reply('Invalid contract address');
        return;
    }
    
    if(!contract) {
        ctx.reply('Contract not found');
        return;
    }

    if(state?.waitingForAddress) {
        const nft = await getDataContract(contract, chain)
        if(!nft) {
            ctx.reply('Contract not found');
            return;
        }

        ctx.replyWithMarkdownV2(showDataNFT(nft as NFTType),
            Markup.inlineKeyboard([
                Markup.button.url("🔗 Go to Opensea", `https://opensea.io/assets/${contract}`),
                Markup.button.callback("🔔 Set alert", "alert"),
            ])
        );
        state.waitingForAddress = false;
    }
};

const receivedMessageCollection = async (ctx: Context, state: ChatState, chain: string) => {
    const collection = (ctx.message as Message).text;

    if(!collection) {
        ctx.reply('Collection not found');
        return;
    }

    if(state?.waitingForCollection) {
        const nft = await getPriceCollection(collection, chain)
        if(!nft) {
            ctx.reply('Collection not found');
            return;
        }

        ctx.replyWithMarkdownV2(nft,
            Markup.inlineKeyboard([
                Markup.button.url("🔗 Go to Opensea", `https://opensea.io/collection/${collection}`),
                Markup.button.callback("🔔 Set alert", "alert"),
            ])
        );
        state.waitingForCollection = false;
    }
}


export { receivedMessageContract }