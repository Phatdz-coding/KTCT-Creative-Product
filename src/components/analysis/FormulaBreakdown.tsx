import { MIN_OVERLOAD_FACTOR, OVERLOAD_PENALTY } from '../../features/simulator/simulator.engine.ts'
import type { SimulationInput, SimulationResult } from '../../features/simulator/simulator.types.ts'
import { formatVND } from '../../lib/currency.ts'
import { formatHours, formatNumber, formatPercent } from '../../lib/number.ts'
import styles from './analysis.module.css'

interface FormulaBreakdownProps {
  input: SimulationInput
  result: SimulationResult
}

export function FormulaBreakdown({ input, result }: FormulaBreakdownProps) {
  const n = (value: number) => formatNumber(value, 2)

  const rows: { name: string; formula: string; value: string }[] = [
    {
      name: 'Khối lượng mỗi người',
      formula: `nhu cầu ${n(input.customerDemand)} ly ÷ ${n(input.employeeCount)} người`,
      value: `${n(result.loadPerWorker)} ly`,
    },
    {
      name: 'Mức làm việc hiệu quả',
      formula: `${n(input.productivityPerWorkerHour)} ly/giờ × ${n(input.optimalWorkingHours)} giờ hiệu quả`,
      value: `${n(result.sustainableLoad)} ly`,
    },
    {
      name: 'Hệ số quá tải',
      formula:
        result.overloadFactor < 1
          ? `1 − ${n(OVERLOAD_PENALTY)} × (${n(result.loadPerWorker)} ÷ ${n(result.sustainableLoad)} − 1), thấp nhất ${n(MIN_OVERLOAD_FACTOR)}`
          : 'khối lượng không vượt mức hiệu quả',
      value: n(result.overloadFactor),
    },
    {
      name: 'Năng suất thực tế',
      formula: `${n(input.productivityPerWorkerHour)} ly/giờ × hệ số quá tải`,
      value: `${n(result.effectiveProductivity)} ly/giờ`,
    },
    {
      name: 'Công suất',
      formula: `${n(input.employeeCount)} người × ${n(input.workingHours)} giờ × ${n(result.effectiveProductivity)} ly (làm tròn xuống)`,
      value: `${n(result.productionCapacity)} ly`,
    },
    {
      name: 'Số ly bán được',
      formula: `min(công suất ${n(result.productionCapacity)}, nhu cầu ${n(input.customerDemand)})`,
      value: `${n(result.unitsSold)} ly`,
    },
    {
      name: 'Doanh thu',
      formula: `${n(result.unitsSold)} ly × ${formatVND(input.productPrice)}`,
      value: formatVND(result.revenue),
    },
    {
      name: 'c — tư bản bất biến',
      formula: `nguyên liệu ${formatVND(result.materialCost)} + khấu hao ${formatVND(result.dailyEquipmentCost)}`,
      value: formatVND(result.constantCapital),
    },
    {
      name: 'v — tư bản khả biến',
      formula: `${n(input.employeeCount)} người × ${n(input.workingHours)} giờ × ${formatVND(input.hourlyWage)}`,
      value: formatVND(result.variableCapital),
    },
    {
      name: 'Thu nhập một công nhân',
      formula: `${n(input.workingHours)} giờ × ${formatVND(input.hourlyWage)}`,
      value: formatVND(result.workerDailyIncome),
    },
    {
      name: 'Phần còn lại',
      formula: 'doanh thu − c − v',
      value: formatVND(result.remainingValue),
    },
    {
      name: 'm — giá trị thặng dư',
      formula: 'max(0, phần còn lại)',
      value: formatVND(result.surplusValue),
    },
    {
      name: 'm′ — tỷ suất giá trị thặng dư',
      formula: 'm / v × 100%',
      value:
        result.surplusValueRate !== null
          ? formatPercent(result.surplusValueRate)
          : 'Không xác định',
    },
    {
      name: 'Lao động tất yếu',
      formula: `${n(input.workingHours)} giờ × v / (v + m)`,
      value:
        result.necessaryLabourHours !== null
          ? formatHours(result.necessaryLabourHours)
          : 'Không xác định',
    },
    {
      name: 'Lao động thặng dư',
      formula: 'ngày lao động − lao động tất yếu',
      value:
        result.surplusLabourHours !== null
          ? formatHours(result.surplusLabourHours)
          : 'Không xác định',
    },
  ]

  return (
    <>
      <dl className={styles.formulaList}>
        {rows.map((row) => (
          <div key={row.name} className={styles.formulaRow}>
            <dt>{row.name}</dt>
            <dd>
              <span className={styles.formulaText}>{row.formula}</span>
              <span className={`${styles.formulaValue} tabular`}>= {row.value}</span>
            </dd>
          </div>
        ))}
      </dl>
      <p className={styles.formulaNote}>
        Đây là phép tính giản lược để minh họa, không phải mô hình kế toán đầy đủ của một doanh
        nghiệp thực tế.
      </p>
    </>
  )
}
