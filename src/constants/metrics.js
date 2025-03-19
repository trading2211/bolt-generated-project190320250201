// Metrics mapping and utility functions

// Define metric types
export const METRIC_TYPES = {
  MAX_RETRACEMENT: 'Max Retracement',
  MAX_RETRACEMENT_TIME: 'Max Retracement Time',
  MAX_EXTENSION_SD: 'Max Extension SD',
  MAX_EXTENSION_TIME: 'Max Extension Time',
  TRUE_DAY_PERCENTAGE: 'True Day Percentage'
};

// Define days
export const DAYS = {
  MONDAY: 'monday',
  TUESDAY: 'tuesday',
  WEDNESDAY: 'wednesday',
  THURSDAY: 'thursday',
  FRIDAY: 'friday'
};

// Define time periods
export const TIME_PERIODS = {
  GLOBAL: 'global',
  TIME_10_30_10_40: '10:30-10:40',
  TIME_10_40_10_50: '10:40-10:50',
  TIME_10_50_11_00: '10:50-11:00',
  TIME_11_00_11_10: '11:00-11:10',
  TIME_11_10_11_20: '11:10-11:20',
  TIME_11_20_11_30: '11:20-11:30',
  TIME_11_30_11_40: '11:30-11:40',
  TIME_11_40_11_50: '11:40-11:50',
  TIME_11_50_12_00: '11:50-12:00'
};

// Define directions
export const DIRECTIONS = {
  GLOBAL: 'global',
  LONG: 'long',
  SHORT: 'short'
};

// Export metric mapping - this was missing!
export const metricMapping = {
  // Max Retracement (22-171)
  22: { type: METRIC_TYPES.MAX_RETRACEMENT, day: DAYS.MONDAY, timePeriod: TIME_PERIODS.GLOBAL, direction: DIRECTIONS.GLOBAL },
  23: { type: METRIC_TYPES.MAX_RETRACEMENT, day: DAYS.MONDAY, timePeriod: TIME_PERIODS.GLOBAL, direction: DIRECTIONS.LONG },
  24: { type: METRIC_TYPES.MAX_RETRACEMENT, day: DAYS.MONDAY, timePeriod: TIME_PERIODS.GLOBAL, direction: DIRECTIONS.SHORT },
  25: { type: METRIC_TYPES.MAX_RETRACEMENT, day: DAYS.MONDAY, timePeriod: TIME_PERIODS.TIME_10_30_10_40, direction: DIRECTIONS.GLOBAL },
  
  // Max Retracement Time (472-621)
  472: { type: METRIC_TYPES.MAX_RETRACEMENT_TIME, day: DAYS.MONDAY, timePeriod: TIME_PERIODS.GLOBAL, direction: DIRECTIONS.GLOBAL },
  473: { type: METRIC_TYPES.MAX_RETRACEMENT_TIME, day: DAYS.MONDAY, timePeriod: TIME_PERIODS.GLOBAL, direction: DIRECTIONS.LONG },
  474: { type: METRIC_TYPES.MAX_RETRACEMENT_TIME, day: DAYS.MONDAY, timePeriod: TIME_PERIODS.GLOBAL, direction: DIRECTIONS.SHORT },
  
  // Max Extension SD (322-471)
  322: { type: METRIC_TYPES.MAX_EXTENSION_SD, day: DAYS.MONDAY, timePeriod: TIME_PERIODS.GLOBAL, direction: DIRECTIONS.GLOBAL },
  323: { type: METRIC_TYPES.MAX_EXTENSION_SD, day: DAYS.MONDAY, timePeriod: TIME_PERIODS.GLOBAL, direction: DIRECTIONS.LONG },
  324: { type: METRIC_TYPES.MAX_EXTENSION_SD, day: DAYS.MONDAY, timePeriod: TIME_PERIODS.GLOBAL, direction: DIRECTIONS.SHORT },
  
  // Max Extension Time (622-771)
  622: { type: METRIC_TYPES.MAX_EXTENSION_TIME, day: DAYS.MONDAY, timePeriod: TIME_PERIODS.GLOBAL, direction: DIRECTIONS.GLOBAL },
  623: { type: METRIC_TYPES.MAX_EXTENSION_TIME, day: DAYS.MONDAY, timePeriod: TIME_PERIODS.GLOBAL, direction: DIRECTIONS.LONG },
  624: { type: METRIC_TYPES.MAX_EXTENSION_TIME, day: DAYS.MONDAY, timePeriod: TIME_PERIODS.GLOBAL, direction: DIRECTIONS.SHORT },
  
  // Add more mappings as needed
};

