const LOCALE = 'vi-VN'

export const formatNumber = (value: number, maximumFractionDigits = 1): string =>
  new Intl.NumberFormat(LOCALE, { maximumFractionDigits }).format(value)

export const formatHours = (hours: number): string => `${formatNumber(hours, 2)} giờ`

export const formatPercent = (percent: number): string => `${formatNumber(percent, 1)}%`

/** Hours since midnight → "HH:MM", e.g. 11.2 → "11:12". */
export const formatClock = (hoursSinceMidnight: number): string => {
  const totalMinutes = Math.round(hoursSinceMidnight * 60)
  const hh = Math.floor(totalMinutes / 60) % 24
  const mm = totalMinutes % 60
  return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`
}

export const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value))

/** Snaps to the nearest step counted from min, avoiding float drift like 7.500000001. */
export const snapToStep = (value: number, min: number, step: number): number =>
  Number((min + Math.round((value - min) / step) * step).toFixed(6))
