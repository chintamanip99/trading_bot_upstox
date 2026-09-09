# 🤖 Ensemble Trading Bot - LSTM + CNN

A paper trading bot that uses an ensemble of LSTM and CNN models to generate trading signals for MCX Gold Options (CE/PE). The bot implements a consensus-based voting system where both models must agree on a signal before executing a paper trade.

## 📋 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Bot](#running-the-bot)
- [API Endpoints](#api-endpoints)
- [Trading Strategy](#trading-strategy)
- [Model Details](#model-details)
- [Monitoring](#monitoring)
- [Performance Metrics](#performance-metrics)
- [Risk Management](#risk-management)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

This project implements a sophisticated paper trading system that combines multiple machine learning models to predict market movements and execute simulated trades. The system is designed for educational and testing purposes, operating in a simulated environment without executing real orders.

### Key Highlights
- **Ensemble Approach**: Combines LSTM and CNN models for robust predictions
- **Consensus Voting**: Both models must agree on a signal before trading
- **Paper Trading**: Safe simulated environment with real-time market data
- **Full Capital Utilization**: Uses 95% of available balance per trade
- **Risk Management**: Implements Stop-Loss (4%) and Target (1%) with 1:4 Risk-Reward ratio
- **Real-time Data**: Streams live market data via Upstox WebSocket

## ✨ Features

- **🤖 Dual Model Ensemble**
  - LSTM for price direction prediction
  - CNN for classification with GAF image transformation
  - Consensus-based signal generation

- **📊 Paper Trading Engine**
  - Simulated trading with ₹100,000 initial capital
  - Full capital utilization (95% per trade)
  - Lot size: 10 units (MCX standard)
  - Automatic position sizing

- **📈 Performance Tracking**
  - Real-time balance updates
  - Win rate, profit factor tracking
  - Trade history and logs
  - Consecutive loss monitoring

- **🔔 Real-time Monitoring**
  - Live WebSocket data streaming
  - Interactive dashboard
  - Auto-refresh every 2 seconds
  - Trade log visualization

- **🛡️ Risk Management**
  - Stop-Loss: 4% from entry
  - Target: 1% from entry
  - Risk-Reward Ratio: 1:4
  - Max consecutive losses: 3 (auto-stop)
  - Time-based exit (45 minutes max hold)
