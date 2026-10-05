import { METRIC_COPY } from '../../content/metrics.ts'
import { formatDeltaShort } from '../../features/comparison/comparison.format.ts'
import { computeDelta } from '../../features/comparison/comparison.utils.ts'
import { selectValueDistribution } from '../../features/simulator/simulator.selectors.ts'
import type { ValueKey } from '../../features/simulator/simulator.selectors.ts'
import type { SimulationResult } from '../../features/simulator/simulator.types.ts'
import { formatVND } from '../../lib/currency.ts'
import { formatPercent } from '../../lib/number.ts'
import { InfoTooltip } from '../common/InfoTooltip.tsx'
import styles from './analysis.module.css'

const SEGMENTS: Record<
  ValueKey,
  { symbol: string; metric: 'constantCapital' | 'variableCapital' | 'surplusValue' }
> = {
  constant: { symbol: 'c', metric: 'constantCapital' },
  variable: { symbol: 'v', metric: 'variableCapital' },
  surplus: { symbol: 'm', metric: 'surplusValue' },
}

interface ValueDistributionBarProps {
  result: SimulationResult
  /** When given, each row also shows its change against this earlier result. */
  previous?: SimulationResult | null
}

export function ValueDistributionBar({ result, previous = null }: ValueDistributionBarProps) {
  const items = selectValueDistribution(result)
  const empty = items.every((item) => item.value === 0)

  if (empty) {
    return <p className={styles.unavailable}>Không có giá trị nào để phân chia.</p>
  }

  const summary = items
    .map((item) => `${METRIC_COPY[SEGMENTS[item.key].metric].label} ${formatVND(item.value)}`)
    .join(', ')

  return (
    <div>
      <div className={styles.bar} role="img" aria-label={`Cơ cấu giá trị: ${summary}`}>
        {items.map(
          (item) =>
            item.share > 0 && (
              <div
                key={item.key}
                className={`${styles.segment} ${styles[item.key]}`}
                style={{ flexGrow: item.share }}
              >
                {item.share >= 7 && SEGMENTS[item.key].symbol}
              </div>
            ),
        )}
      </div>
      <ul className={`${styles.legend} ${styles.valueLegend}`}>
        {items.map((item) => {
          const { metric } = SEGMENTS[item.key]
          const copy = METRIC_COPY[metric]
          const delta = previous ? computeDelta(previous[metric], item.value) : null
          return (
            <li key={item.key} className={styles.legendItem}>
              <span className={`${styles.swatch} ${styles[item.key]}`} aria-hidden="true" />
              <span className={styles.legendName}>
                {copy.label}
                <InfoTooltip label={copy.label} text={copy.hint} />
              </span>
              <span className={`${styles.legendDelta} tabular`}>
                {formatDeltaShort(delta, 'money')}
              </span>
              <span className={`${styles.legendValue} tabular`}>{formatVND(item.value)}</span>
              <span className={`${styles.legendShare} tabular`}>{formatPercent(item.share)}</span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
