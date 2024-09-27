import { supabase } from "../../libs/supabaseClient";

const fetchLatestPrice = async (address: string) : Promise<number | null>  => {
    const { data, error } = await supabase
        .from('nfts')
        .select('targetprice') 
        .eq('address', address)
        .limit(1)
        .single();

    if (error) {
        throw new Error(`Error fetching latest price: ${error.message}`);
    }

    return data ? data.targetprice : null; 
}

const isCheckStatusAlert = async (address: string) : Promise<boolean> => {
    const { data, error } = await supabase
        .from('nfts')
        .select('*')
        .eq('address', address)
        .limit(1)
        .single();
        
    if (error) {
        throw new Error(`Error fetching latest price: ${error.message}`);
    }

    return data ? true : false; 
}



export { fetchLatestPrice, isCheckStatusAlert }