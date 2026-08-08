import React, { useMemo } from 'react'
import Chart from 'react-apexcharts'

const INITIAL_CASH = 1000
const LEVERAGE = 10

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

  const isProfit = totalProfit >= 0
  const accentColor = isProfit ? '#22c55e' : '#ef4444'

  const options = {
    chart: {
      type: 'area',
      height: 250,
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
        right: 10,
        top: -15,
        bottom: 10  // ✅ X-axis etiketleri için alt padding artırıldı
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
        offsetY: 8,  // ✅ Etiketleri biraz aşağı it (görünür olsun)
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
      y: { 
        formatter: (value) => '$' + Math.round(value),
      },
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

  const series = [{
    name: 'Portfolio',
    data: chartData
  }]

  return (
    <div className="rounded-2xl border border-cyan-500/20 bg-slate-900/40 p-3 backdrop-blur-sm flex flex-col h-full">
      
      {/* ✅ ÜST: Başlık (sol) + Miktar + Yüzde (sağ, aynı boyut) */}
      <div className="mb-3 flex items-center justify-between">
        
        {/* Sol: Broker Cash */}
        <div className="flex items-center gap-2.5">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: accentColor }}></span>
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-300 whitespace-nowrap">
            Broker Cash
          </h3>
        </div>

        {/* Sağ: Miktar + Profit Yüzdesi (AYNI BOYUT) */}
        <div className="flex items-center gap-2">
          <p className="text-lg font-bold font-mono text-white leading-none whitespace-nowrap">
            ${Math.round(currentValue)}
          </p>
          <p className={`text-lg font-bold font-mono leading-none whitespace-nowrap ${
            isProfit ? 'text-emerald-400' : 'text-rose-400'
          }`}>
            ({isProfit ? '+' : ''}{profitPercent.toFixed(1)}%)
          </p>
        </div>
      </div>

      {/* GRAFİK */}
      <div className="h-[250px]">
        {chartData.length > 1 ? (
          <Chart 
            options={options} 
            series={series} 
            type="area" 
            height={250}
          />
        ) : (
          <div className="flex h-[250px] items-center justify-center">
            <p className="text-xs text-slate-500">
              Waiting for trades...
            </p>
          </div>
        )}
      </div>

      {/* ✅ Summary Card KALDIRILDI */}
    </div>
  )
}

export default BrokerCashChart