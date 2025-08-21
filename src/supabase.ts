import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://khpexgrspxamjkfozdmv.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_ugK_u9iU15UWAtze4AUXJw_0WZh3fnf";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
