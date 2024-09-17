import { User } from "../../interface";
import { supabase } from "../../libs/supabaseClient"

const isCheckUserExists = async (id: number): Promise<boolean> => {
    if(id === undefined || "") return false; 

    const { data, error, status } = await supabase
        .from('users')
        .select('user_id')
        .eq('user_id', id)
        .single()
    
    return !!data && !error
}

const addUser = async( user: User) => {
    const { user_id, username, name } = user 

    if(!user_id || !username || !name ) return;

    if(await isCheckUserExists(user_id)) {
        console.log("User already exists")
        return;
    }

    try {
        const { data, error, status } = await supabase
            .from('users')
            .insert({user_id: user_id, username: username, name: name})
            .select()
        
        if (error) {
            throw error;
        }

        if (status !== 201) {
            throw new Error(`Unexpected status code: ${status}`);
        }
        console.log("data inserted")
    } catch ( error ) {
        console.error("Error adding NFT alert:", error);
        throw error;
    }
}



export { addUser, isCheckUserExists }