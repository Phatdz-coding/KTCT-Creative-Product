import type { SimulationPhase } from '../../features/simulator/simulator.types.ts'
import styles from './cafe.module.css'

const STEPS: { phase: SimulationPhase; label: string }[] = [
  { phase: 'opening', label: 'Mở cửa' },
  { phase: 'working', label: 'Sản xuất' },
  { phase: 'serving', label: 'Bán hàng' },
  { phase: 'accounting', label: 'Hạch toán' },
  { phase: 'result', label: 'Kết quả' },
]

/** Compact five-step rail: the label of each step sits under its segment. */
export function PhaseStepper({ phase }: { phase: SimulationPhase }) {
  const currentIndex = STEPS.findIndex((step) => step.phase === phase)

  return (
    <ol className={styles.stepper} aria-label="Tiến trình một ngày làm việc">
      {STEPS.map((step, index) => {
        const state = index < currentIndex ? 'done' : index === currentIndex ? 'current' : 'todo'
        return (
          <li
            key={step.phase}
            className={`${styles.step} ${styles[state]}`}
            aria-current={state === 'current' ? 'step' : undefined}
          >
            {step.label}
          </li>
        )
      })}
    </ol>
  )
}
