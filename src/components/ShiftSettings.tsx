import { useState } from "react";
import { Settings2 } from "lucide-react";
import {
  baseline,
  calculate,
  money,
  scenarioForCups,
  type Scenario,
} from "../lib/economics";

type Settings = Omit<Scenario, "productivity"> & { cups: number };
const fields: {
  key: keyof Settings;
  label: string;
  min: number;
  max: number;
  unit: string;
}[] = [
  { key: "cups", label: "Số ly cà phê / ca", min: 1, max: 1000, unit: "ly" },
  { key: "workers", label: "Số lượng barista", min: 1, max: 6, unit: "người" },
  { key: "hours", label: "Thời gian ca làm", min: 4, max: 12, unit: "giờ" },
  {
    key: "wage",
    label: "Lương / người / ca",
    min: 120000,
    max: 600000,
    unit: "đ",
  },
  { key: "price", label: "Giá bán / ly", min: 20000, max: 80000, unit: "đ" },
  {
    key: "material",
    label: "Nguyên liệu / ly",
    min: 5000,
    max: 40000,
    unit: "đ",
  },
  { key: "operating", label: "Vận hành / ly", min: 0, max: 20000, unit: "đ" },
];
const toDraft = (s: Scenario) =>
  Object.fromEntries(
    fields.map((f) => [
      f.key,
      String(f.key === "cups" ? calculate(s).cups : s[f.key]),
    ]),
  ) as Record<keyof Settings, string>;

export default function ShiftSettings({
  scenario,
  onApply,
}: {
  scenario: Scenario;
  onApply: (s: Scenario) => void;
}) {
  const [draft, setDraft] = useState(() => toDraft(scenario));
  const [message, setMessage] = useState("");
  const valid = fields.every(
    (f) =>
      draft[f.key].trim() !== "" &&
      Number.isInteger(Number(draft[f.key])) &&
      Number(draft[f.key]) >= f.min &&
      Number(draft[f.key]) <= f.max,
  );
  const settings = Object.fromEntries(
    fields.map((f) => [f.key, Number(draft[f.key])]),
  ) as Settings;
  const preview = valid ? scenarioForCups(settings, settings.cups) : null;
  const dirty = fields.some((f) => draft[f.key] !== toDraft(scenario)[f.key]);
  return (
    <section className="shift-settings" aria-label="Thiết lập ca làm">
      <div className="section-heading">
        <div>
          <span className="eyebrow">
            <Settings2 size={14} /> THIẾT LẬP CA LÀM
          </span>
          <h3>Quán của bạn, những con số của bạn</h3>
        </div>
        <button
          type="button"
          className="button small"
          onClick={() => {
            setDraft(toDraft(baseline));
            setMessage("");
          }}
        >
          ↻ Điền mặc định
        </button>
      </div>
      <p className="settings-explanation">
        Chọn số ly muốn pha trong cả ca. Năng suất sẽ tự tính bằng số ly ÷ số
        barista ÷ số giờ. Tất cả ly pha ra được giả định bán ngay.
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!preview) return;
          onApply(preview);
          setMessage("Đã áp dụng. Bạn có thể bắt đầu ca làm.");
        }}
      >
        <div className="settings-fields">
          {fields.map((f) => (
            <label key={f.key} htmlFor={`setting-${f.key}`}>
              <span>{f.label}</span>
              <div>
                <input
                  id={`setting-${f.key}`}
                  name={f.key}
                  type="number"
                  required
                  min={f.min}
                  max={f.max}
                  step="1"
                  value={draft[f.key]}
                  onChange={(e) => {
                    setDraft({ ...draft, [f.key]: e.target.value });
                    setMessage("");
                  }}
                />
                <span>{f.unit}</span>
              </div>
              <small>
                {f.min.toLocaleString("vi-VN")}–{f.max.toLocaleString("vi-VN")}{" "}
                {f.unit}
              </small>
            </label>
          ))}
        </div>
        <div className="settings-preview" aria-live="polite">
          {preview ? (
            <>
              <span>
                Năng suất{" "}
                <strong>
                  {preview.productivity.toLocaleString("vi-VN", {
                    maximumFractionDigits: 2,
                  })}{" "}
                  ly/người/giờ
                </strong>
              </span>
              <span>
                Lương cả ca <strong>{money(calculate(preview).wages)}</strong>
              </span>
              <span>
                Doanh thu dự kiến{" "}
                <strong>{money(calculate(preview).revenue)}</strong>
              </span>
            </>
          ) : (
            <p>Nhập số nguyên trong khoảng cho phép ở tất cả các ô.</p>
          )}
        </div>
        <div className="settings-actions">
          <button type="submit" className="button primary" disabled={!valid}>
            Áp dụng thiết lập
          </button>
          <span role="status">
            {message ||
              (dirty
                ? "Có thay đổi chưa áp dụng."
                : "Các thiết lập hiện tại đã sẵn sàng.")}
          </span>
        </div>
      </form>
    </section>
  );
}
