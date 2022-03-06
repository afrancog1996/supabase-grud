import { createClient } from '@supabase/supabase-js'
const supabaseUrl = "https://lkgymkpmcnwrkogiznwu.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxrZ3lta3BtY253cmtvZ2l6bnd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDQ3Mjc2MDMsImV4cCI6MTk2MDMwMzYwM30.3mo52XkedONeBmNkPpZz5jya4vafcXFdh4AV-nwgUck";


export const supabase = createClient(supabaseUrl, supabaseAnonKey)