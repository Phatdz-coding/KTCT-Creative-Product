const vndFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0,
})

export const formatVND = (value: number): string => vndFormatter.format(value)

/** Compact axis label in millions of đồng, e.g. 1.800.000 → "1,8 tr". */
export const formatVNDMillions = (value: number): string =>
  `${new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 1 }).format(value / 1_000_000)} tr`
