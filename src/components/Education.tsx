import { useEffect, useRef, useState } from "react";
import { BatteryWarning } from "lucide-react";
import { calculate, clock, money, type Scenario } from "../lib/economics";
export function Tip({ text }: { text: string }) {
  return (
    <span className="tip">
      <button type="button" aria-label={text}>
        ?
      </button>
      <span role="tooltip">{text}</span>
    </span>
  );
}
export function EducationalModal({
  hours,
  onContinue,
}: {
  hours: number;
  onContinue: () => void;
}) {
  const button = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement;
    button.current?.focus();
    return () => previous?.focus();
  }, []);
  return (
    <div className="modal-backdrop">
      <section
        className="education-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="question-title"
        onKeyDown={(e) => {
          if (e.key === "Tab") {
            e.preventDefault();
            button.current?.focus();
          }
        }}
      >
        <span className="eyebrow">MỘT KHOẢNH KHẮC ĐỂ SUY NGẪM</span>
        <div className="modal-cup">☕</div>
        <h2 id="question-title">Khoan đã.</h2>
        <p>
          Bạn mới làm việc <strong>{clock(hours)} giờ</strong>.
        </p>
        <p>
          Trong khoảng thời gian này, lao động đã tạo ra lượng giá trị tương ứng
          với tiền lương của mình.
        </p>
        <blockquote>
          Vậy thời gian còn lại trong ca làm việc tạo ra giá trị cho ai?
        </blockquote>
        <p className="muted">
          Ca làm đã tạm dừng. Hãy tiếp tục để tự tìm câu trả lời.
        </p>
        <button ref={button} className="button primary" onClick={onContinue}>
          Tiếp tục quan sát →
        </button>
      </section>
    </div>
  );
}
export function ExhaustionModal({
  completed,
  target,
  onContinue,
}: {
  completed: number;
  target: number;
  onContinue: () => void;
}) {
  const button = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement;
    button.current?.focus();
    return () => previous?.focus();
  }, []);
  return (
    <div className="modal-backdrop">
      <section
        className="education-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="exhaustion-title"
        onKeyDown={(e) => {
          if (e.key === "Tab") {
            e.preventDefault();
            button.current?.focus();
          }
        }}
      >
        <span className="eyebrow">KHỐI LƯỢNG CÔNG VIỆC VƯỢT QUÁ SỨC NGƯỜI</span>
        <div className="modal-cup">
          <BatteryWarning size={44} aria-hidden="true" />
        </div>
        <h2 id="exhaustion-title">Barista đã kiệt sức.</h2>
        <p>
          Anh ấy đã làm hết khả năng và pha được <strong>{completed}</strong> /{" "}
          <strong>{target} ly</strong> trong ca này.
        </p>
        <blockquote>
          Còn {target - completed} ly chưa hoàn thành. Một người không thể đáp
          ứng khối lượng công việc này trong thời gian đã định.
        </blockquote>
        <p className="muted">
          Hãy giảm mục tiêu hoặc tăng số barista để phân bổ công việc hợp lý.
        </p>
        <button ref={button} className="button primary" onClick={onContinue}>
          Xem kết quả ca làm →
        </button>
      </section>
    </div>
  );
}
export function ValueFormula({ scenario }: { scenario: Scenario }) {
  const v = calculate(scenario);
  return (
    <section className="formula-section">
      <span className="eyebrow">TỪ QUÁN CÀ PHÊ ĐẾN MỘT KHÁI NIỆM</span>
      <h2>Vậy lợi nhuận đến từ đâu?</h2>
      <p>
        Trong lý luận kinh tế chính trị Mác, giá trị thặng dư là phần giá trị
        mới do lao động tạo ra vượt quá giá trị sức lao động được trả dưới hình
        thức tiền lương.
      </p>
      <div className="formula">
        <div>
          <b>W</b>
          <span>Giá trị sản phẩm</span>
          <strong>{money(v.revenue)}</strong>
        </div>
        <i>=</i>
        <div>
          <b>c</b>
          <span>Tư bản bất biến</span>
          <strong>{money(v.materialCost + v.operatingCost)}</strong>
        </div>
        <i>+</i>
        <div>
          <b>v</b>
          <span>Tư bản khả biến</span>
          <strong>{money(v.wages)}</strong>
        </div>
        <i>+</i>
        <div className="surplus-formula">
          <b>m</b>
          <span>
            {v.surplus < 0 ? "Phần còn lại (âm)" : "Giá trị thặng dư"}{" "}
            <Tip text="Theo lý luận Mác, phần giá trị mới do lao động tạo ra vượt quá giá trị sức lao động." />
          </span>
          <strong>{money(v.surplus)}</strong>
        </div>
      </div>
      {v.surplus < 0 && (
        <p className="model-note">
          Kịch bản này có phần còn lại âm: doanh thu chưa bù đủ chi phí và
          lương. Đây là khoản thiếu hụt trong phép tính mô phỏng, không phải
          minh họa về giá trị thặng dư dương.
        </p>
      )}
      <p className="model-note">
        Trong mô hình này, c được minh họa bằng nguyên liệu và vận hành, v bằng
        tiền lương, m bằng phần còn lại. Ta giả định bán hết sản phẩm và giá bán
        phản ánh giá trị. Doanh thu và lợi nhuận kế toán ngoài thực tế không
        đồng nhất trực tiếp với W và m; mô hình chưa xét thuế, lãi vay, tồn kho
        hay biến động thị trường.
      </p>
    </section>
  );
}
const sliders: {
  key: keyof Scenario;
  label: string;
  min: number;
  max: number;
  step: number;
  unit: string;
}[] = [
  {
    key: "wage",
    label: "Lương / người / ca",
    min: 120000,
    max: 600000,
    step: 20000,
    unit: "đ",
  },
  {
    key: "price",
    label: "Giá bán / ly",
    min: 20000,
    max: 80000,
    step: 5000,
    unit: "đ",
  },
  {
    key: "productivity",
    label: "Năng suất / người",
    min: 2,
    max: 10,
    step: 1,
    unit: "ly/giờ",
  },
  { key: "hours", label: "Số giờ làm", min: 4, max: 12, step: 1, unit: "giờ" },
  {
    key: "material",
    label: "Nguyên liệu / ly",
    min: 5000,
    max: 40000,
    step: 2500,
    unit: "đ",
  },
  {
    key: "workers",
    label: "Số lượng barista",
    min: 1,
    max: 6,
    step: 1,
    unit: "người",
  },
];
export function WhatIfSimulator({
  initialScenario,
}: {
  initialScenario: Scenario;
}) {
  const [scenario, setScenario] = useState<Scenario>({ ...initialScenario });
  const v = calculate(scenario);
  return (
    <section className="what-if" id="what-if">
      <div className="section-heading">
        <div>
          <span className="eyebrow">PHÒNG THỬ NGHIỆM ĐÃ MỞ KHÓA</span>
          <h2>
            What If? <span>Nếu bạn thay đổi luật chơi…</span>
          </h2>
        </div>
        <button
          className="button small"
          onClick={() => setScenario({ ...initialScenario })}
        >
          ↻ Thiết lập ca vừa chạy
        </button>
      </div>
      <div className="what-if-grid">
        <div className="sliders">
          {sliders.map((s) => (
            <label key={s.key}>
              <span>
                {s.label}
                <strong>
                  {new Intl.NumberFormat("vi-VN").format(scenario[s.key])}{" "}
                  {s.unit}
                </strong>
              </span>
              <input
                type="range"
                min={Math.min(s.min, initialScenario[s.key])}
                max={Math.max(s.max, initialScenario[s.key])}
                step={s.key === "productivity" ? "any" : 1}
                value={scenario[s.key]}
                onChange={(e) =>
                  setScenario({ ...scenario, [s.key]: Number(e.target.value) })
                }
              />
            </label>
          ))}
        </div>
        <div className="experiment-results" aria-live="polite">
          <div>
            <span>Doanh thu</span>
            <strong>{money(v.revenue)}</strong>
          </div>
          <div>
            <span>Tổng chi phí (gồm lương)</span>
            <strong>{money(v.totalCost)}</strong>
          </div>
          <div>
            <span>Trong đó: tiền lương</span>
            <strong>{money(v.wages)}</strong>
          </div>
          <div className="result-highlight">
            <span>Giá trị còn lại</span>
            <strong>{money(v.surplus)}</strong>
          </div>
          <div>
            <span>
              Lao động tất yếu{" "}
              <Tip text="Thời gian lý thuyết để giá trị mới bù đủ tiền lương, với năng suất và chi phí đã chọn." />
            </span>
            <strong>
              {Number.isFinite(v.necessaryHours)
                ? `${v.necessaryHours.toFixed(2)} giờ`
                : "Không đạt"}
            </strong>
          </div>
          <div>
            <span>
              Lao động thặng dư{" "}
              <Tip text="Phần thời gian còn lại sau khi bù đủ tiền lương; bằng 0 nếu cả ca chưa đạt điểm này." />
            </span>
            <strong>{v.surplusHours.toFixed(2)} giờ</strong>
          </div>
          {v.necessaryHours > scenario.hours && (
            <p className="hint">
              Ca này chưa tạo đủ phần giá trị để bù tiền lương.
            </p>
          )}
        </div>
      </div>
      <div className="experiment-hints">
        {scenario.hours > initialScenario.hours && (
          <p>
            ↗ <strong>Giá trị thặng dư tuyệt đối:</strong> kéo dài ca làm trong
            khi giữ nguyên lương ngày làm tăng phần thời gian vượt quá lao động
            tất yếu.
          </p>
        )}
        {scenario.productivity > initialScenario.productivity && (
          <p>
            ↗ <strong>Liên hệ giá trị thặng dư tương đối:</strong> năng suất cao
            làm ngắn thời gian bù lương trong mô hình. Trong lý luận Mác, khái
            niệm này gắn với năng suất xã hội làm giảm giá trị sức lao động;
            tăng năng suất riêng của quán chưa đủ để kết luận như vậy.
          </p>
        )}
        <p className="model-note">
          Giữ cố định lương theo ca và chi phí vận hành{" "}
          {money(scenario.operating)}/ly. Kết quả là ước tính đơn giản hóa; hãy
          thay đổi từng yếu tố để so sánh.
        </p>
      </div>
    </section>
  );
}
