import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

/**
 * Custom hook to fetch and process metric data based on filters
 */
export function useMetricData(filters) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Use table name directly with schema set in client
        let query = supabase.from('metric_definition').select('*');
        
        if (filters?.day) {
          query = query.eq('day', filters.day.toLowerCase());
        }
        
        if (filters?.times && filters.times.length > 0) {
          query = query.in('time', filters.times);
        }
        
        if (filters?.actions && filters.actions.length > 0) {
          query = query.in('direction', filters.actions.map(a => a.toLowerCase()));
        }
        
        // Execute query
        const { data: metricsData, error: metricsError } = await query;
        
        if (metricsError) throw metricsError;
        
        if (metricsData && metricsData.length > 0) {
          // Fetch associated stats for these metrics
          const metricIds = metricsData.map(metric => metric.id);
          
          const { data: statsData, error: statsError } = await supabase
            .from('computed_stats')
            .select('*')
            .in('metric_id', metricIds);
            
          if (statsError) throw statsError;
          
          // Combine metrics with their stats
          const combinedData = metricsData.map(metric => {
            const stats = statsData.find(stat => stat.metric_id === metric.id) || {};
            return { ...metric, stats };
          });
          
          setData(combinedData);
        } else {
          setData([]);
        }
      } catch (err) {
        console.error('Error fetching metric data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [filters]);
  
  return { data, loading, error };
}
