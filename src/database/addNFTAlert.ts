import { Context } from "telegraf";
import { notification } from "../components/notification";
import { NFTAlert } from "../interface";
import { supabase } from "../libs/supabaseClient";

const addNftAlert = async (ctx :Context, nftAlert: NFTAlert, message: number | string, id: number): Promise<void> => {
    const { collection_name, address, chain, currency } = nftAlert;

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

        notification(ctx, "NFT Alert added successfully");
    } catch (error) {
        console.error("Error adding NFT alert:", error);
        throw error;
    }
};

export { addNftAlert };