import { formatVND } from '../../lib/currency.ts'
import { formatHours, formatNumber, formatPercent } from '../../lib/number.ts'
import type { Delta, MetricFormat } from './comparison.utils.ts'

const EPSILON = 1e-9

export const isUnchanged = (delta: Delta | null): boolean =>
  delta === null || Math.abs(delta.absolute) < EPSILON

export const formatMetric = (value: number | null, format: MetricFormat): string => {
  if (value === null) return 'N/A'
  switch (format) {
    case 'money':
      return formatVND(value)
    case 'percent':
      return formatPercent(value)
    case 'hours':
      return formatHours(value)
    case 'units':
      return `${formatNumber(value)} ly`
    case 'rate':
      return `${formatNumber(value, 2)} ly/giờ`
  }
}

// A change in a percentage is stated in percentage points, never as "% of a %".
const formatMagnitude = (magnitude: number, format: MetricFormat): string =>
  format === 'percent' ? `${formatNumber(magnitude, 1)} điểm %` : formatMetric(magnitude, format)

export const deltaArrow = (delta: Delta | null): string => {
  if (isUnchanged(delta)) return ''
  return delta!.absolute > 0 ? '▲' : '▼'
}

/** Full form for the compare table: "+320.000 ₫ (+17,8%)". */
export const formatDelta = (delta: Delta | null, format: MetricFormat): string => {
  if (delta === null) return '—'
  if (isUnchanged(delta)) return 'Không đổi'
  const sign = delta.absolute > 0 ? '+' : '−'
  const relative =
    format !== 'percent' && delta.percent !== null
      ? ` (${sign}${formatNumber(Math.abs(delta.percent), 1)}%)`
      : ''
  return `${sign}${formatMagnitude(Math.abs(delta.absolute), format)}${relative}`
}

/** Compact form for the live panel: "▲ 320.000 ₫", or "không đổi". */
export const formatDeltaShort = (delta: Delta | null, format: MetricFormat): string => {
  if (delta === null) return ''
  if (isUnchanged(delta)) return 'không đổi'
  return `${deltaArrow(delta)} ${formatMagnitude(Math.abs(delta.absolute), format)}`
}
