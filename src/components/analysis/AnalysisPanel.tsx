import { motion, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { METRIC_COPY } from '../../content/metrics.ts'
import { formatDeltaShort } from '../../features/comparison/comparison.format.ts'
import { computeDelta } from '../../features/comparison/comparison.utils.ts'
import type { MetricFormat } from '../../features/comparison/comparison.utils.ts'
import { getScenario } from '../../features/scenarios/scenarios.data.ts'
import {
  changedKeys,
  isSameInput,
  selectSalesLimit,
} from '../../features/simulator/simulator.selectors.ts'
import type { SalesLimit } from '../../features/simulator/simulator.selectors.ts'
import { useSimulatorStore } from '../../features/simulator/simulator.store.ts'
import type { SimulationInput, SimulationResult } from '../../features/simulator/simulator.types.ts'
import { formatVND } from '../../lib/currency.ts'
import { formatNumber, formatPercent } from '../../lib/number.ts'
import { Button } from '../common/Button.tsx'
import { InfoTooltip } from '../common/InfoTooltip.tsx'
import styles from './analysis.module.css'
import { FormulaDialog } from './FormulaDialog.tsx'
import { ValueDistributionBar } from './ValueDistributionBar.tsx'

interface MetricCardProps {
  label: string
  value: string
  /** Shown under the value; replaced by the change since the last run when there is one. */
  note: string
  change?: string
  tone?: 'default' | 'negative'
}

function MetricCard({ label, value, note, change, tone = 'default' }: MetricCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.cardLabel}>{label}</div>
      <div className={`${styles.cardValue} tabular ${tone === 'negative' ? styles.negative : ''}`}>
        {value}
      </div>
      <div
        className={`${styles.cardNote} tabular ${change && change !== 'không đổi' ? styles.change : ''}`}
      >
        {change || note}
      </div>
    </div>
  )
}

function Reveal({ order, children }: { order: number; children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: order * 0.12 }}
    >
      {children}
    </motion.div>
  )
}

const salesSentence = (
  limit: SalesLimit,
  input: SimulationInput,
  result: SimulationResult,
): string => {
  const sold = formatNumber(result.unitsSold)
  const capacity = formatNumber(result.productionCapacity)
  const demand = formatNumber(input.customerDemand)
  switch (limit) {
    case 'demand':
      return `Bán ${sold} ly. Công suất ${capacity} ly nhưng khách chỉ mua ${demand} ly: thiếu cầu.`
    case 'capacity':
      return `Bán ${sold} ly. Khách muốn mua ${demand} ly nhưng quán chỉ làm được ${capacity} ly: hết công suất.`
    case 'balanced':
      return `Bán ${sold} ly. Công suất vừa bằng nhu cầu của khách.`
  }
}

const overloadSentence = (result: SimulationResult): string =>
  `Quá tải: mỗi người phải làm ${formatNumber(result.loadPerWorker)} ly, mức hiệu quả ${formatNumber(result.sustainableLoad)} ly → năng suất còn ${formatNumber(result.effectiveProductivity, 2)} ly/giờ.`

