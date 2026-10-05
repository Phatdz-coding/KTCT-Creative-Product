import type { SimulationInput } from './simulator.types.ts'

export interface ParameterDefinition {
  key: keyof SimulationInput
  label: string
  unit: string
  min: number
  max: number
  step: number
  /** 'advanced' parameters sit in a collapsed group: no scenario changes them. */
  group: 'main' | 'advanced'
}

// UI ranges from PRD §9, in the order they appear in the control panel.
export const PARAMETERS: ParameterDefinition[] = [
  {
    key: 'employeeCount',
    label: 'Số công nhân',
    unit: 'người',
    min: 1,
    max: 20,
    step: 1,
    group: 'main',
  },
  {
    key: 'hourlyWage',
    label: 'Tiền công mỗi giờ',
    unit: '₫',
    min: 15_000,
    max: 100_000,
    step: 1_000,
    group: 'main',
  },
  {
    key: 'workingHours',
    label: 'Ngày lao động',
    unit: 'giờ',
    min: 4,
    max: 12,
    step: 0.5,
    group: 'main',
  },
  {
    key: 'productivityPerWorkerHour',
    label: 'Năng suất',
    unit: 'ly/người/giờ',
    min: 0.5,
    max: 10,
    step: 0.5,
    group: 'main',
  },
  {
    key: 'productPrice',
    label: 'Giá bán mỗi ly',
    unit: '₫',
    min: 20_000,
    max: 150_000,
    step: 1_000,
    group: 'main',
  },
  {
    key: 'customerDemand',
    label: 'Nhu cầu khách',
    unit: 'ly/ngày',
    min: 0,
    max: 500,
    step: 5,
    group: 'main',
  },
  {
    key: 'optimalWorkingHours',
    label: 'Giờ làm hiệu quả',
    unit: 'giờ/người',
    min: 4,
    max: 12,
    step: 0.5,
    group: 'advanced',
  },
  {
    key: 'materialCostPerUnit',
    label: 'Nguyên liệu mỗi ly',
    unit: '₫',
    min: 5_000,
    max: 80_000,
    step: 1_000,
    group: 'advanced',
  },
  {
    key: 'dailyEquipmentCost',
    label: 'Khấu hao mỗi ngày',
    unit: '₫',
    min: 0,
    max: 5_000_000,
    step: 50_000,
    group: 'advanced',
  },
]

export const PARAMETER_BY_KEY = Object.fromEntries(PARAMETERS.map((p) => [p.key, p])) as Record<
  keyof SimulationInput,
  ParameterDefinition
>
