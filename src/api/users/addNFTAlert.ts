import { Context } from "telegraf";
import { notification } from "../../components/notifications";
import { NFTAlert } from "../../interface";
import { supabase } from "../../libs/supabaseClient";

const addNftAlert = async (ctx :Context, nftAlert: NFTAlert, message: number | string, id: number): Promise<void> => {
    const { name, collection_name, address, chain, currency } = nftAlert;

    if (!collection_name || !address || !chain || !currency) {
        throw new Error('Missing required NFT alert information');
    }

    // Convert the message to a number
    const targetPrice = parseFloat(message.toString());
    if (isNaN(targetPrice)) {
        throw new Error('Invalid target price: must be a number');
    }

    console.log(targetPrice)

    const nftData = {
        user_id: id,
        name,
        address,
        collection_name,
        chain,
        currency,
        targetprice: targetPrice,
        is_alert: true,
    };

    try {
        const { error, status } = await supabase
            .from('nfts')
            .insert(nftData)
            .select()
            .single();

        if (error) {
            throw error;
        }

        if (status !== 201) {
            throw new Error(`Unexpected status code: ${status}`);
        }

        notification(ctx, "NFT Alert added successfully 🎉. Click /notification to see your alert");
    } catch (error) {
        throw new Error(`Error adding NFT alert:, ${error}`)
    }
};

export { addNftAlert };