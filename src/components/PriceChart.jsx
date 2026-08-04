import React, { useState, useEffect } from 'react'
import Chart from 'react-apexcharts'

const COIN_MAP = {
  BTC: { 
    name: 'Bitcoin', 
    symbol: 'BTC', 
    binanceSymbol: 'BTCUSDT',
    icon: 'https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/128/color/btc.png'
  },
  XRP: { 
    name: 'Ripple', 
    symbol: 'XRP', 
    binanceSymbol: 'XRPUSDT',
    icon: 'https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/128/color/xrp.png'
  },
  BNB: { 
    name: 'BNB', 
    symbol: 'BNB', 
    binanceSymbol: 'BNBUSDT',
    icon: 'https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/128/color/bnb.png'
  },
  TRX: { 
    name: 'TRON', 
    symbol: 'TRX', 
    binanceSymbol: 'TRXUSDT',
    icon: 'https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/128/color/trx.png'
  }
}

// ✅ Aşağı bakan üçgen SVG (URL encoded)
//const TRIANGLE_DOWN_SVG = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 10'%3E%3Cpath d='M5 8.5L1 2.5h8z' fill='%234ade80'/%3E%3C/svg%3E`

function PriceChart({ activeCoin = 'BTC', buyOrder = null }) {
  const [chartData, setChartData] = useState([])
  const [coinInfo, setCoinInfo] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [annotations, setAnnotations] = useState({})
  const [currentProfit, setCurrentProfit] = useState(null)

  useEffect(() => {
    fetchChartData()
  }, [activeCoin])

  const fetchChartData = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const coin = COIN_MAP[activeCoin]
      if (!coin) throw new Error('Invalid coin')
      
      const response = await fetch(
        `https://api.binance.com/api/v3/klines?symbol=${coin.binanceSymbol}&interval=15m&limit=288`
      )
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`)
      }
      
      const data = await response.json()
      
      const formattedData = data.map(candle => ({
        x: new Date(candle[0]),
        y: [
          parseFloat(candle[1]),
          parseFloat(candle[2]),
          parseFloat(candle[3]),
          parseFloat(candle[4])
        ]
      }))
      
      setChartData(formattedData)
      
      // ✅ BUY ORDER ANNOTATIONS
      if (buyOrder && data.length > 0) {
        const buyTime = new Date(buyOrder.buy_time).getTime()
        
        // Buy time'a en yakın mum'u bul
        const nearestCandle = data.reduce((prev, curr) => {
          return (Math.abs(curr[0] - buyTime) < Math.abs(prev[0] - buyTime)) ? curr : prev
        })
        
        // ✅ Üçgen mumun ÜSTÜNDE olsun (high price)
        const markerPrice = parseFloat(nearestCandle[2])
        
        setAnnotations({
          xaxis: [{
            x: buyTime,
            borderColor: '#4ade80',
            strokeWidth: 1.5,
            strokeDashArray: 4,
            label: {
              text: 'BUY',
              position: 'top',
              offsetY: -8,
              style: {
                color: '#ffffff',
                background: '#4ade80',
                fontSize: '9px',
                fontWeight: 'bold',
                padding: { left: 4, right: 4, top: 2, bottom: 2 },
                borderRadius: 3,
              }
            }
          }]
        })
        
        // ✅ Current Profit hesapla
        if (data.length > 0) {
          const lastCandle = data[data.length - 1]
          const currentPrice = parseFloat(lastCandle[4])
          const profit = ((currentPrice - buyOrder.buy_price) / buyOrder.buy_price) * 100
          setCurrentProfit(profit)
        }
      } else {
        setAnnotations({})
        setCurrentProfit(null)
      }
      
      // Coin bilgisi
      if (data.length > 0) {
        const lastCandle = data[data.length - 1]
        const currentPrice = parseFloat(lastCandle[4])
        
        const candle24hAgo = data[Math.max(0, data.length - 97)]
        const price24hAgo = parseFloat(candle24hAgo[4])
        const change24h = ((currentPrice - price24hAgo) / price24hAgo) * 100
        
        setCoinInfo({
          name: coin.name,
          symbol: coin.symbol,
          currentPrice,
          change24h
        })
      }
      
    } catch (err) {
      console.error('Chart fetch error:', err)
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const chartOptions = {
    chart: {
      type: 'candlestick',
      height: 200,
      background: 'transparent',
      toolbar: { show: false },
      zoom: { enabled: true },
    },
    theme: { mode: 'dark' },
    grid: {
      borderColor: '#1e293b',
      strokeDashArray: 3,
    },
    xaxis: {
      type: 'datetime',
      labels: {
        style: { colors: '#94a3b8', fontSize: '10px' },
        datetimeFormatter: {
          day: 'dd MMM',
          hour: 'HH:mm',
          minute: 'HH:mm',
        }
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: { colors: '#94a3b8', fontSize: '10px' },
        formatter: (value) => `$${value.toLocaleString()}`
      },
      tooltip: { enabled: true },
    },
    plotOptions: {
      candlestick: {
        colors: {
          upward: '#22c55e',
          downward: '#ef4444'
        }
      }
    },
    tooltip: {
      custom: function({ series, seriesIndex, dataPointIndex, w }) {
        const data = w.globals.initialSeries[seriesIndex].data[dataPointIndex]
        const date = new Date(data.x).toLocaleString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          hour: '2-digit', 
          minute: '2-digit' 
        })
        const close = data.y[3]
        
        return `
          <div style="
            background: rgba(15, 23, 42, 0.95); 
            border: 1px solid rgba(34, 211, 238, 0.3); 
            border-radius: 8px; 
            padding: 8px 12px; 
            box-shadow: 0 4px 20px rgba(0,0,0,0.5);
          ">
            <div style="font-size: 11px; color: #94a3b8; margin-bottom: 4px;">
              ${date}
            </div>
            <div style="font-size: 14px; font-weight: bold; color: #22d3ee;">
              $${close.toLocaleString(undefined, { 
                minimumFractionDigits: 2, 
                maximumFractionDigits: 2 
              })}
            </div>
          </div>
        `
      }
    },
    annotations: annotations,
  }

  const chartSeries = [{
    name: 'Price',
    data: chartData
  }]

  // ✅ Profit renk sınıfı
  const profitColor = currentProfit !== null
    ? currentProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'
    : 'text-slate-400'

  return (
    <div className="bg-slate-900/40 px-4 py-3 backdrop-blur-sm">
      
      {/* ✅ ÜST BİLGİ - TEK SATIR */}
      <div className="mb-3 flex items-center justify-between">
        
        {/* Sol: Sembol + Price + 24h */}
        <div className="flex items-center gap-3">
          {/* Sembol */}
          <div className="flex items-center gap-2">
            <img 
              src={COIN_MAP[activeCoin]?.icon} 
              alt={coinInfo?.symbol || 'coin'}
              className="h-6 w-6 rounded-full object-cover"
            />
            <span className="text-sm font-semibold text-white">
              {coinInfo?.symbol || '...'}/USDT
            </span>
          </div>
          
          {/* Price + 24h */}
          {coinInfo && (
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold font-mono text-white">
                ${coinInfo.currentPrice.toLocaleString(undefined, { 
                  minimumFractionDigits: 2, 
                  maximumFractionDigits: 2 
                })}
              </span>
              <span className={`text-xs font-semibold ${
                coinInfo.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}>
                {coinInfo.change24h >= 0 ? '+' : ''}{coinInfo.change24h.toFixed(2)}%
              </span>
            </div>
          )}
        </div>
        
        {/* Sağ: Current Profit */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
            Current Profit
          </span>
          <span className={`text-sm font-bold font-mono ${profitColor}`}>
            {currentProfit !== null 
              ? `${currentProfit >= 0 ? '+' : ''}${currentProfit.toFixed(2)}%`
              : '—'
            }
          </span>
        </div>
      </div>

      {/* Grafik */}
      {isLoading ? (
        <div className="flex h-[200px] items-center justify-center rounded-xl bg-slate-950/50">
          <div className="flex flex-col items-center gap-2">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-cyan-400/20 border-t-cyan-300" />
            <p className="text-xs text-slate-400">Loading 15m candles...</p>
          </div>
        </div>
      ) : error ? (
        <div className="flex h-[200px] items-center justify-center rounded-xl bg-red-500/5">
          <div className="text-center">
            <p className="text-sm font-medium text-red-300">Failed to load chart</p>
            <p className="mt-1 text-xs text-slate-400">{error}</p>
            <button 
              onClick={fetchChartData}
              className="mt-2 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs text-cyan-300 hover:bg-cyan-500/20 transition-all"
            >
              Retry
            </button>
          </div>
        </div>
      ) : (
        <div className="h-[200px] w-full">
          <Chart 
            options={chartOptions} 
            series={chartSeries} 
            type="candlestick" 
            height={200} 
          />
        </div>
      )}
      
      {/* Zaman bilgisi */}
      <div className="mt-2 text-center">
        <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
          Last 3 Days • 15m Candles
        </span>
      </div>
    </div>
  )
}

export default PriceChart