export function AnalysisPanel() {
  const status = useSimulatorStore((s) => s.simulationStatus)
  const draftInput = useSimulatorStore((s) => s.draftInput)
  const input = useSimulatorStore((s) => s.lastInput)
  const result = useSimulatorStore((s) => s.lastResult)
  const previous = useSimulatorStore((s) => s.previousResult)
  const previousLabel = useSimulatorStore((s) => s.previousLabel)
  const scenario = useSimulatorStore((s) => getScenario(s.selectedScenarioId))
  const snapshotA = useSimulatorStore((s) => s.snapshotA)
  const snapshotB = useSimulatorStore((s) => s.snapshotB)
  const saveAsA = useSimulatorStore((s) => s.saveAsA)
  const saveAsB = useSimulatorStore((s) => s.saveAsB)
  const setView = useSimulatorStore((s) => s.setView)
  const run = useSimulatorStore((s) => s.run)
  const reducedMotion = useReducedMotion()
  const [formulaOpen, setFormulaOpen] = useState(false)
  const panelRef = useRef<HTMLElement>(null)

  const ready = status === 'complete' && input !== null && result !== null
  const stale = ready && !isSameInput(draftInput, input)

  // In the stacked tablet / phone layout the panel sits below the fold: bring the fresh result into view.
  useEffect(() => {
    const panel = panelRef.current
    if (!ready || !panel?.scrollIntoView) return
    if (panel.getBoundingClientRect().top > window.innerHeight * 0.6) {
      panel.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' })
    }
  }, [ready, result, reducedMotion])

  const change = (before: number | null | undefined, after: number | null, format: MetricFormat) =>
    previous ? formatDeltaShort(computeDelta(before ?? null, after), format) : ''

  return (
    <section ref={panelRef} className={styles.panel} aria-labelledby="analysis-title">
      <div className={styles.titleRow}>
        <h2 className={styles.panelTitle} id="analysis-title">
          Kết quả một ngày
        </h2>
        {stale ? (
          <span className={styles.stale} role="status">
            Thông số đã đổi
            <button
              type="button"
              className={styles.rerun}
              onClick={() => run({ animate: !reducedMotion })}
            >
              Chạy lại
            </button>
          </span>
        ) : (
          ready &&
          previous && <span className={styles.deltaKey}>▲▼ so với lần trước: {previousLabel}</span>
        )}
      </div>

      <p className="sr-only" role="status">
        {ready
          ? `Kết quả: doanh thu ${formatVND(result.revenue)}, tổng tiền công ${formatVND(result.totalWages)}, giá trị thặng dư ${formatVND(result.surplusValue)}.`
          : status === 'running'
            ? 'Đang mô phỏng.'
            : ''}
      </p>

      {!ready && (
        <div className={styles.empty}>
          {status === 'running' ? (
            <>
              <p className={styles.emptyTitle}>Đang mô phỏng một ngày làm việc…</p>
              <p>Kết quả sẽ hiện ra khi quán hạch toán xong.</p>
            </>
          ) : (
            <>
              <p className={styles.emptyTitle}>Chưa có kết quả</p>
              <p>
                Chọn kịch bản hoặc chỉnh thông số ở bên trái, rồi nhấn{' '}
                <strong>Chạy mô phỏng</strong>.
              </p>
              <ul className={styles.emptyList}>
                <li>Doanh thu, thu nhập của công nhân và lợi nhuận giản lược</li>
                <li>Doanh thu được chia thành c, v và m</li>
                <li>Tỷ suất giá trị thặng dư m′</li>
              </ul>
            </>
          )}
        </div>
      )}

      {ready && (
        <>
          <div className={`${styles.results} ${stale ? styles.resultsStale : ''}`}>
            <Reveal order={0}>
              <h3 className={styles.groupTitle}>Kết quả kinh doanh</h3>
              <div className={styles.cards}>
                <MetricCard
                  label={METRIC_COPY.revenue.label}
                  value={formatVND(result.revenue)}
                  note={`${formatNumber(result.unitsSold)} ly × ${formatVND(input.productPrice)}`}
                  change={change(previous?.revenue, result.revenue, 'money')}
                />
                <MetricCard
                  label="Thu nhập mỗi người"
                  value={formatVND(result.workerDailyIncome)}
                  note="mỗi công nhân, mỗi ngày"
                  change={change(previous?.workerDailyIncome, result.workerDailyIncome, 'money')}
                />
                <MetricCard
                  label={METRIC_COPY.simplifiedProfit.label}
                  value={formatVND(result.simplifiedProfit)}
                  tone={result.simplifiedProfit < 0 ? 'negative' : 'default'}
                  note={result.simplifiedProfit < 0 ? 'quán bị lỗ' : 'doanh thu − c − v'}
                  change={change(previous?.simplifiedProfit, result.simplifiedProfit, 'money')}
                />
              </div>
              {/* One short paragraph either way, so an overload never pushes the charts down. */}
              {result.overloadFactor < 1 ? (
                <p className={styles.salesNote}>
                  Bán {formatNumber(result.unitsSold)} ly, khách cần{' '}
                  {formatNumber(input.customerDemand)} ly.{' '}
                  <strong className={styles.overloadNote}>{overloadSentence(result)}</strong>
                </p>
              ) : (
                <p className={styles.salesNote}>
                  {salesSentence(selectSalesLimit(result, input), input, result)}
                </p>
              )}
            </Reveal>

            <Reveal order={1}>
              <h3 className={styles.groupTitle}>
                Phân tích kinh tế chính trị
                <span className={styles.groupTag}>mô hình giản lược</span>
              </h3>

              <div className={styles.rateCard}>
                <div>
                  <div className={styles.rateLabel}>
                    {METRIC_COPY.surplusValueRate.label}
                    <InfoTooltip
                      label={METRIC_COPY.surplusValueRate.label}
                      text={METRIC_COPY.surplusValueRate.hint}
                    />
                  </div>
                  <div className={styles.rateNote}>
                    {result.surplusValueRate === null
                      ? 'Không xác định khi tiền công bằng 0.'
                      : result.remainingValue < 0
                        ? 'Doanh thu không đủ bù chi phí nên m = 0.'
                        : `1 ₫ tiền công → ${formatNumber(result.surplusValueRate / 100, 2)} ₫ giá trị thặng dư`}
                  </div>
                </div>
                <div className={styles.rateFigure}>
                  <div className={`${styles.rateValue} tabular`}>
                    {result.surplusValueRate !== null
                      ? formatPercent(result.surplusValueRate)
                      : 'N/A'}
                  </div>
                  <div className={`${styles.rateChange} tabular`}>
                    {change(previous?.surplusValueRate, result.surplusValueRate, 'percent')}
                  </div>
                </div>
              </div>

              <h4 className={styles.chartTitle}>Cơ cấu giá trị: c, v và m</h4>
              <ValueDistributionBar result={result} previous={previous} />
              {result.remainingValue < 0 && (
                <p className={styles.lossNote}>
                  Doanh thu không đủ bù c + v: quán lỗ {formatVND(-result.remainingValue)}.
                </p>
              )}
            </Reveal>

            <Reveal order={2}>
              <p className={styles.observation}>
                <span className={styles.observationLabel}>Quan sát</span>
                {/* The canned observation describes the preset; it may not hold once parameters are edited. */}
                {changedKeys(input, scenario.input).length === 0
                  ? scenario.observation
                  : `Lần chạy này khác kịch bản gốc ở ${changedKeys(input, scenario.input).length} thông số.`}
              </p>
            </Reveal>
          </div>

          <div className={styles.actions}>
            <Button onClick={() => setFormulaOpen(true)}>Cách tính</Button>
            <Button onClick={saveAsA}>
              {snapshotA?.result === result ? '✓ Đã lưu A' : 'Lưu làm A'}
            </Button>
            <Button onClick={saveAsB}>
              {snapshotB?.result === result ? '✓ Đã lưu B' : 'Lưu làm B'}
            </Button>
            <Button
              variant="primary"
              disabled={!snapshotA || !snapshotB}
              onClick={() => setView('compare')}
            >
              So sánh A và B
            </Button>
          </div>

          <FormulaDialog
            open={formulaOpen}
            input={input}
            result={result}
            onClose={() => setFormulaOpen(false)}
          />
        </>
      )}
    </section>
  )
}
