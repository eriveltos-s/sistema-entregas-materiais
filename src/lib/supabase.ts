import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kbauhhrctnfgzqdpfrgg.supabase.co';
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtiYXVoaHJjdG5mZ3pxZHBmcmdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNDU5NTMsImV4cCI6MjEwMjcyMTk1M30.D-ys5cNtmaHPnK_-GyFEysqrYMH_OpzWkcwLBBrLWfY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);