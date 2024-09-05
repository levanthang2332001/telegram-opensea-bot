import { NFTAlert } from "../interface";
import { supabase } from "../libs/supabaseClient";

const addNftAlert = async (nftAlert: NFTAlert, message: number, id: number): Promise<void> => {
    const { collection_name, address, chain, currency } = nftAlert;

    if (!collection_name || !address || !chain || !currency) {
        throw new Error('Missing required NFT alert information');
    }

    const nftData = {
        user_id: id,
        address,
        collection_name,
        chain,
        currency,
        targetprice: message,
        is_alert: true,
    };

    try {
        const { data, error, status } = await supabase
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

        console.log("NFT Alert added successfully:", data);
    } catch (error) {
        console.error("Error adding NFT alert:", error);
        throw error;
    }
};

export { addNftAlert };