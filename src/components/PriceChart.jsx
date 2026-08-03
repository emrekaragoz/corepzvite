import React, { useState, useEffect } from 'react'
import Chart from 'react-apexcharts'

const COIN_MAP = {
  BTC: { name: 'Bitcoin', symbol: 'BTC', binanceSymbol: 'BTCUSDT' },
  XRP: { name: 'Ripple', symbol: 'XRP', binanceSymbol: 'XRPUSDT' },
  BNB: { name: 'BNB', symbol: 'BNB', binanceSymbol: 'BNBUSDT' },
  TRX: { name: 'TRON', symbol: 'TRX', binanceSymbol: 'TRXUSDT' }
}

function PriceChart({ activeCoin = 'BTC' }) {
  const [chartData, setChartData] = useState([])
  const [coinInfo, setCoinInfo] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchChartData()
  }, [activeCoin])

  const fetchChartData = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const coin = COIN_MAP[activeCoin]
      if (!coin) throw new Error('Invalid coin')
      
      // Binance API - 3 günlük saatlik mumlar (72 saat)
      const response = await fetch(
        `https://api.binance.com/api/v3/klines?symbol=${coin.binanceSymbol}&interval=1h&limit=72`
      )
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`)
      }
      
      const data = await response.json()
      
      // ApexCharts formatına dönüştür
      const formattedData = data.map(candle => ({
        x: new Date(candle[0]),
        y: [
          parseFloat(candle[1]), // Open
          parseFloat(candle[2]), // High
          parseFloat(candle[3]), // Low
          parseFloat(candle[4])  // Close
        ]
      }))
      
      setChartData(formattedData)
      
      // Son mum'dan fiyat bilgisi al
      if (data.length > 0) {
        const lastCandle = data[data.length - 1]
        const currentPrice = parseFloat(lastCandle[4])
        
        // 24h değişim için 24 saat önceki mumu bul
        const candle24hAgo = data[Math.max(0, data.length - 25)]
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
      zoom: { enabled: false },
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
      theme: 'dark',
      x: { format: 'dd MMM HH:mm' },
    },
  }

  const chartSeries = [{
    name: 'Price',
    data: chartData
  }]

  return (
    <div className="mb-6 bg-slate-900/40 px-4 py-3 backdrop-blur-sm">
      
      {/* Coin Bilgisi - TEK SATIR */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full border border-cyan-500/30 bg-gradient-to-br from-cyan-500/20 to-cyan-500/5">
            <span className="text-xs font-bold text-cyan-300">
              {coinInfo?.symbol?.[0] || '?'}
            </span>
          </div>
          <span className="text-sm font-semibold text-white">
            {coinInfo?.symbol || '...'}/USDT
          </span>
        </div>
        
        {coinInfo && (
          <div className="flex items-center gap-3">
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

      {/* Grafik Alanı */}
      {isLoading ? (
        <div className="flex h-[200px] items-center justify-center rounded-xl bg-slate-950/50">
          <div className="flex flex-col items-center gap-2">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-cyan-400/20 border-t-cyan-300" />
            <p className="text-xs text-slate-400">Loading candlesticks...</p>
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
          Last 3 Days • 1H Candles
        </span>
      </div>
    </div>
  )
}

export default PriceChart