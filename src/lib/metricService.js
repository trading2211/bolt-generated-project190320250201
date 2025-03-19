import { supabase, testDatabaseAccess } from './supabase';
import { mockMetricsData } from './mockData';
import { METRIC_TYPES } from '../constants/metrics';

// Keep track of database connectivity
let databaseAvailable = null; // null = not tested yet

/**
 * Check if the database is available and update status
 */
export async function checkDatabaseAvailability() {
  if (databaseAvailable === null) {
    databaseAvailable = await testDatabaseAccess();
  }
  return databaseAvailable;
}

/**
 * Parse metric value into a usable format
 */
export function parseMetricValue(metric) {
  if (!metric || !metric.stat_value) return null;
  
  try {
    // Handle JSON strings
    if (typeof metric.stat_value === 'string') {
      // Try to parse as JSON
      try {
        return JSON.parse(metric.stat_value);
      } catch (e) {
        console.warn('Failed to parse metric value:', e);
      }
    }
    
    return metric.stat_value;
  } catch (e) {
    console.error('Error parsing metric value:', e);
    return null;
  }
}

/**
 * Check if a metric is time-based
 */
export function isTimeBasedMetric(metricId) {
  // Max Retracement Time and Max Extension Time are time-based
  return (metricId >= 472 && metricId <= 621) || (metricId >= 622 && metricId <= 771);
}

/**
 * Fetch metrics by IDs with fallback to mock data
 */
export async function fetchMetricsByIds(metricIds) {
  if (!metricIds || !Array.isArray(metricIds) || metricIds.length === 0) return {};
  
  // Always use mock data for development
  return getFallbackData(metricIds);
}

/**
 * Get fallback data for specified metric IDs
 */
function getFallbackData(metricIds) {
  const result = {};
  
  metricIds.forEach(id => {
    if (mockMetricsData[id]) {
      result[id] = {
        ...mockMetricsData[id],
        parsedValue: parseMetricValue(mockMetricsData[id])
      };
    } else {
      // Check if this is a time-based metric
      const isTimeBased = isTimeBasedMetric(id);
      
      if (isTimeBased) {
        // Generate time-based mock data
        const timeData = {
          bins: [
            "10:30", "10:40", "10:50", "11:00", "11:10", "11:20", 
            "11:30", "11:40", "11:50", "12:00", "12:10", "12:20", 
            "12:30", "12:40", "12:50", "13:00", "13:10", "13:20", 
            "13:30", "13:40", "13:50", "14:00", "14:10", "14:20", 
            "14:30", "14:40", "14:50", "15:00", "15:10", "15:20"
          ],
          counts: []
        };
        
        // Generate mock counts with a peak in the middle
        for (let i = 0; i < timeData.bins.length; i++) {
          // Create a bell curve with peak in the middle
          const middle = timeData.bins.length / 2;
          const distance = Math.abs(i - middle);
          const height = Math.max(1, Math.floor(30 * Math.exp(-distance * distance / 20)));
          timeData.counts.push(height);
        }
        
        result[id] = {
          metric_id: id,
          computed_on: "2023-10-01T12:00:00",
          stat_value: JSON.stringify(timeData),
          parsedValue: timeData
        };
      } else {
        // Generate numeric range data (for Max Retracement and Max Extension SD)
        const bins = [];
        
        // Create bins from -2.5 to 2.5 with steps of 0.2
        for (let i = -2.5; i <= 2.5; i += 0.2) {
          const binStart = parseFloat(i.toFixed(1));
          const binEnd = parseFloat((i + 0.2).toFixed(1));
          
          // Create a bell curve-like distribution with peak at 0
          const distance = Math.abs(i);
          const height = Math.max(5, Math.floor(150 * Math.exp(-distance * distance)));
          
          bins.push({
            bin: [binStart, binEnd],
            count: height
          });
        }
        
        result[id] = {
          metric_id: id,
          computed_on: "2023-10-01T12:00:00",
          stat_value: JSON.stringify(bins),
          parsedValue: bins
        };
      }
    }
  });
  
  return result;
}

/**
 * Create chart data from metric value
 */
export function createChartData(metric, title) {
  if (!metric) return null;
  
  try {
    const value = metric.parsedValue || [];
    
    // Check if this is a time-based metric
    if (isTimeBasedMetric(metric.metric_id)) {
      // Handle time-based data (format: { bins: [time1, time2, ...], counts: [count1, count2, ...] })
      if (value.bins && value.counts && Array.isArray(value.bins) && Array.isArray(value.counts)) {
        return {
          labels: value.bins,
          datasets: [{
            label: title,
            data: value.counts,
            backgroundColor: value.counts.map(() => '#7A3AEA'),
            borderWidth: 0,
            borderRadius: 4,
            barPercentage: 0.9,
            categoryPercentage: 0.9,
          }]
        };
      }
    }
    
    // Handle bin/count array structure (for Max Retracement and Max Extension SD)
    if (Array.isArray(value) && value.length > 0 && value[0].bin && value[0].count !== undefined) {
      return {
        labels: value.map(item => {
          if (Array.isArray(item.bin)) {
            return `${parseFloat(item.bin[0]).toFixed(1)}`;
          }
          return typeof item.bin === 'number' ? item.bin.toFixed(1) : String(item.bin);
        }),
        datasets: [{
          label: title,
          data: value.map(item => item.count),
          backgroundColor: value.map(() => '#7A3AEA'),
          borderWidth: 0,
          borderRadius: 4,
          barPercentage: 0.9,
          categoryPercentage: 0.9,
        }]
      };
    }
    
    // Handle simple numeric value
    if (typeof value === 'number') {
      return {
        labels: ['Value'],
        datasets: [{
          label: title,
          data: [value],
          backgroundColor: ['#7A3AEA'],
          borderWidth: 0,
          borderRadius: 4,
        }]
      };
    }
    
    // Handle other array types
    if (Array.isArray(value)) {
      return {
        labels: value.map((_, i) => `Item ${i+1}`),
        datasets: [{
          label: title,
          data: value,
          backgroundColor: value.map(() => '#7A3AEA'),
          borderWidth: 0,
          borderRadius: 4,
        }]
      };
    }
  } catch (e) {
    console.error('Error creating chart data:', e);
  }
  
  return null;
}
