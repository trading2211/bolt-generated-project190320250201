import React, { useState, useEffect } from 'react';
import { testComputedStatsAccess, fetchTrueConfirmationMetric } from '../lib/supabaseTest';

function TestAccess() {
  const [testResult, setTestResult] = useState(null);
  const [trueConfirmation, setTrueConfirmation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const runTests = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Run direct access test
      const result = await testComputedStatsAccess();
      setTestResult(result);
      
      // Fetch True Confirmation metric
      const metric = await fetchTrueConfirmationMetric();
      setTrueConfirmation(metric);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="test-access">
      <h2>Database Access Test</h2>
      
      <button 
        onClick={runTests} 
        disabled={loading}
        style={{
          padding: '10px 20px',
          margin: '20px 0',
          backgroundColor: '#7A3AEA',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? 'Testing...' : 'Test Database Access'}
      </button>
      
      {error && (
        <div className="error-message">
          Error: {error}
        </div>
      )}
      
      {testResult && (
        <div className="test-result">
          <h3>Test Result</h3>
          <pre>{JSON.stringify(testResult, null, 2)}</pre>
        </div>
      )}
      
      {trueConfirmation && (
        <div className="true-confirmation">
          <h3>True Confirmation Metric (ID: 54)</h3>
          <pre>{JSON.stringify(trueConfirmation, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default TestAccess;
