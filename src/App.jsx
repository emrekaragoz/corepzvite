import { useState } from 'react'
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import { AnimatePresence, motion } from 'framer-motion'

const TRADE_URL = 'http://localhost:8000/api/trade'

function App() {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <Dashboard />
    </QueryClientProvider>
  )
}

function Dashboard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['trade'],
    queryFn: async () => {
      const response = await fetch(TRADE_URL)
      if (!response.ok) {
        throw new Error('Unable to load trade data')
      }
      return response.json()
    },
    refetchInterval: 9000,
    staleTime: 9000,
  })

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-slate-100">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="w-full max-w-3xl rounded-3xl border border-cyan-400/20 bg-slate-950/80 p-4 shadow-[0_0_40px_rgba(34,211,238,0.15)] backdrop-blur-xl sm:p-8">
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-cyan-300/80">
                Live Market Pulse
              </p>
              <h1 className="text-2xl font-semibold text-white sm:text-3xl">
                Trade Dashboard
              </h1>
            </div>
            <div className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-sm text-cyan-200">
              Auto-refresh every 15 min
            </div>
          </div>

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
            <AnimatePresence mode="wait">
              <motion.div
                key={JSON.stringify(data)}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
              >
                <TradeCard data={data} />
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </main>
  )
}

function TradeCard({ data }) {
  const trade = data?.data ?? data
  const payload = Array.isArray(trade) ? trade[0] : trade

  const orderRef = payload?.order_ref ?? payload?.orderRef ?? '—'
  const profit = payload?.profit ?? null
  const buyPrice = payload?.buy_price ?? payload?.buyPrice ?? null
  const sellPrice = payload?.sell_price ?? payload?.sellPrice ?? null
  const buyTime = payload?.buy_time ?? payload?.buyTime ?? null
  const sellTime = payload?.sell_time ?? payload?.sellTime ?? null
  const duration = payload?.duration ?? null
  const signalType = payload?.last_signal_type ?? payload?.lastSignalType ?? null
  const signalVolume = payload?.last_signal_volume ?? payload?.lastSignalVolume ?? null

  const formatValue = (value) => {
    if (value === null || value === undefined || value === '') {
      return '—'
    }

    if (typeof value === 'number') {
      return value.toLocaleString()
    }

    return value
  }

  const profitClass = profit > 0 ? 'text-emerald-400' : profit < 0 ? 'text-rose-400' : 'text-slate-100'

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="group relative overflow-hidden rounded-2xl border border-cyan-400/30 bg-slate-900/60 p-5 shadow-[0_0_40px_rgba(34,211,238,0.14)] backdrop-blur-xl sm:p-6"
    >
      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.16),transparent_46%)]" />
      <div className="pointer-events-none absolute inset-0 rounded-2xl before:absolute before:inset-[-1px] before:rounded-2xl before:bg-[linear-gradient(115deg,rgba(34,211,238,0.2),rgba(34,211,238,0.02),rgba(34,211,238,0.35))] before:opacity-70 before:transition-opacity before:duration-300 before:content-[''] before:animate-[spin_8s_linear_infinite] group-hover:before:opacity-100" />
      <div className="relative z-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-cyan-300/70">
              Active trade
            </p>
            <h2 className="mt-1 text-xl font-semibold text-white sm:text-2xl">{orderRef}</h2>
            <p className="mt-2 text-sm text-slate-400">Futuristic execution snapshot</p>
          </div>
          <div className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-sm text-cyan-200">
            Live
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Profit</p>
            <p className={`mt-2 text-lg font-semibold font-mono ${profitClass}`}>
              {profit !== null ? `${profit > 0 ? '+' : ''}${formatValue(profit)}` : '—'}
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Buy price</p>
            <p className="mt-2 text-lg font-semibold font-mono text-cyan-200">
              {formatValue(buyPrice)}
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Sell price</p>
            <p className="mt-2 text-lg font-semibold font-mono text-cyan-200">
              {formatValue(sellPrice)}
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Duration</p>
            <p className="mt-2 text-lg font-semibold font-mono text-cyan-200">
              {formatValue(duration)}
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Buy time</p>
            <p className="mt-2 text-lg font-semibold font-mono text-cyan-200">
              {formatValue(buyTime)}
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Sell time</p>
            <p className="mt-2 text-lg font-semibold font-mono text-cyan-200">
              {formatValue(sellTime)}
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Last signal</p>
            <p className="mt-2 text-lg font-semibold font-mono text-cyan-200">
              {formatValue(signalType)}
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Signal volume</p>
            <p className="mt-2 text-lg font-semibold font-mono text-cyan-200">
              {formatValue(signalVolume)}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default App
