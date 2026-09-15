import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const App = () => {
  const [status, setStatus] = useState('Connecting...');
  const [tradeLogs, setTradeLogs] = useState([]);
  const [performance, setPerformance] = useState({
    balance: 0,
    totalReturn: 0,
    returnPercentage: 0,
    totalTrades: 0,
    winningTrades: 0,
    losingTrades: 0,
    winRate: 0,
    totalFeesPaid: 0,
  });
  const [prices, setPrices] = useState({ ce: 0, pe: 0, last: 0 });
  const [position, setPosition] = useState(null);
  const [modelPredictions, setModelPredictions] = useState({
    lstm: { signal: 0, confidence: 0 },
    cnn: { signal: 0, confidence: 0 },
    sarimax: { signal: 0, confidence: 0 },
  });
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const logsEndRef = useRef(null);

  // Fetch data from API
  const fetchData = async () => {
    try {
      const response = await fetch('http://192.168.29.2:5000/trade_logs');
      if (!response.ok) throw new Error('Failed to fetch data');
      const data = await response.json();

      // Update state with fetched data
      setStatus(data.current_status || 'Unknown status');
      
      if (data.global_logs) {
        setTradeLogs(data.global_logs);
      }
      
      if (data.performance_stats) {
        setPerformance({
          balance: data.balance || 0,
          totalReturn: data.performance_stats.total_return || 0,
          returnPercentage: data.performance_stats.return_percentage || 0,
          totalTrades: data.performance_stats.total_trades || 0,
          winningTrades: data.performance_stats.winning_trades || 0,
          losingTrades: data.performance_stats.losing_trades || 0,
          winRate: data.performance_stats.win_rate || 0,
          totalFeesPaid: data.performance_stats.total_fees_paid || 0,
        });
      }
      
      if (data.ce_price || data.pe_price) {
        setPrices({
          ce: data.ce_price || 0,
          pe: data.pe_price || 0,
          last: data.last_price || 0,
        });
      }
      
      setPosition(data.current_position || null);
      
      if (data.model_predictions) {
        setModelPredictions({
          lstm: {
            signal: data.model_predictions.lstm?.signal || 0,
            confidence: data.model_predictions.lstm?.confidence || 0,
          },
          cnn: {
            signal: data.model_predictions.cnn?.signal || 0,
            confidence: data.model_predictions.cnn?.confidence || 0,
          },
          sarimax: {
            signal: data.model_predictions.sarimax?.signal || 0,
            confidence: data.model_predictions.sarimax?.confidence || 0,
          },
        });
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setStatus('Error connecting to server');
      setLoading(false);
    }
  };

  // Auto-refresh every 2 seconds
  useEffect(() => {
    fetchData();
    
    let interval;
    if (autoRefresh) {
      interval = setInterval(fetchData, 2000);
    }
    
    return () => clearInterval(interval);
  }, [autoRefresh]);

  // Scroll to bottom of logs
  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [tradeLogs]);

  // Get signal color
  const getSignalColor = (signal) => {
    if (signal === 1) return 'bullish';
    if (signal === -1 || signal === 2) return 'bearish';
    return 'neutral';
  };

  // Get signal label
  const getSignalLabel = (signal) => {
    if (signal === 1) return '📈 BUY CE';
    if (signal === 2) return '📉 BUY PE';
    if (signal === -1) return '📉 BEARISH';
    return '⏸️ HOLD';
  };

  // Format time
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString('en-IN', { 
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } catch {
      return timestamp;
    }
  };

  // Parse trade log message
  const parseTradeMessage = (message) => {
    if (!message) return { type: 'info', text: message || '' };
    
    if (message.includes('ENTRY')) return { type: 'entry', text: message };
    if (message.includes('EXIT')) return { type: 'exit', text: message };
    if (message.includes('ERROR')) return { type: 'error', text: message };
    return { type: 'info', text: message };
  };

  return (
    <div className="app">
      <header className="header">
        <h1>🤖 Ensemble Trading Bot</h1>
        <div className="header-badge">
          <span className="badge">PAPER TRADING</span>
          <span className="badge">LSTM + CNN + SARIMAX</span>
        </div>
      </header>

      <div className="main-container">
        {/* Status Dashboard */}
        <div className="dashboard">
          <div className="status-card">
            <h2>📊 Live Status</h2>
            <div className="status-content">
              <div className="status-text">
                <span className="status-label">Status:</span>
                <span className="status-value">{status}</span>
              </div>
              <div className="status-metrics">
                <div className="metric">
                  <span className="metric-label">CE Price</span>
                  <span className="metric-value price">₹{prices.ce.toFixed(2)}</span>
                </div>
                <div className="metric">
                  <span className="metric-label">PE Price</span>
                  <span className="metric-value price">₹{prices.pe.toFixed(2)}</span>
                </div>
                <div className="metric">
                  <span className="metric-label">Position</span>
                  <span className={`metric-value position ${position ? 'active' : 'none'}`}>
                    {position ? position.toUpperCase() : 'None'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Card */}
          <div className="performance-card">
            <h2>💰 Performance</h2>
            <div className="performance-grid">
              <div className="perf-item">
                <span className="perf-label">Balance</span>
                <span className="perf-value">₹{performance.balance.toFixed(2)}</span>
              </div>
              <div className="perf-item">
                <span className="perf-label">Return</span>
                <span className={`perf-value ${performance.returnPercentage >= 0 ? 'positive' : 'negative'}`}>
                  {performance.returnPercentage >= 0 ? '+' : ''}{performance.returnPercentage.toFixed(2)}%
                </span>
              </div>
              <div className="perf-item">
                <span className="perf-label">Trades</span>
                <span className="perf-value">{performance.totalTrades}</span>
              </div>
              <div className="perf-item">
                <span className="perf-label">Win Rate</span>
                <span className="perf-value">{performance.winRate.toFixed(1)}%</span>
              </div>
              <div className="perf-item">
                <span className="perf-label">Wins/Losses</span>
                <span className="perf-value">{performance.winningTrades}/{performance.losingTrades}</span>
              </div>
              <div className="perf-item">
                <span className="perf-label">Fees Paid</span>
                <span className="perf-value">₹{performance.totalFeesPaid.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Model Predictions */}
          <div className="predictions-card">
            <h2>🧠 Model Predictions</h2>
            <div className="predictions-grid">
              <div className="model-pred">
                <span className="model-name">LSTM</span>
                <span className={`signal ${getSignalColor(modelPredictions.lstm.signal)}`}>
                  {getSignalLabel(modelPredictions.lstm.signal)}
                </span>
                <span className="confidence">{(modelPredictions.lstm.confidence * 100).toFixed(1)}%</span>
              </div>
              <div className="model-pred">
                <span className="model-name">CNN</span>
                <span className={`signal ${getSignalColor(modelPredictions.cnn.signal)}`}>
                  {getSignalLabel(modelPredictions.cnn.signal)}
                </span>
                <span className="confidence">{(modelPredictions.cnn.confidence * 100).toFixed(1)}%</span>
              </div>
              <div className="model-pred">
                <span className="model-name">SARIMAX</span>
                <span className={`signal ${getSignalColor(modelPredictions.sarimax.signal)}`}>
                  {getSignalLabel(modelPredictions.sarimax.signal)}
                </span>
                <span className="confidence">{(modelPredictions.sarimax.confidence * 100).toFixed(1)}%</span>
              </div>
            </div>
            <div className="ensemble-indicator">
              <span className="ensemble-label">🎯 Ensemble Signal:</span>
              <span className={`ensemble-signal ${getSignalColor(
                modelPredictions.lstm.signal === 1 && 
                modelPredictions.cnn.signal === 1 && 
                modelPredictions.sarimax.signal === 1 ? 1 :
                modelPredictions.lstm.signal === -1 && 
                modelPredictions.cnn.signal === -1 && 
                modelPredictions.sarimax.signal === -1 ? -1 : 0
              )}`}>
                {modelPredictions.lstm.signal === 1 && 
                 modelPredictions.cnn.signal === 1 && 
                 modelPredictions.sarimax.signal === 1 ? '📈 UNANIMOUS BULLISH' :
                 modelPredictions.lstm.signal === -1 && 
                 modelPredictions.cnn.signal === -1 && 
                 modelPredictions.sarimax.signal === -1 ? '📉 UNANIMOUS BEARISH' :
                 '⚠️ NO CONSENSUS'}
              </span>
            </div>
          </div>
        </div>

        {/* Trade Logs */}
        <div className="logs-container">
          <div className="logs-header">
            <h2>📋 Trade Logs</h2>
            <div className="logs-controls">
              <button 
                className={`auto-refresh-btn ${autoRefresh ? 'active' : ''}`}
                onClick={() => setAutoRefresh(!autoRefresh)}
              >
                {autoRefresh ? '⏸️ Pause' : '▶️ Resume'}
              </button>
              <span className="log-count">{tradeLogs.length} entries</span>
            </div>
          </div>
          <div className="logs-scroll">
            {loading ? (
              <div className="loading">Loading trades...</div>
            ) : tradeLogs.length === 0 ? (
              <div className="no-logs">No trade logs available</div>
            ) : (
              tradeLogs.map((log, index) => {
                const parsed = parseTradeMessage(log.message || log);
                return (
                  <div key={index} className={`log-entry ${parsed.type}`}>
                    <span className="log-time">{formatTime(log.timestamp)}</span>
                    <span className="log-message">{parsed.text}</span>
                  </div>
                );
              })
            )}
            <div ref={logsEndRef} />
          </div>
        </div>
      </div>

      <footer className="footer">
        <span>⚡ Target: 2% | Stop-Loss: 1%</span>
        <span>🔄 Auto-refresh: {autoRefresh ? 'ON' : 'OFF'}</span>
        <span>📡 Server: localhost:5000</span>
      </footer>
    </div>
  );
};

export default App;
