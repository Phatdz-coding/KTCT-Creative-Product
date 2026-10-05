import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { SimulationSnapshot } from '../../features/simulator/simulator.types.ts'
import { formatVND, formatVNDMillions } from '../../lib/currency.ts'
import styles from './analysis.module.css'

interface ComparisonChartProps {
  snapshotA: SimulationSnapshot
  snapshotB: SimulationSnapshot
}

export function ComparisonChart({ snapshotA, snapshotB }: ComparisonChartProps) {
  const a = snapshotA.result
  const b = snapshotB.result
  // Chart text follows the page's root size, which scales with the window.
  const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16
  const data = [
    { name: 'Doanh thu', A: a.revenue, B: b.revenue },
    { name: 'Tổng tiền công (v)', A: a.totalWages, B: b.totalWages },
    { name: 'Giá trị thặng dư (m)', A: a.surplusValue, B: b.surplusValue },
  ]

  return (
    <figure style={{ margin: 0 }}>
      <div className={styles.chartFrame} aria-hidden="true">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 1.6 * rem, right: 8, bottom: 0, left: 0 }}
            barGap={6}
            accessibilityLayer={false}
          >
            <CartesianGrid vertical={false} stroke="var(--line)" />
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={{ stroke: 'var(--line-strong)' }}
              tick={{ fill: 'var(--ink)', fontSize: 0.9 * rem }}
            />
            <YAxis
              tickFormatter={formatVNDMillions}
              tickLine={false}
              axisLine={false}
              width={4.4 * rem}
              tick={{ fill: 'var(--ink-soft)', fontSize: 0.84 * rem }}
            />
            <Tooltip
              formatter={(value) => formatVND(Number(value))}
              cursor={{ fill: 'var(--surface-sunken)' }}
            />
            <Legend wrapperStyle={{ fontSize: '0.9rem' }} />
            <Bar
              dataKey="A"
              name="A"
              fill="var(--c)"
              radius={[4, 4, 0, 0]}
              isAnimationActive={false}
            >
              <LabelList
                dataKey="A"
                position="top"
                formatter={(value) => formatVNDMillions(Number(value))}
                fontSize={0.84 * rem}
                fill="var(--ink)"
              />
            </Bar>
            <Bar
              dataKey="B"
              name="B"
              fill="var(--m)"
              radius={[4, 4, 0, 0]}
              isAnimationActive={false}
            >
              <LabelList
                dataKey="B"
                position="top"
                formatter={(value) => formatVNDMillions(Number(value))}
                fontSize={0.84 * rem}
                fill="var(--ink)"
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <figcaption className={styles.chartCaption}>
        Đơn vị: triệu đồng (tr). Số liệu chính xác nằm trong bảng bên cạnh.
      </figcaption>
    </figure>
  )
}
