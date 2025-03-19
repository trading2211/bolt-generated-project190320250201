import React, { useEffect, useState, useRef } from "react";
import { Bar } from "react-chartjs-2";
import { useDataContext } from "../contexts/DataContext";
import { getMetricTitle } from "../constants/metrics";
import { createChartData, isTimeBasedMetric } from "../lib/metricService";
import { mockMetricsData } from "../lib/mockData";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "./Chart.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

function Chart({ metricId }) {
  const [chartData, setChartData] = useState(null);
  const [chartError, setChartError] = useState(null);
  const chartContainerRef = useRef(null);
  
  // Access context with safe defaults
  const context = useDataContext() || {};
  const activeDay = context.activeDay || null;
  const metricsData = context.metricsData || {};
  const loading = context.loading || false;

  // Get a title for the metric, with fallback
  const title = metricId ? getMetricTitle(metricId) : "Chart";
  
  // Check if this is a time-based metric
  const isTimeBased = isTimeBasedMetric(metricId);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(139, 92, 246, 0.1)',
          drawBorder: false,
        },
        ticks: {
          color: '#94A3B8',
          font: { size: 11 },
          padding: 5,
        },
        border: { display: false },
      },
      x: {
        grid: { display: false },
        ticks: {
          color: '#94A3B8',
          font: { size: 11 },
          maxRotation: isTimeBased ? 45 : 0, // Rotate time labels for readability
          minRotation: 0,
          autoSkip: isTimeBased, // Skip some labels for time-based charts
          maxTicksLimit: isTimeBased ? 12 : 20,
        },
        border: { display: false },
      }
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(88, 28, 135, 0.9)',
        titleColor: '#fff',
        bodyColor: '#fff',
        padding: 8,
        titleFont: { size: 12 },
        bodyFont: { size: 12 },
        displayColors: false,
        callbacks: {
          title: (tooltipItems) => isTimeBased 
            ? `Time: ${tooltipItems[0].label}`
            : `Value: ${tooltipItems[0].label}`,
          label: (context) => `Count: ${context.parsed.y}`,
        }
      },
      title: {
        display: true,
        text: activeDay ? `${title} - ${activeDay.charAt(0).toUpperCase() + activeDay.slice(1)}` : title,
        color: '#fff',
        font: {
          size: 14,
          weight: 'normal',
        },
        padding: { bottom: 10 },
      }
    },
    layout: {
      padding: {
        left: 5,
        right: 5,
        top: 10,
        bottom: isTimeBased ? 30 : 20, // More padding for time-based charts
      }
    }
  };

  // Process the metric data to create chart data
  const prepareChartData = () => {
    setChartError(null);
    
    if (!metricId) {
      setChartError("No metric ID provided");
      return;
    }
    
    try {
      // Try to get metric from context data
      let metric = metricsData[metricId];
      
      // If not found in context data, try mock data as fallback
      if (!metric && mockMetricsData[metricId]) {
        metric = {
          ...mockMetricsData[metricId],
          parsedValue: JSON.parse(mockMetricsData[metricId].stat_value)
        };
      }
      
      // If still no metric data available, generate dynamic mock data
      if (!metric) {
        // This will be handled by the createChartData function
        metric = {
          metric_id: metricId,
          computed_on: "2023-10-01T12:00:00",
          // We'll let createChartData generate appropriate mock data based on metric type
        };
      }
      
      // Create chart data
      let data = createChartData(metric, title);
      
      if (data) {
        setChartData(data);
      } else {
        setChartError(`Failed to create chart for metric ID ${metricId}`);
      }
    } catch (error) {
      console.error('Error preparing chart data:', error);
      setChartError(`Error preparing chart: ${error.message}`);
    }
  };

  // Scroll to middle of chart when data loads
  useEffect(() => {
    if (chartData && chartContainerRef.current) {
      // Wait a moment for the chart to render
      const timeout = setTimeout(() => {
        const container = chartContainerRef.current;
        if (container) {
          // Get the scrollable width and set scroll position to middle
          const scrollWidth = container.scrollWidth;
          const clientWidth = container.clientWidth;
          
          if (scrollWidth > clientWidth) {
            container.scrollLeft = (scrollWidth - clientWidth) / 2;
          }
        }
      }, 200); // Slightly longer timeout to ensure chart is fully rendered
      
      return () => clearTimeout(timeout);
    }
  }, [chartData]);

  // Update chart when metric ID or data changes
  useEffect(() => {
    prepareChartData();
  }, [metricId, activeDay, metricsData]);

  if (chartError) {
    return (
      <div className="chart">
        <div className="error-message">
          <div className="error-title">{title}</div>
          <div className="error-details">
            {chartError}
            <div className="metric-id">ID: {metricId}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="chart">
      {chartData ? (
        <div className="chart-scrollable-container" ref={chartContainerRef}>
          <div className="chart-inner-container">
            <Bar data={chartData} options={options} />
          </div>
        </div>
      ) : (
        <div className="loading">
          {loading ? 'Loading data...' : 'No data available'}
        </div>
      )}
    </div>
  );
}

export default Chart;
