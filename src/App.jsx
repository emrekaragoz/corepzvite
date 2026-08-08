import React, { useState } from 'react'
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import Footer from './components/Footer'
import CoinSelector from './components/CoinSelector'
import PriceChart from './components/PriceChart'
import SubscribeCard from './components/SubscribeCard'
import CryptoNews from './components/CryptoNews'
import TradeList from './components/TradeList'
import PositionCard from './components/PositionCard'
import BrokerCashChart from './components/BrokerCashChart'
import icon from './assets/icon.png'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

function App() {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <main className="flex min-h-screen flex-col bg-[#0a0a0f] text-slate-100">
        <div className="w-full flex flex-1 flex-col px-2 py-2 sm:px-4 sm:py-3 max-w-full">
          <Dashboard />
        </div>
        <Footer />
      </main>
    </QueryClientProvider>
  )
}

function Dashboard() {
  const [activeCoin, setActiveCoin] = useState('BTC')

  // ✅ TRADE GEÇMİŞİ
  const { data: trades, isLoading: isLoadingTrades, error: tradesError } = useQuery({
    queryKey: ['trades', activeCoin],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/api/trades`)
      if (!response.ok) throw new Error('Failed to fetch trades')
      return response.json()
    },
    refetchInterval: 30000,
    staleTime: 25000,
    gcTime: 10 * 60 * 1000,
    retry: 3,
    retryDelay: 2000,
    placeholderData: (previousData) => previousData,
  })

  // ✅ AKTİF POZİSYON
  const { data: activePosition, isLoading: isLoadingPosition } = useQuery({
    queryKey: ['position', activeCoin],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/api/position`)
      if (!response.ok) throw new Error('Failed to fetch position')
      return response.json()
    },
  })

  const isLoading = isLoadingTrades || isLoadingPosition
  const error = tradesError
  const hasPosition = activePosition && activePosition.buy_time

  return (
    <div className="w-full rounded-2xl border border-cyan-400/20 bg-slate-950/80 p-2 shadow-[0_0_24px_rgba(34,211,238,0.12)] backdrop-blur-xl sm:p-3">
      
      
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        
        {/* Üst (mobil) / Sol (desktop): Icon + Trade Dashboard */}
        <div className="flex min-w-0 items-center gap-2">
          <img 
            src={icon} 
            alt="Logo" 
            className="h-10 w-10" 
          />
          <p className="min-w-0 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300/90 truncate">
            Trade Dashboard
          </p>
        </div>
        
        {/* Alt (mobil) / Sağ (desktop): CoinSelector */}
        <div className="flex w-full items-center justify-end sm:w-auto">
          <CoinSelector activeCoin={activeCoin} onSelectCoin={setActiveCoin} />
        </div>
      </div>
      {/* Loading / Error */}
      {isLoading ? (
        <div className="flex min-h-[200px] flex-col items-center justify-center rounded-2xl border border-cyan-400/20 bg-slate-900/70">
          <div className="mb-3 h-10 w-10 animate-spin rounded-full border-4 border-cyan-400/20 border-t-cyan-300 shadow-[0_0_30px_rgba(34,211,238,0.35)]" />
          <p className="text-base font-medium text-cyan-100">Syncing trade feed...</p>
          <p className="mt-1 text-sm text-slate-400">
            Connecting to server at {API_BASE}
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
            Make sure backend is running
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          
          {/* ═══════════════════════════════════════════ */}
          {/* 1. PRICECHART + ACTIVE POSITION (MEVCUT)    */}
          {/* ═══════════════════════════════════════════ */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="md:col-span-3">
              <PriceChart 
                activeCoin={activeCoin} 
                buyOrder={hasPosition ? activePosition : null} 
              />
            </div>
            <div className="md:col-span-2">
                <PositionCard 
                  position={activePosition} 
                  activeCoin={activeCoin} 
                />
            </div>
          </div>

          {/* ═══════════════════════════════════════════ */}
          {/* 2. TRA DELIST + BROKER CASH   */}
          {/* ═══════════════════════════════════════════ */}
          {/* TradeList + BrokerCash */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-3">
              <BrokerCashChart trades={trades || []} />
              
            </div>
            <div className="lg:col-span-2">
              <TradeList trades={trades || []} />
            </div>
          </div>

          {/* ═══════════════════════════════════════════ */}
          {/* 4. SUBSCRIBE + NEWS (AYNI)                  */}
          {/* ═══════════════════════════════════════════ */}
          <SubscribeCard />
          <CryptoNews />
        </div>
      )}
    </div>
  )
}

export default App