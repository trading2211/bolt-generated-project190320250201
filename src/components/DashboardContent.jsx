import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useDataContext } from "../contexts/DataContext";
import StatisticsCard from "./StatisticsCard";
import Chart from "./Chart";
import { METRIC_TYPES } from "../constants/metrics";
import "./DashboardContent.css";

// Default chart metric IDs for each position
const DEFAULT_METRICS = {
  MAX_RETRACEMENT: 22,       // Top-left
  MAX_RETRACEMENT_TIME: 472, // Top-right
  MAX_EXTENSION_SD: 322,     // Bottom-left
  MAX_EXTENSION_TIME: 622    // Bottom-right
};

// Default statistics
const DEFAULT_STATISTICS = {
  newsDay: '44',
  trendConfidence: '1.7',
  bestTiming: '0.5',
  worstTiming: '77%',
  trueConfirmation: '67.84%'
};

const DashboardContent = () => {
  // State for metric IDs and statistics
  const [metrics, setMetrics] = useState({
    ids: [DEFAULT_METRICS.MAX_RETRACEMENT, DEFAULT_METRICS.MAX_RETRACEMENT_TIME, 
          DEFAULT_METRICS.MAX_EXTENSION_SD, DEFAULT_METRICS.MAX_EXTENSION_TIME],
    stats: DEFAULT_STATISTICS
  });
  
  // Access auth and context safely
  const auth = useAuth() || {};
  const context = useDataContext() || {};
  
  // Extract needed values with defaults
  const activeDay = context.activeDay || null;
  const activeTimes = context.activeTimes || [];
  const activeActions = context.activeActions || [];
  const selectedMetricIds = context.selectedMetricIds || [];
  const error = context.error || null;
  
  // Update metrics when the filters change
  useEffect(() => {
    // Only proceed if context is available and has required functions
    if (!context || typeof context.getMetricIdsForChartType !== 'function') {
      return;
    }
    
    try {
      // Get IDs for each chart type
      const getIds = (type) => {
        try {
          const ids = context.getMetricIdsForChartType(type);
          return Array.isArray(ids) && ids.length > 0 ? ids[0] : DEFAULT_METRICS[type];
        } catch (e) {
          console.error(`Error getting IDs for ${type}:`, e);
          return DEFAULT_METRICS[type];
        }
      };
      
      // Get updated metric IDs
      const maxRetracementId = getIds('MAX_RETRACEMENT');
      const maxRetracementTimeId = getIds('MAX_RETRACEMENT_TIME');
      const maxExtensionSdId = getIds('MAX_EXTENSION_SD');
      const maxExtensionTimeId = getIds('MAX_EXTENSION_TIME');
      
      // Update metrics state with new IDs
      setMetrics(prev => ({
        ...prev,
        ids: [maxRetracementId, maxRetracementTimeId, maxExtensionSdId, maxExtensionTimeId]
      }));
      
      // Update statistics if calculateStatistics is available
      if (typeof context.calculateStatistics === 'function') {
        const stats = context.calculateStatistics();
        if (stats) {
          setMetrics(prev => ({ ...prev, stats }));
        }
      }
    } catch (e) {
      console.error("Error updating metrics:", e);
    }
  }, [context, activeDay, activeTimes, activeActions, context.metricsData]);
  
  // Call getRelevantMetricIds when component mounts
  useEffect(() => {
    if (context && typeof context.getRelevantMetricIds === 'function') {
      try {
        context.getRelevantMetricIds();
      } catch (e) {
        console.error("Error getting relevant metrics:", e);
      }
    }
  }, [context]);
  
  // Safely get active filters text
  const getActiveFiltersText = () => {
    const filters = [];
    
    if (activeDay) {
      filters.push(<span key="day" className="filter-item">Day: {activeDay}</span>);
    }
    
    if (Array.isArray(activeTimes) && activeTimes.length > 0) {
      filters.push(
        <span key="times" className="filter-item">Times: {activeTimes.join(', ')}</span>
      );
    }
    
    if (Array.isArray(activeActions) && activeActions.length > 0) {
      filters.push(
        <span key="actions" className="filter-item">Actions: {activeActions.join(', ')}</span>
      );
    }
    
    if (filters.length === 0) {
      return <span className="filter-item">No active filters</span>;
    }
    
    return filters;
  };

  return (
    <div className="dashboard-content">
      <div className="statistics">
        <StatisticsCard title="News Day" value={metrics.stats.newsDay} />
        <StatisticsCard title="Trend Confidence" value={metrics.stats.trendConfidence} />
        <StatisticsCard title="Best Timing" value={metrics.stats.bestTiming} />
        <StatisticsCard title="Worst Timing" value={metrics.stats.worstTiming} />
        <StatisticsCard title="True Confirmation" value={metrics.stats.trueConfirmation} />
      </div>
      
      {error && (
        <div className="error-message">
          Error loading data: {error}
        </div>
      )}
      
      <div className="metrics-info">
        <div className="panel">
          <h3>Available Metrics</h3>
          <p>{Array.isArray(selectedMetricIds) ? selectedMetricIds.length : 4} metrics matching current filters</p>
          <div className="metric-ids">
            Showing metrics: {Array.isArray(selectedMetricIds) && selectedMetricIds.length > 0 
              ? selectedMetricIds.slice(0, Math.min(4, selectedMetricIds.length)).join(', ')
              : metrics.ids.join(', ')}
          </div>
          <div className="filter-status">
            <span>Filters: </span>
            {getActiveFiltersText()}
          </div>
        </div>
      </div>
      
      <div className="charts-grid">
        {/* Top Left: Max Retracement */}
        <div className="chart-container">
          <Chart 
            metricId={metrics.ids[0]} 
            key={`max-retracement-${metrics.ids[0]}-${activeDay || 'default'}`} 
          />
        </div>
        
        {/* Top Right: Max Retracement Time */}
        <div className="chart-container">
          <Chart 
            metricId={metrics.ids[1]}
            key={`max-retracement-time-${metrics.ids[1]}-${activeDay || 'default'}`}
          />
        </div>
        
        {/* Bottom Left: Max Extension SD */}
        <div className="chart-container">
          <Chart 
            metricId={metrics.ids[2]}
            key={`max-extension-sd-${metrics.ids[2]}-${activeDay || 'default'}`}
          />
        </div>
        
        {/* Bottom Right: Max Extension Time */}
        <div className="chart-container">
          <Chart 
            metricId={metrics.ids[3]}
            key={`max-extension-time-${metrics.ids[3]}-${activeDay || 'default'}`}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;
