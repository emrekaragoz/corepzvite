import React, { useState, useEffect } from 'react'

// Binance sembol mapping
const COIN_SYMBOLS = {
  BTC: 'BTCUSDT',
  XRP: 'XRPUSDT',
  BNB: 'BNBUSDT',
  TRX: 'TRXUSDT',
}

function PositionCard({ position, activeCoin = 'BTC' }) {
  const [currentPrice, setCurrentPrice] = useState(null)
  const [isLoadingPrice, setIsLoadingPrice] = useState(false)

  const hasData = position && (
    position.buy_time || 
    position.buy_price || 
    position.order_ref
  )

  // ✅ Güncel fiyatı Binance'dan çek (her 30 saniyede bir)
  useEffect(() => {
    if (!hasData) return

    const symbol = COIN_SYMBOLS[activeCoin] || 'BTCUSDT'

    const fetchPrice = async () => {
      try {
        setIsLoadingPrice(true)
        const response = await fetch(
          `https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`
        )
        if (response.ok) {
          const data = await response.json()
          setCurrentPrice(parseFloat(data.price))
        }
      } catch (err) {
        console.error('Price fetch error:', err)
      } finally {
        setIsLoadingPrice(false)
      }
    }

    // İlk çekme
    fetchPrice()

    // Her 30 saniyede bir güncelle
    const interval = setInterval(fetchPrice, 10000)

    return () => clearInterval(interval)
  }, [hasData, activeCoin])

  // ✅ Current Profit hesapla
  const profitData = (() => {
  if (!hasData || currentPrice === null || !position.buy_price) {
    return null
  }

  // Ham yüzde (leverage olmadan)
  const rawProfitPercent = ((currentPrice - position.buy_price) / position.buy_price) * 100
  
  // 10x leverage uygula
  const LEVERAGE = 10
  const profitPercent = rawProfitPercent * LEVERAGE
  const profit = (rawProfitPercent / 100) * position.buy_price * LEVERAGE
  const isProfit = profit >= 0

  return { profit, profitPercent, isProfit }
})()

  // ============================================
  // BOŞ DURUM
  // ============================================
  if (!hasData) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-600/40 bg-slate-900/30 p-4 backdrop-blur-sm h-full flex flex-col items-center justify-center min-h-[280px]">
        
        {/* İkon */}
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-slate-600/30 bg-slate-800/40">
          <svg 
            className="h-7 w-7 text-slate-500" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" 
            />
          </svg>
        </div>

        {/* No Position mesajı */}
        <h3 className="text-sm font-bold uppercase tracking-[0.25em] text-slate-300 mb-2">
          No Position
        </h3>
        <p className="text-xs text-slate-500 text-center leading-relaxed max-w-[220px]">
          Waiting for the next trading signal to open a position
        </p>

        {/* Animasyonlu bekleme */}
        <div className="mt-4 flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-slate-600 animate-pulse" style={{ animationDelay: '0ms' }}></span>
          <span className="h-1.5 w-1.5 rounded-full bg-slate-600 animate-pulse" style={{ animationDelay: '200ms' }}></span>
          <span className="h-1.5 w-1.5 rounded-full bg-slate-600 animate-pulse" style={{ animationDelay: '400ms' }}></span>
        </div>
      </div>
    )
  }

  // ============================================
  // POZİSYON VAR
  // ============================================
  return (
    <div className="rounded-2xl border border-emerald-500/20 bg-slate-900/60 p-4 backdrop-blur-sm h-full flex flex-col">
      
      {/* Başlık */}
      <div className="mb-3 flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
        </span>
        <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
          Active Position
        </h3>
      </div>
      
      {/* Pozisyon bilgileri */}
      <div className="flex flex-col gap-2.5 flex-1">
        
        {/* Buy Price */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-2.5">
          <p className="text-[10px] uppercase tracking-[0.15em] text-slate-500">Buy Price</p>
          <p className="text-base font-bold font-mono text-white mt-0.5">
            ${position.buy_price?.toLocaleString(undefined, { 
              minimumFractionDigits: 2, 
              maximumFractionDigits: 2 
            }) || '—'}
          </p>
        </div>
        
        {/* Buy Time */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-2.5">
          <p className="text-[10px] uppercase tracking-[0.15em] text-slate-500">Buy Time</p>
          <p className="text-sm font-semibold font-mono text-cyan-200 mt-0.5">
            {position.buy_time || '—'}
          </p>
        </div>
        
      </div>

      {/* ✅ Current Profit (Alt kısım, belirgin) */}
      {profitData && (
        <div className={`mt-3 rounded-xl border p-3 ${
          profitData.isProfit 
            ? 'border-emerald-500/20 bg-emerald-500/5' 
            : 'border-rose-500/20 bg-rose-500/5'
        }`}>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">
                Current Profit
              </p>
              <span className="rounded border border-cyan-500/20 bg-cyan-500/5 px-1.5 py-0.5 text-[8px] font-mono text-cyan-400/80">
                10x
              </span>
            </div>
          </div>
          
          <div className="flex items-baseline justify-left gap-2">
            <p className={`text-xl font-bold font-mono ${
              profitData.isProfit ? 'text-emerald-400' : 'text-rose-400'
            }`}>
              {profitData.isProfit ? '+' : ''}{profitData.profitPercent.toFixed(1)}%
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default PositionCard