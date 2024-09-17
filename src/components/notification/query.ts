import { NFTAlertWithPrice } from "../../interface";
import { supabase } from "../../libs/supabaseClient";

const fetchUserNotifications = async <T>(userId: number): Promise<T | null> => {
    const { data, error } = await supabase
        .from('nfts')
        .select('*')
        .eq('user_id', userId)
        .eq('is_alert', true);
    
    if (error) {
        console.error('Error fetching notifications:', error);
        return null;
    }
    return data as T;
}

const fetchNftWithName = async <T>(userId: number, name: string): Promise<T | null> => {
    const { data, error } = await supabase
        .from('nfts')
        .select('*')
        .eq('user_id', userId)
        .eq('name', name);
       
    if (error) {
        console.error('Error fetching notifications:', error);
        return null;
    }
    return data as T;
}

export { fetchUserNotifications, fetchNftWithName }
