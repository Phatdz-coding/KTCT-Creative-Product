export interface TheoryTerm {
  term: string
  symbol?: string
  definition: string
  /** How the term shows up in the simulator. */
  inSimulator?: string
}

export const THEORY_TERMS: TheoryTerm[] = [
  {
    term: 'Nhà tư bản',
    definition:
      'Người sở hữu tư bản, ứng tiền ra mua tư liệu sản xuất và sức lao động để tổ chức sản xuất.',
    inSimulator: 'Chủ quán: người quyết định các thông số ở bảng điều khiển.',
  },
  {
    term: 'Người lao động làm thuê',
    definition:
      'Người không có tư liệu sản xuất, phải bán sức lao động của mình để nhận tiền công.',
    inSimulator: 'Các công nhân pha chế trong quán.',
  },
  {
    term: 'Sức lao động',
    definition:
      'Toàn bộ năng lực thể chất và tinh thần của con người được vận dụng khi sản xuất. Thứ người lao động bán là sức lao động, không phải lao động.',
    inSimulator: 'Số công nhân × số giờ làm việc.',
  },
  {
    term: 'Tiền công',
    definition:
      'Biểu hiện bằng tiền của giá trị sức lao động, tức là giá cả của hàng hóa sức lao động.',
    inSimulator: 'Tiền công mỗi giờ và tổng tiền công.',
  },
  {
    term: 'Tư bản bất biến',
    symbol: 'c',
    definition:
      'Bộ phận tư bản tồn tại dưới hình thái tư liệu sản xuất. Giá trị của nó được bảo toàn và chuyển vào sản phẩm, không thay đổi về lượng.',
    inSimulator: 'Nguyên liệu + khấu hao thiết bị.',
  },
  {
    term: 'Tư bản khả biến',
    symbol: 'v',
    definition:
      'Bộ phận tư bản dùng để mua sức lao động. Thông qua lao động của công nhân, nó tăng lên về lượng.',
    inSimulator: 'Tổng tiền công.',
  },
  {
    term: 'Thời gian lao động tất yếu',
    definition:
      'Phần ngày lao động trong đó người công nhân tạo ra lượng giá trị ngang bằng giá trị sức lao động của mình.',
    inSimulator: 'Đoạn đầu của thanh ngày lao động.',
  },
  {
    term: 'Thời gian lao động thặng dư',
    definition: 'Phần ngày lao động vượt quá thời gian lao động tất yếu, tạo ra giá trị thặng dư.',
    inSimulator: 'Đoạn sau của thanh ngày lao động.',
  },
  {
    term: 'Giá trị thặng dư',
    symbol: 'm',
    definition:
      'Bộ phận giá trị mới dôi ra ngoài giá trị sức lao động, do công nhân tạo ra và thuộc về nhà tư bản.',
    inSimulator: 'Doanh thu − c − v (bằng 0 nếu kết quả âm).',
  },
  {
    term: 'Tỷ suất giá trị thặng dư',
    symbol: 'm′',
    definition:
      'Tỷ lệ phần trăm giữa giá trị thặng dư và tư bản khả biến: m′ = m / v × 100%. Phản ánh trình độ khai thác sức lao động.',
    inSimulator: 'Thẻ m′ trong phần phân tích.',
  },
  {
    term: 'Lợi nhuận',
    symbol: 'p',
    definition:
      'Hình thái biểu hiện của giá trị thặng dư khi được so với toàn bộ tư bản ứng trước (c + v).',
    inSimulator: 'Lợi nhuận giản lược = phần còn lại sau khi trừ c và v.',
  },
]

export const MODEL_ASSUMPTIONS: string[] = [
  'Mô phỏng một ngày làm việc duy nhất, kết quả hoàn toàn xác định, không có yếu tố ngẫu nhiên.',
  'Chỉ những ly bán được mới tạo ra doanh thu và mới tính chi phí nguyên liệu.',
  'Mỗi người làm việc hiệu quả nhất trong một số giờ nhất định (mặc định 8 giờ). Khi số ly mỗi người phải làm vượt mức đó, năng suất giảm theo một quy tắc tuyến tính đơn giản, mang tính minh họa.',
  'Tư bản bất biến chỉ gồm nguyên liệu và khấu hao thiết bị; tư bản khả biến bằng tổng tiền công.',
  'Giá trị thặng dư được ước lượng bằng doanh thu − c − v, và bằng 0 khi quán lỗ.',
  'Ngày lao động được chia theo tỷ lệ v / (v + m). Đây là cách chia mang tính minh họa.',
  'Không tính thuế, tiền thuê mặt bằng, lãi vay, lạm phát hay các quy định của luật lao động.',
]
