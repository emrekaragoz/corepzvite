export const COIN_MAP = {
  BTC: {
    id: 'BTC',
    name: 'Bitcoin',
    symbol: 'BTC',
    binanceSymbol: 'BTCUSDT',
    icon: 'https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/128/color/btc.png',
    locked: false,
  },
  XRP: {
    id: 'XRP',
    name: 'Ripple',
    symbol: 'XRP',
    binanceSymbol: 'XRPUSDT',
    icon: 'https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/128/color/xrp.png',
    locked: true,
  },
  BNB: {
    id: 'BNB',
    name: 'BNB',
    symbol: 'BNB',
    binanceSymbol: 'BNBUSDT',
    icon: 'https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/128/color/bnb.png',
    locked: true,
  },
  TRX: {
    id: 'TRX',
    name: 'TRON',
    symbol: 'TRX',
    binanceSymbol: 'TRXUSDT',
    icon: 'https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/128/color/trx.png',
    locked: true,
  },
}

export const AVAILABLE_COINS = Object.values(COIN_MAP)
export const COIN_SYMBOLS = Object.fromEntries(
  Object.entries(COIN_MAP).map(([key, coin]) => [key, coin.binanceSymbol])
)
