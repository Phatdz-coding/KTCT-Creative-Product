import { useReducedMotion } from 'framer-motion'
import { getScenario } from '../../features/scenarios/scenarios.data.ts'
import { PARAMETERS } from '../../features/simulator/parameters.data.ts'
import type { ParameterDefinition } from '../../features/simulator/parameters.data.ts'
import { changedKeys } from '../../features/simulator/simulator.selectors.ts'
import { useSimulatorStore } from '../../features/simulator/simulator.store.ts'
import { Button } from '../common/Button.tsx'
import styles from './controls.module.css'
import { ParameterSlider } from './ParameterSlider.tsx'

const MAIN_PARAMETERS = PARAMETERS.filter((p) => p.group === 'main')
const ADVANCED_PARAMETERS = PARAMETERS.filter((p) => p.group === 'advanced')

export function ControlPanel() {
  const draftInput = useSimulatorStore((s) => s.draftInput)
  const selectedScenarioId = useSimulatorStore((s) => s.selectedScenarioId)
  const status = useSimulatorStore((s) => s.simulationStatus)
  const setInput = useSimulatorStore((s) => s.setInput)
  const run = useSimulatorStore((s) => s.run)
  const reset = useSimulatorStore((s) => s.reset)
  const reducedMotion = useReducedMotion()

  const scenarioInput = getScenario(selectedScenarioId).input
  const changed = changedKeys(draftInput, scenarioInput)
  const advancedChanged = ADVANCED_PARAMETERS.some((p) => changed.includes(p.key))
  const running = status === 'running'

  const slider = (definition: ParameterDefinition) => (
    <ParameterSlider
      key={definition.key}
      definition={definition}
      value={draftInput[definition.key]}
      scenarioValue={scenarioInput[definition.key]}
      disabled={running}
      onChange={(value) => setInput(definition.key, value)}
    />
  )

  return (
    <section className={styles.panel} aria-labelledby="controls-title">
      <h2 className={styles.panelTitle} id="controls-title">
        Thông số của quán
        {changed.length > 0 && <span className={styles.panelHint}>{changed.length} thay đổi</span>}
      </h2>

      <div className={styles.fields}>
        {MAIN_PARAMETERS.map(slider)}

        {/* No scenario changes these, so they stay folded away during a presentation. */}
        <details className={styles.costGroup}>
          <summary>
            Thông số khác
            {advancedChanged && (
              <>
                <span className={styles.changedDot} aria-hidden="true" />
                <span className="sr-only">(đã thay đổi)</span>
              </>
            )}
            <span className={styles.costSummary}>3 thông số</span>
          </summary>
          <div className={styles.costFields}>{ADVANCED_PARAMETERS.map(slider)}</div>
        </details>
      </div>

      <div className={styles.actions}>
        <Button
          variant="primary"
          size="large"
          disabled={running}
          onClick={() => run({ animate: !reducedMotion })}
        >
          {running ? 'Đang chạy…' : 'Chạy mô phỏng'}
          {!running && (
            <span className={styles.kbd} aria-hidden="true">
              R
            </span>
          )}
        </Button>
        <Button size="large" onClick={reset}>
          Đặt lại
        </Button>
      </div>
    </section>
  )
}
