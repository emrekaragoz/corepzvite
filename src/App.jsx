import React, { useState } from 'react'
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import { AnimatePresence, motion } from 'framer-motion'
import Footer from './components/Footer'
import CoinSelector from './components/CoinSelector'
import PriceChart from './components/PriceChart'
import SummaryCard from './components/SummaryCard'

// ✅ ÇOKLU MOCK VERİ (Compound hesaplama için)
const MOCK_TRADES = [
  {
    id: 1,
    order_ref: "BTC-USDT-7G8H9I",
    profit: 800,         // %8 kar
    buy_price: 10000,
    sell_price: 10800,
    buy_time: "2026-08-04 14:20:10",
    sell_time: "2026-08-04 14:45:30",
    duration: "25m 20s",
    last_signal_type: "EMA Cross",
    last_signal_volume: 450000
  },
  {
    id: 2,
    order_ref: "BTC-USDT-4D5E6F",
    profit: -500,        // %5 zarar
    buy_price: 10000,
    sell_price: 9500,
    buy_time: "2026-08-01 13:00:00",
    sell_time: "2026-08-01 13:15:45",
    duration: "15m 45s",
    last_signal_type: "Breakout Failed",
    last_signal_volume: 850000
  },
  {
    id: 3,
    order_ref: "BTC-USDT-1A2B3C",
    profit: 1000,        // %10 kar
    buy_price: 10000,
    sell_price: 11000,
    buy_time: "2026-07-04 09:15:22",
    sell_time: "2026-07-04 11:42:05",
    duration: "2h 26m",
    last_signal_type: "RSI Cross",
    last_signal_volume: 1200000
  }
]

const TRADE_URL = 'http://localhost:8000/api/trade'

function App() {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <main className="flex min-h-screen flex-col bg-[#0a0a0f] text-slate-100">
        <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
          <Dashboard />
        </div>
        <Footer />
      </main>
    </QueryClientProvider>
  )
}

function Dashboard() {
  // Coin state'i burada tutuluyor (tüm bileşenler senkronize)
  const [activeCoin, setActiveCoin] = useState('BTC')

  const { data, isLoading, error } = useQuery({
    queryKey: ['trade', activeCoin],
    queryFn: async () => {
      // ⬇️ GERÇEK API KODU (Tasarım bitince bunu aktif et)
      /*
      const response = await fetch(TRADE_URL)
      if (!response.ok) throw new Error('Unable to load trade data')
      return response.json()
      */

      // ✅ MOCK DATA
      await new Promise(resolve => setTimeout(resolve, 800))
      return MOCK_TRADES
    },
    refetchInterval: 900000,
    staleTime: 900000,
  })

  return (
    <div className="w-full max-w-4xl rounded-3xl border border-cyan-400/20 bg-slate-950/80 p-4 shadow-[0_0_40px_rgba(34,211,238,0.15)] backdrop-blur-xl sm:p-8">
      
      {/* Header */}
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-cyan-300/80">
            Live Market Pulse
          </p>
          <h1 className="text-2xl font-semibold text-white sm:text-3xl">
            Trade Dashboard
          </h1>
        </div>
        
        {/* Live Badge */}
        <div className="flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1.5 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500"></span>
          </span>
          <span className="text-sm font-semibold uppercase tracking-wider text-red-300">
            Live
          </span>
        </div>
      </div>

      {/* Coin Selector */}
      <CoinSelector activeCoin={activeCoin} onSelectCoin={setActiveCoin} />

      {/* Price Chart (CoinGecko) */}
      <PriceChart activeCoin={activeCoin} />

      {/* Trade Data */}
      {isLoading ? (
        <div className="flex min-h-[280px] flex-col items-center justify-center rounded-2xl border border-cyan-400/20 bg-slate-900/70">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-cyan-400/20 border-t-cyan-300 shadow-[0_0_30px_rgba(34,211,238,0.35)]" />
          <p className="text-lg font-medium text-cyan-100">Syncing trade feed...</p>
          <p className="mt-1 text-sm text-slate-400">
            Initializing the latest market snapshot
          </p>
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-500/40 bg-red-500/10 p-6 text-red-200 shadow-[0_0_30px_rgba(248,113,113,0.22)]">
          <div className="mb-2 flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400 shadow-[0_0_10px_rgba(248,113,113,0.8)]" />
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-300">
              Connection issue
            </p>
          </div>
          <p className="text-base">
            {error.message || 'Unable to load trade data right now.'}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <TradeList trades={data} />
          <SummaryCard trades={data} />
        </div>
      )}
    </div>
  )
}

// Trade Listesi (Row Row)
function TradeList({ trades }) {
  return (
    <div className="flex flex-col gap-4">
      <AnimatePresence mode="popLayout">
        {trades.map((trade, index) => (
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
      className="group relative overflow-hidden rounded-2xl border border-cyan-400/20 bg-slate-900/60 p-4 shadow-[0_0_20px_rgba(34,211,238,0.08)] backdrop-blur-xl transition-all duration-300 hover:border-cyan-400/40 hover:shadow-[0_0_30px_rgba(34,211,238,0.15)]"
    >
      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.1),transparent_50%)]" />
      
      <div className="relative z-10 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6 items-center">
        
        {/* PROFIT */}
        <div className="flex flex-col justify-center border-r border-white/10 pr-4">
          <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 mb-1">Profit</p>
          <p className={`text-xl font-bold font-mono ${profitClass} drop-shadow-[0_0_8px_rgba(52,211,153,0.3)]`}>
            {profit > 0 ? '+' : ''}{formatValue(profit)}
          </p>
        </div>

        {/* PRICES */}
        <div className="flex flex-col justify-center border-r border-white/10 pr-4">
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
        <div className="flex flex-col justify-center border-r border-white/10 pr-4">
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
          <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 mb-1">Duration</p>
          <p className="text-lg font-bold font-mono text-cyan-100">
            {formatValue(trade.duration)}
          </p>
        </div>

      </div>
    </motion.div>
  )
}

export default App