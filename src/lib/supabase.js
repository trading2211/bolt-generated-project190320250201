import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ahfglshexgeplzdlkrlf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFoZmdsc2hleGdlcGx6ZGxrcmxmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjkyOTE4NTAsImV4cCI6MjA0NDg2Nzg1MH0.zg576a1SxYBqBizO8IsuiSkngNHg9fQ1WAfM4Dxz7Jg';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Check if we can access the computed_stats table
export async function testDatabaseAccess() {
  try {
    const { count, error } = await supabase
      .from('computed_stats')
      .select('*', { count: 'exact', head: true });
      
    if (error) {
      console.error("Database access error:", error);
      return false;
    }
    
    console.log(`Successfully connected to database. Table has ${count} records.`);
    return true;
  } catch (e) {
    console.error("Exception during database access:", e);
    return false;
  }
}
