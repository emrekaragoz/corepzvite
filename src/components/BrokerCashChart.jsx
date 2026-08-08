import React, { useMemo } from 'react'
import Chart from 'react-apexcharts'

const INITIAL_CASH = 1000
const LEVERAGE = 10
const SUMMARY_INITIAL = 100000

function BrokerCashChart({ trades }) {
  // ═══════════════════════════════════════════
  // BROKER CASH HESAPLAMA (LEVERAGE İLE)
  // ═══════════════════════════════════════════
  const { chartData, currentValue, totalProfit, profitPercent } = useMemo(() => {
    if (!trades || trades.length === 0) {
      return {
        chartData: [{ x: new Date(), y: INITIAL_CASH }],
        currentValue: INITIAL_CASH,
        totalProfit: 0,
        profitPercent: 0
      }
    }

    const sorted = [...trades].sort(
      (a, b) => new Date(a.buy_time) - new Date(b.buy_time)
    )

    const data = [{ x: new Date(sorted[0].buy_time).getTime() - 60000, y: INITIAL_CASH }]
    let current = INITIAL_CASH

    sorted.forEach((trade) => {
      const leveragedProfit = (trade.profit || 0) * LEVERAGE
      current += leveragedProfit
      data.push({
        x: new Date(trade.sell_time || trade.buy_time).getTime(),
        y: current
      })
    })

    const totalProfit = current - INITIAL_CASH
    const profitPercent = (totalProfit / INITIAL_CASH) * 100

    return {
      chartData: data,
      currentValue: current,
      totalProfit,
      profitPercent
    }
  }, [trades])

  // ═══════════════════════════════════════════
  // SUMMARY CARD HESAPLAMA (COMPOUND)
  // ═══════════════════════════════════════════
  const summary = useMemo(() => {
    if (!trades || trades.length === 0) {
      return {
        finalAmount: SUMMARY_INITIAL,
        profit: 0,
        tradeCount: 0
      }
    }

    let currentAmount = SUMMARY_INITIAL

    const sortedTrades = [...trades].sort(
      (a, b) => new Date(a.buy_time) - new Date(b.buy_time)
    )

    sortedTrades.forEach(trade => {
      const profitPercentage = trade.profit / trade.buy_price
      currentAmount = currentAmount * (1 + profitPercentage)
    })

    const profit = currentAmount - SUMMARY_INITIAL

    return {
      finalAmount: currentAmount,
      profit: profit,
      tradeCount: sortedTrades.length
    }
  }, [trades])

  const isProfit = totalProfit >= 0
  const accentColor = isProfit ? '#22c55e' : '#ef4444'
  const summaryProfitColor = summary.profit >= 0 ? 'text-emerald-400' : 'text-rose-400'

const options = {
    chart: {
        type: 'area',
        height: 300,
        background: 'transparent',
        toolbar: { show: false },
        zoom: { enabled: false },
    },
    theme: { mode: 'dark' },
    colors: [accentColor],
    fill: {
        type: 'gradient',
        gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.35,
        opacityTo: 0.02,
        stops: [0, 100]
        }
    },
    stroke: {
        curve: 'smooth',
        width: 2,
    },
    // ✅ VERİ NOKTALARI ÜZERİNDEKİ DEĞERLER (VİRGÜLSÜZ)
    dataLabels: {
        enabled: true,
        formatter: (value) => '$' + Math.round(value),
        style: {
        colors: ['#94a3b8'],
        fontSize: '9px',
        fontWeight: 500,
        },
        background: {
        enabled: false,
        },
        offsetY: -8,
    },
    grid: {
        borderColor: '#1e293b',
        strokeDashArray: 3,
        padding: {
        left: 0,
        right: 0,
        top: -15,
        bottom: -5
        }
    },
    xaxis: {
        type: 'datetime',
        labels: {
        style: { colors: '#64748b', fontSize: '9px' },
        datetimeFormatter: {
            day: 'dd MMM',
            hour: 'HH:mm',
        },
        hideOverlappingLabels: true,
        },
        axisBorder: { show: false },
        axisTicks: { show: false },
    },
    // ✅ Y-AXIS DEĞERLERİ (VİRGÜLSÜZ)
    yaxis: {
        labels: {
        style: { colors: '#64748b', fontSize: '9px' },
        formatter: (value) => '$' + Math.round(value),
        },
    },
    // ✅ TOOLTIP (VİRGÜLSÜZ)
    tooltip: {
        theme: 'dark',
        x: { format: 'dd MMM HH:mm' },
        y: { 
        formatter: (value) => '$' + Math.round(value),
        },
    },
    // ✅ BAŞLANGIÇ ÇİZGİSİ (VİRGÜLSÜZ)
    annotations: {
        yaxis: [{
        y: INITIAL_CASH,
        borderColor: '#475569',
        strokeDashArray: 4,
        label: {
            text: '$' + INITIAL_CASH,
            position: 'left',
            style: {
            color: '#94a3b8',
            background: 'transparent',
            fontSize: '9px',
            }
        }
        }]
    }
    }

  const series = [{
    name: 'Portfolio',
    data: chartData
  }]

  // ═══════════════════════════════════════════
  // FORMAT FONKSİYONLARI
  // ═══════════════════════════════════════════
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatProfit = (value) => {
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.abs(value))
    return `${value >= 0 ? '+' : '-'}${formatted}`
  }

  return (
    <div className="rounded-2xl border border-cyan-500/20 bg-slate-900/40 p-3 backdrop-blur-sm flex flex-col h-full">
      
      {/* ÜST: Başlık + Leverage */}
      <div className="mb-3 flex items-center justify-between">
  
  {/* Sol: Broker Cash + Miktar */}
  <div className="flex items-center gap-2.5">
    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: accentColor }}></span>
    <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 whitespace-nowrap">
      Broker Cash
    </h3>
    <p className="text-lg font-bold font-mono text-white leading-none whitespace-nowrap">
      ${Math.round(currentValue)}
    </p>
  </div>

  {/* Sağ: Net Profit + Yüzde + Leverage */}
  <div className="flex items-center gap-3">
    
    {/* Net Profit + Yüzde (belirgin) */}
    <div className="flex items-baseline gap-1.5">
      <p className={`text-base font-bold font-mono leading-none whitespace-nowrap ${
        isProfit ? 'text-emerald-400' : 'text-rose-400'
      }`}>
        {isProfit ? '+' : ''}{Math.round(totalProfit)}
      </p>
      <p className={`text-[10px] font-semibold whitespace-nowrap ${
        isProfit ? 'text-emerald-400/70' : 'text-rose-400/70'
      }`}>
        ({isProfit ? '+' : ''}{profitPercent.toFixed(1)}%)
      </p>
    </div>

    {/* Leverage (daha küçük) */}
    <span className="rounded border border-cyan-500/20 bg-cyan-500/5 px-1.5 py-0.5 text-[8px] font-mono text-cyan-400/80 whitespace-nowrap">
      {LEVERAGE}x Lev
    </span>
  </div>
</div>

      {/* GRAFİK */}
      <div className="min-h-[300px]">
        {chartData.length > 1 ? (
            <Chart 
            options={options} 
            series={series} 
            type="area" 
            height={300}
            />
        ) : (
            <div className="flex h-[300px] items-center justify-center">
            <p className="text-xs text-slate-500">
                Waiting for trades...
            </p>
            </div>
        )}
        </div>

      <div className="mt-2 rounded-xl border border-cyan-500/15 bg-slate-950/40 px-3 py-2.5">
        <div className="flex flex-wrap items-center justify-center gap-x-1.5 gap-y-0.5 text-[11px] leading-relaxed text-center">
          <span className="text-slate-400">If you had invested</span>
          <span className="font-semibold text-cyan-300">$100,000</span>
          <span className="text-slate-400">across all</span>
          <span className="font-semibold text-cyan-300">{summary.tradeCount} trades</span>
          <span className="text-slate-400">, you would have</span>
          <span className={`font-bold ${summaryProfitColor}`}>
            {formatCurrency(summary.finalAmount)}
          </span>
          <span className={`font-semibold ${summaryProfitColor}`}>
            ({formatProfit(summary.profit)})
          </span>
        </div>
      </div>
    </div>
  )
}

export default BrokerCashChart