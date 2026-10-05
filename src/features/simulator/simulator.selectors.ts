import type { SimulationInput, SimulationResult } from './simulator.types.ts'

export type ValueKey = 'constant' | 'variable' | 'surplus'

export interface ValueDistributionItem {
  key: ValueKey
  value: number
  /** Share of c + v + m, 0–100. */
  share: number
}

export const selectValueDistribution = (result: SimulationResult): ValueDistributionItem[] => {
  const items: [ValueKey, number][] = [
    ['constant', result.constantCapital],
    ['variable', result.variableCapital],
    ['surplus', result.surplusValue],
  ]
  const total = items.reduce((sum, [, value]) => sum + value, 0)
  return items.map(([key, value]) => ({ key, value, share: total > 0 ? (value / total) * 100 : 0 }))
}

export interface LabourSegments {
  necessaryHours: number
  surplusHours: number
  /** Share of the working day spent on necessary labour, 0–100. */
  necessaryShare: number
}

export const selectLabourSegments = (
  result: SimulationResult,
  workingHours: number,
): LabourSegments | null => {
  if (result.necessaryLabourHours === null || result.surplusLabourHours === null) return null
  return {
    necessaryHours: result.necessaryLabourHours,
    surplusHours: result.surplusLabourHours,
    necessaryShare: workingHours > 0 ? (result.necessaryLabourHours / workingHours) * 100 : 0,
  }
}

export type SalesLimit = 'demand' | 'capacity' | 'balanced'

export const selectSalesLimit = (result: SimulationResult, input: SimulationInput): SalesLimit => {
  if (result.productionCapacity > input.customerDemand) return 'demand'
  if (result.productionCapacity < input.customerDemand) return 'capacity'
  return 'balanced'
}

export const isSameInput = (a: SimulationInput, b: SimulationInput): boolean =>
  (Object.keys(a) as (keyof SimulationInput)[]).every((key) => a[key] === b[key])

export const changedKeys = (a: SimulationInput, b: SimulationInput): (keyof SimulationInput)[] =>
  (Object.keys(a) as (keyof SimulationInput)[]).filter((key) => a[key] !== b[key])
