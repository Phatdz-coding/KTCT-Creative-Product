import { create } from 'zustand'
import { DEFAULT_SCENARIO_ID, getScenario } from '../scenarios/scenarios.data.ts'
import { runSimulation } from './simulator.engine.ts'
import { simulationInputSchema } from './simulator.schema.ts'
import { isSameInput } from './simulator.selectors.ts'
import type {
  SimulationInput,
  SimulationPhase,
  SimulationResult,
  SimulationSnapshot,
  SimulationStatus,
} from './simulator.types.ts'

export type AppView = 'landing' | 'presentation' | 'compare'

// Animation timeline (TRD §11). It only decides when the result is revealed;
// the result itself is calculated up front in run().
const PHASE_TIMELINE: { phase: SimulationPhase; durationMs: number }[] = [
  { phase: 'opening', durationMs: 300 },
  { phase: 'working', durationMs: 1200 },
  { phase: 'serving', durationMs: 800 },
  { phase: 'accounting', durationMs: 700 },
]

export const PHASE_DURATION_MS = Object.fromEntries(
  PHASE_TIMELINE.map(({ phase, durationMs }) => [phase, durationMs]),
) as Partial<Record<SimulationPhase, number>>

interface SimulatorStore {
  view: AppView

  selectedScenarioId: string
  draftInput: SimulationInput

  lastInput: SimulationInput | null
  lastResult: SimulationResult | null
  /** Result of the run before the current one, for "change since last run". */
  previousResult: SimulationResult | null
  /** Short name of the run that previousResult came from. */
  previousLabel: string | null

  snapshotA: SimulationSnapshot | null
  snapshotB: SimulationSnapshot | null

  simulationStatus: SimulationStatus
  phase: SimulationPhase

  setView(view: AppView): void
  setInput<K extends keyof SimulationInput>(key: K, value: SimulationInput[K]): void
  loadScenario(id: string): void
  run(options?: { animate?: boolean }): void
  reset(): void
  saveAsA(): void
  saveAsB(): void
}

let phaseTimers: ReturnType<typeof setTimeout>[] = []

const clearPhaseTimers = () => {
  phaseTimers.forEach(clearTimeout)
  phaseTimers = []
}

const idleRun = {
  lastInput: null,
  lastResult: null,
  simulationStatus: 'idle',
  phase: 'idle',
} as const

export const useSimulatorStore = create<SimulatorStore>((set, get) => {
  const isEdited = (input: SimulationInput, scenarioId: string) =>
    !isSameInput(input, getScenario(scenarioId).input)

  // What the next run will be compared against: the run on screen now, if there is one.
  const previousRun = () => {
    const { lastInput, lastResult, selectedScenarioId, previousResult, previousLabel } = get()
    if (!lastInput || !lastResult) return { previousResult, previousLabel }
    const { name } = getScenario(selectedScenarioId)
    return {
      previousResult: lastResult,
      previousLabel: isEdited(lastInput, selectedScenarioId) ? `${name} (đã chỉnh)` : name,
    }
  }

  const snapshot = (id: 'A' | 'B'): SimulationSnapshot | null => {
    const { lastInput, lastResult, selectedScenarioId } = get()
    if (!lastInput || !lastResult) return null
    const scenario = getScenario(selectedScenarioId)
    const edited = isEdited(lastInput, selectedScenarioId)
    return {
      id,
      label: edited ? `${scenario.title} (đã chỉnh)` : scenario.title,
      input: lastInput,
      result: lastResult,
    }
  }

  return {
    view: 'landing',

    selectedScenarioId: DEFAULT_SCENARIO_ID,
    draftInput: getScenario(DEFAULT_SCENARIO_ID).input,

    ...idleRun,
    previousResult: null,
    previousLabel: null,

    snapshotA: null,
    snapshotB: null,

    setView: (view) => set({ view }),

    setInput: (key, value) =>
      set((state) => ({ draftInput: { ...state.draftInput, [key]: value } })),

    loadScenario: (id) => {
      clearPhaseTimers()
      const scenario = getScenario(id)
      set({
        selectedScenarioId: scenario.id,
        draftInput: scenario.input,
        ...previousRun(),
        ...idleRun,
      })
    },

    run: ({ animate = true } = {}) => {
      const parsed = simulationInputSchema.safeParse(get().draftInput)
      if (!parsed.success) return

      clearPhaseTimers()
      const input = parsed.data
      const result = runSimulation(input)
      const previous = previousRun()

      if (!animate) {
        set({
          ...previous,
          lastInput: input,
          lastResult: result,
          simulationStatus: 'complete',
          phase: 'result',
        })
        return
      }

      set({
        ...previous,
        lastInput: input,
        lastResult: result,
        simulationStatus: 'running',
        phase: PHASE_TIMELINE[0].phase,
      })

      let elapsed = 0
      PHASE_TIMELINE.forEach(({ durationMs }, index) => {
        elapsed += durationMs
        const next = PHASE_TIMELINE[index + 1]
        phaseTimers.push(
          setTimeout(() => {
            set(next ? { phase: next.phase } : { phase: 'result', simulationStatus: 'complete' })
          }, elapsed),
        )
      })
    },

    reset: () => get().loadScenario(get().selectedScenarioId),

    saveAsA: () => {
      const snapshotA = snapshot('A')
      if (snapshotA) set({ snapshotA })
    },

    saveAsB: () => {
      const snapshotB = snapshot('B')
      if (snapshotB) set({ snapshotB })
    },
  }
})
