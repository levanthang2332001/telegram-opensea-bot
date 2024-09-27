import { NFTAlertWithPrice } from "../../interface";
import { supabase } from "../../libs/supabaseClient";

const fetchUserNotifications = async <T>(userId: number): Promise<T | null> => {
    const { data, error } = await supabase
        .from('nfts')
        .select('*')
        .eq('user_id', userId)
        .eq('is_alert', true)
    
    if (error) {
        throw new Error(`Error fetching notifications: ${error.message}`);
    }
    return data as T;
}

const fetchNftWithName = async <T>(userId: number, callback_data: string): Promise<T | null> => {
    // console.log(userId, name);
    const { data, error } = await supabase
        .from('nfts')
        .select('*')
        .eq('user_id', userId)
        .eq('collection_name', callback_data);
       
    if (error) {
        throw new Error(`Error fetching notifications: ${error.message}`);
    }

    return data as T;
}

export { fetchUserNotifications, fetchNftWithName }
