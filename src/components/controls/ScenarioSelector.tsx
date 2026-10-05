import { SCENARIOS } from '../../features/scenarios/scenarios.data.ts'
import { useSimulatorStore } from '../../features/simulator/simulator.store.ts'
import styles from './controls.module.css'

export function ScenarioSelector() {
  const selectedScenarioId = useSimulatorStore((s) => s.selectedScenarioId)
  const loadScenario = useSimulatorStore((s) => s.loadScenario)

  return (
    <nav className={styles.strip} aria-label="Kịch bản">
      <span className={styles.stripLabel} aria-hidden="true">
        Kịch bản
      </span>
      {SCENARIOS.map((scenario, index) => {
        const active = scenario.id === selectedScenarioId
        return (
          <button
            key={scenario.id}
            type="button"
            className={`${styles.chip} ${active ? styles.chipActive : ''}`}
            aria-pressed={active}
            aria-keyshortcuts={String(index + 1)}
            onClick={() => loadScenario(scenario.id)}
          >
            <span className={styles.chipNumber}>{index + 1}</span>
            {scenario.name}
          </button>
        )
      })}
    </nav>
  )
}
