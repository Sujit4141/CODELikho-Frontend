import React, { useState } from 'react';

export default function Submissiontab({ usersubmisiion }) {
  const [expandedId, setExpandedId] = useState(null);
  
  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Format memory from bytes to MB
  const formatMemory = (bytes) => {
    return (bytes / 1024).toFixed(1) + ' MB';
  };

  // Format date to readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Determine status color classes
  const getStatusColor = (status) => {
    const statusLower = status.toLowerCase();
    if (statusLower.includes('accepted')) {
      return 'bg-green-900 text-green-300';
    } 
    if (statusLower.includes('error') || statusLower.includes('wrong')) {
      return 'bg-red-900 text-red-300';
    }
    return 'bg-gray-800 text-gray-300';
  };

  return (
    <div className="bg-gray-900 rounded-xl p-4 border border-gray-800 shadow-2xl">
      <h2 className="text-2xl font-bold mb-6 text-blue-400 border-b border-gray-800 pb-3 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Your Submissions
      </h2>

      {!usersubmisiion || usersubmisiion.length === 0 ? (
        <div className="text-center py-12 bg-gray-800 rounded-xl border border-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-xl font-semibold text-gray-300 mb-2">No Submissions Yet</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            Submit your solution to see your submissions here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {usersubmisiion.map((item) => (
            <div 
              key={item._id} 
              className={`bg-gray-800 rounded-lg border transition-all duration-300 overflow-hidden ${
                expandedId === item._id 
                  ? 'border-blue-500 shadow-lg' 
                  : 'border-gray-700 hover:border-gray-600 hover:shadow-md'
              }`}
            >
              <div 
                className="p-4 cursor-pointer grid grid-cols-2 md:grid-cols-5 gap-4 items-center"
                onClick={() => toggleExpand(item._id)}
              >
                <div className="md:col-span-2">
                  <div className="text-gray-300 font-medium">{formatDate(item.createdAt)}</div>
                  <div className="text-sm text-gray-500">Language: {item.language}</div>
                </div>
                
                <div className={`px-3 py-1 rounded-full ${getStatusColor(item.status)}`}>
                  {item.status}
                </div>
                
                <div>
                  <div className="text-gray-300 font-medium">{item.runtime} ms</div>
                  <div className="text-xs text-gray-500">Runtime</div>
                </div>
                
                <div>
                  <div className="text-gray-300 font-medium">{formatMemory(item.memory)}</div>
                  <div className="text-xs text-gray-500">Memory</div>
                </div>
                
                <div className="absolute right-4">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className={`h-5 w-5 text-gray-500 transform transition-transform ${
                      expandedId === item._id ? 'rotate-180' : ''
                    }`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              
              {expandedId === item._id && (
                <div className="border-t border-gray-700 bg-gray-850 p-4 animate-fadeIn">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-gray-400 font-semibold mb-2 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                        </svg>
                        Code
                      </h3>
                      <pre className="bg-gray-900 p-4 rounded-lg text-gray-300 text-sm overflow-x-auto max-h-64">
                        {item.code}
                      </pre>
                    </div>
                    
                    <div>
                      <h3 className="text-gray-400 font-semibold mb-2 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Details
                      </h3>
                      <div className="bg-gray-900 p-4 rounded-lg">
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Test Cases:</span>
                            <span className="text-gray-300 font-medium">
                              {item.testCasesPassed}/{item.testCasesTotal}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Submission ID:</span>
                            <span className="text-gray-300 font-mono">{item._id}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Problem ID:</span>
                            <span className="text-gray-300">{item.problemId}</span>
                          </div>
                          
                          {item.errorMessage && (
                            <div className="mt-4 pt-3 border-t border-gray-800">
                              <h4 className="text-red-400 font-medium mb-2">Error Message:</h4>
                              <div className="text-sm text-red-300 bg-red-900/30 p-3 rounded">
                                {item.errorMessage}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-end">
                    <button 
                      onClick={() => toggleExpand(item._id)}
                      className="px-4 py-2 text-sm bg-gray-700 hover:bg-gray-600 rounded-lg text-gray-300 transition-colors"
                    >
                      Close Details
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}