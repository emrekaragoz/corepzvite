import React from 'react'

const COINS = [
  { id: 'BTC', label: 'BTC', locked: false },
  { id: 'XRP', label: 'XRP', locked: true },
  { id: 'BNB', label: 'BNB', locked: true },
  { id: 'TRX', label: 'TRX', locked: true },
]

function LockIcon({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  )
}

function CoinSelector({ activeCoin, onSelectCoin }) {
  const handleSelect = (coin) => {
    if (!coin.locked) {
      onSelectCoin(coin.id)
    }
  }

  return (
    <div className="mb-8 flex justify-center">
      <div className="inline-flex items-center gap-1 rounded-full border border-cyan-500/20 bg-slate-900/60 p-1 backdrop-blur-md shadow-[0_0_20px_rgba(34,211,238,0.08)]">
        {COINS.map((coin) => {
          const isActive = activeCoin === coin.id
          const isLocked = coin.locked
          
          return (
            <button
              key={coin.id}
              type="button"
              disabled={isLocked}
              onClick={() => handleSelect(coin)}
              className={`relative flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                isActive
                  ? 'bg-cyan-500/15 text-cyan-200 border border-cyan-400/30 shadow-[0_0_12px_rgba(34,211,238,0.15)]'
                  : 'text-slate-500 border border-transparent'
              } ${
                isLocked 
                  ? 'cursor-not-allowed opacity-70' 
                  : 'cursor-pointer hover:bg-cyan-500/10 hover:text-cyan-300'
              }`}
            >
              {isLocked && <LockIcon className="h-3 w-3 opacity-60" />}
              <span>{coin.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default CoinSelector