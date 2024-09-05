import {  Message } from "node-telegram-bot-api";
import { Context, Markup } from "telegraf";
import { ChatState, NFTAlert, NFTType } from "../../interface";
import { isEvmValidation } from "../../validation/evm";
import { getDataContract, getPriceCollection } from "../../api/getDataCollection";
import { supabase } from "../../libs/supabaseClient";
import { addNftAlert } from "../../database/addNFTAlert";

let currentNFT: NFTAlert | null = null;

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

        if(!nft || typeof nft === 'string') {
            ctx.reply('Contract not found');
            return;
        }
        currentNFT = {
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
    // console.log(currentNFT)
};


const receivedMessageAlert = async (ctx: Context, state: ChatState): Promise<void> => {
    const messageText = (ctx.message as Message).text;
    const message = parseFloat(messageText as string);

    if (isNaN(message) || message <= 0) {
        ctx.reply('Invalid alert value. Please enter a positive number.');
        return;
    }

    const { address, chain, collection_name, currency } = currentNFT as NFTAlert;

    if(!collection_name || !address || !chain || !currency) {
        ctx.reply('NFT not found');
        return;
    }

    addNftAlert(currentNFT as NFTAlert, message, ctx.from?.id as number);
    
    state.waitingForAlert = false;

}

// Update the isNumber function to allow decimal numbers
const isNumber = (value: string): boolean => /^\d*\.?\d+$/.test(value);


export { receivedMessageContract , receivedMessageAlert }