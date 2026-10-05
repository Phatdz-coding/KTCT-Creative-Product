import { AnalysisPanel } from '../components/analysis/AnalysisPanel.tsx'
import { LabourTimeBar } from '../components/analysis/LabourTimeBar.tsx'
import { CafeScene } from '../components/cafe/CafeScene.tsx'
import { PhaseStepper } from '../components/cafe/PhaseStepper.tsx'
import { InfoTooltip } from '../components/common/InfoTooltip.tsx'
import { ControlPanel } from '../components/controls/ControlPanel.tsx'
import { ScenarioSelector } from '../components/controls/ScenarioSelector.tsx'
import { getScenario } from '../features/scenarios/scenarios.data.ts'
import { isSameInput } from '../features/simulator/simulator.selectors.ts'
import { useSimulatorStore } from '../features/simulator/simulator.store.ts'
import { formatClock, formatHours } from '../lib/number.ts'
import styles from './pages.module.css'

const OPENING_HOUR = 8

export function PresentationPage({ onOpenTheory }: { onOpenTheory(): void }) {
  const selectedScenarioId = useSimulatorStore((s) => s.selectedScenarioId)
  const draftInput = useSimulatorStore((s) => s.draftInput)
  const lastInput = useSimulatorStore((s) => s.lastInput)
  const lastResult = useSimulatorStore((s) => s.lastResult)
  const previousResult = useSimulatorStore((s) => s.previousResult)
  const phase = useSimulatorStore((s) => s.phase)

  const scenario = getScenario(selectedScenarioId)
  const finished = phase === 'result' && lastInput !== null && lastResult !== null
  const stale = finished && !isSameInput(draftInput, lastInput)
  // While a run is on screen the scene shows the inputs that run actually used.
  const sceneInput = phase !== 'idle' && lastInput ? lastInput : draftInput

  return (
    <div className={styles.presentation}>
      <ScenarioSelector />

      <main className={styles.columns}>
        <ControlPanel />

        <section className={styles.stage} aria-label="Quán cà phê">
          <div className={styles.scenarioCard}>
            <h1 className={styles.scenarioTitle}>{scenario.title}</h1>
            <p className={styles.scenarioText}>{scenario.description}</p>
          </div>

          <div className={styles.sceneFrame}>
            <CafeScene
              phase={phase}
              employeeCount={sceneInput.employeeCount}
              workingHours={sceneInput.workingHours}
              productPrice={sceneInput.productPrice}
              unitsSold={lastResult?.unitsSold ?? null}
              productionCapacity={lastResult?.productionCapacity ?? null}
              productivityLoss={lastResult ? 1 - lastResult.overloadFactor : 0}
            />
          </div>

          <PhaseStepper phase={phase} />

          {/* The working day sits next to the clock it belongs to. */}
          <div className={`${styles.labourCard} ${stale ? styles.staleBlock : ''}`}>
            <h2 className={styles.labourTitle}>
              Ngày lao động: tất yếu và thặng dư
              <InfoTooltip
                label="Ngày lao động"
                text="Ngày lao động được chia theo tỷ lệ v / (v + m). Đây là cách chia trừu tượng để minh họa, không phải số giờ đo được trong thực tế."
              />
            </h2>
            {finished ? (
              <LabourTimeBar
                result={lastResult}
                workingHours={lastInput.workingHours}
                previous={previousResult}
                startHour={OPENING_HOUR}
              />
            ) : (
              <div className={styles.labourPlaceholder}>
                <div className={styles.labourTrack}>
                  {formatHours(sceneInput.workingHours)} · chạy mô phỏng để xem cách chia
                </div>
                <div className={`${styles.labourClock} tabular`} aria-hidden="true">
                  <span>{formatClock(OPENING_HOUR)}</span>
                  <span>{formatClock(OPENING_HOUR + sceneInput.workingHours)}</span>
                </div>
              </div>
            )}
          </div>

          <div className={styles.discussion} aria-live="polite">
            {finished ? (
              <p className={styles.discussionQuestion}>
                <span className={styles.discussionLabel}>Câu hỏi thảo luận</span>
                {scenario.question}
              </p>
            ) : (
              <p>
                <span className={styles.discussionLabel}>Mục tiêu của kịch bản</span>
                {scenario.teachingGoal}
              </p>
            )}
          </div>
        </section>

        <AnalysisPanel />
      </main>

      <footer className={styles.footer}>
        <span>
          Mô phỏng giáo dục đã được giản lược, dựa chủ yếu trên kinh tế chính trị Mác-xít — không
          phải mô hình kế toán của doanh nghiệp thực tế.
        </span>
        <button type="button" className={styles.footerLink} onClick={onOpenTheory}>
          Xem giả định
        </button>
      </footer>
    </div>
  )
}
