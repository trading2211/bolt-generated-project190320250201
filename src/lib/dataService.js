import { supabase } from './supabase';
import { metricMapping } from '../constants/metrics';

/**
 * Fetches data for specified metric IDs
 * @param {number[]} metricIds - Array of metric IDs to fetch
 * @returns {Promise<Object>} - Object with metric data mapped by ID
 */
export async function fetchMetricData(metricIds = []) {
  if (!metricIds.length) return {};
  
  try {
    // Log the request for debugging
    console.log('Fetching data for metric IDs:', metricIds);
    
    // Fetch metrics data
    const { data: statsData, error: statsError } = await supabase
      .from('computed_stats')
      .select('*')
      .in('metric_id', metricIds);
      
    if (statsError) throw new Error(`Stats error: ${statsError.message}`);
    
    // Fetch metric definitions
    const { data: definitions, error: defError } = await supabase
      .from('metric_definition')
      .select('*')
      .in('id', metricIds);
      
    if (defError) throw new Error(`Definition error: ${defError.message}`);
    
    // Process and combine the data
    const processedData = {};
    
    if (statsData && statsData.length > 0) {
      statsData.forEach(stat => {
        // Find corresponding definition
        const definition = definitions.find(def => def.id === stat.metric_id) || {};
        
        // Find metadata from our local mapping
        const metadata = metricMapping[stat.metric_id] || {};
        
        // Process the stat_value based on its structure
        let processedValue = stat.stat_value;
        let binsData = [];
        
        // Handle different data formats
        if (typeof stat.stat_value === 'string' && stat.stat_value.startsWith('[')) {
          try {
            // Try to parse as JSON array
            const parsed = JSON.parse(stat.stat_value);
            if (Array.isArray(parsed)) {
              processedValue = parsed;
              
              // If it's bin data, format it appropriately
              if (parsed.length > 0 && parsed[0].bin !== undefined && parsed[0].count !== undefined) {
                binsData = parsed;
              }
            }
          } catch (e) {
            console.warn(`Failed to parse stat_value for metric ${stat.metric_id}:`, e);
          }
        }
        
        // Store the processed data
        processedData[stat.metric_id] = {
          ...stat,
          definition,
          metadata,
          value: processedValue,
          bins_data: binsData,
          display_name: definition.name || metadata.type || `Metric ${stat.metric_id}`
        };
      });
    }
    
    console.log(`Processed ${Object.keys(processedData).length} metrics`);
    return processedData;
  } catch (error) {
    console.error('Error fetching metric data:', error);
    throw error;
  }
}

/**
 * Decodes and processes stat values based on metric type
 * @param {any} statValue - The raw stat value from the database
 * @param {string} metricType - The type of metric
 * @returns {any} - The processed value ready for display
 */
export function decodeStatValue(statValue, metricType) {
  // Handle different metric types appropriately
  if (!statValue) return null;
  
  try {
    // Handle JSON string format
    if (typeof statValue === 'string' && (statValue.startsWith('[') || statValue.startsWith('{'))) {
      return JSON.parse(statValue);
    }
    
    // Handle numeric types
    if (metricType === 'percentage') {
      return typeof statValue === 'number' ? `${(statValue * 100).toFixed(2)}%` : statValue;
    }
    
    if (metricType === 'decimal') {
      return typeof statValue === 'number' ? statValue.toFixed(2) : statValue;
    }
    
    // Return as is for other types
    return statValue;
  } catch (e) {
    console.warn('Error decoding stat value:', e);
    return statValue; // Return original if processing fails
  }
}

/**
 * Creates chart data configuration from metric data
 * @param {Object} metricData - Processed metric data
 * @returns {Object} - Chart.js compatible data configuration
 */
export function createChartData(metricData) {
  if (!metricData) return null;
  
  // Handle bin data for histograms
  if (metricData.bins_data && metricData.bins_data.length > 0) {
    return {
      labels: metricData.bins_data.map(item => {
        // Process bin label based on format
        if (typeof item.bin === 'object' && item.bin.length === 2) {
          return `${item.bin[0].toFixed(2)}-${item.bin[1].toFixed(2)}`;
        }
        return typeof item.bin === 'number' ? item.bin.toFixed(2) : item.bin;
      }),
      datasets: [{
        label: metricData.display_name,
        data: metricData.bins_data.map(item => item.count),
        backgroundColor: metricData.bins_data.map(() => '#7A3AEA'),
        borderWidth: 0,
        borderRadius: 4,
        barPercentage: 0.95,
      }]
    };
  }
  
  // Handle single value metrics
  if (metricData.value !== undefined) {
    return {
      labels: ['Value'],
      datasets: [{
        label: metricData.display_name,
        data: [metricData.value],
        backgroundColor: ['#7A3AEA'],
        borderWidth: 0,
        borderRadius: 4,
      }]
    };
  }
  
  return null;
}
