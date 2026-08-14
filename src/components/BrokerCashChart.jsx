import React, { useMemo } from 'react'
import Chart from 'react-apexcharts'

const INITIAL_CASH = 1000

function BrokerCashChart({ trades }) {
  const { chartData, currentValue, totalProfit, profitPercent } = useMemo(() => {
    if (!trades || trades.length === 0) {
      return {
        chartData: [{ x: new Date(), y: INITIAL_CASH }],
        currentValue: INITIAL_CASH,
        totalProfit: 0,
        profitPercent: 0
      }
    }

    // Tarihe göre en eskiden en yeniye sırala
    const sorted = [...trades].sort(
      (a, b) => new Date(a.buy_time) - new Date(b.buy_time)
    )

    // İlk veri noktası: ilk işlemden hemen önceki başlangıç bakiyesi
    const data = [{ x: new Date(sorted[0].buy_time).getTime() - 60000, y: INITIAL_CASH }]
    let current = INITIAL_CASH

    sorted.forEach((trade) => {
      // trade.profit yüzde olarak kabul edilir (örn. 10 → %10)
      const profitPercent = trade.profit || 0
      // Bileşik büyüme: current = current * (1 + profitPercent/100)
      current *= (1 + profitPercent / 100)
      data.push({
        x: new Date(trade.sell_time || trade.buy_time).getTime(),
        y: current
      })
    })

    const totalProfit = current - INITIAL_CASH
    const profitPercent = (totalProfit / INITIAL_CASH) * 100

    return { chartData: data, currentValue: current, totalProfit, profitPercent }
  }, [trades])

  const isProfit = totalProfit >= 0
  const accentColor = isProfit ? '#22c55e' : '#ef4444'

  const options = {
    chart: {
      type: 'area',
      height: '100%',
      background: 'transparent',
      toolbar: { show: false },
      zoom: { enabled: false },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 600,
      },
    },
    theme: { mode: 'dark' },
    colors: [accentColor],
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.02,
        stops: [0, 100]
      }
    },
    stroke: {
      curve: 'smooth',
      width: 2.5,
    },
    dataLabels: {
      enabled: true,
      formatter: (value) => '$' + Math.round(value),
      style: {
        colors: ['#94a3b8'],
        fontSize: '9px',
        fontWeight: 500,
      },
      background: { enabled: false },
      offsetY: -10,
    },
    grid: {
      borderColor: '#1e293b',
      strokeDashArray: 3,
      padding: {
        left: 10,
        right: 15,
        top: 20,
        bottom: 5
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
        offsetY: 8,
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: { colors: '#64748b', fontSize: '9px' },
        formatter: (value) => '$' + Math.round(value),
      },
    },
    tooltip: {
      theme: 'dark',
      x: { format: 'dd MMM HH:mm' },
      y: { formatter: (value) => '$' + Math.round(value) },
    },
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

  const series = [{ name: 'Portfolio', data: chartData }]

  return (
    <div className="relative rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-slate-900/60 to-slate-950/40 p-4 backdrop-blur-sm flex flex-col overflow-hidden">
      
      {/* Dekoratif glow efekti */}
      <div 
        className="pointer-events-none absolute -top-20 -right-20 h-40 w-40 rounded-full blur-3xl opacity-20"
        style={{ backgroundColor: accentColor }}
      />

      {/* ÜST: Başlık (sol) + Miktar + Yüzde (sağ) */}
      <div className="relative mb-3 flex items-center justify-between">
        
        {/* Sol: Broker Cash + Leverage */}
        <div className="flex items-center gap-2.5">
          <span 
            className="h-2 w-2 rounded-full shadow-lg" 
            style={{ backgroundColor: accentColor, boxShadow: `0 0 8px ${accentColor}` }}
          />
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-300 whitespace-nowrap">
            Broker Cash
          </h3>
        </div>

        {/* Sağ: Miktar + Yüzde (aynı boyut) */}
        <div className="flex items-center gap-2">
          <p className="text-lg font-bold font-mono text-white leading-none whitespace-nowrap">
            ${Math.round(currentValue)}
          </p>
          <p className={`text-md font-bold font-mono leading-none whitespace-nowrap ${
            isProfit ? 'text-emerald-400' : 'text-rose-400'
          }`}>
            ({isProfit ? '+' : ''}{profitPercent.toFixed(1)}%)
          </p>
        </div>
      </div>

      {/* GRAFİK */}
      <div className="relative h-[280px] w-full">
        {chartData.length > 1 ? (
          <Chart 
            options={options} 
            series={series} 
            type="area" 
            height="100%"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-400/20 border-t-cyan-300" />
            <p className="text-xs text-slate-500">Waiting for trades...</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default BrokerCashChart
