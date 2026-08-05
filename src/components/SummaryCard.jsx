import React, { useState, useMemo } from 'react'

function SummaryCard({ trades }) {
  const [timeframe, setTimeframe] = useState('1m')

  const timeframes = [
    { id: '3d', label: '3 Days' },
    { id: '1w', label: '1 Week' },
    { id: '1m', label: '1 Month' },
    { id: '3m', label: '3 Months' },
  ]

  // Zaman dilimine göre trade'leri filtrele
  const filteredTrades = useMemo(() => {
    if (!trades || trades.length === 0) return []

    const now = new Date()
    let cutoffDate

    switch (timeframe) {
      case '3d':
        cutoffDate = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000)
        break
      case '1w':
        cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case '1m':
        cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      case '3m':
        cutoffDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
        break
      default:
        cutoffDate = new Date(0)
    }

    return trades.filter(trade => new Date(trade.buy_time) >= cutoffDate)
  }, [trades, timeframe])

  // Compound (bileşik) hesaplama
  const result = useMemo(() => {
    const initialAmount = 100000
    let currentAmount = initialAmount

    // Trade'leri tarihe göre sırala (en eski önce)
    const sortedTrades = [...filteredTrades].sort(
      (a, b) => new Date(a.buy_time) - new Date(b.buy_time)
    )

    // Sırayla compound uygula
    sortedTrades.forEach(trade => {
      let profitPercentage = trade.profit * currentAmount / 100
      currentAmount = currentAmount + profitPercentage
    })

    const profit = currentAmount - initialAmount

    return {
      finalAmount: currentAmount,
      profit: profit,
      tradeCount: sortedTrades.length
    }
  }, [filteredTrades])

  const isProfit = result.profit >= 0
  const profitColor = isProfit ? 'text-emerald-400' : 'text-rose-400'

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatProfit = (value) => {
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.abs(value))
    return `${value >= 0 ? '+' : '-'}${formatted}`
  }

  return (
    <div className="mt-6 rounded-2xl border border-cyan-500/20 bg-slate-900/40 px-4 py-3 backdrop-blur-sm">
      <div className="flex flex-wrap items-center justify-center gap-x-1.5 gap-y-1 text-sm leading-relaxed">
        <span className="text-slate-300">If you had invested</span>
        <span className="font-medium text-cyan-300">$100,000</span>
        <span className="text-slate-300">in the last</span>
        
        {/* Inline Dropdown */}
        <select
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
          className="cursor-pointer rounded-md border border-cyan-500/30 bg-slate-950/80 px-2 py-0.5 text-sm font-medium text-cyan-100 outline-none transition-all focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/20"
        >
          {timeframes.map((tf) => (
            <option key={tf.id} value={tf.id}>
              {tf.label}
            </option>
          ))}
        </select>
        
        <span className="text-slate-300">, you would have</span>
        <span className={`font-bold ${profitColor}`}>
          {formatCurrency(result.finalAmount)}
        </span>
        <span className={`font-semibold ${profitColor}`}>
          ({formatProfit(result.profit)})
        </span>
      </div>
    </div>
  )
}

export default SummaryCard