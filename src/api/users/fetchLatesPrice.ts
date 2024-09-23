import { supabase } from "../../libs/supabaseClient";

const fetchLatestPrice = async (address: string) : Promise<number | null>  => {
    const { data, error } = await supabase
        .from('nfts')
        .select('targetprice') 
        .eq('address', address)
        .limit(1)
        .single();

    if (error) {
        console.error("Error fetching latest price:", error);
        return null; 
    }

    return data ? data.targetprice : null; 
}

export { fetchLatestPrice }