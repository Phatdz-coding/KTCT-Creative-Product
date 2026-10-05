import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { BASELINE_INPUT, getScenario } from '../scenarios/scenarios.data.ts'
import { useSimulatorStore } from './simulator.store.ts'

const store = () => useSimulatorStore.getState()

beforeEach(() => {
  vi.useFakeTimers()
  store().loadScenario('baseline')
  useSimulatorStore.setState({ snapshotA: null, snapshotB: null })
})

afterEach(() => {
  vi.useRealTimers()
})

describe('simulator store', () => {
  test('keeps the previous result across runs and scenario switches', () => {
    useSimulatorStore.setState({ previousResult: null, previousLabel: null })
    store().run({ animate: false })
    expect(store().previousResult).toBeNull()

    store().loadScenario('lower-wage')
    expect(store().lastResult).toBeNull()
    expect(store().previousResult?.totalWages).toBe(1_200_000)

    store().run({ animate: false })
    expect(store().previousResult?.totalWages).toBe(1_200_000)
    expect(store().lastResult?.totalWages).toBe(880_000)

    expect(store().previousLabel).toBe('Cơ sở')

    store().setInput('employeeCount', 6)
    store().run({ animate: false })
    expect(store().previousResult?.totalWages).toBe(880_000)
    expect(store().previousLabel).toBe('Giảm tiền công')

    store().run({ animate: false })
    expect(store().previousLabel).toBe('Giảm tiền công (đã chỉnh)')
  })

  test('controls change the draft only', () => {
    store().setInput('hourlyWage', 20_000)
    expect(store().draftInput.hourlyWage).toBe(20_000)
    expect(store().lastResult).toBeNull()
    expect(store().simulationStatus).toBe('idle')
  })

  test('run without animation completes immediately', () => {
    store().run({ animate: false })
    expect(store().simulationStatus).toBe('complete')
    expect(store().phase).toBe('result')
    expect(store().lastResult?.revenue).toBe(5_000_000)
    expect(store().lastInput).toEqual(BASELINE_INPUT)
  })

  test('animated run walks through the phases and then completes', () => {
    store().run()
    expect(store().simulationStatus).toBe('running')
    expect(store().phase).toBe('opening')
    // The result exists from the start: animation never gates the calculation.
    expect(store().lastResult?.surplusValue).toBe(1_800_000)

    vi.advanceTimersByTime(300)
    expect(store().phase).toBe('working')
    vi.advanceTimersByTime(1200)
    expect(store().phase).toBe('serving')
    vi.advanceTimersByTime(800)
    expect(store().phase).toBe('accounting')
    vi.advanceTimersByTime(700)
    expect(store().phase).toBe('result')
    expect(store().simulationStatus).toBe('complete')
  })

  test('reset restores the selected scenario and cancels a running animation', () => {
    store().loadScenario('lower-wage')
    store().setInput('employeeCount', 12)
    store().run()
    store().reset()
    vi.runAllTimers()
    expect(store().draftInput).toEqual(getScenario('lower-wage').input)
    expect(store().simulationStatus).toBe('idle')
    expect(store().lastResult).toBeNull()
  })

  test('snapshots keep both input and result of the run they were saved from', () => {
    store().saveAsA()
    expect(store().snapshotA).toBeNull()

    store().run({ animate: false })
    store().saveAsA()
    store().setInput('hourlyWage', 22_000)
    store().run({ animate: false })
    store().saveAsB()

    expect(store().snapshotA?.label).toBe('Quán cà phê cơ sở')
    expect(store().snapshotB?.label).toBe('Quán cà phê cơ sở (đã chỉnh)')
    expect(store().snapshotA?.input.hourlyWage).toBe(30_000)
    expect(store().snapshotA?.result.totalWages).toBe(1_200_000)
    expect(store().snapshotB?.input.hourlyWage).toBe(22_000)
    expect(store().snapshotB?.result.totalWages).toBe(880_000)
  })
})
