export interface SimulationInput {
  employeeCount: number
  hourlyWage: number
  workingHours: number
  productivityPerWorkerHour: number
  /** Hours of work one person can sustain a day at full productivity. */
  optimalWorkingHours: number
  productPrice: number
  materialCostPerUnit: number
  dailyEquipmentCost: number
  customerDemand: number
}

export interface SimulationResult {
  /** Units each worker is asked to make: demand ÷ workers. */
  loadPerWorker: number
  /** Units one worker can sustain a day: productivity × optimal hours. */
  sustainableLoad: number
  /** 1 when not overloaded, lower when the load exceeds the sustainable level. */
  overloadFactor: number
  effectiveProductivity: number

  productionCapacity: number
  unitsSold: number

  revenue: number

  totalWages: number
  materialCost: number
  dailyEquipmentCost: number

  constantCapital: number
  variableCapital: number

  remainingValue: number
  surplusValue: number
  simplifiedProfit: number

  surplusValueRate: number | null

  necessaryLabourHours: number | null
  surplusLabourHours: number | null

  workerDailyIncome: number
}

export interface SimulationSnapshot {
  id: string
  label: string
  input: SimulationInput
  result: SimulationResult
}

export type SimulationStatus = 'idle' | 'running' | 'complete'

export type SimulationPhase = 'idle' | 'opening' | 'working' | 'serving' | 'accounting' | 'result'
