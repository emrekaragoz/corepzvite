import React, { useState, useEffect } from 'react'
import { formatDateDisplay } from '../utils/date'

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
  // BOŞ DURUM - Strateji canlı çalışıyor
if (!hasData) {
  return (
    <div className="relative rounded-2xl border border-cyan-500/10 bg-gradient-to-br from-slate-900/90 to-slate-950/90 p-6 backdrop-blur-xl h-full flex flex-col items-center justify-center overflow-hidden min-h-[220px] shadow-[inset_0_0_80px_rgba(0,0,0,0.6)]">
      
      {/* CSS Animasyonları */}
      <style>{`
        @keyframes breathe {
          0%, 100% { transform: scale(1); opacity: 0.15; }
          50% { transform: scale(1.4); opacity: 0.35; }
        }
        @keyframes textShimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spinReverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes scanHorizontal {
          0% { left: -10%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { left: 110%; opacity: 0; }
        }
        @keyframes coreGlow {
          0%, 100% { box-shadow: 0 0 15px rgba(34, 211, 238, 0.2); }
          50% { box-shadow: 0 0 40px rgba(34, 211, 238, 0.6), 0 0 80px rgba(34, 211, 238, 0.15); }
        }
        .animate-breathe { animation: breathe 5s ease-in-out infinite; }
        .animate-text-shimmer {
          background-size: 200% auto;
          animation: textShimmer 5s linear infinite;
        }
        .animate-spin-slow { animation: spinSlow 10s linear infinite; }
        .animate-spin-reverse { animation: spinReverse 7s linear infinite; }
        .animate-scan-horizontal {
          animation: scanHorizontal 4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        .animate-core-glow { animation: coreGlow 3s ease-in-out infinite; }
      `}</style>

      {/* Arka Plan Işık Küresi */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl animate-breathe" />
      
      {/* İnce Grid Deseni */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)', backgroundSize: '24px 24px' }} />

      {/* === FRAME'İ SOLDAN SAĞA TARAYAN BÜYÜK IŞIK EFEXTİ === */}
      <div className="absolute top-0 h-full w-full pointer-events-none">
        <div className="absolute top-0 h-full w-[1px] bg-gradient-to-b from-transparent via-cyan-300 to-transparent shadow-[0_0_20px_#22d3ee] animate-scan-horizontal" />
        <div className="absolute top-0 h-full w-[100px] bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent blur-2xl animate-scan-horizontal" style={{ animationDelay: '0.1s' }} />
      </div>
      
        {/* === ORTA GÖRSEL (Dönen Halkalar + Hedef İkon) === */}
      <div className="relative mb-5 flex h-20 w-20 items-center justify-center">
        
        {/* Dıştaki yavaş dönen çember */}
        <div className="absolute h-full w-full rounded-full border border-cyan-400/20 animate-spin-slow" />
        
        {/* Ortadaki ters yönde dönen çember */}
        <div className="absolute h-[85%] w-[85%] rounded-full border border-cyan-400/30 animate-spin-reverse" />
        
        {/* İçteki nabız atan halka (Ping efekti) */}
        <div className="absolute h-[70%] w-[70%] rounded-full border border-emerald-400/20 animate-ping" style={{ animationDuration: '1.8s' }} />

        {/* Merkezdeki Glow Butonu (Fiyat hedefini simgeler) */}
        <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-cyan-500 to-emerald-500 shadow-[0_0_35px_rgba(34,211,238,0.6)]">
        </div>
      </div>

      {/* === METİN ALANI === */}
      <div className="relative z-10 text-center space-y-1.5 max-w-[240px]">
        <h3 className="text-[11px] font-bold tracking-[0.12em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 via-white to-cyan-200 animate-text-shimmer leading-relaxed">
          Scanning the best entry point
        </h3>
        <p className="text-[11px] font-light tracking-wider text-slate-400/70">
          No current position yet.
        </p>
      </div>

      {/* === SAĞ ÜST KÖŞE "LIVE" ETİKETİ === */}
      <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 border border-emerald-500/20 backdrop-blur-sm z-20">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
        </span>
        <span className="text-[10px] font-semibold uppercase tracking-widest text-emerald-300">Live</span>
      </div>

    </div>
  );
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
            {formatDateDisplay(position.buy_time)}
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