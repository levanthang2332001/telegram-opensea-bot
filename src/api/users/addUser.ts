import { User } from "../../interface";
import { supabase } from "../../libs/supabaseClient"

const isCheckUserExists = async (id: string): Promise<boolean> => {
    if (!id) return false;

    const { data, error } = await supabase
        .from('users')
        .select('user_id')
        .eq('user_id', id)
        .single()
    
    return !!data && !error
}


const addUser = async(user: User) => {
    const { user_id, username, name } = user 

    if(!user_id || !username || !name) {
        console.log("Missing required fields:", { user_id, username, name });
        return;
    }

    try {
        const exists = await isCheckUserExists(user_id);
        if(exists) {
            console.log("User already exists:", user_id);
            return;
        }

        const { error, status, data } = await supabase
            .from('users')
            .insert({
                user_id: user_id,
                username,
                name,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                is_active: true,
            })
            .select()
        
        console.log("Insert response:", { error, status, data });

        if (error) {
            throw new Error(error.message || 'Unknown database error');
        }

        if (status !== 201) {
            throw new Error(`Unexpected status code: ${status}`);
        }
        console.log("User added successfully:", user_id);
    } catch (error) {
        console.error("Detailed error:", error);
        throw new Error(error instanceof Error ? error.message : 'Unknown error occurred');
    }
}

export { addUser, isCheckUserExists }