/**
 * Helper functions for data processing and calculations
 */

// Process different bin formats
export const processBin = (bin) => {
  // If bin is a string representing an array "[x,y]"
  if (typeof bin === 'string' && bin.startsWith('[') && bin.endsWith(']')) {
    const matches = bin.match(/-?\d+\.?\d*/g);
    if (matches && matches.length === 2) {
      return ((parseFloat(matches[0]) + parseFloat(matches[1])) / 2);
    }
    return 0;
  }
  
  // If bin is a number, return it directly
  return typeof bin === 'number' ? bin : 0;
};

// Calculate average value from an array of numbers
export const calculateAverage = (values) => {
  if (!values || values.length === 0) return 0;
  const sum = values.reduce((acc, val) => acc + val, 0);
  return sum / values.length;
};

// Calculate percentage from a fraction
export const calculatePercentage = (value, total) => {
  if (!total) return 0;
  return (value / total * 100).toFixed(2);
};

// Format large numbers for display
export const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

// Calculate statistics from metric data
export const calculateDashboardStatistics = (statsData) => {
  if (!statsData || Object.keys(statsData).length === 0) {
    return {
      newsDay: '0',
      trendConfidence: '0',
      bestTiming: '0',
      worstTiming: '0%',
      trueConfirmation: '0%'
    };
  }
  
  try {
    // Calculate statistics based on the available stats
    // These are placeholder calculations - replace with your actual logic
    const stats = Object.values(statsData);
    
    return {
      newsDay: '44',
      trendConfidence: '1.7',
      bestTiming: '0.5',
      worstTiming: '77%',
      trueConfirmation: stats[0]?.true_days_percentage?.toFixed(2) + '%' || '67.84%'
    };
  } catch (err) {
    console.error('Error calculating statistics:', err);
    return {
      newsDay: '0',
      trendConfidence: '0',
      bestTiming: '0',
      worstTiming: '0%',
      trueConfirmation: '0%'
    };
  }
};
