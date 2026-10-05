import { deltaArrow, isUnchanged } from '../../features/comparison/comparison.format.ts'
import { computeDelta } from '../../features/comparison/comparison.utils.ts'
import { selectLabourSegments } from '../../features/simulator/simulator.selectors.ts'
import type { SimulationResult } from '../../features/simulator/simulator.types.ts'
import { formatClock, formatHours, formatNumber } from '../../lib/number.ts'
import styles from './analysis.module.css'

interface LabourTimeBarProps {
  result: SimulationResult
  workingHours: number
  /** When given, each segment also shows its change against this earlier result. */
  previous?: SimulationResult | null
  /** Hour of day the shift starts; only used for the clock labels. */
  startHour?: number
}

const hoursDelta = (before: number | null | undefined, after: number): string => {
  const delta = computeDelta(before ?? null, after)
  if (delta === null) return ''
  if (isUnchanged(delta)) return ' (không đổi)'
  return ` (${deltaArrow(delta)} ${formatNumber(Math.abs(delta.absolute), 2)})`
}

export function LabourTimeBar({
  result,
  workingHours,
  previous = null,
  startHour = 8,
}: LabourTimeBarProps) {
  const segments = selectLabourSegments(result, workingHours)

  if (!segments) {
    return (
      <p className={styles.unavailable}>Không thể phân tích thời gian lao động với cấu hình này.</p>
    )
  }

  const { necessaryHours, surplusHours, necessaryShare } = segments
  const splitHour = startHour + necessaryHours
  // Keep the middle clock label from colliding with the two end labels.
  const splitLabelPosition = Math.min(86, Math.max(14, necessaryShare))

  return (
    <div>
      <div
        className={styles.bar}
        role="img"
        aria-label={`Ngày lao động ${formatHours(workingHours)}: lao động tất yếu ${formatHours(necessaryHours)}, lao động thặng dư ${formatHours(surplusHours)}`}
      >
        {necessaryHours > 0 && (
          <div
            className={`${styles.segment} ${styles.variable}`}
            style={{ flexGrow: necessaryHours }}
          >
            {necessaryShare >= 18 && formatHours(necessaryHours)}
          </div>
        )}
        {surplusHours > 0 && (
          <div
            className={`${styles.segment} ${styles.surplus} ${styles.hatched}`}
            style={{ flexGrow: surplusHours }}
          >
            {necessaryShare <= 82 && formatHours(surplusHours)}
          </div>
        )}
      </div>
      <div className={`${styles.clockRow} tabular`} aria-hidden="true">
        <span>{formatClock(startHour)}</span>
        {surplusHours > 0 && necessaryHours > 0 && (
          <span className={styles.clockSplit} style={{ left: `${splitLabelPosition}%` }}>
            {formatClock(splitHour)}
          </span>
        )}
        <span>{formatClock(startHour + workingHours)}</span>
      </div>
      <ul className={`${styles.legend} ${styles.legendInline}`}>
        <li className={styles.legendItem}>
          <span className={`${styles.swatch} ${styles.variable}`} aria-hidden="true" />
          <span className={styles.legendName}>Tất yếu</span>
          <span className={`${styles.legendValue} tabular`}>
            {formatHours(necessaryHours)}
            <span className={styles.inlineDelta}>
              {hoursDelta(previous?.necessaryLabourHours, necessaryHours)}
            </span>
          </span>
        </li>
        <li className={styles.legendItem}>
          <span
            className={`${styles.swatch} ${styles.surplus} ${styles.hatched}`}
            aria-hidden="true"
          />
          <span className={styles.legendName}>Thặng dư</span>
          <span className={`${styles.legendValue} tabular`}>
            {formatHours(surplusHours)}
            <span className={styles.inlineDelta}>
              {hoursDelta(previous?.surplusLabourHours, surplusHours)}
            </span>
          </span>
        </li>
      </ul>
    </div>
  )
}
