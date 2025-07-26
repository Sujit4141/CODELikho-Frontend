import React, { useState } from 'react';

const TrafficDonutChart = () => {
  const [showInfo, setShowInfo] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [devices, setDevices] = useState({
    desktop: true,
    tablet: true,
    mobile: true
  });

  const toggleDevice = (device) => {
    setDevices(prev => ({ ...prev, [device]: !prev[device] }));
  };

  return (
    <div className="max-w-sm w-full bg-white rounded-lg shadow-sm dark:bg-base-300 p-4 md:p-6">
      {/* Header */}
      <div className="flex justify-between mb-3">
        <div className="flex items-center">
          <h5 className="text-xl font-bold text-gray-900 dark:text-white">Website traffic</h5>
          <div className="relative">
            <button 
              onClick={() => setShowInfo(!showInfo)}
              className="text-gray-500 dark:text-gray-400 ml-1"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm0 16a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm1-5.034V12a1 1 0 0 1-2 0v-1.418a1 1 0 0 1 1.038-.999 1.436 1.436 0 0 0 1.488-1.441 1.501 1.501 0 1 0-3-.116.986.986 0 0 1-1.037.961 1 1 0 0 1-.96-1.037A3.5 3.5 0 1 1 11 11.466Z"/>
              </svg>
            </button>
            
            {showInfo && (
              <div className="absolute z-10 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-xl w-72 p-3 mt-2">
                <h3 className="font-semibold text-gray-900 dark:text-white">Activity growth - Incremental</h3>
                <p className="text-sm mt-2">Report helps navigate cumulative growth of community activities.</p>
                <h3 className="font-semibold text-gray-900 dark:text-white mt-3">Calculation</h3>
                <p className="text-sm mt-1">For each date bucket, the all-time volume of activities is calculated.</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="tooltip" data-tip="Download CSV">
          <button className="btn btn-ghost btn-sm">
            <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 18">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 1v11m0 0 4-4m-4 4L4 8m11 4v3a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-3"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Device Filters */}
      <div className="flex mb-4">
        {['desktop', 'tablet', 'mobile'].map((device) => (
          <div key={device} className="flex items-center mr-4">
            <input
              type="checkbox"
              checked={devices[device]}
              onChange={() => toggleDevice(device)}
              className="checkbox checkbox-xs checkbox-primary"
            />
            <label className="ml-2 text-sm font-medium capitalize">{device}</label>
          </div>
        ))}
      </div>

      {/* Chart Placeholder */}
      <div className="py-6 flex justify-center">
        <div className="radial-progress text-primary" 
             style={{"--value":70, "--size":"12rem"}}>
          70%
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-5">
        <div className="flex justify-between">
          <div className="dropdown">
            <button 
              className="btn btn-ghost btn-sm"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              Last 7 days
              <svg className="w-2.5 ml-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
              </svg>
            </button>
            
            {showDropdown && (
              <ul className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-44 mt-1">
                {['Yesterday', 'Today', 'Last 7 days', 'Last 30 days', 'Last 90 days'].map((item) => (
                  <li key={item}><a>{item}</a></li>
                ))}
              </ul>
            )}
          </div>
          
          <a className="btn btn-link btn-sm text-primary">
            Traffic analysis
            <svg className="w-2.5 h-2.5 ml-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};

export default TrafficDonutChart;