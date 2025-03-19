import React from "react";
import { Link } from "react-router-dom";
import { useDataContext } from "../contexts/DataContext";
import "./Sidebar.css";

const Sidebar = () => {
  const { 
    activeDay, 
    setActiveDay, 
    activeTimes, 
    toggleTime, 
    activeActions, 
    toggleAction,
    clearFilters
  } = useDataContext();
  
  // Updated to use time ranges instead of individual times
  const timeRanges = [
    "10:30-10:40", 
    "10:40-10:50", 
    "10:50-11:00", 
    "11:00-11:10", 
    "11:10-11:20",
    "11:20-11:30", 
    "11:30-11:40", 
    "11:40-11:50", 
    "11:50-12:00"
  ];

  const handleDayToggle = (day) => {
    setActiveDay(activeDay === day ? null : day);
  };

  return (
    <div className="sidebar">
      <select className="dropdown">
        <option>E6 - Euro FX Future</option>
      </select>
      <div className="filters">
        <button 
          className={`day-button ${activeDay === 'monday' ? 'active' : ''}`}
          onClick={() => handleDayToggle('monday')}
        >
          Mon
        </button>
        <button 
          className={`day-button ${activeDay === 'tuesday' ? 'active' : ''}`}
          onClick={() => handleDayToggle('tuesday')}
        >
          Tue
        </button>
        <button 
          className={`day-button ${activeDay === 'wednesday' ? 'active' : ''}`}
          onClick={() => handleDayToggle('wednesday')}
        >
          Wed
        </button>
        <button 
          className={`day-button ${activeDay === 'thursday' ? 'active' : ''}`}
          onClick={() => handleDayToggle('thursday')}
        >
          Thu
        </button>
        <button 
          className={`day-button ${activeDay === 'friday' ? 'active' : ''}`}
          onClick={() => handleDayToggle('friday')}
        >
          Fri
        </button>
      </div>
      <div className="time-buttons">
        {timeRanges.map((timeRange) => (
          <button 
            key={timeRange} 
            className={`time-button ${activeTimes.includes(timeRange) ? 'active' : ''}`}
            onClick={() => toggleTime(timeRange)}
          >
            {timeRange}
          </button>
        ))}
      </div>
      <div className="action-buttons">
        <button 
          className={`action-button ${activeActions.includes('Long') ? 'active' : ''}`}
          onClick={() => toggleAction('Long')}
        >
          Long
        </button>
        <button 
          className={`action-button ${activeActions.includes('Short') ? 'active' : ''}`}
          onClick={() => toggleAction('Short')}
        >
          Short
        </button>
        <button 
          className={`action-button ${activeActions.includes('True') ? 'active' : ''}`}
          onClick={() => toggleAction('True')}
        >
          True
        </button>
        <button 
          className={`action-button ${activeActions.includes('False') ? 'active' : ''}`}
          onClick={() => toggleAction('False')}
        >
          False
        </button>
      </div>
      <button className="action-button" onClick={clearFilters}>Clear Filter</button>
      <button className="action-button">Settings</button>
      <div className="navigation">
        <Link to="/">
          <button className="navigation-button">Go to Welcome Page</button>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
