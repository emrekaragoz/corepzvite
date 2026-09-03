import React, { useState, useEffect, useRef } from 'react'
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

function PriceChart({ activeCoin = 'BTC', buyOrder = null }) {
  const [chartData, setChartData] = useState([])
  const [rawBinanceData, setRawBinanceData] = useState([])
  const [coinInfo, setCoinInfo] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [annotations, setAnnotations] = useState({})
  const [selectedCandle, setSelectedCandle] = useState(null)
  const chartContainerRef = useRef(null)

  // Data fetch
  useEffect(() => {
    fetchChartData()
    setSelectedCandle(null)
  }, [activeCoin])

  // Annotations update
  useEffect(() => {
    if (!buyOrder || !buyOrder.buy_time || rawBinanceData.length === 0) {
      setAnnotations({})
      return
    }

    const buyDate = new Date(buyOrder.buy_time)
    if (isNaN(buyDate.getTime())) {
      setAnnotations({})
      return
    }

    const buyTime = buyDate.getTime()

    const nearestCandle = rawBinanceData.reduce((prev, curr) => {
      return (Math.abs(curr[0] - buyTime) < Math.abs(prev[0] - buyTime)) ? curr : prev
    })

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
  }, [buyOrder, rawBinanceData])

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
      setRawBinanceData(data)
      
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

  const handleChartClick = (event, _chartContext, config) => {
    const dataPointIndex = config?.dataPointIndex
    const selectedData = chartData[dataPointIndex]
    const container = chartContainerRef.current

    if (dataPointIndex === undefined || dataPointIndex < 0 || !selectedData || !container) {
      return
    }

    const bounds = container.getBoundingClientRect()
    const tooltipWidth = 150
    const tooltipHeight = 58
    const left = Math.min(
      Math.max(event.clientX - bounds.left - tooltipWidth / 2, 8),
      Math.max(8, bounds.width - tooltipWidth - 8)
    )
    const top = Math.min(
      Math.max(event.clientY - bounds.top - tooltipHeight - 12, 8),
      Math.max(8, bounds.height - tooltipHeight - 8)
    )

    setSelectedCandle({
      data: selectedData,
      position: { left, top }
    })
  }

  const chartOptions = {
    chart: {
      type: 'candlestick',
      height: 200,
      background: 'transparent',
      toolbar: { show: false },
      zoom: {
        enabled: true,
        type: 'x',
        autoScaleYaxis: true,
        allowMouseWheelZoom: true,
      },
      pan: {
        enabled: true,
        type: 'x',
      },
      events: {
        click: handleChartClick,
        zoomed: () => setSelectedCandle(null),
        scrolled: () => setSelectedCandle(null),
      },
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
      },
      followCursor: false,
      intersect: true,
      shared: false,
    },
    annotations: annotations,
  }

  const chartSeries = [{
    name: 'Price',
    data: chartData
  }]

  return (
    <div className="bg-slate-900/40 px-4 py-3 backdrop-blur-sm h-full">
      
      {/* ✅ ÜST BİLGİ */}
      {/* ✅ ÜST BİLGİ */}
<div className="mb-3 flex items-center justify-between">
  
  {/* Sol: Icon + Symbol + 15m Candles */}
  <div className="flex items-center gap-3 flex-wrap">
    <img 
      src={COIN_MAP[activeCoin]?.icon} 
      alt={coinInfo?.symbol || 'coin'}
      className="h-6 w-6 rounded-full object-cover"
    />
    <span className="text-sm font-semibold text-white whitespace-nowrap">
      {coinInfo?.symbol || '...'}/USDT
    </span>
    <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500 whitespace-nowrap">
      15m Candles
    </span>
  </div>
  
  {/* Sağ: Price + 24h Change */}
  {coinInfo && (
    <div className="flex items-center gap-2">
      <span className="text-lg font-bold font-mono text-white whitespace-nowrap">
        ${coinInfo.currentPrice.toLocaleString(undefined, { 
          minimumFractionDigits: 2, 
          maximumFractionDigits: 2 
        })}
      </span>
    </div>
  )}
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
        <div ref={chartContainerRef} className="relative h-[200px] w-full">
          <Chart 
            options={chartOptions} 
            series={chartSeries} 
            type="candlestick" 
            height={200} 
          />
          {selectedCandle && (
            <div
              className="pointer-events-none absolute z-20 w-[150px] rounded-lg border border-cyan-400/30 bg-slate-900/95 px-3 py-2 shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
              style={{ left: selectedCandle.position.left, top: selectedCandle.position.top }}
            >
              <p className="mb-1 text-[11px] text-slate-400">
                {new Date(selectedCandle.data.x).toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
              <p className="text-sm font-bold text-cyan-300">
                ${selectedCandle.data.y[3].toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default PriceChart