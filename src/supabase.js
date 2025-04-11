import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://uflxshroyasxnwqsxira.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVmbHhzaHJveWFzeG53cXN4aXJhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5ODc1MTksImV4cCI6MjA1ODU2MzUxOX0.wILRoTZuenFeg_wINyGiKfCTrBDClk_gLvV_yUG9mJQ";
const supabase = createClient(supabaseUrl, supabaseKey);
// we exported the supabase client to use it in the app
export default supabase;
