import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'

// ✅ Duration string'ini "18hours 15mins" formatına çevirir
const formatDuration = (durationStr) => {
  if (!durationStr || durationStr === 'N/A' || durationStr === '') return '—'

  const normalized = String(durationStr).trim()

  if (/^\d{1,2}:\d{2}:\d{2}$/.test(normalized)) {
    const [hours, minutes] = normalized.split(':').map(Number)
    return `${hours} hours ${minutes} mins`
  }

  let hours = 0
  let minutes = 0

  const hourMatch = normalized.match(/(\d+)h/)
  const minMatch = normalized.match(/(\d+)m/)

  if (hourMatch) hours = parseInt(hourMatch[1], 10)
  if (minMatch) minutes = parseInt(minMatch[1], 10)

  return `${hours} hours ${minutes} mins`
}

function TradeList({ trades }) {
  // ✅ En yeni 5 trade'i göster
  const MAX_VISIBLE_TRADES = 5
  
  // En yeni trade'i en üste almak için sell_time'a göre sırala
  const sortedTrades = [...(trades || [])]
    .sort((a, b) => {
      const timeA = new Date(a.sell_time).getTime()
      const timeB = new Date(b.sell_time).getTime()
      return timeB - timeA
    })
    .slice(0, MAX_VISIBLE_TRADES)  // ✅ Sadece ilk 5 tanesini al

  if (sortedTrades.length === 0) {
    return (
      <div className="flex min-h-[120px] items-center justify-center rounded-2xl border border-cyan-400/20 bg-slate-900/40">
        <p className="text-sm text-slate-400">No trades yet. Waiting for server data...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {/* ✅ Toplam trade sayısı bilgisini göster */}
        <div className="flex flex-col items-center justify-center gap-1 text-sm leading-relaxed">
            <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-200">
            - Position History -
            </h2>
        </div>
      
        <AnimatePresence mode="popLayout">
            {sortedTrades.map((trade, index) => (
            <TradeRow key={trade.id || index} trade={trade} index={index} />
            ))}
        </AnimatePresence>
    </div>
  )
}

function TradeRow({ trade, index }) {
  const profit = trade.profit ?? 0
  const profitClass = profit > 0 ? 'text-emerald-400' : profit < 0 ? 'text-rose-400' : 'text-slate-100'
  
  const formatValue = (value) => {
    if (value === null || value === undefined || value === '') return '—'
    if (typeof value === 'number') return value.toLocaleString()
    return value
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut', delay: index * 0.05 }}
      className="group relative overflow-hidden rounded-2xl border border-cyan-400/20 bg-slate-900/60 p-3 shadow-[0_0_20px_rgba(34,211,238,0.08)] backdrop-blur-xl transition-all duration-300 hover:border-cyan-400/40 hover:shadow-[0_0_30px_rgba(34,211,238,0.15)] sm:p-4"
    >
      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.1),transparent_50%)]" />
      
      <div className="relative z-10 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4 md:gap-4">
        
        {/* PROFIT */}
        <div className="flex flex-col justify-center border-b border-white/10 pb-3 sm:border-b-0 sm:border-r sm:pb-0 sm:pr-3">
          <p className="mb-1 text-[10px] uppercase tracking-[0.2em] text-slate-400">Profit</p>
          <p className={`text-lg font-bold font-mono ${profitClass} drop-shadow-[0_0_8px_rgba(52,211,153,0.3)]`}>
            {profit > 0 ? '+' : ''}{formatValue(profit)}{"%"}
          </p>
        </div>

        {/* PRICES */}
        <div className="flex flex-col justify-center border-b border-white/10 pb-3 sm:border-b-0 sm:border-r sm:pb-0 sm:pr-3">
          <div className="mb-1">
            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Sell Price</p>
            <p className="text-sm font-semibold font-mono text-cyan-200">{formatValue(trade.sell_price)}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Buy Price</p>
            <p className="text-sm font-semibold font-mono text-cyan-200">{formatValue(trade.buy_price)}</p>
          </div>
        </div>

        {/* TIMES */}
        <div className="flex flex-col justify-center border-b border-white/10 pb-3 sm:border-b-0 sm:border-r sm:pb-0 sm:pr-3">
          <div className="mb-1">
            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Sell Time</p>
            <p className="text-sm font-semibold font-mono text-cyan-200">{formatValue(trade.sell_time)}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Buy Time</p>
            <p className="text-sm font-semibold font-mono text-cyan-200">{formatValue(trade.buy_time)}</p>
          </div>
        </div>

        {/* DURATION */}
        <div className="flex flex-col justify-center">
          <p className="mb-1 text-[10px] uppercase tracking-[0.2em] text-slate-400">Duration</p>
          <p className="text-base font-bold font-mono text-cyan-100">
            {formatDuration(trade.duration)}
          </p>
        </div>

      </div>
    </motion.div>
  )
}

export default TradeList