import { Sparkles } from "lucide-react";
import type { useSimulation } from "../hooks/useSimulation";
const thoughts = [
  "Một ly cà phê không chỉ chứa nguyên liệu.",
  "Máy móc không tự tạo ra sản phẩm nếu không có lao động vận hành.",
  "Năng suất lao động ảnh hưởng trực tiếp đến lượng sản phẩm tạo ra.",
];
export default function ObservationPanel({
  sim,
  duration,
}: {
  sim: ReturnType<typeof useSimulation>;
  duration: number;
}) {
  const done = sim.state === "completed";
  const step =
    sim.state === "idle" ? 1 : done ? 4 : (Math.floor(sim.hours / 2) % 3) + 1;
  return (
    <aside className="observation">
      <span className="observation-icon">
        <Sparkles size={28} aria-hidden="true" />
      </span>
      <div>
        <span className="eyebrow">GÓC QUAN SÁT</span>
        <p>
          {sim.state === "idle" ? (
            <>
              <strong>Quán đã sẵn sàng.</strong> Khi ca làm bắt đầu, mỗi ly cà
              phê sẽ tạo ra doanh thu, đồng thời phát sinh chi phí và phản ánh
              vai trò của lao động.
            </>
          ) : done ? (
            `${sim.values.cups} ly cà phê, ${duration} giờ lao động. Cùng nhìn lại giá trị mà ca làm này đã tạo ra.`
          ) : (
            thoughts[Math.floor(sim.hours / 2) % thoughts.length]
          )}
        </p>
      </div>
      <span className="observation-pages">
        <strong>{String(step).padStart(2, "0")}</strong> / 04
        <span aria-hidden="true">
          {[1, 2, 3, 4].map((n) => (
            <i key={n} className={n === step ? "active" : ""} />
          ))}
        </span>
      </span>
    </aside>
  );
}
