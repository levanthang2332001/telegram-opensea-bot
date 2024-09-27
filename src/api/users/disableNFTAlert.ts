import { Context } from "telegraf";
import { supabase } from "../../libs/supabaseClient";


const disableNFTAlert = async (ctx: Context, alert: { collection_name: string }) => {
    const { collection_name } = alert;
    const userId = ctx.from?.id;

    if (!userId) return;

    const { data , error} = await supabase
        .from('nfts')
        .update({ is_alert: false })
        .eq('collection_name', collection_name)
        .eq('user_id', userId)
        .select()

    if (error) {
        throw new Error(`Error disabling NFT alert: ${error.message}`)
    }

    return data;
}

export { disableNFTAlert }
