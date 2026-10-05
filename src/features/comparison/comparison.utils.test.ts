import { describe, expect, test } from 'vitest'
import { BASELINE_INPUT } from '../scenarios/scenarios.data.ts'
import { runSimulation } from '../simulator/simulator.engine.ts'
import type { SimulationInput, SimulationSnapshot } from '../simulator/simulator.types.ts'
import { computeDelta, selectComparison } from './comparison.utils.ts'

const snapshot = (id: string, input: SimulationInput): SimulationSnapshot => ({
  id,
  label: id,
  input,
  result: runSimulation(input),
})

describe('computeDelta', () => {
  test('gives absolute and percentage change', () => {
    expect(computeDelta(200, 250)).toEqual({ absolute: 50, percent: 25 })
    expect(computeDelta(200, 150)).toEqual({ absolute: -50, percent: -25 })
  })

  test('has no percentage when the starting value is zero', () => {
    expect(computeDelta(0, 500)).toEqual({ absolute: 500, percent: null })
  })

  test('is unavailable when either side is missing', () => {
    expect(computeDelta(null, 5)).toBeNull()
    expect(computeDelta(5, null)).toBeNull()
  })
})

describe('selectComparison', () => {
  test('compares a lower-wage run against the baseline', () => {
    const rows = selectComparison(
      snapshot('A', BASELINE_INPUT),
      snapshot('B', { ...BASELINE_INPUT, hourlyWage: 22_000 }),
    )
    const row = (key: string) => rows.find((r) => r.key === key)!

    expect(row('revenue').delta).toEqual({ absolute: 0, percent: 0 })
    expect(row('totalWages').delta?.absolute).toBe(-320_000)
    expect(row('surplusValue').delta?.absolute).toBe(320_000)
    expect(row('surplusValueRate').b).toBeCloseTo(240.9, 1)
  })
})

describe('delta formatting', () => {
  test('compact form uses an arrow and the magnitude', async () => {
    const { formatDeltaShort, formatDelta } = await import('./comparison.format.ts')
    expect(formatDeltaShort(computeDelta(1_200_000, 880_000), 'money')).toBe('▼ 320.000 ₫')
    expect(formatDeltaShort(computeDelta(150, 240.9), 'percent')).toBe('▲ 90,9 điểm %')
    expect(formatDeltaShort(computeDelta(100, 100), 'units')).toBe('không đổi')
    expect(formatDeltaShort(null, 'money')).toBe('')
    expect(formatDelta(computeDelta(150, 240.9), 'percent')).toBe('+90,9 điểm %')
    expect(formatDelta(computeDelta(0, 500), 'units')).toBe('+500 ly')
  })
})
