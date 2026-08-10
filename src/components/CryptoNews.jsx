import React from 'react'
import { useQuery } from '@tanstack/react-query'

// ✅ CoinTelegraph RSS → JSON (API key gerektirmez, ücretsiz)
const RSS_URL = 'https://api.rss2json.com/v1/api.json?rss_url=https://cointelegraph.com/rss'

function CryptoNews() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['cryptoNews'],
    queryFn: async () => {
      const response = await fetch(RSS_URL)
      if (!response.ok) throw new Error('Failed to fetch news')
      const json = await response.json()
      return json.items || []
    },
    refetchInterval: 900000, // 15 dakika
    staleTime: 900000,
  })

  // İlk 6 haberi al
  const news = data?.slice(0, 6) || []

  // Relative time hesapla
  const getTimeAgo = (dateString) => {
    const now = Date.now()
    const published = new Date(dateString).getTime()
    const diff = Math.floor((now - published) / 1000)
    
    if (diff < 60) return 'Just now'
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
    return `${Math.floor(diff / 86400)}d ago`
  }

  // HTML etiketlerini temizle
  const stripHtml = (html) => {
    if (!html) return ''
    return html.replace(/<[^>]*>/g, '').substring(0, 100) + '...'
  }

  return (
    <div className="mt-6">
      {/* Başlık */}
      <div className="mb-4 flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
        <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-200">
          Crypto News
        </h3>
        <span className="ml-auto text-[10px] uppercase tracking-wider text-slate-500">
          Auto-refresh 15min
        </span>
      </div>

      {isLoading ? (
        <div className="flex min-h-[120px] items-center justify-center rounded-2xl border border-cyan-400/20 bg-slate-900/70">
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-400/20 border-t-cyan-300" />
            <p className="text-xs text-slate-400">Loading news...</p>
          </div>
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-4 text-center">
          <p className="text-sm text-red-300">Failed to load news</p>
          <p className="mt-1 text-xs text-slate-400">{error.message}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {news.map((item, index) => (
            <a
              key={item.guid || index}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-xl border border-white/10 bg-slate-900/60 p-3 transition-all duration-300 hover:border-cyan-400/30 hover:bg-slate-900/80 hover:shadow-[0_0_20px_rgba(34,211,238,0.1)]"
            >
              <div className="flex items-start gap-3">
                {/* Haber Görseli */}
                {item.thumbnail || item.enclosure?.link ? (
                  <img 
                    src={item.thumbnail || item.enclosure.link} 
                    alt=""
                    className="h-12 w-12 flex-shrink-0 rounded-lg object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none'
                    }}
                  />
                ) : (
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                  </div>
                )}
                
                {/* İçerik */}
                <div className="min-w-0">
                  <h4 className="text-sm font-semibold text-white line-clamp-2 group-hover:text-cyan-200 transition-colors">
                    {item.title}
                  </h4>
                  <div className="mt-1.5 flex items-center gap-2 text-[11px] text-slate-400">
                    <span className="font-medium text-cyan-400/80">
                      {item.author || 'CoinTelegraph'}
                    </span>
                    <span className="text-slate-600">•</span>
                    <span>{getTimeAgo(item.pubDate)}</span>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}

export default CryptoNews