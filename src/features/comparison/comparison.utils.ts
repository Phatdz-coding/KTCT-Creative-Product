import type { SimulationResult, SimulationSnapshot } from '../simulator/simulator.types.ts'

export type MetricFormat = 'money' | 'percent' | 'hours' | 'units' | 'rate'

export interface Delta {
  absolute: number
  /** null when A is zero: a percentage change from zero would be misleading. */
  percent: number | null
}

export const computeDelta = (a: number | null, b: number | null): Delta | null => {
  if (a === null || b === null) return null
  return { absolute: b - a, percent: a !== 0 ? ((b - a) / Math.abs(a)) * 100 : null }
}

export interface ComparisonRow {
  key: keyof SimulationResult
  format: MetricFormat
  a: number | null
  b: number | null
  delta: Delta | null
}

const COMPARED_METRICS: { key: keyof SimulationResult; format: MetricFormat }[] = [
  { key: 'effectiveProductivity', format: 'rate' },
  { key: 'unitsSold', format: 'units' },
  { key: 'revenue', format: 'money' },
  { key: 'totalWages', format: 'money' },
  { key: 'surplusValue', format: 'money' },
  { key: 'surplusValueRate', format: 'percent' },
  { key: 'workerDailyIncome', format: 'money' },
  { key: 'necessaryLabourHours', format: 'hours' },
  { key: 'surplusLabourHours', format: 'hours' },
]

export const selectComparison = (
  snapshotA: SimulationSnapshot,
  snapshotB: SimulationSnapshot,
): ComparisonRow[] =>
  COMPARED_METRICS.map(({ key, format }) => {
    const a = snapshotA.result[key]
    const b = snapshotB.result[key]
    return { key, format, a, b, delta: computeDelta(a, b) }
  })