// Helper function to find a metric ID based on parameters
export function findMetricId(metricType, day, timePeriod = 'global', direction = 'global') {
  // Normalize inputs
  day = day.toLowerCase();
  timePeriod = timePeriod.toLowerCase();
  direction = direction.toLowerCase();
  
  // Find the corresponding metric ID based on given parameters
  
  // These are approximations - the actual mapping should be more precise
  // This is based on the pattern observed in your metric IDs list
  
  let baseId = 0;
  
  // Set base ID for metric type
  if (metricType === METRIC_TYPES.MAX_RETRACEMENT) {
    baseId = 22; // Metrics 22-171
  } else if (metricType === METRIC_TYPES.TRUE_DAY_PERCENTAGE) {
    baseId = 172; // Metrics 172-321
  } else if (metricType === METRIC_TYPES.MAX_EXTENSION_SD) {
    baseId = 322; // Metrics 322-471
  } else if (metricType === METRIC_TYPES.MAX_RETRACEMENT_TIME) {
    baseId = 472; // Metrics 472-621
  } else if (metricType === METRIC_TYPES.MAX_EXTENSION_TIME) {
    baseId = 622; // Metrics 622-771
  }
  
  // Add offsets for day
  const dayOffset = {
    'monday': 0,
    'tuesday': 30,
    'wednesday': 60,
    'thursday': 90,
    'friday': 120
  }[day] || 0;
  
  // Add offsets for time period
  const timePeriodOffset = {
    'global': 0,
    '10:30-10:40': 3,
    '10:40-10:50': 6,
    '10:50-11:00': 9,
    '11:00-11:10': 12,
    '11:10-11:20': 15,
    '11:20-11:30': 18,
    '11:30-11:40': 21,
    '11:40-11:50': 24,
    '11:50-12:00': 27
  }[timePeriod] || 0;
  
  // Add offsets for direction
  const directionOffset = {
    'global': 0,
    'long': 1,
    'short': 2
  }[direction] || 0;
  
  // Calculate final ID
  const metricId = baseId + dayOffset + timePeriodOffset + directionOffset;
  
  return metricId;
}

// Gets a human-readable title for a metric ID
export function getMetricTitle(metricId) {
  // Get the general type based on metric ID ranges
  let metricType;
  if (metricId >= 22 && metricId <= 171) {
    metricType = METRIC_TYPES.MAX_RETRACEMENT;
  } else if (metricId >= 172 && metricId <= 321) {
    metricType = METRIC_TYPES.TRUE_DAY_PERCENTAGE;
  } else if (metricId >= 322 && metricId <= 471) {
    metricType = METRIC_TYPES.MAX_EXTENSION_SD;
  } else if (metricId >= 472 && metricId <= 621) {
    metricType = METRIC_TYPES.MAX_RETRACEMENT_TIME;
  } else if (metricId >= 622 && metricId <= 771) {
    metricType = METRIC_TYPES.MAX_EXTENSION_TIME;
  } else {
    return `Metric ${metricId}`;
  }
  
  return metricType;
}

// Gets all metric IDs for a specific type that match the given filters
export function getFilteredMetricIdsByType(metricType, day, timePeriod, direction) {
  if (!metricType) return [];
  
  // If no day specified, use all days
  const days = day ? [day] : Object.values(DAYS);
  
  // If no time period specified, use global
  const timePeriods = timePeriod ? [timePeriod] : [TIME_PERIODS.GLOBAL];
  
  // If no direction specified, use global
  const directions = direction ? [direction] : [DIRECTIONS.GLOBAL];
  
  // Build the list of relevant metric IDs
  const metricIds = [];
  
  // For each combination, find the metric ID
  days.forEach(d => {
    timePeriods.forEach(t => {
      directions.forEach(dr => {
        const metricId = findMetricId(metricType, d, t, dr);
        metricIds.push(metricId);
      });
    });
  });
  
  return metricIds;
}
