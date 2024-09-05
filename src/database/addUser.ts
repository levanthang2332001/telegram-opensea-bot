import { supabase } from "./../libs/supabaseClient"

const isCheckUserExists = async (id: number): Promise<boolean> => {
    if(id === undefined || "") return false; 

    const { data, error, status } = await supabase
        .from('users')
        .select('id')
        .eq('user_id', id)
        .single()
    
    return !!data && !error
}
 
export type User = {
    user_id: number,
    username: string,
    name: string
}

const addUser = async( user: User) => {
    const { user_id, username, name } = user 

    if(!user_id || !username || !name ) return;

    if(await isCheckUserExists(user_id)) {
        try {
            const { data, error, status } = await supabase
                .from('users')
                .insert({user_id: user_id, username: username, name: name})
                .select()
    
            if(!error || status != 201) return;
            console.log("data inserted")
        } catch ( error ) {
            return error
        }
    } 
    return;
}

type NftAlert = {
    nft_id: number;
    collection_name: string;
    address: string;
    targetPrice: number | null;
    currency: string | null;
    chain_id: number | null;
    user_id: number | null;
    is_alert: boolean | null;
}

const addNftAlert = async (nftAlert: NftAlert) => {
    const { nft_id, collection_name, address, targetPrice, currency, chain_id, user_id, is_alert } = nftAlert;

    if(!nft_id || !collection_name || !address || !targetPrice || !currency || !chain_id || !user_id || !is_alert) return;

    const { data, error, status } = await supabase
        .from('nfts')
        .insert({ nft_id, collection_name, address, targetPrice, currency, chain_id, user_id, is_alert })
        .select()

    if(!data || error || status != 201) return;

    return data;
}
export  { addUser, addNftAlert }