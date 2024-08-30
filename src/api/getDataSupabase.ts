import { QueryResult, QueryData, QueryError } from '@supabase/supabase-js'
import { supabase } from '../libs/supabaseClient'

const fetchData = supabase.from('countries').select('*')

fetchData.then((result) => {
    console.log(result.data);
});