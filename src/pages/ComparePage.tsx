import { ComparisonChart } from '../components/analysis/ComparisonChart.tsx'
import { LabourTimeBar } from '../components/analysis/LabourTimeBar.tsx'
import { Button } from '../components/common/Button.tsx'
import { METRIC_COPY } from '../content/metrics.ts'
import { deltaArrow, formatDelta, formatMetric } from '../features/comparison/comparison.format.ts'
import { selectComparison } from '../features/comparison/comparison.utils.ts'
import { PARAMETER_BY_KEY } from '../features/simulator/parameters.data.ts'
import { changedKeys } from '../features/simulator/simulator.selectors.ts'
import { useSimulatorStore } from '../features/simulator/simulator.store.ts'
import { formatNumber } from '../lib/number.ts'
import styles from './pages.module.css'

export function ComparePage() {
  const snapshotA = useSimulatorStore((s) => s.snapshotA)
  const snapshotB = useSimulatorStore((s) => s.snapshotB)
  const setView = useSimulatorStore((s) => s.setView)

  if (!snapshotA || !snapshotB) {
    return (
      <main className={styles.compareEmpty}>
        <h1>So sánh hai lần chạy</h1>
        <p>
          Cần lưu đủ hai kết quả để so sánh. Hiện tại: A {snapshotA ? 'đã lưu' : 'chưa lưu'}, B{' '}
          {snapshotB ? 'đã lưu' : 'chưa lưu'}.
        </p>
        <ol className={styles.compareHowTo}>
          <li>Chạy một kịch bản rồi nhấn «Lưu làm A».</li>
          <li>Thay đổi thông số hoặc chọn kịch bản khác, chạy lại rồi nhấn «Lưu làm B».</li>
          <li>Quay lại trang này để xem hai kết quả cạnh nhau.</li>
        </ol>
        <Button variant="primary" size="large" onClick={() => setView('presentation')}>
          Về màn hình mô phỏng
        </Button>
      </main>
    )
  }

  const rows = selectComparison(snapshotA, snapshotB)
  const differences = changedKeys(snapshotA.input, snapshotB.input)

  return (
    <main className={styles.compare}>
      <header className={styles.compareHead}>
        <h1>So sánh A và B</h1>
        <Button onClick={() => setView('presentation')}>← Về màn hình mô phỏng</Button>
      </header>

      <div className={styles.compareGrid}>
        <section className={styles.sheet} aria-labelledby="compare-inputs">
          <h2 className={styles.sheetTitle} id="compare-inputs">
            Thông số khác nhau
          </h2>
          {differences.length === 0 ? (
            <p className={styles.muted}>Hai lần chạy dùng cùng một bộ thông số.</p>
          ) : (
            <ul className={styles.diffList}>
              {differences.map((key) => {
                const { label, unit } = PARAMETER_BY_KEY[key]
                return (
                  <li key={key} className={styles.diffItem}>
                    <span>{label}</span>
                    <span className="tabular">
                      <strong>{formatNumber(snapshotA.input[key])}</strong> →{' '}
                      <strong>{formatNumber(snapshotB.input[key])}</strong> {unit}
                    </span>
                  </li>
                )
              })}
            </ul>
          )}

          <h2 className={styles.sheetTitle}>Kết quả</h2>
          <table className={styles.table}>
            <thead>
              <tr>
                <th scope="col">Chỉ số</th>
                <th scope="col">
                  <span className={styles.tagA}>A</span> {snapshotA.label}
                </th>
                <th scope="col">
                  <span className={styles.tagB}>B</span> {snapshotB.label}
                </th>
                <th scope="col">Thay đổi (A → B)</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.key}>
                  <th scope="row">{METRIC_COPY[row.key].label}</th>
                  <td className="tabular">{formatMetric(row.a, row.format)}</td>
                  <td className="tabular">{formatMetric(row.b, row.format)}</td>
                  <td className={`tabular ${styles.deltaCell}`}>
                    <span aria-hidden="true">{deltaArrow(row.delta)}</span>{' '}
                    {formatDelta(row.delta, row.format)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className={styles.sheet} aria-labelledby="compare-charts">
          <h2 className={styles.sheetTitle} id="compare-charts">
            Doanh thu, tiền công và giá trị thặng dư
          </h2>
          <ComparisonChart snapshotA={snapshotA} snapshotB={snapshotB} />

          <h2 className={styles.sheetTitle}>Ngày lao động</h2>
          <div className={styles.labourPair}>
            <div>
              <p className={styles.labourLabel}>
                <span className={styles.tagA}>A</span> {snapshotA.label}
              </p>
              <LabourTimeBar
                result={snapshotA.result}
                workingHours={snapshotA.input.workingHours}
              />
            </div>
            <div>
              <p className={styles.labourLabel}>
                <span className={styles.tagB}>B</span> {snapshotB.label}
              </p>
              <LabourTimeBar
                result={snapshotB.result}
                workingHours={snapshotB.input.workingHours}
              />
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
