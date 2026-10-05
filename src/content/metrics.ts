import type { SimulationResult } from '../features/simulator/simulator.types.ts'

interface MetricCopy {
  label: string
  /** Short explanation shown in the tooltip. */
  hint: string
}

export const METRIC_COPY = {
  loadPerWorker: {
    label: 'Khối lượng mỗi người',
    hint: 'Số ly mỗi công nhân phải làm trong ngày = nhu cầu của khách ÷ số công nhân.',
  },
  sustainableLoad: {
    label: 'Mức làm việc hiệu quả',
    hint: 'Số ly một người làm được mỗi ngày mà vẫn giữ nguyên năng suất = năng suất × giờ làm hiệu quả.',
  },
  overloadFactor: {
    label: 'Hệ số quá tải',
    hint: 'Bằng 1 khi không quá tải. Khi khối lượng mỗi người vượt mức hiệu quả, cứ vượt 100% thì năng suất giảm 30%, thấp nhất còn 60%.',
  },
  effectiveProductivity: {
    label: 'Năng suất thực tế',
    hint: 'Năng suất danh nghĩa × hệ số quá tải. Bằng năng suất danh nghĩa khi công nhân không bị quá tải.',
  },
  productionCapacity: {
    label: 'Công suất',
    hint: 'Số ly tối đa có thể làm trong ngày = số công nhân × số giờ × năng suất thực tế.',
  },
  unitsSold: {
    label: 'Số ly bán được',
    hint: 'Số nhỏ hơn giữa công suất và nhu cầu của khách. Ly không bán được thì không tạo ra doanh thu.',
  },
  revenue: {
    label: 'Doanh thu',
    hint: 'Số ly bán được × giá bán mỗi ly.',
  },
  totalWages: {
    label: 'Tổng tiền công',
    hint: 'Số công nhân × số giờ làm × tiền công mỗi giờ.',
  },
  materialCost: {
    label: 'Nguyên liệu',
    hint: 'Số ly bán được × chi phí nguyên liệu mỗi ly.',
  },
  dailyEquipmentCost: {
    label: 'Khấu hao thiết bị',
    hint: 'Phần giá trị máy móc, thiết bị chuyển vào sản phẩm trong một ngày.',
  },
  constantCapital: {
    label: 'Tư bản bất biến (c)',
    hint: 'Nguyên liệu + khấu hao thiết bị. Giá trị của nó được chuyển nguyên vẹn vào sản phẩm, không tăng thêm.',
  },
  variableCapital: {
    label: 'Tư bản khả biến (v)',
    hint: 'Phần tư bản dùng để mua sức lao động. Trong mô hình này bằng tổng tiền công.',
  },
  remainingValue: {
    label: 'Phần còn lại',
    hint: 'Doanh thu − tư bản bất biến − tư bản khả biến.',
  },
  surplusValue: {
    label: 'Giá trị thặng dư (m)',
    hint: 'Phần giá trị mới do công nhân tạo ra vượt quá tiền công. Ở đây là phép tính giản lược: phần còn lại nếu dương, bằng 0 nếu quán lỗ.',
  },
  simplifiedProfit: {
    label: 'Lợi nhuận giản lược',
    hint: 'Bằng phần còn lại. Không phải lợi nhuận kế toán thực tế: chưa tính thuế, tiền thuê, lãi vay…',
  },
  surplusValueRate: {
    label: 'Tỷ suất giá trị thặng dư (m′)',
    hint: 'm′ = m / v × 100%. Cho biết mỗi đồng tiền công ứng ra thu về bao nhiêu giá trị thặng dư.',
  },
  necessaryLabourHours: {
    label: 'Lao động tất yếu',
    hint: 'Phần ngày lao động mà công nhân tạo ra lượng giá trị ngang với tiền công của mình. Đây là ước lượng mang tính minh họa.',
  },
  surplusLabourHours: {
    label: 'Lao động thặng dư',
    hint: 'Phần ngày lao động còn lại, tạo ra giá trị thặng dư. Đây là ước lượng mang tính minh họa.',
  },
  workerDailyIncome: {
    label: 'Thu nhập một công nhân',
    hint: 'Số giờ làm × tiền công mỗi giờ, tính cho một người trong một ngày.',
  },
} satisfies Record<keyof SimulationResult, MetricCopy>

export const DISCLAIMER =
  'Capital Café là một mô phỏng giáo dục đã được giản lược. Phần giá trị thặng dư minh họa các khái niệm của kinh tế chính trị Mác-xít. Lợi nhuận của doanh nghiệp trong thực tế còn chịu ảnh hưởng của nhiều yếu tố khác, và các lý thuyết kinh tế khác giải thích lợi nhuận bằng tư bản, rủi ro, tinh thần kinh doanh, đổi mới, cấu trúc thị trường và vai trò điều phối.'

export const TOPIC_QUESTION =
  'Nhà tư bản ứng tư bản và thu lợi nhuận. Người lao động bán sức lao động và nhận tiền công. Nếu hai bên hợp tác và trao đổi tự nguyện, bóc lột có còn tồn tại không?'
