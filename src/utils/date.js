const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Agu', 'Sep', 'Oct', 'Nov', 'Dec'
]

function parseDate(value) {
  if (!value) return null
  const date = value instanceof Date ? value : new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

export function formatDateDisplay(value) {
  const date = parseDate(value)
  if (!date) return '—'

  const day = date.getDate()
  const month = MONTHS[date.getMonth()] || '---'
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')

  return `${day} ${month} ${hours}:${minutes}`
}

export function formatShortDate(value) {
  const date = parseDate(value)
  if (!date) return '—'

  const day = date.getDate()
  const month = MONTHS[date.getMonth()] || '---'
  return `${day} ${month}`
}

export function formatDuration(durationStr) {
  if (!durationStr || durationStr === 'N/A') return '—'

  const normalized = String(durationStr).trim()
  if (/^\d{1,2}:\d{2}:\d{2}$/.test(normalized)) {
    const [hours, minutes] = normalized.split(':').map(Number)
    return `${hours} hours ${minutes} mins`
  }

  const hourMatch = normalized.match(/(\d+)h/)
  const minMatch = normalized.match(/(\d+)m/)
  const hours = hourMatch ? Number(hourMatch[1]) : 0
  const minutes = minMatch ? Number(minMatch[1]) : 0

  return `${hours} hours ${minutes} mins`
}

export function formatCurrency(value, options = {}) {
  const number = Number(value)
  if (!Number.isFinite(number)) return '—'

  const {
    currency = 'USD',
    minimumFractionDigits = 0,
    maximumFractionDigits = 2,
    signDisplay = 'auto'
  } = options

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits,
    maximumFractionDigits,
    signDisplay
  }).format(number)
}

export function formatPercent(value, options = {}) {
  const number = Number(value)
  if (!Number.isFinite(number)) return '—'

  const {
    minimumFractionDigits = 0,
    maximumFractionDigits = 1,
    showSign = true
  } = options

  const formattedNumber = number.toLocaleString(undefined, {
    minimumFractionDigits,
    maximumFractionDigits
  })

  if (!showSign) return `${formattedNumber}%`
  if (number > 0) return `+${formattedNumber}%`
  return `${formattedNumber}%`
}

export function formatNumber(value, options = {}) {
  const number = Number(value)
  if (!Number.isFinite(number)) return '—'

  const {
    minimumFractionDigits = 0,
    maximumFractionDigits = 2
  } = options

  return number.toLocaleString(undefined, {
    minimumFractionDigits,
    maximumFractionDigits
  })
}

export function formatTradeValue(value) {
  if (value === null || value === undefined || value === '') return '—'

  const numericValue = Number(value)
  if (Number.isFinite(numericValue)) {
    return formatNumber(numericValue, { minimumFractionDigits: 0, maximumFractionDigits: 2 })
  }

  return String(value)
}
