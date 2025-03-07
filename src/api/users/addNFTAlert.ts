import { Context } from "telegraf";
import { notification } from "../../components/notifications";
import { NFTAlert } from "../../interface";
import { supabase } from "../../libs/supabaseClient";

const addNftAlert = async (ctx :Context, nftAlert: NFTAlert, message: number | string, id: string): Promise<void> => {
    const { name, collection_name, address, chain, currency } = nftAlert;

    if (!collection_name || !address || !chain || !currency) {
        throw new Error('Missing required NFT alert information');
    }

    if (typeof message === 'string' && message.includes(',')) {
        notification(ctx, "❌ Invalid price format. Please use decimal point (.) instead of comma.\nExample: 2.5 or 2");
        return;
    }
    const targetPrice = parseFloat(message.toString());
    if (isNaN(targetPrice)) {
        notification(ctx, "❌ Invalid price format. Please enter a valid number.\nExample: 2.5 or 2");
        return;
    }

    console.log(targetPrice)

    const nftData = {
        collection_name,
        address,
        target_price: targetPrice,
        currency,
        chain,
        user_id: id,
        is_alert: true,
    };
    
    console.log(nftData)

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
        throw new Error(`Error adding NFT alert: ${error}`)
    }
};

export { addNftAlert };




