import { createClient } from "@supabase/supabase-js";
import { Database } from "../types/supabase";

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.SUPABASE_KEY

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY')
}

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY)
