/**
 * Xtreme Serverless OOB - Live Log Component
 * Developed by p0intsec (06/2025)
 * MIT Licensed
 */

import React, { useContext, useEffect, useState } from 'react';
import useWebSocket from '../../hooks/useWebSocket';
import { AppContext } from '../../contexts/AppContext';

const LiveLog = () => {
  const { darkMode } = useContext(AppContext);
  const [logs, setLogs] = useState([]);
  const { lastMessage } = useWebSocket(process.env.NEXT_PUBLIC_WS_URL);

  useEffect(() => {
    if (lastMessage) {
      const data = JSON.parse(lastMessage.data);
      setLogs(prev => [data, ...prev].slice(0, 100));
    }
  }, [lastMessage]);

  const getTypeColor = (type) => {
    switch(type) {
      case 'XSS': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'SSRF': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'SQLi': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'Redirect': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  return (
    <div className={`rounded-lg shadow p-4 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
      <h2 className="text-xl font-bold mb-4">Real-time Attack Logs</h2>
      <div className="space-y-2 max-h-[600px] overflow-y-auto">
        {logs.map((log, index) => (
          <div key={index} className={`p-3 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(log.attackType)}`}>
                  {log.attackType}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <span className="text-sm font-mono">{log.ip}</span>
            </div>
            <div className="mt-2">
              <pre className={`text-xs p-2 rounded overflow-x-auto ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
                {JSON.stringify(log.details, null, 2)}
              </pre>
              {log.screenshot && (
                <div className="mt-2">
                  <p className="text-sm mb-1">Screenshot:</p>
                  <img 
                    src={log.screenshot} 
                    alt="Victim screenshot" 
                    className="max-w-full h-auto rounded border border-gray-200 dark:border-gray-600"
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveLog;
