import React from 'react'

const COINS = [
  { 
    id: 'BTC', 
    label: 'BTC', 
    locked: false,
    icon: 'https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/128/color/btc.png'
  },
  { 
    id: 'XRP', 
    label: 'XRP', 
    locked: true,
    icon: 'https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/128/color/xrp.png'
  },
  { 
    id: 'BNB', 
    label: 'BNB', 
    locked: true,
    icon: 'https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/128/color/bnb.png'
  },
  { 
    id: 'TRX', 
    label: 'TRX', 
    locked: true,
    icon: 'https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/128/color/trx.png'
  },
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
    <div className="w-full max-w-full overflow-x-auto">
      <div className="mx-auto flex w-max items-center gap-1 rounded-full border border-cyan-500/20 bg-slate-900/60 p-1 backdrop-blur-md shadow-[0_0_20px_rgba(34,211,238,0.08)] sm:w-auto sm:flex-wrap sm:justify-center">
        {COINS.map((coin) => {
          const isActive = activeCoin === coin.id
          const isLocked = coin.locked
          
          return (
            <button
              key={coin.id}
              type="button"
              disabled={isLocked}
              onClick={() => handleSelect(coin)}
              className={`relative flex min-w-max items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider transition-all duration-300 sm:px-4 sm:py-1.5 sm:text-xs ${
                isActive
                  ? 'border border-cyan-400/30 bg-cyan-500/15 text-cyan-200 shadow-[0_0_12px_rgba(34,211,238,0.15)]'
                  : 'border border-transparent text-slate-500'
              } ${
                isLocked 
                  ? 'cursor-not-allowed opacity-70' 
                  : 'cursor-pointer hover:bg-cyan-500/10 hover:text-cyan-300'
              }`}
            >
              <img 
                src={coin.icon} 
                alt={coin.label}
                className="h-4 w-4 rounded-full object-cover"
              />
              <span>{coin.label}</span>
              {isLocked && <LockIcon className="h-3 w-3 opacity-60" />}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default CoinSelector