import {  Message } from "node-telegram-bot-api";
import { Context, Markup } from "telegraf";
import { ChatState, NFTType } from "../../interface";
import { isEvmValidation } from "../../validation/evm";
import { getDataContract, getPriceCollection } from "../../api/getDataCollection";
import { IUser } from "../../interface";

let currentNFT: NFTType | null = null;




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

        currentNFT = nft as NFTType;

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


const receivedMessageAlert = async (ctx: Context, state: ChatState) => {
    const messageText = (ctx.message as Message).text;
    const message = parseFloat(messageText as string);

    if (isNaN(message) || message <= 0) {
        ctx.reply('Invalid alert value. Please enter a positive number.');
        return;
    }

    const { address, chain, collection, currency, name, price } = currentNFT as NFTType;

    console.log(address, chain, collection, currency, name, price)

    
    // ... rest of the function
}

// Update the isNumber function to allow decimal numbers
const isNumber = (value: string): boolean => /^\d*\.?\d+$/.test(value);


export { receivedMessageContract , receivedMessageAlert }