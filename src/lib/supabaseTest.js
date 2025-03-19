import { supabase } from './supabase';

/**
 * Test direct access to computed_stats
 * This function tests a direct query to the computed_stats table
 * and logs the results or error
 */
export async function testComputedStatsAccess() {
  console.log("Testing direct access to computed_stats table...");
  
  try {
    // Try a simple count query first
    const { count, error: countError } = await supabase
      .from('computed_stats')
      .select('*', { count: 'exact', head: true });
      
    if (countError) {
      console.error("Count error:", countError);
      return { success: false, error: countError };
    }
    
    console.log(`Table has ${count} records`);
    
    // Try to fetch a specific ID
    const { data, error } = await supabase
      .from('computed_stats')
      .select('*')
      .eq('metric_id', 54)
      .limit(1);
      
    if (error) {
      console.error("Fetch error:", error);
      return { success: false, error };
    }
    
    console.log("Successfully retrieved data:", data);
    return { success: true, data };
  } catch (e) {
    console.error("Exception:", e);
    return { success: false, error: e };
  }
}

/**
 * Test accessing the metric with ID 54 (True Confirmation)
 */
export async function fetchTrueConfirmationMetric() {
  try {
    const { data, error } = await supabase
      .from('computed_stats')
      .select('*')
      .eq('metric_id', 54)
      .single();
      
    if (error) throw error;
    
    console.log("True Confirmation metric:", data);
    return data;
  } catch (e) {
    console.error("Error fetching True Confirmation:", e);
    return null;
  }
}
