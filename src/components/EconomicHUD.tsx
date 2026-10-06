import type { ReactNode } from "react";
import { Coffee, Coins, ReceiptText, TrendingUp } from "lucide-react";
import { calculate, money, type Scenario } from "../lib/economics";
import { Tip } from "./Education";

function StatCard({
  tone,
  icon,
  label,
  value,
  unit = "đ",
  tip,
  children,
}: {
  tone: string;
  icon: ReactNode;
  label: string;
  value: number;
  unit?: string;
  tip: string;
  children: ReactNode;
}) {
  return (
    <article className={`economic-card ${tone}-card`}>
      <div className="card-label">
        <span className="stat-icon">{icon}</span>
        <h2>{label}</h2>
        <Tip text={tip} />
      </div>
      <div className="big-number">
        {value.toLocaleString("vi-VN")}
        <small>{unit}</small>
      </div>
      <div className="stat-detail">{children}</div>
    </article>
  );
}
export default function EconomicHUD({
  scenario,
  values,
}: {
  scenario: Scenario;
  values: ReturnType<typeof calculate>;
}) {
  const target = calculate(scenario).targetCups;
  return (
    <section className="economic-grid" aria-label="Các chỉ số kinh tế">
      <StatCard
        tone="cups"
        icon={<Coffee size={23} aria-hidden="true" />}
        label="Số ly đã pha"
        value={values.cups}
        unit="ly"
        tip="Mỗi ly pha xong được giả định bán ngay trong mô hình."
      >
        <p>
          Mục tiêu <strong>{target} ly / ca</strong>
        </p>
        <div className="mini-progress">
          <div style={{ transform: `scaleX(${values.cups / target})` }} />
        </div>
      </StatCard>
      <StatCard
        tone="revenue"
        icon={<Coins size={23} aria-hidden="true" />}
        label="Doanh thu"
        value={values.revenue}
        tip={`Số ly đã bán × giá bán ${money(scenario.price)}/ly.`}
      >
        <p>Giá bán × số ly đã pha</p>
        <div className="stat-equation">
          {money(scenario.price)} <span>×</span> {values.cups} ly
        </div>
      </StatCard>
      <StatCard
        tone="cost"
        icon={<ReceiptText size={23} aria-hidden="true" />}
        label="Chi phí"
        value={values.totalCost}
        tip="Tổng chi phí gồm nguyên liệu, vận hành và tiền lương toàn ca, được tính ngay từ đầu."
      >
        <dl>
          <div>
            <dt>Nguyên liệu</dt>
            <dd>{money(values.materialCost)}</dd>
          </div>
          <div>
            <dt>Vận hành</dt>
            <dd>{money(values.operatingCost)}</dd>
          </div>
          <div>
            <dt>
              Tiền lương{" "}
              <Tip
                text={`${scenario.workers} nhân viên × ${money(scenario.wage)} mỗi ca. Lương được ghi nhận đầy đủ ngay từ đầu.`}
              />
            </dt>
            <dd>{money(values.wages)}</dd>
          </div>
        </dl>
      </StatCard>
      <StatCard
        tone="surplus"
        icon={<TrendingUp size={23} aria-hidden="true" />}
        label="Giá trị còn lại"
        value={values.surplus}
        tip="Doanh thu trừ tổng chi phí. Số âm nghĩa là doanh thu hiện tại chưa bù đủ chi phí và lương."
      >
        <p>Doanh thu − chi phí</p>
        <span className="surplus-footnote">
          <span aria-hidden="true">✦</span>{" "}
          {values.surplus < 0
            ? "Đang bù đắp chi phí ca làm"
            : "Lao động tiếp tục tạo ra giá trị"}
        </span>
      </StatCard>
    </section>
  );
}
