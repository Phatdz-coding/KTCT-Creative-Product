import { describe, expect, test } from 'vitest'
import { MIN_OVERLOAD_FACTOR, runSimulation } from './simulator.engine.ts'
import type { SimulationInput } from './simulator.types.ts'

const baseline: SimulationInput = {
  employeeCount: 5,
  hourlyWage: 30_000,
  workingHours: 8,
  productivityPerWorkerHour: 3,
  optimalWorkingHours: 8,
  productPrice: 50_000,
  materialCostPerUnit: 15_000,
  dailyEquipmentCost: 500_000,
  customerDemand: 100,
}

describe('runSimulation', () => {
  test('baseline produces the documented numbers', () => {
    const r = runSimulation(baseline)
    expect(r.loadPerWorker).toBe(20)
    expect(r.sustainableLoad).toBe(24)
    expect(r.overloadFactor).toBe(1)
    expect(r.effectiveProductivity).toBe(3)
    expect(r.productionCapacity).toBe(120)
    expect(r.unitsSold).toBe(100)
    expect(r.revenue).toBe(5_000_000)
    expect(r.totalWages).toBe(1_200_000)
    expect(r.materialCost).toBe(1_500_000)
    expect(r.constantCapital).toBe(2_000_000)
    expect(r.variableCapital).toBe(1_200_000)
    expect(r.remainingValue).toBe(1_800_000)
    expect(r.surplusValue).toBe(1_800_000)
    expect(r.simplifiedProfit).toBe(1_800_000)
    expect(r.surplusValueRate).toBeCloseTo(150)
    expect(r.necessaryLabourHours).toBeCloseTo(3.2)
    expect(r.surplusLabourHours).toBeCloseTo(4.8)
    expect(r.workerDailyIncome).toBe(240_000)
  })

  test('is deterministic', () => {
    expect(runSimulation(baseline)).toEqual(runSimulation(baseline))
  })

  test('sales are limited by demand when capacity is higher', () => {
    const r = runSimulation({ ...baseline, customerDemand: 40 })
    expect(r.productionCapacity).toBe(120)
    expect(r.unitsSold).toBe(40)
  })

  test('sales are limited by capacity when demand is higher', () => {
    const r = runSimulation({ ...baseline, customerDemand: 120 })
    expect(r.overloadFactor).toBe(1)
    expect(r.productionCapacity).toBe(120)
    expect(r.unitsSold).toBe(120)

    const busier = runSimulation({ ...baseline, customerDemand: 130 })
    expect(busier.unitsSold).toBe(busier.productionCapacity)
    expect(busier.unitsSold).toBeLessThan(130)
  })

  test('capacity is floored to whole units', () => {
    const r = runSimulation({
      ...baseline,
      employeeCount: 1,
      workingHours: 4.5,
      customerDemand: 20,
    })
    expect(r.overloadFactor).toBe(1)
    expect(r.productionCapacity).toBe(13)
  })

  describe('overload', () => {
    test('no overload while each worker is asked for no more than the sustainable load', () => {
      // 5 workers × 24 cups = 120 is exactly sustainable.
      const r = runSimulation({ ...baseline, customerDemand: 120 })
      expect(r.loadPerWorker).toBe(r.sustainableLoad)
      expect(r.effectiveProductivity).toBe(baseline.productivityPerWorkerHour)
    })

    test('fewer workers facing the same demand lose productivity', () => {
      const r = runSimulation({ ...baseline, employeeCount: 3 })
      // 100 / 3 = 33.3 cups each against 24: ratio 1.389, factor 1 − 0.3 × 0.389.
      expect(r.loadPerWorker).toBeCloseTo(33.333, 3)
      expect(r.overloadFactor).toBeCloseTo(0.8833, 4)
      expect(r.effectiveProductivity).toBeCloseTo(2.65, 2)
      expect(r.productionCapacity).toBe(63)
      // Without the penalty three workers would make 3 × 8 × 3 = 72.
      expect(r.productionCapacity).toBeLessThan(72)
    })

    test('the heavier the load, the lower the productivity, down to the floor', () => {
      const factors = [100, 150, 200, 400, 2000].map(
        (customerDemand) => runSimulation({ ...baseline, customerDemand }).overloadFactor,
      )
      expect(factors[0]).toBe(1)
      for (let i = 1; i < factors.length; i++) {
        expect(factors[i]).toBeLessThanOrEqual(factors[i - 1])
        expect(factors[i]).toBeGreaterThanOrEqual(MIN_OVERLOAD_FACTOR)
      }
      expect(factors.at(-1)).toBe(MIN_OVERLOAD_FACTOR)
    })

    test('a longer optimal day raises the sustainable load and removes the overload', () => {
      const tired = runSimulation({ ...baseline, employeeCount: 3 })
      const sturdy = runSimulation({ ...baseline, employeeCount: 3, optimalWorkingHours: 12 })
      expect(tired.overloadFactor).toBeLessThan(1)
      expect(sturdy.overloadFactor).toBe(1)
      expect(sturdy.productionCapacity).toBe(72)
    })

    test('zero demand or zero productivity never counts as overload', () => {
      expect(runSimulation({ ...baseline, customerDemand: 0 }).overloadFactor).toBe(1)
      expect(runSimulation({ ...baseline, productivityPerWorkerHour: 0 }).overloadFactor).toBe(1)
    })
  })

  test('a loss gives zero surplus value and negative simplified profit', () => {
    const r = runSimulation({ ...baseline, customerDemand: 20 })
    expect(r.remainingValue).toBeLessThan(0)
    expect(r.surplusValue).toBe(0)
    expect(r.simplifiedProfit).toBe(r.remainingValue)
    expect(r.surplusValueRate).toBe(0)
    expect(r.necessaryLabourHours).toBeCloseTo(baseline.workingHours)
    expect(r.surplusLabourHours).toBeCloseTo(0)
  })

  test('zero demand sells nothing and stays finite', () => {
    const r = runSimulation({ ...baseline, customerDemand: 0 })
    expect(r.unitsSold).toBe(0)
    expect(r.revenue).toBe(0)
    expect(r.materialCost).toBe(0)
    expect(r.surplusValue).toBe(0)
  })

  test('zero wages make the rate and labour split unavailable instead of dividing by zero', () => {
    const r = runSimulation({ ...baseline, hourlyWage: 0, customerDemand: 0 })
    expect(r.variableCapital).toBe(0)
    expect(r.surplusValueRate).toBeNull()
    expect(r.necessaryLabourHours).toBeNull()
    expect(r.surplusLabourHours).toBeNull()
  })

  test('necessary and surplus labour add up to the working day', () => {
    for (const workingHours of [4, 7.5, 8, 12]) {
      const r = runSimulation({ ...baseline, workingHours, customerDemand: 300 })
      expect(r.necessaryLabourHours! + r.surplusLabourHours!).toBeCloseTo(workingHours)
    }
  })

  test('never returns NaN or Infinity across boundary inputs', () => {
    const cases: SimulationInput[] = [
      { ...baseline, employeeCount: 1, workingHours: 4 },
      { ...baseline, productivityPerWorkerHour: 0 },
      { ...baseline, productPrice: 1_000_000, customerDemand: 10_000 },
      { ...baseline, hourlyWage: 0 },
      { ...baseline, dailyEquipmentCost: 0, materialCostPerUnit: 0 },
    ]
    for (const input of cases) {
      for (const value of Object.values(runSimulation(input))) {
        if (value !== null) expect(Number.isFinite(value)).toBe(true)
      }
    }
  })

  test('rejects invalid input', () => {
    expect(() => runSimulation({ ...baseline, employeeCount: -1 })).toThrow()
    expect(() => runSimulation({ ...baseline, hourlyWage: -5 })).toThrow()
    expect(() => runSimulation({ ...baseline, workingHours: Number.NaN })).toThrow()
    expect(() => runSimulation({ ...baseline, productPrice: Number.POSITIVE_INFINITY })).toThrow()
    expect(() => runSimulation({ ...baseline, employeeCount: 2.5 })).toThrow()
  })
})
