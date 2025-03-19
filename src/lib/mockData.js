// Mock data for development and fallback when database is unavailable
export const mockMetricsData = {
  // Metric ID 22: Max Retracement, Monday, global, global
  22: {
    metric_id: 22,
    computed_on: "2023-10-01T12:00:00",
    stat_value: JSON.stringify([
      { bin: [-2.2, -2.1], count: 5 },
      { bin: [-2.0, -1.9], count: 8 },
      { bin: [-1.8, -1.7], count: 12 },
      { bin: [-1.6, -1.5], count: 18 },
      { bin: [-1.4, -1.3], count: 24 },
      { bin: [-1.2, -1.1], count: 35 },
      { bin: [-1.0, -0.9], count: 48 },
      { bin: [-0.8, -0.7], count: 67 },
      { bin: [-0.6, -0.5], count: 89 },
      { bin: [-0.4, -0.3], count: 112 },
      { bin: [-0.2, -0.1], count: 145 },
      { bin: [0.0, 0.1], count: 98 },
      { bin: [0.2, 0.3], count: 64 },
      { bin: [0.4, 0.5], count: 32 },
      { bin: [0.6, 0.7], count: 18 },
      { bin: [0.8, 0.9], count: 9 },
      { bin: [1.0, 1.1], count: 4 }
    ])
  },
  
  // Metric ID 472: Max Retracement Time, Monday, global, global
  472: {
    metric_id: 472,
    computed_on: "2023-10-01T12:00:00",
    stat_value: JSON.stringify({
      bins: [
        "10:30", "10:40", "10:50", "11:00", "11:10", "11:20", 
        "11:30", "11:40", "11:50", "12:00", "12:10", "12:20", 
        "12:30", "12:40", "12:50", "13:00", "13:10", "13:20", 
        "13:30", "13:40", "13:50", "14:00", "14:10", "14:20", 
        "14:30", "14:40", "14:50", "15:00", "15:10", "15:20"
      ],
      counts: [5, 8, 12, 18, 24, 35, 48, 67, 89, 112, 89, 67, 48, 35, 24, 18, 12, 8, 5, 8, 12, 18, 24, 35, 48, 67, 48, 35, 24, 18]
    })
  },
  
  // Metric ID 322: Max Extension SD, Monday, global, global
  322: {
    metric_id: 322,
    computed_on: "2023-10-01T12:00:00",
    stat_value: JSON.stringify([
      { bin: [0.0, 0.5], count: 35 },
      { bin: [0.5, 1.0], count: 78 },
      { bin: [1.0, 1.5], count: 120 },
      { bin: [1.5, 2.0], count: 187 },
      { bin: [2.0, 2.5], count: 145 },
      { bin: [2.5, 3.0], count: 98 },
      { bin: [3.0, 3.5], count: 62 },
      { bin: [3.5, 4.0], count: 35 },
      { bin: [4.0, 4.5], count: 18 },
      { bin: [4.5, 5.0], count: 8 }
    ])
  },
  
  // Metric ID 622: Max Extension Time, Monday, global, global
  622: {
    metric_id: 622,
    computed_on: "2023-10-01T12:00:00",
    stat_value: JSON.stringify({
      bins: [
        "10:30", "10:40", "10:50", "11:00", "11:10", "11:20", 
        "11:30", "11:40", "11:50", "12:00", "12:10", "12:20", 
        "12:30", "12:40", "12:50", "13:00", "13:10", "13:20", 
        "13:30", "13:40", "13:50", "14:00", "14:10", "14:20", 
        "14:30", "14:40", "14:50", "15:00", "15:10", "15:20"
      ],
      counts: [5, 8, 12, 18, 24, 35, 48, 67, 89, 112, 89, 67, 48, 35, 24, 18, 12, 8, 5, 8, 12, 18, 24, 35, 48, 67, 48, 35, 24, 18]
    })
  }
};

// Statistics for the dashboard
export const mockStatistics = {
  newsDay: '44',
  trendConfidence: '1.7',
  bestTiming: '0.5',
  worstTiming: '77%',
  trueConfirmation: '67.84%'
};
