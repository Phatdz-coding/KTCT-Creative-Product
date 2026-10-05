import { simulationInputSchema } from './simulator.schema.ts'
import type { SimulationInput, SimulationResult } from './simulator.types.ts'

// Overload model (PRD §10.10 / TRD §8.2). A worker can sustain
// productivity × optimalWorkingHours units a day. Each 100% of load above that
// costs OVERLOAD_PENALTY of productivity, down to a floor of MIN_OVERLOAD_FACTOR.
export const OVERLOAD_PENALTY = 0.3
export const MIN_OVERLOAD_FACTOR = 0.6

/**
 * Runs one working day. Pure and deterministic: formulas follow PRD §10–12 / TRD §8.2.
 * Throws if the input fails schema validation.
 */
export function runSimulation(input: SimulationInput): SimulationResult {
  const {
    employeeCount,
    hourlyWage,
    workingHours,
    productivityPerWorkerHour,
    optimalWorkingHours,
    productPrice,
    materialCostPerUnit,
    dailyEquipmentCost,
    customerDemand,
  } = simulationInputSchema.parse(input)

  // Workload: what each worker is asked to make, against what one worker can sustain.
  // Both use the base productivity, so the result never feeds back into itself.
  const loadPerWorker = customerDemand / employeeCount
  const sustainableLoad = productivityPerWorkerHour * optimalWorkingHours
  const overloadRatio = sustainableLoad > 0 ? loadPerWorker / sustainableLoad : 0
  const overloadFactor =
    overloadRatio > 1
      ? Math.max(MIN_OVERLOAD_FACTOR, 1 - OVERLOAD_PENALTY * (overloadRatio - 1))
      : 1
  const effectiveProductivity = productivityPerWorkerHour * overloadFactor

  // Units are whole cups: capacity is floored once here and nowhere else.
  // toFixed guards against float noise such as 137.99999999999997.
  const productionCapacity = Math.floor(
    Number((employeeCount * workingHours * effectiveProductivity).toFixed(6)),
  )
  const unitsSold = Math.min(productionCapacity, customerDemand)

  const revenue = Math.round(unitsSold * productPrice)

  const totalWages = Math.round(employeeCount * workingHours * hourlyWage)
  // Simplification: materials are counted for sold units only.
  const materialCost = Math.round(unitsSold * materialCostPerUnit)

  const constantCapital = materialCost + dailyEquipmentCost
  const variableCapital = totalWages

  const remainingValue = revenue - constantCapital - variableCapital
  const surplusValue = Math.max(0, remainingValue)
  const simplifiedProfit = remainingValue

  const surplusValueRate = variableCapital > 0 ? (surplusValue / variableCapital) * 100 : null

  const newValue = variableCapital + surplusValue
  const necessaryLabourHours = newValue > 0 ? workingHours * (variableCapital / newValue) : null
  const surplusLabourHours =
    necessaryLabourHours !== null ? workingHours - necessaryLabourHours : null

  return Object.freeze({
    loadPerWorker,
    sustainableLoad,
    overloadFactor,
    effectiveProductivity,
    productionCapacity,
    unitsSold,
    revenue,
    totalWages,
    materialCost,
    dailyEquipmentCost,
    constantCapital,
    variableCapital,
    remainingValue,
    surplusValue,
    simplifiedProfit,
    surplusValueRate,
    necessaryLabourHours,
    surplusLabourHours,
    workerDailyIncome: Math.round(workingHours * hourlyWage),
  })
}
