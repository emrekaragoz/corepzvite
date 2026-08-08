import React from 'react'

function PositionCard({ position }) {
  const hasData = position 

  // BOŞ DURUM
  if (!hasData) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-600/40 bg-slate-900/30 p-4 backdrop-blur-sm h-full flex flex-col items-center justify-center min-h-[280px]">
        
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

        <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400 mb-2">
          No Active Position
        </h3>
        <p className="text-xs text-slate-500 text-center leading-relaxed max-w-[200px]">
          Waiting for the next trading signal to open a position
        </p>

        <div className="mt-4 flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-slate-600 animate-pulse" style={{ animationDelay: '0ms' }}></span>
          <span className="h-1.5 w-1.5 rounded-full bg-slate-600 animate-pulse" style={{ animationDelay: '200ms' }}></span>
          <span className="h-1.5 w-1.5 rounded-full bg-slate-600 animate-pulse" style={{ animationDelay: '400ms' }}></span>
        </div>
      </div>
    )
  }

  // POZİSYON VAR
  return (
    <div className="rounded-2xl border border-emerald-500/20 bg-slate-900/60 p-4 backdrop-blur-sm h-full">
      
      {/* Başlık */}
      <div className="mb-4 flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
        </span>
        <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
          Active Position
        </h3>
      </div>
      
      {/* Pozisyon bilgileri */}
      <div className="flex flex-col gap-3">
        
        {/* Buy Price */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
          <p className="text-[10px] uppercase tracking-[0.15em] text-slate-500">Buy Price</p>
          <p className="text-lg font-bold font-mono text-emerald-300 mt-1">
            ${position.buy_price?.toLocaleString(undefined, { 
              minimumFractionDigits: 2, 
              maximumFractionDigits: 2 
            }) || '—'}
          </p>
        </div>
        
        {/* Buy Time */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
          <p className="text-[10px] uppercase tracking-[0.15em] text-slate-500">Buy Time</p>
          <p className="text-sm font-semibold font-mono text-cyan-200 mt-1">
            {position.buy_time || '—'}
          </p>
        </div>
        
      </div>
    </div>
  )
}

export default PositionCard