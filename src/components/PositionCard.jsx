import React from 'react'

function PositionCard({ position }) {
  if (!position || !position.buy_time) return null
  
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
        
        {/* Order Ref */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
          <p className="text-[10px] uppercase tracking-[0.15em] text-slate-500">Order Ref</p>
          <p className="text-sm font-semibold font-mono text-white mt-1 truncate">
            {position.order_ref || '—'}
          </p>
        </div>
        
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