import React, { useState } from 'react'
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import Footer from './components/Footer'
import CoinSelector from './components/CoinSelector'
import PriceChart from './components/PriceChart'
import SummaryCard from './components/SummaryCard'
import SubscribeCard from './components/SubscribeCard'
import CryptoNews from './components/CryptoNews'
import TradeList from './components/TradeList'
import PositionCard from './components/PositionCard' 

// ✅ API URL'leri
const API_BASE = 'http://localhost:8000'

function App() {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <main className="flex min-h-screen flex-col bg-[#0a0a0f] text-slate-100">
        <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-4 py-4 sm:px-6 lg:px-8">
          <Dashboard />
        </div>
        <Footer />
      </main>
    </QueryClientProvider>
  )
}

function Dashboard() {
  const [activeCoin, setActiveCoin] = useState('BTC')

  // ✅ TRADE GEÇMİŞİ (Server'dan)
  const { data: trades, isLoading: isLoadingTrades, error: tradesError } = useQuery({
    queryKey: ['trades', activeCoin],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/api/trades`)
      if (!response.ok) throw new Error('Failed to fetch trades')
      return response.json()
    }
  })

  // ✅ AKTİF POZİSYON (Server'dan)
  const { data: activePosition, isLoading: isLoadingPosition } = useQuery({
    queryKey: ['position', activeCoin],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/api/position`)
      if (!response.ok) throw new Error('Failed to fetch position')
      return response.json()
    }
  })

  const isLoading = isLoadingTrades || isLoadingPosition
  const error = tradesError

  return (
    <div className="w-full max-w-4xl rounded-3xl border border-cyan-400/20 bg-slate-950/80 p-3 shadow-[0_0_40px_rgba(34,211,238,0.15)] backdrop-blur-xl sm:p-5">
      
      {/* ✅ HEADER - TEK SATIR: Trade Dashboard | CoinSelector | Live */}
      <div className="mb-4 flex items-center">
        
        {/* Sol: Trade Dashboard */}
        <div className="flex-1 flex justify-start">
          <p className="text-sm font-medium uppercase tracking-[0.35em] text-cyan-300/80 whitespace-nowrap">
            Dashboard
          </p>
        </div>
        
        {/* Orta: CoinSelector */}
        <div className="flex-none">
          <CoinSelector activeCoin={activeCoin} onSelectCoin={setActiveCoin} />
        </div>
        
        {/* Sağ: Live Badge */}
        <div className="flex-1 flex justify-end">
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
      </div>

      {/* Price Chart + Aktif Pozisyon */}
      <div className="mb-4">
        {activePosition && activePosition.buy_time ? (
          // ✅ Pozisyon var: Grid layout (3/4 PriceChart + 1/4 PositionCard)
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-3">
              <PriceChart 
                activeCoin={activeCoin} 
                buyOrder={activePosition} 
              />
            </div>
            <div className="md:col-span-1">
              <PositionCard position={activePosition} />
            </div>
          </div>
        ) : (
          // ✅ Pozisyon yok: PriceChart tam genişlik
          <PriceChart 
            activeCoin={activeCoin} 
            buyOrder={null} 
          />
        )}
      </div>

      {/* Trade Data */}
      {isLoading ? (
        <div className="flex min-h-[200px] flex-col items-center justify-center rounded-2xl border border-cyan-400/20 bg-slate-900/70">
          <div className="mb-3 h-10 w-10 animate-spin rounded-full border-4 border-cyan-400/20 border-t-cyan-300 shadow-[0_0_30px_rgba(34,211,238,0.35)]" />
          <p className="text-base font-medium text-cyan-100">Syncing trade feed...</p>
          <p className="mt-1 text-sm text-slate-400">
            Connecting to server at localhost:8000
          </p>
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-500/40 bg-red-500/10 p-5 text-red-200 shadow-[0_0_30px_rgba(248,113,113,0.22)]">
          <div className="mb-2 flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400 shadow-[0_0_10px_rgba(248,113,113,0.8)]" />
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-300">
              Server Connection Issue
            </p>
          </div>
          <p className="text-base">
            {error.message || 'Unable to connect to backend server.'}
          </p>
          <p className="mt-1 text-xs text-red-400/70">
            Make sure `python api_server.py` is running on port 8000
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <TradeList trades={trades || []} />
          <SummaryCard trades={trades || []} />
          <SubscribeCard />
          <CryptoNews />
        </div>
      )}
    </div>
  )
}

export default App