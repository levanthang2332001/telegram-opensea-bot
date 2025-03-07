import { Context, Markup } from "telegraf";
import { NFTType } from "../../interface";
import { supabase } from "../../libs/supabaseClient";
import { getDataContract } from "../../api/openseas/show-data";


const checkAndNotifyUser = async (ctx: Context, nftData: NFTType) => {
    try {
        const { data: alerts, error } = await supabase
            .from('nfts')
            .select('*')
            .eq('address', nftData.address as string)
            .eq('is_alert', true)

        if( error ) throw error;
        
        for(const alert of alerts) {
            const currentPrice = parseFloat(nftData.price);
            const targetPrice = parseFloat(String(alert.target_price));

            if(currentPrice >= targetPrice) {
                await sendAlertToUser(ctx, alert, nftData);
            }
        }
    } catch (error) {
        throw new Error(`Error in checkAndNotifyUser:', ${error}`)
    }
}

const sendAlertToUser = async (ctx: Context, alert: any, nftData: NFTType) => {
    console.log('sendAlertToUser', alert)
    const message = [
        `🚨 ALERT FOR <b>${nftData.name?.toUpperCase()}</b>!🚨`,
        `-------------------------------------`,    
        `Current Price: <code>${nftData.price} ${nftData.currency}</code>`,
        `Target Price : <code>${alert.target_price} ${nftData.currency}</code>`,
    ].join('\n');

    const inlineKeyboard = Markup.inlineKeyboard([
        Markup.button.url('View on OpenSea', `https://opensea.io/collection/${nftData.collection}`),
        Markup.button.callback('Disable Alert', `disable_alert/${alert.collection_name.toLowerCase()}`)
    ]);

    try {
        await ctx.telegram.sendMessage(alert.user_id, message, { 
            parse_mode: "HTML",
            ...inlineKeyboard
        });
        console.log(`Alert sent to user ${alert.user_id} for NFT ${nftData.name}`);
    } catch (error) {
        throw new Error(`Failed to send alert to user ${alert.user_id}:`)
    }
}

const updateAllNFTPricesAndCheckAlerts = async (ctx: Context) => {
    try {
        const { data: nftData, error } = await supabase
            .from('nfts')
            .select('address, chain')
            .eq('is_alert', true)

        if (error || !nftData) throw error;

        for (const alert of nftData) {
            const updatedData = await getDataContract(alert.address, alert.chain);
            // console.log(typeof updatedData)
            if (typeof updatedData !== 'string') {
                await checkAndNotifyUser(ctx, updatedData);
            }
        }

        console.log('All NFT prices updated and alerts checked');
    } catch (error) {
        throw new Error(`Error updating all NFT prices and checking alerts:', ${error}`)
    }
}
export { updateAllNFTPricesAndCheckAlerts }