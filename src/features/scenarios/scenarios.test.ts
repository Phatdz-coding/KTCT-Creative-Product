import { describe, expect, test } from 'vitest'
import { PARAMETERS } from '../simulator/parameters.data.ts'
import { runSimulation } from '../simulator/simulator.engine.ts'
import { getScenario, SCENARIOS } from './scenarios.data.ts'

const run = (id: string) => runSimulation(getScenario(id).input)

describe('scenario presets', () => {
  test('ids are unique and every input is inside the UI ranges', () => {
    expect(new Set(SCENARIOS.map((s) => s.id)).size).toBe(SCENARIOS.length)
    for (const scenario of SCENARIOS) {
      for (const { key, min, max } of PARAMETERS) {
        expect(scenario.input[key]).toBeGreaterThanOrEqual(min)
        expect(scenario.input[key]).toBeLessThanOrEqual(max)
      }
    }
  })

  // Each test pins the direction of change that the scenario's Vietnamese text claims.
  const base = run('baseline')

  test('lower wage: worker income falls, surplus value and rate rise', () => {
    const r = run('lower-wage')
    expect(r.workerDailyIncome).toBeLessThan(base.workerDailyIncome)
    expect(r.totalWages).toBeLessThan(base.totalWages)
    expect(r.surplusValue).toBeGreaterThan(base.surplusValue)
    expect(r.surplusValueRate!).toBeGreaterThan(base.surplusValueRate!)
  })

  test('longer day: wages rise but surplus labour hours rise by more', () => {
    const scenario = getScenario('longer-day')
    const r = run('longer-day')
    // Compare against an 8-hour day facing the same demand, so only hours differ.
    const sameDemand = runSimulation({ ...scenario.input, workingHours: 8 })
    expect(r.unitsSold).toBe(r.productionCapacity)
    expect(r.totalWages).toBeGreaterThan(sameDemand.totalWages)
    expect(r.surplusValue).toBeGreaterThan(sameDemand.surplusValue)
    const extraSurplus = r.surplusLabourHours! - sameDemand.surplusLabourHours!
    const extraNecessary = r.necessaryLabourHours! - sameDemand.necessaryLabourHours!
    expect(extraSurplus).toBeGreaterThan(extraNecessary)
  })

  test('productivity: same hours and wages, shorter necessary labour, higher rate', () => {
    const scenario = getScenario('productivity')
    const r = run('productivity')
    const sameDemand = runSimulation({ ...scenario.input, productivityPerWorkerHour: 3 })
    expect(r.totalWages).toBe(sameDemand.totalWages)
    expect(r.necessaryLabourHours!).toBeLessThan(sameDemand.necessaryLabourHours!)
    expect(r.surplusValueRate!).toBeGreaterThan(sameDemand.surplusValueRate!)
  })

  test('demand limit: capacity is 180 but the result equals the baseline', () => {
    const r = run('demand-limit')
    expect(r.productionCapacity).toBe(180)
    expect(r.unitsSold).toBe(100)
    expect(r.surplusValue).toBe(base.surplusValue)
  })

  test('higher price: wages unchanged, remaining value rises', () => {
    const r = run('higher-price')
    expect(r.totalWages).toBe(base.totalWages)
    expect(r.remainingValue).toBeGreaterThan(base.remainingValue)
  })

  test('understaffed: each worker is overloaded, productivity and surplus fall', () => {
    const r = run('understaffed')
    expect(r.loadPerWorker).toBeGreaterThan(33)
    expect(r.sustainableLoad).toBe(24)
    expect(r.effectiveProductivity).toBeLessThan(3)
    expect(r.unitsSold).toBeLessThan(100)
    expect(r.surplusValue).toBeLessThan(base.surplusValue)
  })

  test('longer day: the load is above the sustainable level, so productivity dips slightly', () => {
    const r = run('longer-day')
    expect(r.loadPerWorker).toBe(30)
    expect(r.overloadFactor).toBeLessThan(1)
    expect(r.overloadFactor).toBeGreaterThan(0.9)
  })

  test('presets that are not about overload are not overloaded', () => {
    for (const id of [
      'baseline',
      'lower-wage',
      'productivity',
      'demand-limit',
      'higher-price',
      'overstaffed',
    ]) {
      expect(run(id).overloadFactor).toBe(1)
    }
  })

  test('overstaffed: wages double, revenue unchanged, surplus falls', () => {
    const r = run('overstaffed')
    expect(r.totalWages).toBe(base.totalWages * 2)
    expect(r.revenue).toBe(base.revenue)
    expect(r.surplusValue).toBeLessThan(base.surplusValue)
  })
})
