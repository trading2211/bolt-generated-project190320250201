import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { fetchMetricsByIds } from '../lib/metricService';
import { mockStatistics } from '../lib/mockData';
import { 
  findMetricId, 
  METRIC_TYPES
} from '../constants/metrics';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  // Filter states
  const [activeDay, setActiveDay] = useState(null);
  const [activeTimes, setActiveTimes] = useState([]);
  const [activeActions, setActiveActions] = useState([]);
  
  // Data states
  const [selectedMetricIds, setSelectedMetricIds] = useState([]); 
  const [metricsData, setMetricsData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Cache for queries
  const [queryCache, setQueryCache] = useState({});

  // Generate cache key based on current filters
  const getCacheKey = useCallback(() => {
    return `${activeDay || 'all'}-${activeTimes.join(',')}-${activeActions.join(',')}`;
  }, [activeDay, activeTimes, activeActions]);

  // Get all metric IDs for the four chart types based on active filters
  const getRelevantMetricIds = useCallback(() => {
    try {
      // Convert activeActions to direction format (long, short, global)
      const directions = activeActions.length > 0 
        ? activeActions.map(action => {
            if (action.toLowerCase() === 'long') return 'long';
            if (action.toLowerCase() === 'short') return 'short';
            if (action.toLowerCase() === 'true' || action.toLowerCase() === 'false') return 'global';
            return action.toLowerCase();
          })
        : ['global'];

      // Use time periods directly from activeTimes
      // They're already in the correct format: "10:30-10:40", etc.
      const timePeriods = activeTimes.length > 0 ? activeTimes : ['global'];

      // The day to use
      const day = activeDay || 'monday';
      
      // Get metrics for each chart type
      const allMetricIds = [];
      
      // For each combination of filters
      timePeriods.forEach(timePeriod => {
        directions.forEach(direction => {
          // Get metrics for each of the four chart types
          allMetricIds.push(findMetricId(METRIC_TYPES.MAX_RETRACEMENT, day, timePeriod, direction));
          allMetricIds.push(findMetricId(METRIC_TYPES.MAX_RETRACEMENT_TIME, day, timePeriod, direction));
          allMetricIds.push(findMetricId(METRIC_TYPES.MAX_EXTENSION_SD, day, timePeriod, direction));
          allMetricIds.push(findMetricId(METRIC_TYPES.MAX_EXTENSION_TIME, day, timePeriod, direction));
        });
      });
      
      // Filter out any duplicates
      return [...new Set(allMetricIds)];
    } catch (err) {
      console.error("Error getting relevant metric IDs:", err);
      // Return default metrics for the four chart types
      return [
        22,  // Max Retracement (Monday, global, global)
        472, // Max Retracement Time (Monday, global, global)
        322, // Max Extension SD (Monday, global, global)
        622  // Max Extension Time (Monday, global, global)
      ];
    }
  }, [activeDay, activeTimes, activeActions]);

  // Get metric IDs for a specific chart type based on current filters
  const getMetricIdsForChartType = useCallback((metricType) => {
    if (!metricType) return [];
    
    try {
      // Convert activeActions to direction format
      const directions = activeActions.length > 0 
        ? activeActions.map(action => {
            if (action.toLowerCase() === 'long') return 'long';
            if (action.toLowerCase() === 'short') return 'short';
            if (action.toLowerCase() === 'true' || action.toLowerCase() === 'false') return 'global';
            return action.toLowerCase();
          })
        : ['global'];

      // Use time periods directly from activeTimes
      const timePeriods = activeTimes.length > 0 ? activeTimes : ['global'];
      
      // The day to use
      const day = activeDay || 'monday';
      
      // Get relevant metrics
      const metricIds = [];
      
      // For each combination of filters
      timePeriods.forEach(timePeriod => {
        directions.forEach(direction => {
          const metricId = findMetricId(metricType, day, timePeriod, direction);
          metricIds.push(metricId);
        });
      });
      
      return metricIds;
    } catch (err) {
      console.error(`Error getting metrics for ${metricType}:`, err);
      
      // Default IDs for each type
      if (metricType === METRIC_TYPES.MAX_RETRACEMENT) return [22];
      if (metricType === METRIC_TYPES.MAX_RETRACEMENT_TIME) return [472];
      if (metricType === METRIC_TYPES.MAX_EXTENSION_SD) return [322];
      if (metricType === METRIC_TYPES.MAX_EXTENSION_TIME) return [622];
      
      return [];
    }
  }, [activeDay, activeTimes, activeActions]);

  // Load metrics by IDs
  const loadMetrics = useCallback(async (metricIds) => {
    if (!metricIds || metricIds.length === 0) return;
    
    // Generate cache key
    const cacheKey = getCacheKey();
    
    // Check cache first
    if (queryCache[cacheKey]) {
      setMetricsData(queryCache[cacheKey]);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchMetricsByIds(metricIds);
      
      // Update cache and state
      setMetricsData(data);
      setQueryCache(prev => ({
        ...prev,
        [cacheKey]: data
      }));
    } catch (err) {
      setError(`Failed to load metrics: ${err.message}`);
      console.error("Error loading metrics:", err);
    } finally {
      setLoading(false);
    }
  }, [getCacheKey, queryCache]);

  // Calculate dashboard statistics based on current filters
  const calculateStatistics = useCallback(() => {
    try {
      // Get True Confirmation metric ID based on current filters
      const trueConfirmationMetricId = findMetricId(
        METRIC_TYPES.TRUE_DAY_PERCENTAGE, 
        activeDay || 'monday', 
        activeTimes.length > 0 ? activeTimes[0] : 'global',
        activeActions.length > 0 ? activeActions[0].toLowerCase() : 'global'
      );
      
      const trueConfirmationMetric = trueConfirmationMetricId ? metricsData[trueConfirmationMetricId] : null;
      
      // Use mock statistics as fallback
      return {
        newsDay: mockStatistics.newsDay,
        trendConfidence: mockStatistics.trendConfidence,
        bestTiming: mockStatistics.bestTiming,
        worstTiming: mockStatistics.worstTiming,
        trueConfirmation: trueConfirmationMetric && trueConfirmationMetric.parsedValue ? 
          `${(parseFloat(trueConfirmationMetric.parsedValue) * 100).toFixed(2)}%` : 
          mockStatistics.trueConfirmation
      };
    } catch (err) {
      console.error('Error calculating statistics:', err);
      return mockStatistics;
    }
  }, [activeDay, activeTimes, activeActions, metricsData]);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setActiveDay(null);
    setActiveTimes([]);
    setActiveActions([]);
  }, []);

  // Toggle time filter
  const toggleTime = useCallback((time) => {
    if (activeTimes.includes(time)) {
      setActiveTimes(activeTimes.filter(t => t !== time));
    } else {
      setActiveTimes([...activeTimes, time]);
    }
  }, [activeTimes]);

  // Toggle action filter
  const toggleAction = useCallback((action) => {
    if (activeActions.includes(action)) {
      setActiveActions(activeActions.filter(a => a !== action));
    } else {
      setActiveActions([...activeActions, action]);
    }
  }, [activeActions]);

  // Update metrics when filters change
  useEffect(() => {
    const metricIds = getRelevantMetricIds();
    setSelectedMetricIds(metricIds);
    loadMetrics(metricIds);
  }, [activeDay, activeTimes, activeActions, getRelevantMetricIds, loadMetrics]);

  const contextValue = {
    activeDay, 
    setActiveDay,
    activeTimes,
    toggleTime,
    activeActions,
    toggleAction,
    selectedMetricIds,
    metricsData,
    loading,
    error,
    clearFilters,
    calculateStatistics,
    getRelevantMetricIds,
    getMetricIdsForChartType
  };

  return (
    <DataContext.Provider value={contextValue}>
      {children}
    </DataContext.Provider>
  );
};

export const useDataContext = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useDataContext must be used within a DataProvider');
  }
  return context;
};
