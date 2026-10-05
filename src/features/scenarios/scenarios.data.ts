import type { SimulationInput } from '../simulator/simulator.types.ts'

export interface Scenario {
  id: string
  /** Short label for the scenario strip. */
  name: string
  title: string
  description: string
  teachingGoal: string
  /** What the audience should notice after running it. */
  observation: string
  question: string
  input: SimulationInput
}

export const BASELINE_INPUT: SimulationInput = {
  employeeCount: 5,
  hourlyWage: 30_000,
  workingHours: 8,
  productivityPerWorkerHour: 3,
  optimalWorkingHours: 8,
  productPrice: 50_000,
  materialCostPerUnit: 15_000,
  dailyEquipmentCost: 500_000,
  customerDemand: 100,
}

// The baseline is demand-bound (capacity 120, demand 100). Scenarios that teach a
// production-side change therefore also raise demand so the extra output can be sold.
// A worker sustains 3 × 8 = 24 cups a day; presets asking for more than that are
// overloaded on purpose. scenarios.test.ts checks each one moves the way its text claims.
export const SCENARIOS: Scenario[] = [
  {
    id: 'baseline',
    name: 'Cơ sở',
    title: 'Quán cà phê cơ sở',
    description: 'Một ngày làm việc bình thường: 5 công nhân, 8 giờ, tiền công 30.000 ₫/giờ.',
    teachingGoal:
      'Thiết lập quan hệ ban đầu giữa tư bản, lao động, tiền công và phần giá trị còn lại.',
    observation:
      'Công nhân nhận đủ tiền công đã thỏa thuận, nhưng giá trị mới tạo ra trong ngày vẫn lớn hơn tiền công.',
    question:
      'Nếu người lao động đã nhận đủ tiền công đã thỏa thuận, phần giá trị còn lại đến từ đâu?',
    input: BASELINE_INPUT,
  },
  {
    id: 'lower-wage',
    name: 'Giảm tiền công',
    title: 'Giảm tiền công',
    description:
      'Chỉ thay đổi tiền công: từ 30.000 xuống 22.000 ₫/giờ. Mọi điều kiện khác giữ nguyên.',
    teachingGoal:
      'Cho thấy tiền công và giá trị thặng dư là hai phần của cùng một lượng giá trị mới.',
    observation:
      'Thu nhập của công nhân giảm, tổng tiền công giảm, còn giá trị thặng dư và tỷ suất m′ đều tăng.',
    question: 'Điều gì thay đổi khi tiền công giảm mà các điều kiện khác vẫn như cũ?',
    input: { ...BASELINE_INPUT, hourlyWage: 22_000 },
  },
  {
    id: 'longer-day',
    name: 'Kéo dài ngày',
    title: 'Kéo dài ngày lao động',
    description:
      'Ngày lao động tăng từ 8 lên 10 giờ. Giả định quán đủ khách (150 ly) để bán hết số ly làm thêm.',
    teachingGoal: 'Minh họa việc kéo dài thời gian lao động làm tăng thời gian lao động thặng dư.',
    observation:
      'Tổng tiền công tăng, nhưng giờ lao động thặng dư tăng nhiều hơn — dù quá tải làm năng suất giảm nhẹ.',
    question: 'Điều gì thay đổi khi công nhân ở lại trong quá trình sản xuất lâu hơn?',
    input: { ...BASELINE_INPUT, workingHours: 10, customerDemand: 150 },
  },
  {
    id: 'productivity',
    name: 'Tăng năng suất',
    title: 'Tăng năng suất lao động',
    description:
      'Máy pha mới nâng năng suất từ 3 lên 4,5 ly/người/giờ. Giả định quán đủ khách (180 ly).',
    teachingGoal: 'Minh họa việc tăng năng suất rút ngắn thời gian lao động tất yếu.',
    observation:
      'Số giờ làm và tiền công không đổi, nhưng thời gian lao động tất yếu ngắn lại và m′ tăng mạnh.',
    question: 'Điều gì thay đổi khi kỹ thuật làm tăng sức sản xuất của lao động?',
    input: { ...BASELINE_INPUT, productivityPerWorkerHour: 4.5, customerDemand: 180 },
  },
  {
    id: 'demand-limit',
    name: 'Thiếu cầu',
    title: 'Năng suất tăng nhưng thiếu cầu',
    description: 'Năng suất vẫn là 4,5 ly/người/giờ, nhưng nhu cầu của khách chỉ có 100 ly.',
    teachingGoal:
      'Cho thấy giá trị thặng dư phải được thực hiện trên thị trường thông qua việc bán hàng.',
    observation:
      'Công suất tăng lên 180 ly nhưng chỉ bán được 100 ly: kết quả không khác gì quán cơ sở.',
    question: 'Năng suất tăng có luôn luôn chuyển thành doanh thu hay không?',
    input: { ...BASELINE_INPUT, productivityPerWorkerHour: 4.5 },
  },
  {
    id: 'higher-price',
    name: 'Tăng giá bán',
    title: 'Tăng giá bán',
    description: 'Chỉ thay đổi giá bán: từ 50.000 lên 60.000 ₫/ly. Giả định nhu cầu không đổi.',
    teachingGoal: 'Phân biệt thay đổi từ phía thị trường với thay đổi từ phía lao động.',
    observation:
      'Ngày lao động, năng suất và tiền công không đổi, nhưng phần còn lại tăng nhờ giá bán.',
    question: 'Thay đổi từ phía thị trường khác gì so với thay đổi từ phía lao động?',
    input: { ...BASELINE_INPUT, productPrice: 60_000 },
  },
  {
    id: 'overstaffed',
    name: 'Thừa nhân công',
    title: 'Thuê thêm công nhân khi thiếu cầu',
    description: 'Số công nhân tăng từ 5 lên 10, nhưng nhu cầu của khách vẫn chỉ có 100 ly.',
    teachingGoal: 'Cho thấy thuê thêm lao động không tự động tạo ra thêm giá trị thặng dư.',
    observation:
      'Tổng tiền công tăng gấp đôi trong khi doanh thu không đổi, nên giá trị thặng dư giảm mạnh.',
    question: 'Vì sao thuê thêm người không làm phần thặng dư tăng lên trong trường hợp này?',
    input: { ...BASELINE_INPUT, employeeCount: 10 },
  },
  {
    id: 'understaffed',
    name: 'Thiếu người',
    title: 'Thiếu người, quá tải',
    description: 'Số công nhân giảm từ 5 xuống 3, trong khi khách vẫn cần 100 ly.',
    teachingGoal:
      'Cho thấy khi mỗi người phải gánh quá mức làm việc hiệu quả, năng suất lao động giảm.',
    observation:
      'Mỗi người gánh quá mức hiệu quả nên năng suất giảm: quán không phục vụ hết khách và giá trị thặng dư giảm.',
    question: 'Cắt giảm nhân công có phải lúc nào cũng làm tăng giá trị thặng dư không?',
    input: { ...BASELINE_INPUT, employeeCount: 3 },
  },
]

export const DEFAULT_SCENARIO_ID = 'baseline'

export const getScenario = (id: string): Scenario =>
  SCENARIOS.find((s) => s.id === id) ?? SCENARIOS[0]
