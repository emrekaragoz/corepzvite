import React, { useState, useEffect } from 'react'
import { formatCurrency, formatDateDisplay, formatPercent } from '../utils/date'
import { COIN_SYMBOLS } from '../utils/coins'

const LEVERAGE = 10

function PositionCard({ position, activeCoin = 'BTC' }) {
  const [currentPrice, setCurrentPrice] = useState(null)
  const [isLoadingPrice, setIsLoadingPrice] = useState(false)

  const hasData = Boolean(
    position?.buy_time || position?.buy_price || position?.order_ref
  )

  useEffect(() => {
    if (!hasData) return

    const symbol = COIN_SYMBOLS[activeCoin] || 'BTCUSDT'
    const fetchPrice = async () => {
      try {
        setIsLoadingPrice(true)
        const response = await fetch(
          `https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`
        )
        if (!response.ok) return
        const data = await response.json()
        setCurrentPrice(parseFloat(data.price))
      } catch {
        setCurrentPrice(null)
      } finally {
        setIsLoadingPrice(false)
      }
    }

    fetchPrice()
    const interval = setInterval(fetchPrice, 10000)
    return () => clearInterval(interval)
  }, [hasData, activeCoin])

  const profitData = (() => {
    if (!hasData || currentPrice === null || !position?.buy_price) {
      return null
    }

    const rawProfitPercent = ((currentPrice - position.buy_price) / position.buy_price) * 100
    const profitPercent = rawProfitPercent * LEVERAGE
    const profit = (rawProfitPercent / 100) * position.buy_price * LEVERAGE

    return {
      profit,
      profitPercent,
      isProfit: profit >= 0,
    }
  })()

  if (!hasData) {
    return (
      <div className="rounded-2xl border border-cyan-500/10 bg-slate-950/80 p-6 backdrop-blur-xl h-full min-h-[220px] flex flex-col items-center justify-center text-center">
        <div className="mb-4 h-16 w-16 rounded-full bg-cyan-500/10 ring-1 ring-cyan-500/20" />
        <h3 className="text-sm font-semibold text-white">No active position</h3>
        <p className="mt-2 text-sm text-slate-400">Connect your first trade to see live position details and profit estimates.</p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-emerald-500/20 bg-slate-900/60 p-4 backdrop-blur-sm h-full flex flex-col">
      <div className="mb-4 flex flex-wrap items-center gap-2 justify-between">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
            Active Position
          </h3>
        </div>
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-slate-400">
          <span className={isLoadingPrice ? 'h-2.5 w-2.5 rounded-full bg-cyan-400 animate-pulse' : 'h-2.5 w-2.5 rounded-full bg-slate-600'} />
          {isLoadingPrice ? 'Pricing...' : 'Live quote'}
        </div>
      </div>

      <div className="flex flex-col gap-2.5 flex-1">
        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
          <p className="text-[10px] uppercase tracking-[0.15em] text-slate-500">Buy Price</p>
          <p className="mt-1 text-base font-bold font-mono text-white">
            {formatCurrency(position.buy_price, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
          <p className="text-[10px] uppercase tracking-[0.15em] text-slate-500">Buy Time</p>
          <p className="mt-1 text-sm font-semibold font-mono text-cyan-200">
            {formatDateDisplay(position.buy_time)}
          </p>
        </div>
      </div>

      {profitData && (
        <div className={`mt-4 rounded-xl border p-4 ${profitData.isProfit ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-rose-500/20 bg-rose-500/5'}`}>
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Current Profit</p>
            <span className="rounded border border-cyan-500/20 bg-cyan-500/5 px-2 py-0.5 text-[10px] font-mono text-cyan-400/80">
              10x
            </span>
          </div>
          <div className="flex items-baseline gap-3">
            <p className={`text-xl font-bold font-mono ${profitData.isProfit ? 'text-emerald-400' : 'text-rose-400'}`}>
              {formatPercent(profitData.profitPercent, { minimumFractionDigits: 1, maximumFractionDigits: 1, showSign: true })}
            </p>
            <p className="text-sm text-slate-400">Estimated move based on current price</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default PositionCard