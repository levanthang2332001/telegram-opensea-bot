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
 
type User = {
    user_id: number,
    username: string,
    name: string
}

const addUser = async( user: User): Promise<boolean> => {
    const { user_id, username, name } = user 

    if(!user_id || !username || !name ) return false

    try {
        const { data, error, status } = await supabase.from('users').insert({user_id: user_id, username: username, name: name}).
    } catch ( error ) {
        return error
    }
    return true
}