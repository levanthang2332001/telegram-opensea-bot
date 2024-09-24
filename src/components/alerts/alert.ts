import { Context } from "telegraf";
import { NFTType } from "../../interface";
import { supabase } from "../../libs/supabaseClient";
import { getDataContract } from "../../api/openseas/show-data";


const checkAndNotifyUser = async (ctx: Context, nftData: NFTType) => {

    try {
        const { data: alerts, error } = await supabase
            .from('nfts')
            .select('*')
            .eq('address', nftData.address as string)

        if( error ) throw error;

        for(const alert of alerts) {
            const currentPrice = parseFloat(nftData.price);
            const targetPrice = parseFloat(String(alert.targetprice));

            if(currentPrice >= targetPrice) {
                await sendAlertToUser(ctx, alert, nftData);
            }

        }
    } catch (error) {
        console.error('Error in checkAndNotifyUser:', error);
    }
}

const sendAlertToUser = async (ctx: Context, alert: any, nftData: NFTType) => {
    const message = `🚨 Alert for ${nftData.name} (${nftData.address})!\n` +
                    `Current price: ${nftData.price} ${nftData.currency}\n` +
                    `Target price: ${alert.target_price} ${nftData.currency}\n` +
                    `Alert condition: Price is ${alert.alert_type} target`;

    try {
        await ctx.telegram.sendMessage(alert.user_id, message);
        console.log(`Alert sent to user ${alert.user_id} for NFT ${nftData.name}`);
    } catch (error) {
        console.error(`Failed to send alert to user ${alert.user_id}:`, error);
    }
}

const updateAllNFTPricesAndCheckAlerts = async (ctx: Context) => {
    try {
        const { data: nftAlerts, error } = await supabase
            .from('nfts')
            .select('address, chain', { count: 'exact', head: true})

        if (error) throw error;

        for (const alert of nftAlerts) {
            const updatedData = await getDataContract(alert.address, alert.chain);
            if (typeof updatedData !== 'string') {
                await checkAndNotifyUser(ctx, updatedData);
            }
        }

        console.log('All NFT prices updated and alerts checked');
    } catch (error) {
        console.error('Error updating all NFT prices and checking alerts:', error);
    }
}
export { updateAllNFTPricesAndCheckAlerts }